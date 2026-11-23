"use client";

import * as React from "react";
import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type MotionValue,
} from "motion/react";

import { cn } from "@/lib/utils";

type Offset = { x?: number; y?: number };

export interface AnimatedBeamProps extends Omit<React.SVGProps<SVGSVGElement>, "ref" | "from" | "to"> {
  /** The positioned element both ends live in. The beam's SVG fills it. */
  containerRef: React.RefObject<HTMLElement | null>;
  /** Element the beam starts from (its centre, plus `fromOffset`). */
  fromRef: React.RefObject<HTMLElement | null>;
  /** Element the beam ends at (its centre, plus `toOffset`). */
  toRef: React.RefObject<HTMLElement | null>;
  /** Bend of the curve in px, perpendicular to the straight line. Negative bends the other way. */
  curvature?: number;
  /** Send the pulse from `to` back to `from`. */
  reverse?: boolean;
  /** Seconds for the pulse to travel the whole beam. */
  duration?: number;
  /** Seconds before the first pulse. Stagger several beams with it. */
  delay?: number;
  /** Seconds of rest between pulses. */
  repeatDelay?: number;
  /** Color of the resting track. */
  pathColor?: string;
  /** Stroke width of the track and the pulse. */
  pathWidth?: number;
  /** Opacity of the resting track. */
  pathOpacity?: number;
  /** Pulse color at the `from` end. */
  gradientStartColor?: string;
  /** Pulse color at the `to` end. */
  gradientStopColor?: string;
  /** Length of the pulse as a fraction of the beam (0.05–0.6). */
  pulseLength?: number;
  /** Nudge the start point, in px from the centre of `fromRef`. */
  fromOffset?: Offset;
  /** Nudge the end point, in px from the centre of `toRef`. */
  toOffset?: Offset;
}

type Geometry = { w: number; h: number; d: string; sx: number; sy: number; ex: number; ey: number };

// The pulse is drawn as a few stacked dashes that share a head, so the tail fades out along the curve.
const TAIL = [1, 0.7, 0.45, 0.25];

function PulseDash({
  d,
  head,
  length,
  reverse,
  stroke,
  width,
  opacity,
}: {
  d: string;
  head: MotionValue<number>;
  length: number;
  reverse: boolean;
  stroke: string;
  width: number;
  opacity: number;
}) {
  // With pathLength=1 a dash of `length` followed by a gap of 2 means only one dash is ever visible.
  // Forward: the dash covers [head - length, head]. Reverse: it covers [head, head + length].
  const offset = useTransform(head, (h) => (reverse ? -h : length - h));
  return (
    <motion.path
      d={d}
      pathLength={1}
      fill="none"
      stroke={stroke}
      strokeWidth={width}
      strokeLinecap="round"
      strokeDasharray={`${length} 2`}
      style={{ strokeDashoffset: offset, opacity }}
    />
  );
}

/**
 * An SVG beam that links two elements with a gentle curve and sends a glowing
 * pulse along it. Place it inside the positioned container that holds both
 * elements; it measures them and redraws whenever any of the three resize.
 *
 * The pulse is a motion value, so it never re-renders React. The SVG is
 * decorative (`aria-hidden`) and ignores the pointer. Under reduced motion
 * the beam is drawn as a still gradient line.
 */
