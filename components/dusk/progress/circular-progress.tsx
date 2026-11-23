"use client";

import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";
import { motion, useReducedMotion, useSpring, useTransform } from "motion/react";

import { cn } from "@/lib/utils";

const ringSpring = { stiffness: 90, damping: 20, mass: 0.8 };

export interface CircularProgressProps
  extends Omit<React.ComponentProps<typeof ProgressPrimitive.Root>, "value" | "max" | "children"> {
  /** Current value, from 0 to `max`. */
  value: number;
  max?: number;
  /** Diameter in pixels. */
  size?: number;
  /** Ring thickness in pixels. */
  strokeWidth?: number;
  /** Show the animated number in the middle. */
  showValue?: boolean;
  /** Formats the number in the middle (it counts up with the ring). Defaults to a whole percentage. */
  formatValue?: (value: number, max: number) => string;
  /** Small caption under the number, e.g. "Uploaded". */
  caption?: React.ReactNode;
  /** Draw a soft glow under the ring. */
  glow?: boolean;
  /** Classes for the progress arc (use `text-*` to recolor it). */
  indicatorClassName?: string;
  /** Classes for the background track (use `text-*` to recolor it). */
  trackClassName?: string;
}

/**
 * A ring that springs to its value while the number in the middle counts
 * along with it. The arc and the number are driven by the same spring motion
 * value, so they never drift apart and nothing re-renders per frame. Built on
 * Radix Progress, so it's a real `progressbar` with aria-valuenow/-max and a
 * readable value label. Jumps straight to the value under reduced motion.
 */
export function CircularProgress({
  value,
  max = 100,
  size = 120,
  strokeWidth = 10,
  showValue = true,
  formatValue,
  caption,
  glow = true,
  indicatorClassName,
  trackClassName,
  className,
  style,
  getValueLabel,
  ...props
}: CircularProgressProps) {
  const reduceMotion = useReducedMotion() ?? false;
  const filterId = `cp-glow-${React.useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const clamped = Math.min(max, Math.max(0, value));
  const progress = useSpring(0, ringSpring);

  React.useEffect(() => {
    const target = max > 0 ? clamped / max : 0;
    if (reduceMotion) progress.jump(target);
    else progress.set(target);
  }, [clamped, max, reduceMotion, progress]);

  // A round line cap draws a dot even at 0, so hide the arc until there's something to show.
  const arcOpacity = useTransform(progress, (p) => (p > 0.002 ? 1 : 0));
  const glowOpacity = useTransform(progress, (p) => (p > 0.002 ? 0.55 : 0));
  const label = useTransform(progress, (p) =>
    formatValue ? formatValue(p * max, max) : `${Math.round(p * 100)}%`
  );

  const radius = (size - strokeWidth) / 2;
  const center = size / 2;

  return (
    <ProgressPrimitive.Root
      value={clamped}
      max={max}
      getValueLabel={getValueLabel ?? ((v, m) => `${Math.round((v / m) * 100)}%`)}
      className={cn("relative inline-grid shrink-0 place-items-center", className)}
      style={{ width: size, height: size, ...style }}
      {...props}
    >
      <svg
        aria-hidden
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="col-start-1 row-start-1 -rotate-90 overflow-visible"
      >
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          className={cn("stroke-current text-primary/15", trackClassName)}
        />
        {glow && (
          <>
            <defs>
              <filter id={filterId} x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation={strokeWidth * 0.6} />
              </filter>
            </defs>
            <motion.circle
              cx={center}
              cy={center}
              r={radius}
              fill="none"
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              filter={`url(#${filterId})`}
              className={cn("stroke-current text-primary", indicatorClassName)}
              style={{ pathLength: progress, opacity: glowOpacity }}
            />
          </>
        )}
        <motion.circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          className={cn("stroke-current text-primary", indicatorClassName)}
          style={{ pathLength: progress, opacity: arcOpacity }}
        />
      </svg>

      {showValue && (
        <span
          aria-hidden
          className="col-start-1 row-start-1 flex flex-col items-center justify-center text-center leading-none"
        >
          <motion.span
            className="font-semibold tracking-tight tabular-nums"
            style={{ fontSize: Math.max(12, size * 0.2) }}
          >
            {label}
          </motion.span>
          {caption && (
            <span className="mt-1.5 text-muted-foreground" style={{ fontSize: Math.max(10, size * 0.09) }}>
              {caption}
            </span>
          )}
        </span>
      )}
    </ProgressPrimitive.Root>
  );
}
