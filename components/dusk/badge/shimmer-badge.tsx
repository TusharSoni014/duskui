"use client";

import * as React from "react";
import { motion, useReducedMotion } from "motion/react";

import { Badge, type BadgeProps } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export interface ShimmerBadgeProps extends Omit<BadgeProps, "asChild"> {
  /** Seconds for one sweep. */
  duration?: number;
  /** Pause between sweeps, in seconds. */
  delay?: number;
}

/**
 * A badge with a faint band of light sweeping across it every few seconds — for
 * "New", "Beta" or "Pro" labels that should catch the eye without blinking.
 * Static under reduced motion.
 */
export function ShimmerBadge({
  variant = "soft",
  duration = 1.4,
  delay = 4,
  className,
  children,
  ...props
}: ShimmerBadgeProps) {
  const reduceMotion = useReducedMotion();
  return (
    <Badge variant={variant} className={cn("relative isolate", className)} {...props}>
      {children}
      {!reduceMotion && (
        <motion.span
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 -z-10 w-full bg-[linear-gradient(100deg,transparent_35%,rgb(255_255_255/0.1)_50%,transparent_65%)]"
          initial={{ x: "-100%" }}
          animate={{ x: "100%" }}
          transition={{ duration, ease: "easeInOut", repeat: Infinity, repeatDelay: delay }}
        />
      )}
    </Badge>
  );
}
