"use client";

import * as React from "react";
import createGlobe, { type Arc, type COBEOptions, type Globe as CobeGlobe, type Marker } from "cobe";
import { useMotionValue, useReducedMotion, useSpring } from "motion/react";

import { cn } from "@/lib/utils";

export type GlobeMarker = {
  /** `[latitude, longitude]` in degrees. */
  location: [number, number];
  /** Dot size, roughly 0.02–0.1. Defaults to `0.05`. */
  size?: number;
  /** Any CSS color. Defaults to `markerColor`. */
  color?: string;
  /** Name of the place. Labelled markers are listed for screen readers. */
  label?: string;
};

export type GlobeArc = {
  /** `[latitude, longitude]` where the arc starts. */
  from: [number, number];
  /** `[latitude, longitude]` where the arc ends. */
  to: [number, number];
  /** Any CSS color. Defaults to `arcColor`. */
  color?: string;
};

export interface GlobeProps extends Omit<React.ComponentProps<"div">, "children"> {
  /** Points pinned to the globe. */
  markers?: GlobeMarker[];
  /** Curved lines between two locations. */
  arcs?: GlobeArc[];
  /** Spin on its own. Always off under reduced motion. */
  autoRotate?: boolean;
  /** Auto-rotation speed in radians per second. */
  speed?: number;
  /** Let people rotate the globe by dragging (and with the arrow keys). */
  draggable?: boolean;
  /** Starting longitude rotation in radians. */
  phi?: number;
  /** Tilt toward the viewer in radians. */
  theta?: number;
  /** Color of the land dots. Any CSS color. */
  baseColor?: string;
  /** Default marker color. Any CSS color. */
  markerColor?: string;
  /** Color of the soft light around the rim. Keep it close to the background. Any CSS color. */
  glowColor?: string;
  /** Default arc color. Any CSS color. */
  arcColor?: string;
  /** `1` renders a dark globe, `0` a light one. */
  dark?: number;
  /** Strength of the lighting falloff toward the edges. */
  diffuse?: number;
  /** Brightness of the land dots. */
  mapBrightness?: number;
  /** Number of dots used to draw the map. More is finer and heavier. */
  mapSamples?: number;
  /** Accessible name of the globe. */
  label?: string;
  /** Shown instead of the globe when WebGL isn't available. */
  fallback?: React.ReactNode;
}

type RGB = [number, number, number];

/** Resolves any CSS color (theme variables, oklch…) to a 0–1 RGB triplet by painting one pixel. */
function resolveColor(host: HTMLElement, color: string): RGB {
  const probe = document.createElement("span");
  probe.style.color = color;
  probe.style.display = "none";
  host.appendChild(probe);
  const computed = getComputedStyle(probe).color;
  probe.remove();
  const ctx = document.createElement("canvas").getContext("2d", { willReadFrequently: true });
  if (!ctx) return [1, 1, 1];
  ctx.fillStyle = computed;
  ctx.fillRect(0, 0, 1, 1);
  const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
  return [r / 255, g / 255, b / 255];
}

let webglSupport: boolean | undefined;
function detectWebGL() {
  if (webglSupport === undefined) {
    try {
      const canvas = document.createElement("canvas");
      const gl = canvas.getContext("webgl2") ?? canvas.getContext("webgl");
      webglSupport = !!gl;
      gl?.getExtension("WEBGL_lose_context")?.loseContext();
    } catch {
      webglSupport = false;
    }
  }
  return webglSupport;
}
const noopSubscribe = () => () => {};

const THETA_MIN = -0.6;
const THETA_MAX = 0.9;

