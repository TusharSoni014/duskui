"use client";

import * as React from "react";
import { useReducedMotion } from "motion/react";

import { cn } from "@/lib/utils";

export interface RetroGridProps extends Omit<React.ComponentProps<"div">, "children"> {
  /** Tilt of the floor in degrees (20–75). Higher is a steeper, more foreshortened floor. */
  angle?: number;
  /** Size of one floor tile in px, measured at the bottom edge. */
  cellSize?: number;
  /** Color of the grid lines and horizon. Any CSS color; defaults to a soft white. */
  color?: string;
  /** Speed multiplier for the floor scrolling toward the viewer. `0` holds it still. */
  speed?: number;
  /** Show a striped sun setting on the horizon. */
  sun?: boolean;
  /** Top and bottom colors of the sun gradient. Defaults to shades of `color`. */
  sunColors?: [string, string];
  /** Height of the horizon as a fraction of the container, from the top (0.2–0.8). */
  horizon?: number;
  /** Thickness of the grid lines in px. */
  lineWidth?: number;
}

/** How fast the floor travels at the bottom edge, in px per second at speed 1. */
const PX_PER_SECOND = 56;
/** The floor plane ends this far toward the horizon (0–1); the haze covers the rest. */
const FAR = 0.78;

const mix = (color: string, amount: number) => `color-mix(in oklab, ${color} ${amount}%, transparent)`;

/** Horizontal cut-outs across the lower part of the sun, thickening toward the horizon. */
function sunStripes(bands: number, from: number) {
  const slot = (100 - from) / bands;
  const stops = ["#000 0%", `#000 ${from}%`];
  for (let i = 0; i < bands; i++) {
    const end = from + (i + 1) * slot;
    const gap = slot * (0.14 + (0.5 * i) / Math.max(bands - 1, 1));
    const cut = (end - gap).toFixed(2);
    stops.push(`#000 ${cut}%`, `transparent ${cut}%`, `transparent ${end.toFixed(2)}%`, `#000 ${end.toFixed(2)}%`);
  }
  return `linear-gradient(to bottom, ${stops.join(", ")})`;
}

const SUN_MASK = sunStripes(7, 42);
/** How far the sun has sunk below the horizon, as a fraction of its size. */
const SUN_SINK = "22%";

/**
 * A synthwave perspective grid: a faint floor that scrolls toward the viewer and recedes to a soft horizon, with an optional striped sun.
 *
 * Built from CSS gradients and a single 3D transform, so the browser composites
 * it without any canvas or per-frame JavaScript. The perspective is solved so
 * the floor always vanishes exactly at the horizon, whatever the container
 * size. Fills its nearest positioned parent, never takes pointer events,
 * pauses off-screen and in hidden tabs, and holds still under reduced motion.
 */