export function AnimatedBeam({
  containerRef,
  fromRef,
  toRef,
  curvature = 0,
  reverse = false,
  duration = 3,
  delay = 0,
  repeatDelay = 0.6,
  pathColor = "#ffffff",
  pathWidth = 2,
  pathOpacity = 0.12,
  gradientStartColor = "var(--color-primary)",
  gradientStopColor = "#22d3ee",
  pulseLength = 0.25,
  fromOffset,
  toOffset,
  className,
  ...props
}: AnimatedBeamProps) {
  const reduceMotion = useReducedMotion();
  const rawId = React.useId();
  const gradientId = `beam-${rawId.replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const [geo, setGeo] = React.useState<Geometry | null>(null);
  const length = Math.min(0.6, Math.max(0.05, pulseLength));
  const head = useMotionValue(reverse ? 1 : 0);

  const fx = fromOffset?.x ?? 0;
  const fy = fromOffset?.y ?? 0;
  const tx = toOffset?.x ?? 0;
  const ty = toOffset?.y ?? 0;

  React.useEffect(() => {
    const container = containerRef.current;
    const from = fromRef.current;
    const to = toRef.current;
    if (!container || !from || !to) return;

    const measure = () => {
      const c = container.getBoundingClientRect();
      const a = from.getBoundingClientRect();
      const b = to.getBoundingClientRect();
      const sx = a.left - c.left + a.width / 2 + fx;
      const sy = a.top - c.top + a.height / 2 + fy;
      const ex = b.left - c.left + b.width / 2 + tx;
      const ey = b.top - c.top + b.height / 2 + ty;
      // Control point: the midpoint pushed sideways along the line's normal.
      const dx = ex - sx;
      const dy = ey - sy;
      const len = Math.hypot(dx, dy) || 1;
      const cx = (sx + ex) / 2 + (-dy / len) * curvature;
      const cy = (sy + ey) / 2 + (dx / len) * curvature;
      const round = (n: number) => Math.round(n * 100) / 100;
      const next: Geometry = {
        w: round(c.width),
        h: round(c.height),
        d: `M ${round(sx)},${round(sy)} Q ${round(cx)},${round(cy)} ${round(ex)},${round(ey)}`,
        sx: round(sx),
        sy: round(sy),
        ex: round(ex),
        ey: round(ey),
      };
      setGeo((prev) => (prev && prev.d === next.d && prev.w === next.w && prev.h === next.h ? prev : next));
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(container);
    observer.observe(from);
    observer.observe(to);
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [containerRef, fromRef, toRef, curvature, fx, fy, tx, ty]);

  React.useEffect(() => {
    if (reduceMotion || !geo) return;
    // The head travels far enough past the end for the whole tail to leave the beam.
    const keyframes = reverse ? [1, -length] : [0, 1 + length];
    head.set(keyframes[0]);
    const controls = animate(head, keyframes, {
      duration,
      delay,
      repeat: Infinity,
      repeatDelay,
      ease: [0.45, 0.05, 0.4, 1],
    });
    return () => controls.stop();
  }, [head, reverse, length, duration, delay, repeatDelay, reduceMotion, geo]);

  return (
    <svg
      aria-hidden
      focusable="false"
      data-slot="animated-beam"
      width={geo?.w ?? 0}
      height={geo?.h ?? 0}
      viewBox={geo ? `0 0 ${geo.w} ${geo.h}` : undefined}
      className={cn("pointer-events-none absolute left-0 top-0 overflow-visible", className)}
      {...props}
    >
      {geo && (
        <>
          <defs>
            <linearGradient
              id={gradientId}
              gradientUnits="userSpaceOnUse"
              x1={geo.sx}
              y1={geo.sy}
              x2={geo.ex}
              y2={geo.ey}
            >
              <stop offset="0" stopColor={gradientStartColor} />
              <stop offset="1" stopColor={gradientStopColor} />
            </linearGradient>
          </defs>
          <path
            d={geo.d}
            fill="none"
            stroke={pathColor}
            strokeOpacity={pathOpacity}
            strokeWidth={pathWidth}
            strokeLinecap="round"
          />
          {reduceMotion ? (
            <path
              d={geo.d}
              fill="none"
              stroke={`url(#${gradientId})`}
              strokeOpacity={0.55}
              strokeWidth={pathWidth}
              strokeLinecap="round"
            />
          ) : (
            <g style={{ filter: `drop-shadow(0 0 ${pathWidth * 2}px ${gradientStartColor})` }}>
              {TAIL.map((share, i) => (
                <PulseDash
                  key={i}
                  d={geo.d}
                  head={head}
                  length={length * share}
                  reverse={reverse}
                  stroke={`url(#${gradientId})`}
                  width={pathWidth}
                  opacity={i === TAIL.length - 1 ? 1 : 0.35}
                />
              ))}
            </g>
          )}
        </>
      )}
    </svg>
  );
}