/** Interactive WebGL globe with markers and arcs that auto-rotates and spins with spring momentum when dragged. */
export function Globe({
  markers = [],
  arcs = [],
  autoRotate = true,
  speed = 0.2,
  draggable = true,
  phi = 0,
  theta = 0.25,
  baseColor = "oklch(0.4 0 0)",
  markerColor = "var(--color-primary)",
  glowColor = "oklch(0.18 0 0)",
  arcColor = "oklch(0.7 0 0)",
  dark = 1,
  diffuse = 1.2,
  mapBrightness = 4,
  mapSamples = 16000,
  label = "Interactive globe",
  fallback,
  className,
  style,
  onPointerDown,
  onKeyDown,
  ...props
}: GlobeProps) {
  const reduceMotion = useReducedMotion() ?? false;
  // The server and the first client render assume WebGL; the client corrects it right after hydration.
  const supported = React.useSyncExternalStore(noopSubscribe, detectWebGL, () => true);

  const rootRef = React.useRef<HTMLDivElement>(null);
  const hostRef = React.useRef<HTMLDivElement>(null);
  const globeRef = React.useRef<CobeGlobe | null>(null);
  const requestFrameRef = React.useRef<() => void>(() => {});
  const applyMarkersRef = React.useRef<() => void>(() => {});
  const live = React.useRef({ autoRotate, speed, reduceMotion });
  const dragging = React.useRef(false);

  // Drag offsets. The springs trail the raw values, which gives the release its momentum.
  const dragPhi = useMotionValue(0);
  const dragTheta = useMotionValue(0);
  const springPhi = useSpring(dragPhi, { stiffness: 60, damping: 18, mass: 1 });
  const springTheta = useSpring(dragTheta, { stiffness: 60, damping: 18, mass: 1 });

  React.useEffect(() => {
    live.current = { autoRotate, speed, reduceMotion };
    requestFrameRef.current();
  }, [autoRotate, speed, reduceMotion]);

  // Create the WebGL globe. The canvas is made here, outside React, because cobe re-parents it.
  React.useEffect(() => {
    const root = rootRef.current;
    const host = hostRef.current;
    if (!root || !host || !supported) return;

    const colors = {
      baseColor: resolveColor(root, baseColor),
      markerColor: resolveColor(root, markerColor),
      glowColor: resolveColor(root, glowColor),
      arcColor: resolveColor(root, arcColor),
    };

    let canvas: HTMLCanvasElement | null = null;
    let globe: CobeGlobe | null = null;
    let size = Math.max(1, root.clientWidth);
    let basePhi = phi;
    let raf = 0;
    let last = 0;
    let onScreen = false;
    let shown = false;
    let textureTimers: ReturnType<typeof setTimeout>[] = [];

    const currentPhi = () => basePhi + (live.current.reduceMotion ? dragPhi.get() : springPhi.get());
    const currentTheta = () => {
      const t = theta + (live.current.reduceMotion ? dragTheta.get() : springTheta.get());
      return Math.min(THETA_MAX, Math.max(THETA_MIN, t));
    };

    // Auto-rotation holds still while the globe is being dragged.
    const spinning = () => live.current.autoRotate && !live.current.reduceMotion && !dragging.current;

    const frame = (now: number) => {
      raf = 0;
      if (!globe) return;
      const dt = last ? Math.min((now - last) / 1000, 0.1) : 0;
      last = now;
      if (spinning()) basePhi += live.current.speed * dt;
      globe.update({ phi: currentPhi(), theta: currentTheta() });
      if (!shown && canvas) {
        shown = true;
        canvas.style.opacity = "1";
      }
      if (spinning()) requestFrame();
      else last = 0;
    };

    const requestFrame = () => {
      if (raf || !globe || !onScreen || document.hidden) return;
      raf = requestAnimationFrame(frame);
    };
    requestFrameRef.current = requestFrame;

    const build = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas = document.createElement("canvas");
      canvas.setAttribute("aria-hidden", "true");
      canvas.style.cssText = "display:block;width:100%;height:100%;opacity:0;transition:opacity 700ms ease";
      host.appendChild(canvas);
      const options: COBEOptions = {
        devicePixelRatio: dpr,
        width: size,
        height: size,
        phi: currentPhi(),
        theta: currentTheta(),
        dark,
        diffuse,
        mapSamples,
        mapBrightness,
        ...colors,
        markers: [],
        arcs: [],
        arcWidth: 0.6,
        arcHeight: 0.25,
        markerElevation: 0.01,
      };
      globe = createGlobe(canvas, options);
      globeRef.current = globe;
      shown = false;
      // cobe decodes its map texture asynchronously; repaint once it has landed, even when nothing spins.
      textureTimers.forEach(clearTimeout);
      textureTimers = [150, 600].map((ms) => setTimeout(requestFrame, ms));
    };

    const teardown = () => {
      textureTimers.forEach(clearTimeout);
      textureTimers = [];
      cancelAnimationFrame(raf);
      raf = 0;
      globe?.destroy();
      globe = null;
      globeRef.current = null;
      if (canvas) {
        const gl = canvas.getContext("webgl2") ?? canvas.getContext("webgl");
        gl?.getExtension("WEBGL_lose_context")?.loseContext();
        // cobe wraps the canvas in its own div; remove whichever is attached to the host.
        const wrapper = canvas.parentElement === host ? canvas : canvas.parentElement;
        wrapper?.remove();
        canvas = null;
      }
    };

    build();
    applyMarkersRef.current();

    const resizeObserver = new ResizeObserver(() => {
      const next = Math.max(1, root.clientWidth);
      if (next === size) return;
      size = next;
      globe?.update({ width: size, height: size, phi: currentPhi(), theta: currentTheta() });
    });
    resizeObserver.observe(root);

    const intersectionObserver = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
      if (onScreen) requestFrame();
      else {
        cancelAnimationFrame(raf);
        raf = 0;
        last = 0;
      }
    });
    intersectionObserver.observe(root);

    const onVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(raf);
        raf = 0;
        last = 0;
      } else requestFrame();
    };
    document.addEventListener("visibilitychange", onVisibility);

    // Rebuild at the new pixel ratio when the window moves to another screen or the page zooms.
    let dprQuery: MediaQueryList | null = null;
    const onDprChange = () => {
      teardown();
      build();
      applyMarkersRef.current();
      watchDpr();
      requestFrame();
    };
    const watchDpr = () => {
      dprQuery?.removeEventListener("change", onDprChange);
      dprQuery = window.matchMedia(`(resolution: ${window.devicePixelRatio || 1}dppx)`);
      dprQuery.addEventListener("change", onDprChange);
    };
    watchDpr();

    // Every drag change (and every spring step after release) asks for a frame.
    const unsubscribers = [springPhi, springTheta, dragPhi, dragTheta].map((v) => v.on("change", requestFrame));

    return () => {
      unsubscribers.forEach((off) => off());
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      dprQuery?.removeEventListener("change", onDprChange);
      requestFrameRef.current = () => {};
      teardown();
    };
  }, [
    supported,
    baseColor,
    markerColor,
    glowColor,
    arcColor,
    dark,
    diffuse,
    mapSamples,
    mapBrightness,
    phi,
    theta,
    dragPhi,
    dragTheta,
    springPhi,
    springTheta,
  ]);

  // Markers and arcs update in place, so inline arrays never rebuild the WebGL context.
  const markersKey = JSON.stringify(markers.map(({ location, size, color }) => [location, size, color]));
  const arcsKey = JSON.stringify(arcs.map(({ from, to, color }) => [from, to, color]));
  React.useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const apply = () => {
      const globe = globeRef.current;
      if (!globe) return;
      const parsedMarkers = JSON.parse(markersKey) as [[number, number], number | undefined, string | undefined][];
      const parsedArcs = JSON.parse(arcsKey) as [[number, number], [number, number], string | undefined][];
      const nextMarkers: Marker[] = parsedMarkers.map(([location, size, color]) => ({
        location,
        size: size ?? 0.05,
        ...(color ? { color: resolveColor(root, color) } : null),
      }));
      const nextArcs: Arc[] = parsedArcs.map(([from, to, color]) => ({
        from,
        to,
        ...(color ? { color: resolveColor(root, color) } : null),
      }));
      globe.update({ markers: nextMarkers, arcs: nextArcs });
      requestFrameRef.current();
    };
    // The globe is rebuilt when colors or the pixel ratio change; it re-applies markers through this ref.
    applyMarkersRef.current = apply;
    apply();
  }, [markersKey, arcsKey]);

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    onPointerDown?.(event);
    if (!draggable || event.defaultPrevented || (event.pointerType === "mouse" && event.button !== 0)) return;
    const el = event.currentTarget;
    const width = Math.max(1, el.clientWidth);
    const startX = event.clientX;
    const startY = event.clientY;
    const startPhi = dragPhi.get();
    const startTheta = dragTheta.get();
    el.setPointerCapture(event.pointerId);
    dragging.current = true;

    const move = (e: PointerEvent) => {
      // Dragging across the full width turns the globe half way round.
      dragPhi.set(startPhi + ((e.clientX - startX) / width) * Math.PI);
      const t = startTheta + ((e.clientY - startY) / width) * Math.PI * 0.5;
      dragTheta.set(Math.min(THETA_MAX - theta, Math.max(THETA_MIN - theta, t)));
    };
    const end = () => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerup", end);
      el.removeEventListener("pointercancel", end);
      dragging.current = false;
      requestFrameRef.current();
      if (reduceMotion) return;
      // Fling: push the target along the release velocity so the spring glides on.
      const velocity = dragPhi.getVelocity();
      if (Number.isFinite(velocity)) dragPhi.set(dragPhi.get() + Math.max(-4, Math.min(4, velocity * 0.18)));
    };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerup", end);
    el.addEventListener("pointercancel", end);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(event);
    if (!draggable || event.defaultPrevented) return;
    const step = event.shiftKey ? 0.6 : 0.25;
    if (event.key === "ArrowLeft") dragPhi.set(dragPhi.get() - step);
    else if (event.key === "ArrowRight") dragPhi.set(dragPhi.get() + step);
    else if (event.key === "ArrowUp")
      dragTheta.set(Math.max(THETA_MIN - theta, dragTheta.get() - step * 0.5));
    else if (event.key === "ArrowDown")
      dragTheta.set(Math.min(THETA_MAX - theta, dragTheta.get() + step * 0.5));
    else return;
    event.preventDefault();
  };

  const named = markers.filter((m) => m.label);

  return (
    <div
      ref={rootRef}
      data-slot="globe"
      role={named.length > 0 ? "group" : "img"}
      aria-label={label}
      aria-roledescription={draggable ? "interactive globe" : "globe"}
      aria-keyshortcuts={draggable ? "ArrowLeft ArrowRight ArrowUp ArrowDown" : undefined}
      tabIndex={draggable ? 0 : undefined}
      className={cn(
        "relative aspect-square w-full max-w-[600px] select-none rounded-full outline-none",
        "focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-4 focus-visible:ring-offset-background",
        draggable && supported && "cursor-grab touch-pan-y active:cursor-grabbing",
        className
      )}
      style={style}
      onPointerDown={handlePointerDown}
      onKeyDown={handleKeyDown}
      {...props}
    >
      <div ref={hostRef} className="absolute inset-0" />
      {!supported &&
        (fallback ?? (
          <div
            aria-hidden
            className="absolute inset-[6%] rounded-full border bg-card"
          />
        ))}
      {named.length > 0 && (
        <ul className="sr-only" aria-label="Marked locations">
          {named.map((m, i) => (
            <li key={`${m.label}-${i}`}>{m.label}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
