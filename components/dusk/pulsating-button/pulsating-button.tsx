"use client";

import * as React from "react";
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "motion/react";

import { Button, type ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface PulsatingButtonProps extends Omit<ButtonProps, "asChild"> {
  /** Any CSS color for the rings. Defaults to the theme primary. */
  pulseColor?: string;
  /** Seconds for one ring to expand and fade. A second ring follows half a beat later. */
  duration?: number;
  /** How far the rings travel outwards, in px. */
  spread?: number;
}

/** Button that sends out soft expanding rings to draw attention, pausing on hover and focus. */
export function PulsatingButton({
  pulseColor = "var(--color-primary)",
  duration = 2.4,
  spread = 8,
  className,
  style,
  children,
  onPointerEnter,
  onPointerLeave,
  onFocus,
  onBlur,
  ...props
}: PulsatingButtonProps) {
  const rings = React.useRef<HTMLSpanElement>(null);
  const reduceMotion = useReducedMotion();
  const inView = useInView(rings);
  const [hovered, setHovered] = React.useState(false);
  const [focused, setFocused] = React.useState(false);

  // `progress` drives both rings; `level` fades them out when paused.
  const progress = useMotionValue(0);
  const level = useMotionValue(1);
  const boxShadow = useTransform(() => {
    const t = progress.get();
    const l = level.get();
    return [t % 1, (t + 0.5) % 1]
      .map((p) => {
        // Ease out so rings leave quickly, then drift and fade.
        const eased = 1 - (1 - p) ** 2;
        const alpha = Math.round((1 - p) * 28 * l);
        return `0 0 0 ${(eased * spread).toFixed(2)}px color-mix(in oklab, var(--pulse) ${alpha}%, transparent)`;
      })
      .join(", ");
  });

  const paused = hovered || focused || !inView || reduceMotion === true;

  React.useEffect(() => {
    if (paused) {
      const fade = animate(level, 0, { duration: 0.25, ease: "easeOut" });
      return () => fade.stop();
    }
    level.set(1);
    const controls = animate(progress, progress.get() + 1, {
      duration: Math.max(0.6, duration),
      ease: "linear",
      repeat: Infinity,
    });
    return () => controls.stop();
  }, [duration, level, paused, progress]);

  return (
    <Button
      className={cn("group/pulse", className)}
      style={{ "--pulse": pulseColor, ...style } as React.CSSProperties}
      onPointerEnter={(e) => {
        onPointerEnter?.(e);
        setHovered(true);
      }}
      onPointerLeave={(e) => {
        onPointerLeave?.(e);
        setHovered(false);
      }}
      onFocus={(e) => {
        onFocus?.(e);
        setFocused(true);
      }}
      onBlur={(e) => {
        onBlur?.(e);
        setFocused(false);
      }}
      {...props}
    >
      {/* Rings are an outer box-shadow on an empty layer, so they never take up space. */}
      <motion.span
        ref={rings}
        aria-hidden
        data-slot="pulse-rings"
        className="pointer-events-none absolute inset-0 rounded-[inherit]"
        style={{ boxShadow }}
      />
      {/* Reduced motion: a steady thin ring instead of moving rings (CSS-only, so SSR markup matches). */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 hidden rounded-[inherit] shadow-[0_0_0_3px_color-mix(in_oklab,var(--pulse)_18%,transparent)] motion-reduce:block"
      />
      {children}
    </Button>
  );
}
