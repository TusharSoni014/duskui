"use client";

import * as React from "react";
import { useReducedMotion } from "motion/react";

import { cn } from "@/lib/utils";

export interface CircuitBoardProps extends React.ComponentProps<"div"> {
  /** Any CSS color for traces and pulses. Defaults to the theme primary. */
  color?: string;
  /** How many traces to lay out, from 0 (sparse) to 1 (packed). */
  density?: number;
  /** Pulse speed in px per second. */
  speed?: number;
  /** Grid spacing between traces in px. */
  cellSize?: number;
  /** Change it to get a different layout; the same seed always draws the same board. */
  seed?: number;
  /** Fade the board out toward the edges. */
  fade?: boolean;
}

type Trace = {
  key: string;
  d: string;
  start: [number, number];
  end: [number, number];
  pulse: null | { length: number; travel: number; dur: number; begin: number };
};

/** Traces are generated per chunk so resizing only adds or removes chunks, never reshuffles. */
const CHUNK_CELLS = 16;

// 8 directions, clockwise from east. Even indices are orthogonal, odd ones diagonal.
const DIRS: [number, number][] = [
  [1, 0],
  [1, 1],
  [0, 1],
  [-1, 1],
  [-1, 0],
  [-1, -1],
  [0, -1],
  [1, -1],
];

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

function chunkTraces(
  cx: number,
  cy: number,
  seed: number,
  density: number,
  cell: number,
  speed: number
): Trace[] {
  const rand = mulberry32(seed * 73856093 + cx * 19349663 + cy * 83492791);
  const n = CHUNK_CELLS;
  const nodes = new Uint8Array(n * n);
  const crossings = new Set<number>();
  const wanted = Math.round(n * n * Math.min(Math.max(density, 0), 1) * 0.12);
  const traces: Trace[] = [];
  const ox = cx * n * cell + cell / 2;
  const oy = cy * n * cell + cell / 2;

  for (let attempt = 0; attempt < wanted * 4 && traces.length < wanted; attempt++) {
    let x = Math.floor(rand() * n);
    let y = Math.floor(rand() * n);
    if (nodes[y * n + x]) continue;

    let dir = Math.floor(rand() * 4) * 2;
    let diagonalLeft = 0;
    let turnSign = 1;
    const maxSteps = 4 + Math.floor(rand() * 14);
    const points: [number, number][] = [[x, y]];
    const visited = [y * n + x];

    for (let step = 0; step < maxSteps; step++) {
      let next = dir;
      if (diagonalLeft > 0) {
        diagonalLeft--;
        // Leave the 45° jog either back to the old heading or on to a full 90° turn.
        if (diagonalLeft === 0) next = (dir + (rand() < 0.5 ? turnSign : -turnSign) + 8) % 8;
      } else if (step > 0 && rand() < 0.3) {
        turnSign = rand() < 0.5 ? 1 : -1;
        next = (dir + turnSign + 8) % 8;
        diagonalLeft = 1 + Math.floor(rand() * 2);
      }
      const [dx, dy] = DIRS[next];
      const nx = x + dx;
      const ny = y + dy;
      if (nx < 0 || ny < 0 || nx >= n || ny >= n || nodes[ny * n + nx]) break;
      if (visited.includes(ny * n + nx)) break;
      if (dx !== 0 && dy !== 0) {
        // Two diagonals may not cross inside the same grid square.
        const square = Math.min(y, ny) * n + Math.min(x, nx);
        if (crossings.has(square)) break;
        crossings.add(square);
      }
      // Merge straight runs into a single segment.
      if (next === dir && points.length > 1) points[points.length - 1] = [nx, ny];
      else points.push([nx, ny]);
      dir = next;
      x = nx;
      y = ny;
      visited.push(y * n + x);
    }

    if (visited.length < 4) continue;
    for (const v of visited) nodes[v] = 1;

    const px = points.map(([gx, gy]) => [ox + gx * cell, oy + gy * cell] as [number, number]);
    let length = 0;
    for (let i = 1; i < px.length; i++) {
      length += Math.hypot(px[i][0] - px[i - 1][0], px[i][1] - px[i - 1][1]);
    }

    let pulse: Trace["pulse"] = null;
    if (rand() < 0.75) {
      const pulseLength = Math.min(length * 0.6, cell * (1.5 + rand() * 2));
      const rest = 0.6 + rand() * 4;
      const travel = length + pulseLength + speed * rest;
      const dur = travel / speed;
      pulse = { length: pulseLength, travel, dur, begin: -rand() * dur };
    }

    traces.push({
      key: `${cx}:${cy}:${traces.length}`,
      d: px.map(([px0, py0], i) => `${i ? "L" : "M"}${px0} ${py0}`).join(""),
      start: px[0],
      end: px[px.length - 1],
      pulse,
    });
  }

  return traces;
}