export function RetroGrid({
  angle = 65,
  cellSize = 56,
  color = "rgb(255 255 255)",
  speed = 1,
  sun = false,
  sunColors,
  horizon = 0.5,
  lineWidth = 1,
  className,
  style,
  ...props
}: RetroGridProps) {
  const reduceMotion = useReducedMotion();
  const rootRef = React.useRef<HTMLDivElement>(null);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  const cell = Math.max(12, cellSize);
  const tilt = Math.min(Math.max(angle, 20), 75);
  const rad = (tilt * Math.PI) / 180;
  const horizonPct = Math.min(Math.max(horizon, 0.2), 0.8) * 100;
  const line = Math.max(0.5, lineWidth);
  const [sunTop, sunBottom] = sunColors ?? [`color-mix(in oklab, ${color} 35%, white)`, color];

  // With perspective p = H·tan(θ), a plane tilted by θ about its bottom edge
  // vanishes exactly H above that edge, i.e. right on the horizon line.
  const perspective = `${(100 * Math.tan(rad)).toFixed(3)}cqh`;
  // Height of plane needed to reach FAR of the way to the horizon, and the
  // width needed to still cover the view at that depth.
  const planeHeight = `${((100 * FAR) / ((1 - FAR) * Math.cos(rad))).toFixed(1)}cqh`;
  const planeInset = `${(((1 / (1 - FAR) - 1) / 2) * 100 + 10).toFixed(0)}%`;

  React.useEffect(() => {
    const root = rootRef.current;
    const floor = scrollRef.current;
    if (!root || !floor || reduceMotion || speed <= 0) return;

    const duration = (cell / (PX_PER_SECOND * speed)) * 1000;
    const animation = floor.animate(
      [{ transform: "translateY(0px)" }, { transform: `translateY(${cell}px)` }],
      { duration, iterations: Infinity, easing: "linear" }
    );

    let inView = true;
    const sync = () => {
      if (inView && !document.hidden) animation.play();
      else animation.pause();
    };
    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      sync();
    });
    observer.observe(root);
    document.addEventListener("visibilitychange", sync);
    return () => {
      animation.cancel();
      observer.disconnect();
      document.removeEventListener("visibilitychange", sync);
    };
  }, [cell, speed, reduceMotion]);

  const gridLines = `linear-gradient(to right, ${mix(color, 22)} ${line}px, transparent ${line}px), linear-gradient(to bottom, ${mix(color, 22)} ${line}px, transparent ${line}px)`;

  return (
    <div
      ref={rootRef}
      aria-hidden
      data-slot="retro-grid"
      className={cn("pointer-events-none absolute inset-0 overflow-hidden [container-type:size]", className)}
      style={style}
      {...props}
    >
      {/* Faint sky light rising from the horizon. */}
      <div
        className="absolute inset-x-0 top-0"
        style={{
          height: `${horizonPct}%`,
          background: `radial-gradient(70% 90% at 50% 100%, ${mix(sun ? sunBottom : color, 8)}, transparent 70%)`,
        }}
      />

      {sun && (
        <div className="absolute inset-x-0 top-0 overflow-hidden" style={{ height: `${horizonPct}%` }}>
          <div
            className="absolute bottom-0 left-1/2 aspect-square rounded-full"
            style={{
              width: `min(34cqw, ${(horizonPct * 1.1).toFixed(1)}cqh)`,
              transform: `translate(-50%, ${SUN_SINK})`,
              background: `linear-gradient(to bottom, ${sunTop}, ${sunBottom} 75%)`,
              maskImage: SUN_MASK,
              WebkitMaskImage: SUN_MASK,
            }}
          />
        </div>
      )}

      {/* The floor: a tall grid plane tilted back into the distance. */}
      <div
        className="absolute inset-x-0 bottom-0 overflow-hidden [container-type:size]"
        style={{
          top: `${horizonPct}%`,
          maskImage: "linear-gradient(to bottom, transparent, #000 55%)",
          WebkitMaskImage: "linear-gradient(to bottom, transparent, #000 55%)",
        }}
      >
        <div
          className="absolute bottom-0"
          style={{
            left: `-${planeInset}`,
            right: `-${planeInset}`,
            height: planeHeight,
            transformOrigin: "50% 100%",
            transform: `perspective(${perspective}) rotateX(${tilt}deg)`,
            maskImage: "linear-gradient(to top, #000 75%, transparent)",
            WebkitMaskImage: "linear-gradient(to top, #000 75%, transparent)",
          }}
        >
          <div
            ref={scrollRef}
            className="absolute inset-x-0 bottom-0 will-change-transform"
            style={{
              top: -cell,
              backgroundImage: gridLines,
              backgroundSize: `${cell}px ${cell}px`,
              backgroundPosition: "50% 0",
            }}
          />
        </div>
      </div>

      {/* Haze over the far floor and a thin horizon line. */}
      <div
        className="absolute inset-x-0"
        style={{
          top: `${horizonPct}%`,
          height: "30%",
          background: `linear-gradient(to bottom, ${mix(color, 8)}, transparent)`,
        }}
      />
      <div
        className="absolute inset-x-0 h-px"
        style={{
          top: `${horizonPct}%`,
          background: `linear-gradient(to right, transparent, ${mix(color, 45)} 20%, ${mix(color, 45)} 80%, transparent)`,
        }}
      />
    </div>
  );
}
