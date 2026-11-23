"use client";

import * as React from "react";
import { useInView, useReducedMotion } from "motion/react";

import { cn } from "@/lib/utils";

export interface ElectricCardProps extends Omit<React.ComponentProps<"div">, "color"> {
  /** Any CSS color for the arcs. Defaults to the theme primary. */
  color?: string;
  /** How far the lightning jumps off the border, in px. */
  chaos?: number;
  /** Number of bright arcs crawling around the border. */
  arcs?: number;
  /** Milliseconds between new lightning shapes. Clamped to at least 60ms. */
  interval?: number;
  /** Laps per second the arcs crawl around the border. */
  speed?: number;
  /** Keep the effect on. By default it runs on hover and keyboard focus inside the card. */
  active?: boolean;
  /** Corner radius in px. The lightning follows this curve. */
  radius?: number;
}

type Size = { w: number; h: number };
type Point = { x: number; y: number; nx: number; ny: number };

/** Point and outward normal at distance `s` along a rounded rectangle's perimeter. */
function perimeterPoint(s: number, { w, h }: Size, r: number): Point {
  const straightX = Math.max(0, w - 2 * r);
  const straightY = Math.max(0, h - 2 * r);
  const corner = (Math.PI * r) / 2;
  const total = 2 * straightX + 2 * straightY + 4 * corner;
  let d = ((s % total) + total) % total;

  const arc = (cx: number, cy: number, from: number): Point => {
    const a = from + (d / corner) * (Math.PI / 2);
    const nx = Math.cos(a);
    const ny = Math.sin(a);
    return { x: cx + nx * r, y: cy + ny * r, nx, ny };
  };

  if (d < straightX) return { x: r + d, y: 0, nx: 0, ny: -1 };
  d -= straightX;
  if (d < corner) return arc(w - r, r, -Math.PI / 2);
  d -= corner;
  if (d < straightY) return { x: w, y: r + d, nx: 1, ny: 0 };
  d -= straightY;
  if (d < corner) return arc(w - r, h - r, 0);
  d -= corner;
  if (d < straightX) return { x: w - r - d, y: h, nx: 0, ny: 1 };
  d -= straightX;
  if (d < corner) return arc(r, h - r, Math.PI / 2);
  d -= corner;
  if (d < straightY) return { x: 0, y: h - r - d, nx: -1, ny: 0 };
  d -= straightY;
  return arc(r, r, Math.PI);
}

const jitter = (amount: number) => (Math.random() * 2 - 1) * amount;
const fmt = (n: number) => n.toFixed(1);

/** A jagged bolt along the border from `start`, tapering at both ends, plus one forked spark. */
function boltPath(start: number, length: number, size: Size, r: number, chaos: number) {
  const steps = Math.max(4, Math.round(length / 9));
  const fork = 1 + Math.floor(Math.random() * (steps - 2));
  let d = "";
  let spark = "";
  for (let k = 0; k <= steps; k++) {
    const p = perimeterPoint(start + (k / steps) * length, size, r);
    const offset = jitter(chaos) * Math.sin((Math.PI * k) / steps);
    const x = p.x + p.nx * offset;
    const y = p.y + p.ny * offset;
    d += `${k === 0 ? "M" : "L"}${fmt(x)} ${fmt(y)}`;
    if (k === fork) {
      // A short branch shooting outwards from the bolt.
      const reach = chaos * (1.2 + Math.random());
      spark = `M${fmt(x)} ${fmt(y)}L${fmt(x + p.nx * reach * 0.5 + jitter(chaos * 0.6))} ${fmt(
        y + p.ny * reach * 0.5 + jitter(chaos * 0.6)
      )}L${fmt(x + p.nx * reach + jitter(chaos * 0.8))} ${fmt(y + p.ny * reach + jitter(chaos * 0.8))}`;
    }
  }
  return d + spark;
}

/** A faint electric outline around the whole border. */
function outlinePath(size: Size, r: number, chaos: number, perimeter: number) {
  const steps = Math.max(12, Math.round(perimeter / 14));
  let d = "";
  for (let k = 0; k < steps; k++) {
    const p = perimeterPoint((k / steps) * perimeter, size, r);
    const offset = jitter(chaos * 0.3);
    d += `${k === 0 ? "M" : "L"}${fmt(p.x + p.nx * offset)} ${fmt(p.y + p.ny * offset)}`;
  }
  return `${d}Z`;
}

/**
 * A card whose border crackles with electricity on hover or keyboard focus.
 *
 * Lightning is procedurally generated SVG: jagged bolts that crawl around the
 * rounded border and re-randomize on an interval, with one soft glow. Paths are
 * written straight to the DOM, so the card never re-renders while it sparks.
 * The bolts change shape but never blink on and off, and reduced-motion users
 * get a single still frame instead of the crackle.
 */