/**
 * An animated printed-circuit background: 45°-routed traces with pads, and
 * small pulses travelling along them. Fills its nearest positioned parent.
 *
 * The board is generated in fixed-size chunks from a seed, so it is identical
 * on every render and resizing never reshuffles it. Pulses use SVG animation,
 * pause while off-screen or in a hidden tab, and are removed for reduced motion.
 */
export function CircuitBoard({
  color = "var(--color-primary)",
  density = 0.4,
  speed = 90,
  cellSize = 20,
  seed = 1,
  fade = true,
  className,
  style,
  ...props
}: CircuitBoardProps) {
  const reduceMotion = useReducedMotion();
  const rootRef = React.useRef<HTMLDivElement>(null);
  const svgRef = React.useRef<SVGSVGElement>(null);
  const activeRef = React.useRef(true);
  const [chunks, setChunks] = React.useState<{ x: number; y: number } | null>(null);
  const chunkPx = CHUNK_CELLS * cellSize;

  // Measure the parent in whole chunks; state only changes when a chunk is added or removed.
  React.useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      const x = Math.max(1, Math.ceil(width / chunkPx));
      const y = Math.max(1, Math.ceil(height / chunkPx));
      setChunks((prev) => (prev && prev.x === x && prev.y === y ? prev : { x, y }));
    });
    observer.observe(root);
    return () => observer.disconnect();
  }, [chunkPx]);

  const traces = React.useMemo(() => {
    if (!chunks) return [];
    const all: Trace[] = [];
    for (let cy = 0; cy < chunks.y; cy++) {
      for (let cx = 0; cx < chunks.x; cx++) {
        all.push(...chunkTraces(cx, cy, seed, density, cellSize, Math.max(speed, 1)));
      }
    }
    return all;
  }, [chunks, seed, density, cellSize, speed]);

  // Pause the SVG timeline while off-screen or in a background tab.
  React.useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    let inView = true;
    const sync = () => {
      activeRef.current = inView && !document.hidden;
      const svg = svgRef.current;
      if (!svg) return;
      if (activeRef.current) svg.unpauseAnimations();
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
  }, []);

  // A freshly mounted <svg> starts running; apply the current pause state to it.
  React.useEffect(() => {
    const svg = svgRef.current;
    if (svg && !activeRef.current) svg.pauseAnimations();
  }, [chunks]);

  const pad = Math.max(2, cellSize * 0.16);

  return (
    <div
      ref={rootRef}
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden",
        fade && "[mask-image:radial-gradient(ellipse_at_center,#000_35%,transparent_80%)]",
        className
      )}
      style={{ color, ...style }}
      {...props}
    >
      {chunks && (
        <svg
          ref={svgRef}
          width={chunks.x * chunkPx}
          height={chunks.y * chunkPx}
          className="absolute left-0 top-0"
          fill="none"
        >
          <g stroke="currentColor" strokeWidth={1} strokeLinejoin="round" strokeOpacity={0.12}>
            {traces.map((t) => (
              <path
                key={t.key}
                d={t.d}
                strokeOpacity={reduceMotion && t.pulse ? 0.25 : undefined}
              />
            ))}
          </g>
          <g stroke="currentColor" strokeOpacity={0.25} style={{ fill: "var(--color-background, #000)" }}>
            {traces.map((t) => (
              <React.Fragment key={t.key}>
                <circle cx={t.start[0]} cy={t.start[1]} r={pad} />
                <circle cx={t.end[0]} cy={t.end[1]} r={pad * 0.75} />
              </React.Fragment>
            ))}
          </g>
          {!reduceMotion && (
            <g stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeOpacity={0.6}>
              {traces.map((t) =>
                t.pulse ? (
                  <g
                    key={t.key}
                    strokeDasharray={`${t.pulse.length} ${t.pulse.travel}`}
                    strokeDashoffset={t.pulse.length}
                  >
                    <path d={t.d} strokeWidth={1.5} />
                    <animate
                      attributeName="stroke-dashoffset"
                      values={`${t.pulse.length};${t.pulse.length - t.pulse.travel}`}
                      dur={`${t.pulse.dur.toFixed(3)}s`}
                      begin={`${t.pulse.begin.toFixed(3)}s`}
                      repeatCount="indefinite"
                    />
                  </g>
                ) : null
              )}
            </g>
          )}
        </svg>
      )}
    </div>
  );
}
