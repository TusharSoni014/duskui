"use client";

import * as React from "react";
import { useReducedMotion } from "motion/react";

import { cn } from "@/lib/utils";

export interface ParticlesProps extends Omit<React.ComponentProps<"div">, "children"> {
  /** Number of particles. */
  quantity?: number;
  /** Any CSS color, including theme variables. Defaults to the theme primary. */
  color?: string;
  /** Average particle radius in px. */
  size?: number;
  /** How quickly particles react to the cursor and settle back, from 0 (sluggish) to 1 (instant). */
  ease?: number;
  /** What the cursor does to nearby particles. */
  interaction?: "repel" | "attract" | "none";
  /** Reach of the cursor in px. */
  radius?: number;
  /** Strength of the cursor push or pull, around 0–2. */
  strength?: number;
  /** Draw lines between particles that are close to each other. */
  connect?: boolean;
  /** Maximum length of a connecting line in px. */
  connectDistance?: number;
  /** Drift speed multiplier. `0` holds the particles still. */
  speed?: number;
  /** Change it for a different layout; the same seed always scatters the same field. */
  seed?: number;
}

type Particle = {
  /** Home position, normalized to the container (0–1), so resizing never reshuffles. */
  x: number;
  y: number;
  /** Drift velocity in px per second. */
  vx: number;
  vy: number;
  /** Cursor displacement in px, eased toward its target every frame. */
  ox: number;
  oy: number;
  r: number;
  alpha: number;
  twinkle: number;
  phase: number;
};

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Resolves any CSS color (variables, oklch…) to an sRGB triplet by painting one pixel. */
function resolveColor(host: HTMLElement, color: string): string {
  const probe = document.createElement("span");
  probe.style.color = color;
  probe.style.display = "none";
  host.appendChild(probe);
  const computed = getComputedStyle(probe).color;
  probe.remove();
  const ctx = document.createElement("canvas").getContext("2d", { willReadFrequently: true });
  if (!ctx) return "255, 255, 255";
  ctx.fillStyle = computed;
  ctx.fillRect(0, 0, 1, 1);
  const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
  return `${r}, ${g}, ${b}`;
}

/**
 * A drifting field of particles on a `<canvas>` that scatters away from (or
 * gathers toward) the cursor, with optional constellation lines between
 * neighbours. Fills its nearest positioned parent.
 *
 * The background never takes pointer events: the pointer is tracked on the
 * window. Sharp on high-DPI screens, resizes with its container, pauses
 * off-screen and in hidden tabs, and draws a single still frame under reduced motion.
 */
