"use client";

import { motion, useReducedMotion } from "motion/react";

import { cn } from "@/lib/utils";

/**
 * Demo-only scenery for the Glassmorphism demos: two muted color fields plus a
 * few crisp shapes drifting slowly behind the glass. Glass needs something sharp behind
 * it — blur only reads when there are edges to blur.
 */
export function GlassBackdrop({ className }: { className?: string }) {
  const reduceMotion = useReducedMotion();
  const drift = (x: number[], y: number[], duration: number) =>
    reduceMotion
      ? {}
      : {
          animate: { x, y },
          transition: { duration, repeat: Infinity, repeatType: "mirror" as const, ease: "easeInOut" as const },
        };

  return (
    <div aria-hidden className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}>
      <div className="absolute inset-0 bg-[radial-gradient(circle,rgb(255_255_255/0.06)_1px,transparent_1px)] bg-size-[22px_22px]" />
      {/* Muted color fields */}
      <div className="absolute -left-16 -top-20 size-72 rounded-full bg-sky-500/15 blur-3xl" />
      <div className="absolute -bottom-24 -right-10 size-80 rounded-full bg-indigo-500/15 blur-3xl" />
      {/* Crisp shapes — these are what the blur visibly smears. */}
      <motion.div
        className="absolute left-[14%] top-[18%] size-28 rounded-full bg-amber-300/80"
        {...drift([0, 30, -10], [0, 20, 40], 20)}
      />
      <motion.div
        className="absolute bottom-[14%] right-[16%] size-36 rounded-full bg-sky-400/80"
        {...drift([0, -30, 15], [0, -20, -35], 22)}
      />
      <motion.div
        className="absolute right-[34%] top-[8%] h-10 w-40 rotate-[-18deg] rounded-full bg-white/70"
        {...drift([0, 20, -20], [0, 35, 15], 24)}
      />
    </div>
  );
}
