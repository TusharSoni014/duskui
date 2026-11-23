import * as React from "react";

import { cn } from "@/lib/utils";

export interface SkeletonProps extends React.ComponentProps<"div"> {
  /**
   * `shimmer` (default) sweeps a soft light across the block, `pulse` fades it
   * like shadcn, `none` is static. All become static under reduced motion.
   */
  animation?: "shimmer" | "pulse" | "none";
}

/**
 * DuskUI Skeleton — a drop-in upgrade of the shadcn/ui Skeleton.
 *
 * Same API as shadcn (size and shape it with classes) plus:
 * - A shimmer sweep instead of a pulse, tuned for dark surfaces.
 * - `animation`: "shimmer" | "pulse" | "none".
 * - Under `prefers-reduced-motion` it is static: no sweep and no pulse.
 * CSS only (tw-animate-css keyframes), so it works in Server Components and
 * renders identically on the server and client.
 */
function Skeleton({ className, animation = "shimmer", children, ...props }: SkeletonProps) {
  return (
    <div
      data-slot="skeleton"
      data-animation={animation}
      className={cn(
        "relative isolate overflow-hidden rounded-md bg-accent/60",
        animation === "pulse" && "animate-pulse motion-reduce:animate-none",
        className
      )}
      {...props}
    >
      {animation === "shimmer" && (
        // Starts one width to the left of the block and travels one width past
        // its right edge, so every sweep fully enters and leaves.
        <span
          aria-hidden
          data-slot="skeleton-shimmer"
          className={cn(
            "pointer-events-none absolute inset-y-0 left-full -z-10 w-full",
            "bg-linear-to-r from-transparent via-white/[0.07] to-transparent",
            "animate-in slide-in-from-left-[200%] repeat-infinite animation-duration-[1.8s] ease-in-out",
            "motion-reduce:hidden"
          )}
        />
      )}
      {children}
    </div>
  );
}

export { Skeleton };
