"use client";

import * as React from "react";
import { useReducedMotion } from "motion/react";

import { cn } from "@/lib/utils";

export interface BinaryRainProps extends React.ComponentProps<"div"> {
  /** Any CSS color, including CSS variables. Defaults to the theme primary. */
  color?: string;
  /** Glyph size in px; also the column width. */
  fontSize?: number;
  /** Fall speed multiplier. */
  speed?: number;
  /** Share of columns raining at any moment, from 0 to 1. */
  density?: number;
  /** Characters to rain. */
  characters?: string;
}

type Drop = { y: number; speed: number; trail: number };

/** Resolves any CSS color (variables, oklch…) to sRGB by painting one pixel. */
function resolveColor(host: HTMLElement, color: string): [number, number, number] {
  const probe = document.createElement("span");
  probe.style.color = color;
  probe.style.display = "none";
  host.appendChild(probe);
  const computed = getComputedStyle(probe).color;
  probe.remove();
  const ctx = document.createElement("canvas").getContext("2d", { willReadFrequently: true });
  if (!ctx) return [255, 255, 255];
  ctx.fillStyle = computed;
  ctx.fillRect(0, 0, 1, 1);
  const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
  return [r, g, b];
}

/**
 * Columns of falling 0s and 1s drawn on a <canvas>: lighter heads, fading
 * trails and glyphs that flicker as they fall. Fills its nearest positioned parent.
 *
 * Glyphs are pre-rendered once per color/size, the loop pauses while off-screen
 * or in a hidden tab, and reduced motion draws a single still frame.
 */
export function BinaryRain({
  color = "var(--color-primary)",
  fontSize = 14,
  speed = 1,
  density = 0.4,
  characters = "01",
  className,
  ...props
}: BinaryRainProps) {
  const reduceMotion = useReducedMotion();
  const rootRef = React.useRef<HTMLDivElement>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    const root = rootRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!root || !canvas || !ctx) return;

    const chars = characters.length ? [...characters] : ["0", "1"];
    const cell = Math.max(6, fontSize);
    const fill = Math.min(Math.max(density, 0), 1);
    const [r, g, b] = resolveColor(root, color);

    let width = 0;
    let height = 0;
    let dpr = 1;
    let cols = 0;
    let rows = 0;
    let glyphs = new Uint8Array(0);
    let drops: Drop[] = [];
    let tailSprites: HTMLCanvasElement[] = [];
    let headSprites: HTMLCanvasElement[] = [];

    const sprite = (char: string, style: string) => {
      const c = document.createElement("canvas");
      c.width = c.height = Math.ceil(cell * dpr);
      const s = c.getContext("2d");
      if (!s) return c;
      s.scale(dpr, dpr);
      s.font = `${Math.round(cell * 0.85)}px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`;
      s.textAlign = "center";
      s.textBaseline = "middle";
      s.fillStyle = style;
      s.fillText(char, cell / 2, cell / 2 + 1);
      return c;
    };

    const respawn = (drop: Drop, initial: boolean) => {
      drop.speed = (5 + Math.random() * 11) * Math.max(speed, 0.05);
      drop.trail = 6 + Math.floor(Math.random() * Math.max(8, rows * 0.6));
      // Lower density means longer pauses above the top edge before a column rains again.
      const gap = rows * (1 - fill) * 2.5 * Math.random();
      drop.y = initial ? Math.random() * (rows + drop.trail) - gap : -gap - Math.random() * 4;
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      for (let c = 0; c < cols; c++) {
        const drop = drops[c];
        const head = Math.floor(drop.y);
        for (let k = 0; k <= drop.trail; k++) {
          const row = head - k;
          if (row < 0 || row >= rows) continue;
          const glyph = glyphs[row * cols + c];
          ctx.globalAlpha = k === 0 ? 0.7 : Math.pow(1 - k / (drop.trail + 1), 1.6) * 0.45;
          ctx.drawImage(k === 0 ? headSprites[glyph] : tailSprites[glyph], c * cell, row * cell, cell, cell);
        }
      }
      ctx.globalAlpha = 1;
    };

    const step = (dt: number) => {
      for (const drop of drops) {
        drop.y += drop.speed * dt;
        if (drop.y - drop.trail > rows) respawn(drop, false);
      }
      // Flicker a few glyphs.
      const flips = Math.ceil(glyphs.length * dt * 0.08);
      for (let i = 0; i < flips; i++) {
        glyphs[Math.floor(Math.random() * glyphs.length)] = Math.floor(Math.random() * chars.length);
      }
    };

    const resize = () => {
      const rect = root.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      const nextDpr = Math.min(window.devicePixelRatio || 1, 2);
      if (nextDpr !== dpr || !tailSprites.length) {
        dpr = nextDpr;
        tailSprites = chars.map((ch) => sprite(ch, `rgb(${r}, ${g}, ${b})`));
        headSprites = chars.map((ch) =>
          sprite(ch, `rgb(${Math.round(r + (255 - r) * 0.5)}, ${Math.round(g + (255 - g) * 0.5)}, ${Math.round(b + (255 - b) * 0.5)})`)
        );
      }
      canvas.width = Math.max(1, Math.round(width * dpr));
      canvas.height = Math.max(1, Math.round(height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const nextCols = Math.ceil(width / cell);
      const nextRows = Math.ceil(height / cell);
      if (nextCols !== cols || nextRows !== rows) {
        const prevDrops = drops;
        cols = nextCols;
        rows = nextRows;
        glyphs = new Uint8Array(cols * rows);
        for (let i = 0; i < glyphs.length; i++) glyphs[i] = Math.floor(Math.random() * chars.length);
        // Keep existing columns where they are so a resize doesn't restart the rain.
        drops = Array.from({ length: cols }, (_, i) => {
          if (prevDrops[i]) return prevDrops[i];
          const drop: Drop = { y: 0, speed: 0, trail: 0 };
          respawn(drop, true);
          return drop;
        });
      }
      draw();
    };

    let raf = 0;
    let last = 0;
    let inView = false;

    const loop = (time: number) => {
      const dt = last ? Math.min((time - last) / 1000, 0.1) : 0;
      last = time;
      // The window moved to a screen with a different pixel density.
      if (Math.min(window.devicePixelRatio || 1, 2) !== dpr) resize();
      step(dt);
      draw();
      raf = requestAnimationFrame(loop);
    };
    const start = () => {
      if (raf || reduceMotion || !inView || document.hidden) return;
      last = 0;
      raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };
    const onVisibility = () => (document.hidden ? stop() : start());

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(root);
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      if (inView) start();
      else stop();
    });
    intersectionObserver.observe(root);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      stop();
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [color, fontSize, speed, density, characters, reduceMotion]);

  return (
    <div
      ref={rootRef}
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
      {...props}
    >
      <canvas ref={canvasRef} className="absolute inset-0 size-full" />
    </div>
  );
}