export function Particles({
  quantity = 80,
  color = "var(--color-primary)",
  size = 1.4,
  ease = 0.08,
  interaction = "repel",
  radius = 120,
  strength = 1,
  connect = false,
  connectDistance = 110,
  speed = 1,
  seed = 1,
  className,
  ...props
}: ParticlesProps) {
  const reduceMotion = useReducedMotion();
  const rootRef = React.useRef<HTMLDivElement>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    const root = rootRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!root || !canvas || !ctx) return;

    const rgb = resolveColor(root, color);
    const count = Math.max(0, Math.round(quantity));
    const reach = Math.max(1, radius);
    const linkMax = Math.max(1, connectDistance);
    const response = Math.min(Math.max(ease, 0.001), 1);
    const interactive = interaction !== "none" && !reduceMotion;

    const rand = mulberry32(seed * 2246822519 + 7);
    const particles: Particle[] = Array.from({ length: count }, () => {
      const angle = rand() * Math.PI * 2;
      const drift = 4 + rand() * 12;
      return {
        x: rand(),
        y: rand(),
        vx: Math.cos(angle) * drift,
        vy: Math.sin(angle) * drift,
        ox: 0,
        oy: 0,
        r: Math.max(0.3, size * (0.5 + rand())),
        alpha: 0.35 + rand() * 0.65,
        twinkle: 0.6 + rand() * 1.6,
        phase: rand() * Math.PI * 2,
      };
    });

    let width = 0;
    let height = 0;
    const pointer = { x: 0, y: 0, active: false };
    const px = new Float32Array(count);
    const py = new Float32Array(count);

    const draw = (time: number, still: boolean) => {
      ctx.clearRect(0, 0, width, height);
      for (let i = 0; i < count; i++) {
        const p = particles[i];
        px[i] = p.x * width + p.ox;
        py[i] = p.y * height + p.oy;
      }

      if (connect) {
        ctx.lineWidth = 1;
        ctx.strokeStyle = `rgb(${rgb})`;
        const max2 = linkMax * linkMax;
        for (let i = 0; i < count; i++) {
          for (let j = i + 1; j < count; j++) {
            const dx = px[i] - px[j];
            const dy = py[i] - py[j];
            const d2 = dx * dx + dy * dy;
            if (d2 > max2) continue;
            ctx.globalAlpha = (1 - Math.sqrt(d2) / linkMax) * 0.3;
            ctx.beginPath();
            ctx.moveTo(px[i], py[i]);
            ctx.lineTo(px[j], py[j]);
            ctx.stroke();
          }
        }
      }

      ctx.fillStyle = `rgb(${rgb})`;
      for (let i = 0; i < count; i++) {
        const p = particles[i];
        const shimmer = still ? 1 : 0.7 + 0.3 * Math.sin(time * p.twinkle + p.phase);
        ctx.globalAlpha = p.alpha * shimmer;
        ctx.beginPath();
        ctx.arc(px[i], py[i], p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    };

    const step = (dt: number) => {
      // Frame-rate independent easing: the same feel at 60 Hz and 120 Hz.
      const k = 1 - Math.pow(1 - response, dt * 60);
      const sign = interaction === "attract" ? -1 : 1;
      for (let i = 0; i < count; i++) {
        const p = particles[i];
        const marginX = (p.r * 4) / width;
        const marginY = (p.r * 4) / height;
        p.x += (p.vx * speed * dt) / width;
        p.y += (p.vy * speed * dt) / height;
        if (p.x < -marginX) p.x = 1 + marginX;
        else if (p.x > 1 + marginX) p.x = -marginX;
        if (p.y < -marginY) p.y = 1 + marginY;
        else if (p.y > 1 + marginY) p.y = -marginY;

        let tx = 0;
        let ty = 0;
        if (interactive && pointer.active) {
          // Measured from the home position, so the push never feeds back on itself.
          const dx = p.x * width - pointer.x;
          const dy = p.y * height - pointer.y;
          const dist = Math.hypot(dx, dy) || 0.001;
          if (dist < reach) {
            const falloff = (1 - dist / reach) ** 2;
            // Attraction is capped so particles gather around the cursor instead of piling onto it.
            const push = Math.min(falloff * reach * 0.6 * strength, sign < 0 ? dist * 0.85 : Infinity);
            tx = (dx / dist) * push * sign;
            ty = (dy / dist) * push * sign;
          }
        }
        p.ox += (tx - p.ox) * k;
        p.oy += (ty - p.oy) * k;
      }
    };

    let raf = 0;
    let last = 0;
    let running = false;
    let onScreen = false;

    const frame = (now: number) => {
      const dt = last ? Math.min((now - last) / 1000, 0.1) : 0;
      last = now;
      step(dt);
      draw(now / 1000, false);
      raf = requestAnimationFrame(frame);
    };

    const update = () => {
      const shouldRun = onScreen && !document.hidden && !reduceMotion;
      if (shouldRun && !running) {
        running = true;
        last = 0;
        raf = requestAnimationFrame(frame);
      } else if (!shouldRun && running) {
        running = false;
        cancelAnimationFrame(raf);
        raf = 0;
      }
    };

    const resize = () => {
      const rect = root.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      // Resizing clears the canvas; repaint now if the loop isn't going to.
      if (!running) draw(0, true);
    };

    const onMove = (event: PointerEvent) => {
      if (!running) return;
      const rect = root.getBoundingClientRect();
      pointer.x = event.clientX - rect.left;
      pointer.y = event.clientY - rect.top;
      pointer.active =
        pointer.x > -reach &&
        pointer.y > -reach &&
        pointer.x < rect.width + reach &&
        pointer.y < rect.height + reach;
    };
    const onRelease = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") pointer.active = false;
    };
    const onLeave = () => {
      pointer.active = false;
    };

    resize();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(root);
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
      update();
    });
    intersectionObserver.observe(root);
    document.addEventListener("visibilitychange", update);
    if (interactive) {
      window.addEventListener("pointermove", onMove, { passive: true });
      window.addEventListener("pointerup", onRelease, { passive: true });
      window.addEventListener("pointercancel", onRelease, { passive: true });
      document.documentElement.addEventListener("pointerleave", onLeave);
    }

    return () => {
      cancelAnimationFrame(raf);
      running = false;
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      document.removeEventListener("visibilitychange", update);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onRelease);
      window.removeEventListener("pointercancel", onRelease);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, [
    quantity,
    color,
    size,
    ease,
    interaction,
    radius,
    strength,
    connect,
    connectDistance,
    speed,
    seed,
    reduceMotion,
  ]);

  return (
    <div
      ref={rootRef}
      aria-hidden
      data-slot="particles"
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
      {...props}
    >
      <canvas ref={canvasRef} className="block size-full" />
    </div>
  );
}
