"use client";

import { motion, useReducedMotion } from "motion/react";

import { cn } from "@/lib/utils";

/**
 * Demo-only scenery for the Glassmorphism demos: soft color glows plus a few
 * crisp shapes drifting behind the glass. Glass needs something sharp behind
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
      <div className="absolute inset-0 bg-[radial-gradient(circle,rgb(255_255_255/0.08)_1px,transparent_1px)] bg-size-[22px_22px]" />
      {/* Soft glows */}
      <motion.div
        className="absolute -left-16 -top-20 size-72 rounded-full bg-primary/45 blur-3xl"
        {...drift([0, 60, -20], [0, 40, 10], 14)}
      />
      <motion.div
        className="absolute -bottom-24 -right-10 size-80 rounded-full bg-fuchsia-500/40 blur-3xl"
        {...drift([0, -50, 10], [0, -30, 20], 16)}
      />
      {/* Crisp shapes — these are what the blur visibly smears. */}
      <motion.div
        className="absolute left-[14%] top-[18%] size-28 rounded-full bg-linear-to-br from-amber-300 to-rose-500 shadow-[0_0_60px_rgb(244_63_94/0.45)]"
        {...drift([0, 40, -10], [0, 30, 50], 11)}
      />
      <motion.div
        className="absolute bottom-[14%] right-[16%] size-36 rounded-full bg-linear-to-tr from-sky-400 to-violet-500 shadow-[0_0_70px_rgb(139_92_246/0.45)]"
        {...drift([0, -40, 15], [0, -25, -45], 13)}
      />
      <motion.div
        className="absolute right-[34%] top-[8%] h-10 w-40 rotate-[-18deg] rounded-full bg-linear-to-r from-primary to-emerald-300"
        {...drift([0, 30, -30], [0, 50, 20], 17)}
      />
    </div>
  );
}
