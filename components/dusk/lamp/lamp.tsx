"use client";

import * as React from "react";
import { motion, useReducedMotion, type Variants } from "motion/react";

import { cn } from "@/lib/utils";

export interface LampProps extends React.ComponentProps<"div"> {
  /** Color of the light. Any CSS color; defaults to a cool neutral. */
  color?: string;
  /** Distance in px from the top of the section to the lamp bar. Content starts below it. */
  offset?: number;
  /** How wide each half of the light cone opens, in degrees from straight down (20–80). */
  spread?: number;
  /** Play the reveal only the first time the lamp scrolls into view. */
  once?: boolean;
}

const mix = (color: string, amount: number) => `color-mix(in oklab, ${color} ${amount}%, transparent)`;
const EASE = [0.22, 1, 0.36, 1] as const;
/** How far above the bar the cones' apex sits, in px. */
const APEX = 24;

/**
 * An overhead lamp: a thin bar whose two soft conic light cones widen into place when the section scrolls into view, lighting the content below.
 *
 * Cones are conic gradients scaled on the compositor, so the reveal never
 * touches layout. The light layer is decorative (`aria-hidden`, no pointer
 * events) and the children render as normal content in front of it. Under
 * reduced motion the light fades in without widening.
 */
export function Lamp({
  color = "#cbd5e1",
  offset = 112,
  spread = 58,
  once = true,
  className,
  style,
  children,
  ...props
}: LampProps) {
  const reduceMotion = useReducedMotion();
  const angle = Math.min(Math.max(spread, 20), 80);
  const top = Math.max(0, offset);

  const cone = (delay: number): Variants => ({
    off: { opacity: 0, scaleX: reduceMotion ? 1 : 0.3 },
    on: { opacity: 1, scaleX: 1, transition: { duration: 0.9, ease: EASE, delay } },
  });
  const bar: Variants = {
    off: { opacity: 0.4, scaleX: reduceMotion ? 1 : 0.35 },
    on: { opacity: 1, scaleX: 1, transition: { duration: 1.1, ease: EASE, delay: 0.15 } },
  };
  const haze: Variants = {
    off: { opacity: 0, scaleX: reduceMotion ? 1 : 0.5 },
    on: { opacity: 1, scaleX: 1, transition: { duration: 1.4, ease: EASE, delay: 0.25 } },
  };

  // Both cones fan out symmetrically from a point just above the bar. Their
  // gradients are continuous across the center line: a hard color stop there
  // renders as a visible seam in some browsers.
  const outerCone = `conic-gradient(from ${180 - angle}deg at 50% 0%, transparent 0deg, ${mix(color, 14)} ${angle * 0.06}deg, ${mix(color, 7)} ${angle * 0.45}deg, ${mix(color, 10)} ${angle}deg, ${mix(color, 7)} ${angle * 1.55}deg, ${mix(color, 14)} ${angle * 1.94}deg, transparent ${angle * 2}deg, transparent 360deg)`;
  const inner = angle * 0.4;
  const innerCone = `conic-gradient(from ${180 - inner}deg at 50% 0%, transparent 0deg, ${mix(color, 10)} ${inner}deg, transparent ${inner * 2}deg, transparent 360deg)`;
  // The apex sits APEX px above the bar, so the beam already has some width where it leaves the bar.
  const coneMask = `linear-gradient(to bottom, transparent ${APEX}px, #000 ${APEX}px, transparent calc(${APEX}px + 22rem))`;
  const coneStyle = {
    top: top - APEX,
    height: `calc(${APEX}px + 26rem)`,
    transformOrigin: "50% 0%",
    maskImage: coneMask,
    WebkitMaskImage: coneMask,
  };

  return (
    <div
      data-slot="lamp"
      className={cn(
        "relative isolate flex w-full flex-col items-center overflow-hidden bg-background pt-[calc(var(--lamp-offset)+3.5rem)]",
        className
      )}
      style={{ "--lamp-offset": `${top}px`, ...style } as React.CSSProperties}
      {...props}
    >
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        initial="off"
        whileInView="on"
        viewport={{ once, amount: 0.35 }}
      >
        <motion.div
          variants={cone(0.15)}
          className="absolute inset-x-0"
          style={{ ...coneStyle, backgroundImage: outerCone }}
        />
        <motion.div
          variants={cone(0.3)}
          className="absolute inset-x-0"
          style={{ ...coneStyle, backgroundImage: innerCone }}
        />

        {/* Faint haze pooling under the bar. */}
        <motion.div
          variants={haze}
          className="absolute inset-x-0 mx-auto h-32 w-[min(36rem,80%)] rounded-full blur-3xl"
          style={{ top: top - 40, background: mix(color, 10) }}
        />

        {/* The housing above the bar stays dark so the light reads as pointing down. */}
        <div
          className="absolute inset-x-0 top-0"
          style={{ height: top, background: "linear-gradient(to bottom, var(--color-background) 35%, transparent)" }}
        />

        <motion.div
          variants={bar}
          className="absolute inset-x-0 mx-auto h-px w-[min(30rem,70%)] rounded-full"
          style={{
            top: top - 1,
            background: `linear-gradient(to right, transparent, ${mix(color, 80)} 15%, ${mix(color, 80)} 85%, transparent)`,
          }}
        />
      </motion.div>

      {children}
    </div>
  );
}
