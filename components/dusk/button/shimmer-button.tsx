"use client";

import * as React from "react";
import { motion, useReducedMotion, type Variants } from "motion/react";

import { MotionButton, type MotionButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface ShimmerButtonProps extends MotionButtonProps {
  /** Keep a slow shimmer sweeping while idle, not only on hover. */
  idle?: boolean;
  /** Seconds to wait between idle sweeps. */
  interval?: number;
}

const sheen: Variants = {
  rest: { x: "-110%", transition: { duration: 0 } },
  hover: { x: "110%", transition: { duration: 0.8, ease: [0.4, 0, 0.2, 1] } },
};

/**
 * A thin, faint sheen sweeps across the button on hover (and optionally on a loop).
 * Good for a single primary call-to-action per screen.
 */
export function ShimmerButton({
  className,
  children,
  idle = false,
  interval = 4,
  ...props
}: ShimmerButtonProps) {
  const reduceMotion = useReducedMotion();

  return (
    <MotionButton
      initial="rest"
      animate="rest"
      whileHover="hover"
      className={cn("overflow-hidden", className)}
      {...props}
    >
      {!reduceMotion && (
        <motion.span
          aria-hidden
          className="pointer-events-none absolute inset-0 -skew-x-12 bg-[linear-gradient(90deg,transparent_42%,rgb(255_255_255/0.3)_50%,transparent_58%)] mix-blend-overlay"
          {...(idle
            ? {
                initial: { x: "-110%" },
                animate: { x: ["-110%", "110%"] },
                transition: {
                  duration: 1.2,
                  ease: "easeInOut",
                  repeat: Infinity,
                  repeatDelay: interval,
                },
              }
            : { variants: sheen })}
        />
      )}
      {children}
    </MotionButton>
  );
}
