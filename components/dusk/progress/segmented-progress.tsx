"use client";

import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";
import { motion, useReducedMotion, useSpring, useTransform, type MotionValue } from "motion/react";

import { cn } from "@/lib/utils";

const fillSpring = { stiffness: 70, damping: 18, mass: 0.9 };

export interface SegmentedProgressProps
  extends Omit<React.ComponentProps<typeof ProgressPrimitive.Root>, "value" | "max" | "children"> {
  /** Current value, from 0 to `max`. */
  value: number;
  max?: number;
  /** Number of segments. Defaults to `max` when it's 12 or less, otherwise 10. */
  segments?: number;
  /** Classes for each segment's track. */
  segmentClassName?: string;
  /** Classes for the filled part of each segment (e.g. a different `bg-*`). */
  indicatorClassName?: string;
}

function Segment({
  fill,
  index,
  className,
  indicatorClassName,
}: {
  fill: MotionValue<number>;
  index: number;
  className?: string;
  indicatorClassName?: string;
}) {
  // How much of this segment is covered by the overall fill, 0–1.
  const amount = useTransform(fill, (v) => Math.min(1, Math.max(0, v - index)));
  // Light up the segment while it's the one filling, then settle.
  const boxShadow = useTransform(amount, (a) =>
    a > 0 && a < 1
      ? "0 0 12px color-mix(in oklab, var(--color-primary) 50%, transparent)"
      : "0 0 0px transparent"
  );

  return (
    <motion.span
      className={cn("relative h-full flex-1 overflow-hidden rounded-full bg-primary/15", className)}
      style={{ boxShadow }}
    >
      <motion.span
        className={cn("absolute inset-0 origin-left rounded-full bg-primary", indicatorClassName)}
        style={{ scaleX: amount }}
      />
    </motion.span>
  );
}

/**
 * A progress bar split into segments that fill one after another, like a
 * chunked upload or an onboarding checklist. A single spring drives the whole
 * bar and each segment takes its slice of it, so the fill flows from segment
 * to segment instead of all of them moving at once; the segment being filled
 * glows. A real Radix `progressbar` underneath. Instant under reduced motion.
 */
export function SegmentedProgress({
  value,
  max = 100,
  segments,
  segmentClassName,
  indicatorClassName,
  className,
  ...props
}: SegmentedProgressProps) {
  const reduceMotion = useReducedMotion() ?? false;
  const count = Math.max(1, Math.round(segments ?? (max <= 12 ? max : 10)));
  const clamped = Math.min(max, Math.max(0, value));
  const fill = useSpring(0, fillSpring);

  React.useEffect(() => {
    const target = max > 0 ? (clamped / max) * count : 0;
    if (reduceMotion) fill.jump(target);
    else fill.set(target);
  }, [clamped, max, count, reduceMotion, fill]);

  return (
    <ProgressPrimitive.Root
      value={clamped}
      max={max}
      className={cn("flex h-2 w-full items-stretch gap-1.5", className)}
      {...props}
    >
      {Array.from({ length: count }, (_, index) => (
        <Segment
          key={index}
          fill={fill}
          index={index}
          className={segmentClassName}
          indicatorClassName={indicatorClassName}
        />
      ))}
    </ProgressPrimitive.Root>
  );
}
