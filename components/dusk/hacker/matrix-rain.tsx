"use client";

import * as React from "react";
import { useReducedMotion } from "motion/react";

import { cn } from "@/lib/utils";

const KATAKANA =
  "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン";
const DIGITS = "0123456789";

export interface MatrixRainProps extends Omit<React.ComponentProps<"div">, "children"> {
  /** Glyph color. Any CSS color, including theme variables. */
  color?: string;
  /** Color of the bright leading glyph of each stream. */
  headColor?: string;
  /** Glyph size in px; also the column width. */
  fontSize?: number;
  /** Speed multiplier. `1` is the classic pace. */
  speed?: number;
  /** How fast trails fade, 0–1 per tick. Lower = longer trails. */
  fade?: number;
  /** How busy the rain is, 0–1. Higher = streams restart sooner. */
  density?: number;
  /** Characters to rain. Defaults to katakana + digits. */
  characters?: string;
  /** Freeze the current frame. */
  paused?: boolean;
}

/** Fixed simulation step, so speed and trail length don't depend on the display's refresh rate. */
const TICK_MS = 1000 / 30;

/**
 * The classic "digital rain": columns of katakana and digits falling on a
 * `<canvas>`. It fills its nearest positioned parent (`absolute inset-0`), so
 * drop it into any `relative` container as a background.
 *
 * Sharp on high-DPI screens, resizes with its container, pauses while
 * off-screen or in a hidden tab, and draws a single still frame under
 * reduced motion. The canvas is decorative and hidden from assistive tech.
 */
export function MatrixRain({
  color = "var(--color-primary)",
  headColor = "#eafff6",
  fontSize = 16,
  speed = 1,
  fade = 0.08,
  density = 0.6,
  characters = KATAKANA + DIGITS,
  paused = false,
  className,
  ...props
}: MatrixRainProps) {
  const rootRef = React.useRef<HTMLDivElement>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const pausedRef = React.useRef(paused);
  const controlRef = React.useRef<(() => void) | null>(null);
  const reduceMotion = useReducedMotion();

  React.useEffect(() => {
    const root = rootRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!root || !canvas || !ctx) return;

    // Resolve CSS colors (e.g. var(--color-primary)) to something canvas understands.
    const resolve = (value: string) => {
      canvas.style.color = value;
      const out = getComputedStyle(canvas).color;
      canvas.style.color = "";
      return out;
    };
    const bodyColor = resolve(color);
    const leadColor = resolve(headColor);
    const font = `${fontSize}px ${getComputedStyle(root).fontFamily || "monospace"}`;
    const glyphs = Array.from(characters.length ? characters : KATAKANA + DIGITS);
    const resetChance = 0.004 + Math.min(1, Math.max(0, density)) * 0.05;
    const trail = Math.min(1, Math.max(0.01, fade));

    let width = 0;
    let height = 0;
    let rows = 0;
    let drops: number[] = [];
    let speeds: number[] = [];
    let lastRow: number[] = [];
    let lastGlyph: string[] = [];

    const glyph = () => glyphs[(Math.random() * glyphs.length) | 0];

    const seedColumn = (i: number) => {
      drops[i] = -Math.random() * rows;
      speeds[i] = 0.35 + Math.random() * 0.5;
      lastRow[i] = -1;
      lastGlyph[i] = "";
    };

    const step = () => {
      // Fade toward transparent, so the rain works over any background.
      ctx.globalCompositeOperation = "destination-out";
      ctx.fillStyle = `rgba(0, 0, 0, ${trail})`;
      ctx.fillRect(0, 0, width, height);
      ctx.globalCompositeOperation = "source-over";

      for (let i = 0; i < drops.length; i++) {
        drops[i] += speeds[i] * speed;
        const row = Math.floor(drops[i]);
        if (row === lastRow[i]) continue;
        const x = i * fontSize;

        // Repaint the previous head in the body color, then draw the new bright head.
        if (lastRow[i] >= 0 && lastGlyph[i]) {
          ctx.clearRect(x, lastRow[i] * fontSize, fontSize, fontSize);
          ctx.fillStyle = bodyColor;
          ctx.fillText(lastGlyph[i], x + fontSize / 2, lastRow[i] * fontSize);
        }
        if (row >= 0) {
          const g = glyph();
          ctx.fillStyle = leadColor;
          ctx.fillText(g, x + fontSize / 2, row * fontSize);
          lastGlyph[i] = g;
        }
        lastRow[i] = row;

        if (row * fontSize > height && Math.random() < resetChance) {
          drops[i] = -Math.random() * 8;
          lastRow[i] = -1;
          lastGlyph[i] = "";
        }
      }
    };

    const drawStill = () => {
      ctx.clearRect(0, 0, width, height);
      for (let i = 0; i < drops.length; i++) drops[i] = Math.random() * rows * 1.2;
      for (let k = 0; k < 70; k++) step();
    };

    const resize = () => {
      const rect = root.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      // Resizing resets the context, so restore transform and text settings.
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.font = font;
      ctx.textAlign = "center";
      ctx.textBaseline = "top";

      rows = Math.ceil(height / fontSize);
      const columns = Math.ceil(width / fontSize);
      const prev = drops.length;
      drops = drops.slice(0, columns);
      speeds = speeds.slice(0, columns);
      lastRow = lastRow.slice(0, columns);
      lastGlyph = lastGlyph.slice(0, columns);
      for (let i = prev; i < columns; i++) seedColumn(i);
      // The resize cleared the canvas; heads must be redrawn from scratch.
      lastRow.fill(-1);
      lastGlyph.fill("");

      if (reduceMotion || pausedRef.current) drawStill();
    };

    let raf = 0;
    let last = 0;
    let acc = 0;
    let onScreen = false;

    const frame = (now: number) => {
      if (!last) last = now;
      acc += Math.min(now - last, 250);
      last = now;
      while (acc >= TICK_MS) {
        step();
        acc -= TICK_MS;
      }
      raf = requestAnimationFrame(frame);
    };

    const update = () => {
      const shouldRun = onScreen && !document.hidden && !reduceMotion && !pausedRef.current;
      if (shouldRun && !raf) {
        last = 0;
        acc = 0;
        raf = requestAnimationFrame(frame);
      } else if (!shouldRun && raf) {
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
    controlRef.current = update;

    return () => {
      cancelAnimationFrame(raf);
      raf = 0;
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      document.removeEventListener("visibilitychange", update);
      controlRef.current = null;
    };
  }, [color, headColor, fontSize, speed, fade, density, characters, reduceMotion]);

  // Pausing keeps the current frame instead of restarting the simulation.
  React.useEffect(() => {
    pausedRef.current = paused;
    controlRef.current?.();
  }, [paused]);

  return (
    <div
      ref={rootRef}
      aria-hidden
      data-slot="matrix-rain"
      className={cn("pointer-events-none absolute inset-0 overflow-hidden font-mono", className)}
      {...props}
    >
      <canvas ref={canvasRef} className="block size-full" />
    </div>
  );
}