export function ElectricCard({
  color = "var(--color-primary)",
  chaos = 4,
  arcs = 1,
  interval = 110,
  speed = 0.25,
  active = false,
  radius = 12,
  className,
  style,
  children,
  onPointerEnter,
  onPointerLeave,
  onFocus,
  onBlur,
  ...props
}: ElectricCardProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const outlineRef = React.useRef<SVGPathElement>(null);
  const boltRef = React.useRef<SVGPathElement>(null);
  const hovered = React.useRef(false);
  const timer = React.useRef<ReturnType<typeof setInterval> | null>(null);
  const size = React.useRef<Size>({ w: 0, h: 0 });
  const offsets = React.useRef<number[]>([]);
  const inView = useInView(ref);
  const reduceMotion = useReducedMotion();
  const boltId = `electric-bolt-${React.useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;

  const tickMs = Math.max(60, interval);

  const draw = React.useCallback(
    (advance: boolean) => {
      const { w, h } = size.current;
      if (!w || !h) return;
      const r = Math.min(radius, w / 2, h / 2);
      // Border-box coordinates; inset half a pixel to sit on the 1px border.
      const box = { w: w - 1, h: h - 1 };
      const perimeter = 2 * (box.w + box.h - 4 * r) + 2 * Math.PI * r;
      const count = Math.max(1, Math.round(arcs));
      if (offsets.current.length !== count) {
        offsets.current = Array.from({ length: count }, (_, i) => (i / count) * perimeter + Math.random() * 40);
      }
      const step = advance ? speed * perimeter * (tickMs / 1000) : 0;
      offsets.current = offsets.current.map((o) => o + step);

      const bolts = offsets.current
        .map((o) => boltPath(o, perimeter * 0.2, box, r, chaos))
        .join("");
      boltRef.current?.setAttribute("d", bolts);
      outlineRef.current?.setAttribute("d", outlinePath(box, r, chaos, perimeter));
    },
    [arcs, chaos, radius, speed, tickMs]
  );

  const start = React.useCallback(() => {
    draw(false);
    if (timer.current || reduceMotion) return;
    timer.current = setInterval(() => draw(true), tickMs);
  }, [draw, reduceMotion, tickMs]);

  const stop = React.useCallback(() => {
    if (timer.current) clearInterval(timer.current);
    timer.current = null;
  }, []);

  // Track the card's size without re-rendering.
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new ResizeObserver(() => {
      size.current = { w: el.offsetWidth, h: el.offsetHeight };
      draw(false);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [draw]);

  React.useEffect(() => {
    if (inView && (active || hovered.current)) start();
    else stop();
    return stop;
  }, [inView, active, start, stop]);

  const activate = () => {
    hovered.current = true;
    if (inView) start();
  };
  const deactivate = () => {
    hovered.current = false;
    if (!active) stop();
  };

  const visible = cn(
    "transition-opacity duration-300 motion-reduce:transition-none",
    active
      ? "opacity-100"
      : "opacity-0 group-hover/electric:opacity-100 group-focus-within/electric:opacity-100"
  );

  return (
    <div
      ref={ref}
      data-slot="electric-card"
      data-active={active || undefined}
      className={cn(
        "group/electric relative isolate border border-white/10 bg-card p-6 text-card-foreground",
        "transition-colors duration-300 hover:border-(--electric-dim) focus-within:border-(--electric-dim) data-active:border-(--electric-dim)",
        className
      )}
      style={
        {
          "--electric": color,
          "--electric-dim": "color-mix(in oklab, var(--electric) 30%, transparent)",
          borderRadius: radius,
          ...style,
        } as React.CSSProperties
      }
      onPointerEnter={(e) => {
        onPointerEnter?.(e);
        activate();
      }}
      onPointerLeave={(e) => {
        onPointerLeave?.(e);
        deactivate();
      }}
      onFocus={(e) => {
        onFocus?.(e);
        activate();
      }}
      onBlur={(e) => {
        onBlur?.(e);
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) deactivate();
      }}
      {...props}
    >
      <svg
        aria-hidden
        focusable="false"
        className={cn("pointer-events-none absolute -inset-px z-10 size-[calc(100%+2px)] overflow-visible", visible)}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ filter: "drop-shadow(0 0 3px color-mix(in oklab, var(--electric) 45%, transparent))" }}
      >
        <defs>
          <path ref={boltRef} id={boltId} />
        </defs>
        <g transform="translate(0.5 0.5)">
          <path ref={outlineRef} style={{ stroke: "var(--electric)" }} strokeOpacity={0.25} strokeWidth={1} />
          <use href={`#${boltId}`} style={{ stroke: "var(--electric)" }} strokeOpacity={0.85} strokeWidth={1.5} />
        </g>
      </svg>
      {children}
    </div>
  );
}
