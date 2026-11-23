"use client";

import * as React from "react";
import { useReducedMotion } from "motion/react";

import { cn } from "@/lib/utils";

export interface MeteorsProps extends React.ComponentProps<"div"> {
  /** Number of meteors. */
  count?: number;
  /** Direction of travel in degrees: 0 is right, 90 is straight down. */
  angle?: number;
  /** Any CSS color for the tails and glow. Defaults to the theme primary. */
  color?: string;
  /** Speed multiplier. */
  speed?: number;
  /** Average tail length in px. */
  tailLength?: number;
  /** Number of faint, still stars scattered behind the meteors. */
  stars?: number;
  /** Change it for a different, but stable, sky. */
  seed?: number;
}

type Meteor = {
  /** Position across the direction of travel, 0–1 of the container's extent. */
  lane: number;
  tail: number;
  pace: number;
  /** Pause between passes, in seconds at speed 1. */
  rest: number;
  /** Where in its cycle the meteor starts, 0–1. */
  phase: number;
};

type Star = { left: string; top: string; size: number; opacity: number };

/** Base meteor speed in px per second. */
const PX_PER_SECOND = 520;

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

function makeSky(count: number, stars: number, tailLength: number, seed: number) {
  const rand = mulberry32(seed * 374761393 + 11);
  const n = Math.max(0, Math.round(count));
  const meteors: Meteor[] = [];
  for (let i = 0; i < n; i++) {
    meteors.push({
      // Stratified lanes spread meteors evenly, jittered so they don't look gridded.
      lane: (i + 0.15 + rand() * 0.7) / Math.max(n, 1),
      tail: Math.max(8, tailLength * (0.6 + rand() * 0.7)),
      pace: 0.7 + rand() * 0.6,
      rest: 1 + rand() * 5,
      phase: rand(),
    });
  }
  // Shuffle so neighbouring lanes don't fire in order.
  for (let i = meteors.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [meteors[i], meteors[j]] = [meteors[j], meteors[i]];
  }
  const field: Star[] = Array.from({ length: Math.max(0, Math.round(stars)) }, () => ({
    left: `${(rand() * 100).toFixed(2)}%`,
    top: `${(rand() * 100).toFixed(2)}%`,
    size: rand() < 0.85 ? 1 : 2,
    opacity: Math.round((0.15 + rand() * 0.45) * 100) / 100,
  }));
  return { meteors, field };
}

/**
 * Shooting stars that streak diagonally across the container at staggered
 * intervals, each with a glowing head and a fading tail. Fills its nearest
 * positioned parent.
 *
 * Every meteor and star is derived from a seed, so the server and client
 * render the same sky. Paths are fitted to the container so each meteor
 * crosses it whatever the angle or aspect ratio. Animations run on the
 * compositor, pause off-screen and in hidden tabs, and reduced motion shows a
 * still frame instead.
 */
