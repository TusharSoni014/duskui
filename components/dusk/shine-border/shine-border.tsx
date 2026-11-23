"use client";

import * as React from "react";
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
} from "motion/react";

import { cn } from "@/lib/utils";

export interface ShineBorderProps extends Omit<React.ComponentProps<"div">, "color"> {
  /** One CSS color, or several that blend from the sheen's core outwards. */
  color?: string | string[];
  /** Border width in px. */
  borderWidth?: number;
  /** Seconds for the sheen to travel once around the border. */
  duration?: number;
  /** Corner radius in px. */
  radius?: number;
  /** Classes for the inner content wrapper, which paints its own background. */
  contentClassName?: string;
}

/** Masks a layer down to its padding box, leaving only a ring the width of its padding. */
const RING =
  "pointer-events-none absolute inset-0 rounded-[inherit] [mask-image:linear-gradient(#000_0_0),linear-gradient(#000_0_0)] [mask-clip:content-box,border-box] [mask-composite:exclude]";

/**
 * Point at fraction `t` (0–1) of the way around a rounded rectangle, walking
 * clockwise from the top-left corner. Moves at constant speed on every side.
 */
function pointOnRoundedRect(t: number, w: number, h: number, r: number) {
  const rad = Math.max(0, Math.min(r, w / 2, h / 2));
  const sx = w - 2 * rad;
  const sy = h - 2 * rad;
  const arc = (Math.PI / 2) * rad;
  const segments = [sx, arc, sy, arc, sx, arc, sy, arc];
  const total = segments.reduce((a, b) => a + b, 0) || 1;
  let d = (((t % 1) + 1) % 1) * total;

  for (let i = 0; i < segments.length; i++) {
    const len = segments[i];
    if (d > len && i < segments.length - 1) {
      d -= len;
      continue;
    }
    const k = len === 0 ? 0 : d / len;
    const corner = (cx: number, cy: number, start: number) => {
      const a = start + k * (Math.PI / 2);
      return { x: cx + rad * Math.cos(a), y: cy + rad * Math.sin(a) };
    };
    switch (i) {
      case 0: return { x: rad + k * sx, y: 0 };
      case 1: return corner(w - rad, rad, -Math.PI / 2);
      case 2: return { x: w, y: rad + k * sy };
      case 3: return corner(w - rad, h - rad, 0);
      case 4: return { x: w - rad - k * sx, y: h };
      case 5: return corner(rad, h - rad, Math.PI / 2);
      case 6: return { x: 0, y: h - rad - k * sy };
      default: return corner(rad, rad, Math.PI);
    }
  }
  return { x: 0, y: 0 };
}

/**
 * Wraps content in a thin border with a soft, multi-color sheen gliding around it.
 */
export function ShineBorder({
  color = "var(--color-primary)",
  borderWidth = 1,
  duration = 8,
  radius = 12,
  className,
  contentClassName,
  style,
  children,
  ...props
}: ShineBorderProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const size = React.useRef({ w: 0, h: 0 });
  const reduceMotion = useReducedMotion();
  const inView = useInView(ref);

  const progress = useMotionValue(0);
  const background = useMotionValue("none");

  const colors = Array.isArray(color) ? (color.length ? color : ["var(--color-primary)"]) : [color];
  // Colors spread from the core of the sheen to ~45% of its radius, then fade out.
  const stops = colors
    .map((c, i) => `${c} ${colors.length === 1 ? 0 : Math.round((i / (colors.length - 1)) * 45)}%`)
    .join(", ");
  const reversed = [...colors]
    .reverse()
    .map((c, i) => `${c} ${colors.length === 1 ? 0 : Math.round((i / (colors.length - 1)) * 45)}%`)
    .join(", ");

  // Builds the two-spot gradient from the current progress and element size.
  const paint = React.useCallback(() => {
    const { w, h } = size.current;
    if (!w || !h) return;
    const t = progress.get();
    const inset = borderWidth / 2;
    const iw = w - borderWidth;
    const ih = h - borderWidth;
    const r = Math.max(0, radius - inset);
    const a = pointOnRoundedRect(t, iw, ih, r);
    const b = pointOnRoundedRect(t + 0.5, iw, ih, r);
    const spot = Math.round(Math.max(40, Math.min(Math.min(w, h) * 0.9, 160)));
    background.set(
      `radial-gradient(${spot}px circle at ${a.x + inset}px ${a.y + inset}px, ${stops}, transparent 72%),` +
        ` radial-gradient(${spot}px circle at ${b.x + inset}px ${b.y + inset}px, ${reversed}, transparent 72%)`
    );
  }, [background, borderWidth, progress, radius, reversed, stops]);

  // Track the element's size so the path matches its shape at any aspect ratio.
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => {
      const box = entry.borderBoxSize?.[0];
      size.current = box
        ? { w: box.inlineSize, h: box.blockSize }
        : { w: el.offsetWidth, h: el.offsetHeight };
      paint();
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [paint]);

  React.useEffect(() => progress.on("change", paint), [paint, progress]);

  // Glide only while visible; reduced motion keeps the sheen parked.
  React.useEffect(() => {
    if (reduceMotion) {
      progress.set(0.125);
      paint();
      return;
    }
    if (!inView) return;
    const controls = animate(progress, progress.get() + 1, {
      duration: Math.max(1, duration),
      ease: "linear",
      repeat: Infinity,
    });
    return () => controls.stop();
  }, [duration, inView, paint, progress, reduceMotion]);

  return (
    <div
      ref={ref}
      data-slot="shine-border"
      className={cn("relative isolate", className)}
      style={{ borderRadius: radius, padding: borderWidth, ...style }}
      {...props}
    >
      {/* Faint resting line so the edge reads where the sheen isn't. */}
      <span
        aria-hidden
        className={RING}
        style={{ padding: borderWidth, background: "color-mix(in oklab, white 10%, transparent)" }}
      />
      <motion.span aria-hidden className={RING} style={{ padding: borderWidth, background }} />
      <div
        data-slot="shine-border-content"
        className={cn("relative h-full bg-card", contentClassName)}
        style={{ borderRadius: Math.max(0, radius - borderWidth) }}
      >
        {children}
      </div>
    </div>
  );
}
