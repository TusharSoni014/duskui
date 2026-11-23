"use client";

import * as React from "react";
import { useReducedMotion } from "motion/react";

import { cn } from "@/lib/utils";

export interface BackgroundBeamsProps extends React.ComponentProps<"div"> {
  /** Any CSS color for the beams. Defaults to the theme primary. */
  color?: string;
  /** Number of curved paths. */
  count?: number;
  /** Speed multiplier. */
  speed?: number;
  /** Opacity of the faint guide paths the beams travel along, from 0 to 1. */
  pathOpacity?: number;
  /** Change it to get a different layout; the same seed always draws the same beams. */
  seed?: number;
  /** Fade the beams out toward the edges. */
  fade?: boolean;
}

type Beam = {
  d: string;
  /** Gradient vector at the start and end of the sweep. */
  from: [number, number, number, number];
  to: [number, number, number, number];
  /** Static gradient position, shown where SMIL is unavailable. */
  still: [number, number, number, number];
  travel: number;
  rest: number;
  phase: number;
};

const VIEW_W = 1000;
const VIEW_H = 600;

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

const r1 = (n: number) => Math.round(n * 10) / 10;

/** A fan of nested curves rising from the bottom-left and sweeping out to the right. */
function makeBeams(count: number, seed: number): Beam[] {
  const rand = mulberry32(seed * 2654435761 + 1);
  const n = Math.max(1, Math.round(count));
  const beams: Beam[] = [];
  for (let i = 0; i < n; i++) {
    const t = n === 1 ? 0.5 : i / (n - 1);
    const x0 = -80 + t * 420 + (rand() - 0.5) * 40;
    const y0 = VIEW_H + 40;
    const x3 = VIEW_W + 60;
    const y3 = -60 + t * 440 + (rand() - 0.5) * 40;
    const c1: [number, number] = [x0 + 30 + rand() * 60, 260 + t * 120 - rand() * 80];
    const c2: [number, number] = [x3 - 360 - rand() * 120, y3 + (rand() - 0.5) * 60];
    const d = `M${r1(x0)} ${r1(y0)}C${r1(c1[0])} ${r1(c1[1])} ${r1(c2[0])} ${r1(c2[1])} ${r1(x3)} ${r1(y3)}`;

    // The lit band is a slice of a gradient laid along the start→end direction.
    const len = Math.hypot(x3 - x0, y3 - y0);
    const ux = (x3 - x0) / len;
    const uy = (y3 - y0) / len;
    const band = len * (0.18 + rand() * 0.1);
    const at = (s: number): [number, number, number, number] => {
      const sx = x0 + ux * (s - band);
      const sy = y0 + uy * (s - band);
      return [r1(sx), r1(sy), r1(sx + ux * band), r1(sy + uy * band)];
    };

    beams.push({
      d,
      from: at(0),
      to: at(len + band),
      still: at(len * (0.35 + rand() * 0.5)),
      travel: 3.5 + rand() * 3.5,
      rest: 0.8 + rand() * 4,
      phase: rand(),
    });
  }
  return beams;
}

/**
 * Thin beams of light travelling along a fan of curved SVG paths. Each beam is
 * a bright slice of a gradient whose stops sweep along its path, so it fades
 * in from a soft tail to a hot head. Fills its nearest positioned parent.
 *
 * The layout is seeded, so it renders identically on the server and client.
 * The SVG timeline pauses off-screen and in hidden tabs; reduced motion
 * freezes it on a still frame.
 */
export function BackgroundBeams({
  color = "var(--color-primary)",
  count = 14,
  speed = 1,
  pathOpacity = 0.08,
  seed = 1,
  fade = true,
  className,
  style,
  ...props
}: BackgroundBeamsProps) {
  const reduceMotion = useReducedMotion();
  const rootRef = React.useRef<HTMLDivElement>(null);
  const svgRef = React.useRef<SVGSVGElement>(null);
  const uid = React.useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const beams = React.useMemo(() => makeBeams(count, seed), [count, seed]);
  const rate = Math.max(speed, 0.05);
  const head = `color-mix(in oklab, ${color} 55%, white)`;

  React.useEffect(() => {
    const root = rootRef.current;
    const svg = svgRef.current;
    if (!root || !svg) return;

    if (reduceMotion) {
      // Freeze the timeline on its first frame: a deterministic still of beams mid-flight.
      svg.setCurrentTime(0);
      svg.pauseAnimations();
      return;
    }

    let inView = true;
    const sync = () => {
      if (inView && !document.hidden) svg.unpauseAnimations();
      else svg.pauseAnimations();
    };
    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      sync();
    });
    observer.observe(root);
    document.addEventListener("visibilitychange", sync);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", sync);
    };
  }, [reduceMotion, beams]);

  return (
    <div
      ref={rootRef}
      aria-hidden
      data-slot="background-beams"
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden",
        fade && "[mask-image:radial-gradient(ellipse_at_center,#000_40%,transparent_85%)]",
        className
      )}
      style={style}
      {...props}
    >
      <svg
        ref={svgRef}
        className="absolute inset-0 size-full"
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        preserveAspectRatio="none"
        fill="none"
      >
        <defs>
          {beams.map((b, i) => {
            const total = (b.travel + b.rest) / rate;
            const split = (b.travel / (b.travel + b.rest)).toFixed(4);
            const attr = (k: number) => `${b.from[k]};${b.to[k]};${b.to[k]}`;
            return (
              <linearGradient
                key={i}
                id={`${uid}-beam-${i}`}
                gradientUnits="userSpaceOnUse"
                x1={b.still[0]}
                y1={b.still[1]}
                x2={b.still[2]}
                y2={b.still[3]}
              >
                <stop offset="0" stopOpacity={0} style={{ stopColor: color }} />
                <stop offset="0.65" stopOpacity={0.55} style={{ stopColor: color }} />
                <stop offset="0.94" stopOpacity={1} style={{ stopColor: head }} />
                <stop offset="1" stopOpacity={0} style={{ stopColor: head }} />
                {(["x1", "y1", "x2", "y2"] as const).map((name, k) => (
                  <animate
                    key={name}
                    attributeName={name}
                    values={attr(k)}
                    keyTimes={`0;${split};1`}
                    dur={`${total.toFixed(3)}s`}
                    begin={`${(-b.phase * total).toFixed(3)}s`}
                    repeatCount="indefinite"
                  />
                ))}
              </linearGradient>
            );
          })}
        </defs>

        {pathOpacity > 0 && (
          <g stroke={color} strokeOpacity={pathOpacity} strokeWidth={1}>
            {beams.map((b, i) => (
              <path key={i} d={b.d} vectorEffect="non-scaling-stroke" />
            ))}
          </g>
        )}
        <g strokeLinecap="round">
          {beams.map((b, i) => (
            <g key={i} stroke={`url(#${uid}-beam-${i})`}>
              <path d={b.d} strokeWidth={5} strokeOpacity={0.25} vectorEffect="non-scaling-stroke" />
              <path d={b.d} strokeWidth={1.5} vectorEffect="non-scaling-stroke" />
            </g>
          ))}
        </g>
      </svg>
    </div>
  );
}
