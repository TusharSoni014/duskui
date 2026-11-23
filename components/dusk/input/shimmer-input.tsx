"use client";

import * as React from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export interface ShimmerInputProps extends React.ComponentProps<"input"> {
  /** Run the light around the border, e.g. while an AI response streams in. */
  loading?: boolean;
  /** Classes for the outer border wrapper. */
  wrapperClassName?: string;
}

/**
 * An input whose border lights up with a travelling beam while `loading`.
 * The beam is a rotating conic gradient clipped to a 1px frame.
 */
export function ShimmerInput({
  loading = false,
  className,
  wrapperClassName,
  ...props
}: ShimmerInputProps) {
  const reduceMotion = useReducedMotion();

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden rounded-[calc(var(--radius)-1px)] bg-input p-px transition-shadow duration-200",
        "has-[input:focus-visible]:ring-[3px] has-[input:focus-visible]:ring-ring/30",
        wrapperClassName
      )}
    >
      <AnimatePresence>
        {loading && (
          <motion.span
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-1/2 aspect-square w-[max(200%,24rem)] -translate-x-1/2 -translate-y-1/2 bg-[conic-gradient(from_0deg,transparent_0%,transparent_65%,var(--color-primary)_85%,white_90%,transparent_100%)]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, rotate: reduceMotion ? 0 : 360 }}
            exit={{ opacity: 0 }}
            transition={{
              opacity: { duration: 0.3 },
              rotate: { duration: 2.2, ease: "linear", repeat: Infinity },
            }}
          />
        )}
      </AnimatePresence>
      <Input
        aria-busy={loading || undefined}
        className={cn(
          "relative border-0 bg-card shadow-none hover:bg-card focus-visible:ring-0 dark:bg-card dark:hover:bg-card",
          className
        )}
        {...props}
      />
    </div>
  );
}
