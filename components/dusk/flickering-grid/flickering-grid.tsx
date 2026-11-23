"use client";

import * as React from "react";
import { useReducedMotion } from "motion/react";

import { cn } from "@/lib/utils";

export interface FlickeringGridProps extends Omit<React.ComponentProps<"div">, "children"> {
  /** Side of each square in px. */
  squareSize?: number;
  /** Space between squares in px. */
  gap?: number;
  /** Chance, per square per second, that it switches to a new brightness (0–1+). */
  flickerChance?: number;
  /** Square color. Any CSS color, including theme variables; defaults to white. */
  color?: string;
  /** Opacity of the brightest square, 0–1. */
  maxOpacity?: number;
  /** Change it for a different, but stable, pattern. */
  seed?: number;
  /** Only draw squares inside this text, which is scaled to fit unless `fontSize` is set. */
  text?: string;
  /** Font size of the mask text in px. Fits the container when omitted. */
  fontSize?: number;
  /** Font weight of the mask text. */
  fontWeight?: number | string;
  /** Font family of the mask text. Defaults to the inherited font. */
  fontFamily?: string;
}

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
function toRgb(host: HTMLElement, color: string): string {
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
 * A canvas grid of small squares that flicker at random, optionally masked so squares only appear inside a word.
 *
 * The starting pattern comes from a seed, so it is identical on every mount and
 * the server never renders anything random. Sharp on high-DPI screens, resizes
 * with its container, pauses off-screen and in hidden tabs, and shows a still
 * frame under reduced motion. Fills its nearest positioned parent.
 */
export function FlickeringGrid({
  squareSize = 4,
  gap = 6,
  flickerChance = 0.15,
  color = "rgb(255 255 255)",
  maxOpacity = 0.15,
  seed = 1,
  text,
  fontSize,
  fontWeight = 700,
  fontFamily,
  className,
  ...props
}: FlickeringGridProps) {
  const reduceMotion = useReducedMotion();
  const rootRef = React.useRef<HTMLDivElement>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    const root = rootRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!root || !canvas || !ctx) return;

    const size = Math.max(1, squareSize);
    const pitch = size + Math.max(0, gap);
    const peak = Math.min(Math.max(maxOpacity, 0), 1);
    const chance = Math.max(0, flickerChance);
    const rgb = toRgb(root, color);
    const flicker = mulberry32(seed * 2654435761 + 97);

    let width = 0;
    let height = 0;
    let cols = 0;
    let rows = 0;
    let levels = new Float32Array(0);
    let mask: Uint8Array | null = null;
    let disposed = false;

    /** Inside the text, squares never go fully dark so the word stays legible. */
    const level = (rand: () => number) => (mask ? peak * (0.25 + 0.75 * rand()) : peak * rand());

    const buildMask = () => {
      if (!text) return null;
      const scratch = document.createElement("canvas");
      scratch.width = Math.max(1, Math.round(width));
      scratch.height = Math.max(1, Math.round(height));
      const sctx = scratch.getContext("2d", { willReadFrequently: true });
      if (!sctx) return null;
      const family = fontFamily ?? getComputedStyle(root).fontFamily ?? "sans-serif";
      sctx.font = `${fontWeight} 100px ${family}`;
      const measured = sctx.measureText(text).width || 1;
      const px = fontSize ?? Math.min(height * 0.72, ((width * 0.9) / measured) * 100);
      sctx.font = `${fontWeight} ${px}px ${family}`;
      sctx.textAlign = "center";
      sctx.textBaseline = "middle";
      sctx.fillStyle = "#000";
      sctx.fillText(text, scratch.width / 2, scratch.height / 2);
      const data = sctx.getImageData(0, 0, scratch.width, scratch.height).data;
      const out = new Uint8Array(cols * rows);
      for (let c = 0; c < cols; c++) {
        const x = Math.min(scratch.width - 1, Math.round(c * pitch + size / 2));
        for (let r = 0; r < rows; r++) {
          const y = Math.min(scratch.height - 1, Math.round(r * pitch + size / 2));
          out[c * rows + r] = data[(y * scratch.width + x) * 4 + 3] > 100 ? 1 : 0;
        }
      }
      return out;
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = `rgb(${rgb})`;
      for (let c = 0; c < cols; c++) {
        for (let r = 0; r < rows; r++) {
          const i = c * rows + r;
          if (mask && !mask[i]) continue;
          ctx.globalAlpha = levels[i];
          ctx.fillRect(c * pitch, r * pitch, size, size);
        }
      }
      ctx.globalAlpha = 1;
    };

    const build = () => {
      const rect = root.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cols = Math.ceil(width / pitch);
      rows = Math.ceil(height / pitch);
      mask = buildMask();
      // Reseeded on every build, so the same size always starts from the same pattern.
      const start = mulberry32(seed * 374761393 + 13);
      levels = new Float32Array(cols * rows);
      for (let i = 0; i < levels.length; i++) levels[i] = level(start);
      draw();
    };

    const step = (dt: number) => {
      const p = chance * dt;
      for (let i = 0; i < levels.length; i++) {
        if (flicker() < p) levels[i] = level(flicker);
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
      draw();
      raf = requestAnimationFrame(frame);
    };

    const update = () => {
      const shouldRun = onScreen && !document.hidden && !reduceMotion && chance > 0;
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

    build();
    // Web fonts change the text's shape once they load.
    if (text && document.fonts) {
      document.fonts.ready.then(() => {
        if (!disposed) build();
      });
    }
    const resizeObserver = new ResizeObserver(build);
    resizeObserver.observe(root);
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
      update();
    });
    intersectionObserver.observe(root);
    document.addEventListener("visibilitychange", update);

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      running = false;
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      document.removeEventListener("visibilitychange", update);
    };
  }, [squareSize, gap, flickerChance, color, maxOpacity, seed, text, fontSize, fontWeight, fontFamily, reduceMotion]);

  return (
    <div
      ref={rootRef}
      aria-hidden
      data-slot="flickering-grid"
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
      {...props}
    >
      <canvas ref={canvasRef} className="block size-full" />
    </div>
  );
}
