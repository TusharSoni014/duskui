"use client";

import * as React from "react";
import { useReducedMotion } from "motion/react";

import { cn } from "@/lib/utils";

export interface WavyBackgroundProps extends Omit<React.ComponentProps<"div">, "children"> {
  /** One wave is drawn per color, back to front. Any CSS colors, including theme variables. */
  colors?: string[];
  /** Thickness of each wave in px. */
  waveWidth?: number;
  /** Softness of the waves in px (a CSS blur on the canvas). `0` keeps them crisp. */
  blur?: number;
  /** Speed multiplier. `0` holds the waves still. */
  speed?: number;
  /** Opacity of each wave, 0–1. */
  waveOpacity?: number;
  /** How far the waves swing up and down, as a fraction of the container height. */
  amplitude?: number;
  /** Change it for a different, but stable, set of waves. */
  seed?: number;
}

const DEFAULT_COLORS = ["var(--color-primary)", "#38bdf8", "#818cf8"];

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

/**
 * Seeded 3D value noise: random values on an integer lattice, blended with a
 * quintic curve so the result and its slope are continuous. Returns -1…1.
 */
function createNoise3D(seed: number) {
  const rand = mulberry32(seed);
  const order = Array.from({ length: 256 }, (_, i) => i);
  for (let i = 255; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  const perm = new Uint8Array(512);
  for (let i = 0; i < 512; i++) perm[i] = order[i & 255];
  const values = new Float32Array(256);
  for (let i = 0; i < 256; i++) values[i] = rand() * 2 - 1;

  const fade = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);
  const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

  return (x: number, y: number, z: number) => {
    const xf = Math.floor(x);
    const yf = Math.floor(y);
    const zf = Math.floor(z);
    const X = xf & 255;
    const Y = yf & 255;
    const Z = zf & 255;
    const u = fade(x - xf);
    const v = fade(y - yf);
    const w = fade(z - zf);
    // Each index stays below 511, so the doubled table needs no extra masking.
    const at = (dx: number, dy: number, dz: number) =>
      values[perm[perm[perm[(X + dx) & 255] + ((Y + dy) & 255)] + ((Z + dz) & 255)]];
    return lerp(
      lerp(lerp(at(0, 0, 0), at(1, 0, 0), u), lerp(at(0, 1, 0), at(1, 1, 0), u), v),
      lerp(lerp(at(0, 0, 1), at(1, 0, 1), u), lerp(at(0, 1, 1), at(1, 1, 1), u), v),
      w
    );
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
 * Layered, flowing waves drawn on a canvas from seeded noise, each in its own color and softened with a blur.
 *
 * The noise is built in, with no dependencies, and seeded so every mount draws
 * the same waves. Sharp on high-DPI screens, resizes with its container,
 * pauses off-screen and in hidden tabs, and draws one still frame under
 * reduced motion. Fills its nearest positioned parent.
 */
export function WavyBackground({
  colors = DEFAULT_COLORS,
  waveWidth = 32,
  blur = 16,
  speed = 0.7,
  waveOpacity = 0.25,
  amplitude = 0.2,
  seed = 1,
  className,
  ...props
}: WavyBackgroundProps) {
  const reduceMotion = useReducedMotion();
  const rootRef = React.useRef<HTMLDivElement>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const palette = colors.length ? colors : DEFAULT_COLORS;
  const paletteKey = palette.join("|");
  const softness = Math.max(0, blur);
  // The canvas overhangs the sides so the blur doesn't fade the waves at the edges.
  const bleed = Math.ceil(softness * 2);

  React.useEffect(() => {
    const root = rootRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!root || !canvas || !ctx) return;

    const rgbs = paletteKey.split("|").map((c) => toRgb(root, c));
    const noise = createNoise3D(seed * 2246822519 + 3);
    const lineWidth = Math.max(0.5, waveWidth);
    const alpha = Math.min(Math.max(waveOpacity, 0), 1);
    const swing = Math.max(0, amplitude);

    let width = 0;
    let height = 0;
    let time = 0;

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.lineWidth = lineWidth;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.globalAlpha = alpha;
      const step = Math.max(4, Math.round(width / 240));
      rgbs.forEach((rgb, i) => {
        ctx.strokeStyle = `rgb(${rgb})`;
        ctx.beginPath();
        for (let x = 0; x <= width + step; x += step) {
          // Two octaves: a long swell plus a smaller ripple riding on it.
          const n = noise(x / 900, i * 0.37, time) + 0.45 * noise(x / 320, i * 0.37 + 17, time * 1.6);
          const y = height / 2 + (n / 1.45) * height * swing * 1.6;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      });
      ctx.globalAlpha = 1;
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      // The blur hides fine detail, so there's no need for full Retina resolution.
      const dpr = Math.min(window.devicePixelRatio || 1, softness > 4 ? 1.25 : 2);
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw();
    };

    let raf = 0;
    let last = 0;
    let running = false;
    let onScreen = false;

    const frame = (now: number) => {
      const dt = last ? Math.min((now - last) / 1000, 0.1) : 0;
      last = now;
      time += dt * 0.16 * speed;
      draw();
      raf = requestAnimationFrame(frame);
    };

    const update = () => {
      const shouldRun = onScreen && !document.hidden && !reduceMotion && speed > 0;
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

    resize();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(root);
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
      update();
    });
    intersectionObserver.observe(root);
    document.addEventListener("visibilitychange", update);

    return () => {
      cancelAnimationFrame(raf);
      running = false;
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      document.removeEventListener("visibilitychange", update);
    };
  }, [paletteKey, waveWidth, waveOpacity, amplitude, speed, seed, softness, reduceMotion]);

  return (
    <div
      ref={rootRef}
      aria-hidden
      data-slot="wavy-background"
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
      {...props}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-y-0 block h-full"
        style={{
          left: -bleed,
          width: `calc(100% + ${bleed * 2}px)`,
          filter: softness ? `blur(${softness}px)` : undefined,
        }}
      />
    </div>
  );
}