export function Meteors({
  count = 12,
  angle = 135,
  color = "var(--color-primary)",
  speed = 1,
  tailLength = 120,
  stars = 30,
  seed = 1,
  className,
  style,
  ...props
}: MeteorsProps) {
  const reduceMotion = useReducedMotion();
  const rootRef = React.useRef<HTMLDivElement>(null);
  const meteorRefs = React.useRef<(HTMLSpanElement | null)[]>([]);
  const { meteors, field } = React.useMemo(
    () => makeSky(count, stars, tailLength, seed),
    [count, stars, tailLength, seed]
  );

  React.useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const nodes = meteorRefs.current;
    const rad = (angle * Math.PI) / 180;
    const dx = Math.cos(rad);
    const dy = Math.sin(rad);
    // Perpendicular to the direction of travel.
    const nx = -dy;
    const ny = dx;
    const rate = Math.max(speed, 0.05);
    const place = (x: number, y: number) => `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px) rotate(${angle}deg)`;

    let animations: (Animation | null)[] = [];
    let inView = true;
    const active = () => inView && !document.hidden;

    const build = () => {
      const { width, height } = root.getBoundingClientRect();
      if (!width || !height) return;
      const times = animations.map((a) => a?.currentTime ?? null);
      for (const a of animations) a?.cancel();
      animations = [];

      // Project the corners onto both axes to find the band every path must cross.
      const corners = [
        [0, 0],
        [width, 0],
        [0, height],
        [width, height],
      ];
      const across = corners.map(([x, y]) => x * nx + y * ny);
      const along = corners.map(([x, y]) => x * dx + y * dy);
      const sMin = Math.min(...across);
      const sMax = Math.max(...across);
      const tMin = Math.min(...along);
      const tMax = Math.max(...along);

      meteors.forEach((m, i) => {
        const el = nodes[i];
        if (!el) return;
        const s = sMin + m.lane * (sMax - sMin);
        // Start with the whole meteor outside, end once its tail has left.
        const t0 = tMin - 8;
        const t1 = tMax + m.tail + 8;
        const at = (f: number) => {
          const t = t0 + (t1 - t0) * f;
          return place(s * nx + t * dx, s * ny + t * dy);
        };

        if (reduceMotion) {
          // A still frame: a third of the meteors frozen mid-flight.
          el.style.transform = at(0.3 + m.phase * 0.4);
          el.style.opacity = i % 3 === 0 ? "0.8" : "0";
          animations.push(null);
          return;
        }

        const travel = ((t1 - t0) / (PX_PER_SECOND * m.pace * rate)) * 1000;
        const total = travel + (m.rest * 1000) / rate;
        const p = travel / total;
        const animation = el.animate(
          [
            { offset: 0, transform: at(0), opacity: 0 },
            { offset: p * 0.08, transform: at(0.08), opacity: 1 },
            { offset: p * 0.7, transform: at(0.7), opacity: 1 },
            { offset: p, transform: at(1), opacity: 0 },
            { offset: 1, transform: at(1), opacity: 0 },
          ],
          { duration: total, iterations: Infinity, easing: "linear" }
        );
        // Keep each meteor's place in its cycle across resizes; stagger them on first run.
        const prev = times[i];
        animation.currentTime = typeof prev === "number" ? prev % total : m.phase * total;
        if (!active()) animation.pause();
        animations.push(animation);
      });
    };

    const sync = () => {
      for (const a of animations) {
        if (!a) continue;
        if (active()) a.play();
        else a.pause();
      }
    };

    build();
    const resizeObserver = new ResizeObserver(build);
    resizeObserver.observe(root);
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      sync();
    });
    intersectionObserver.observe(root);
    document.addEventListener("visibilitychange", sync);

    return () => {
      for (const a of animations) a?.cancel();
      for (const el of nodes) {
        if (!el) continue;
        el.style.transform = "";
        el.style.opacity = "0";
      }
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      document.removeEventListener("visibilitychange", sync);
    };
  }, [meteors, angle, speed, reduceMotion]);

  const head = `color-mix(in oklab, ${color} 35%, white)`;

  return (
    <div
      ref={rootRef}
      aria-hidden
      data-slot="meteors"
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
      style={style}
      {...props}
    >
      {field.map((star, i) => (
        <span
          key={`s${i}`}
          className="absolute rounded-full bg-white"
          style={{ left: star.left, top: star.top, width: star.size, height: star.size, opacity: star.opacity }}
        />
      ))}
      {meteors.map((m, i) => (
        <span
          key={i}
          ref={(el) => {
            meteorRefs.current[i] = el;
          }}
          className="absolute left-0 top-0 block h-px rounded-full will-change-transform"
          style={{
            width: m.tail,
            marginLeft: -m.tail,
            marginTop: -0.5,
            // The head sits at the transform origin, so rotating swings the tail behind it.
            transformOrigin: "100% 50%",
            opacity: 0,
            background: `linear-gradient(to right, transparent, color-mix(in oklab, ${color} 55%, transparent) 65%, ${color})`,
          }}
        >
          <span
            className="absolute right-0 top-1/2 block size-[3px] -translate-y-1/2 translate-x-1/2 rounded-full"
            style={{ background: head, boxShadow: `0 0 6px 2px ${color}` }}
          />
        </span>
      ))}
    </div>
  );
}
