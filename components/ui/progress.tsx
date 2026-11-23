"use client"

import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"
import { motion, useReducedMotion, type Transition } from "motion/react"

import { cn } from "@/lib/utils"

const fill: Transition = { type: "spring", stiffness: 140, damping: 22, mass: 0.6 }

/**
 * DuskUI Progress — a drop-in upgrade of the shadcn/ui Progress.
 *
 * Same API as shadcn (`value`, `max` and the Radix props) plus:
 * - The indicator springs to each new value instead of easing linearly, and
 *   fills in from empty when it mounts.
 * - An indeterminate state: pass `value={null}` (or leave it out) and a
 *   highlight sweeps across the track. Under reduced motion it gently pulses
 *   instead.
 * - A soft gradient and a bright leading edge on the indicator.
 * - `indicatorClassName` to recolor the bar without touching the track.
 * Powered by Radix Progress, so role="progressbar" and the aria-value* attributes are set.
 */
function Progress({
  className,
  indicatorClassName,
  value,
  max = 100,
  ...props
}: React.ComponentProps<typeof ProgressPrimitive.Root> & {
  /** Classes for the moving bar, e.g. a different color. */
  indicatorClassName?: string
}) {
  const reduceMotion = useReducedMotion() ?? false
  const indeterminate = value === null || value === undefined
  const percent = indeterminate ? 0 : Math.min(100, Math.max(0, (value / max) * 100))

  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      value={value}
      max={max}
      className={cn("relative h-2 w-full overflow-hidden rounded-full bg-primary/15", className)}
      {...props}
    >
      <ProgressPrimitive.Indicator data-slot="progress-indicator" asChild>
        {indeterminate ? (
          <motion.div
            key="indeterminate"
            className={cn(
              "h-full w-2/5 rounded-full bg-[linear-gradient(90deg,transparent,var(--color-primary),transparent)]",
              indicatorClassName
            )}
            initial={reduceMotion ? { opacity: 0.4 } : { x: "-100%" }}
            animate={reduceMotion ? { opacity: [0.4, 1, 0.4] } : { x: "250%" }}
            transition={{
              duration: reduceMotion ? 1.6 : 1.3,
              ease: "easeInOut",
              repeat: Infinity,
            }}
          />
        ) : (
          <motion.div
            key="determinate"
            className={cn(
              "relative h-full w-full rounded-full",
              "bg-[linear-gradient(90deg,color-mix(in_oklab,var(--color-primary)_55%,transparent),var(--color-primary))]",
              // Bright leading edge.
              "after:absolute after:inset-y-0 after:right-0 after:w-3 after:rounded-full after:bg-white/40 after:blur-[3px]",
              indicatorClassName
            )}
            initial={{ x: "-100%" }}
            animate={{ x: `${percent - 100}%` }}
            transition={fill}
          />
        )}
      </ProgressPrimitive.Indicator>
    </ProgressPrimitive.Root>
  )
}

export { Progress }
