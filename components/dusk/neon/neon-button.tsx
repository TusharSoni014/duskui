"use client";

import * as React from "react";
import { motion, useReducedMotion, type TargetAndTransition } from "motion/react";

import { MotionButton, type MotionButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface NeonButtonProps
  extends Omit<MotionButtonProps, "color" | "variant" | "asChild"> {
  /** Any CSS color. Defaults to the theme primary. */
  color?: string;
  /** Glow strength multiplier. 0 turns the glow off, 1 is the default. */
  intensity?: number;
  /** Flicker on like a neon tube the first time the button scrolls into view. Skipped for reduced motion. */
  flicker?: boolean;
  /** Filled tube (dark text on the neon color) instead of the outlined default. */
  solid?: boolean;
}

/*
 * Ignition keyframes for the glow layer. Two soft dips spread over 1.4s:
 * at most 2 flashes in any one-second window, well under the 3-per-second
 * photosensitivity limit, and the label itself never blinks.
 */
const IGNITE: TargetAndTransition = {
  opacity: [0, 1, 0.35, 1, 0.6, 1],
  transition: { duration: 1.4, times: [0, 0.15, 0.3, 0.55, 0.75, 1], ease: "easeOut" },
};

/**
 * A button with a soft neon-tube glow. The single glow layer brightens a
 * little on hover and keyboard focus, and can optionally flicker on when it
 * first appears.
 *
 * Built on the DuskUI `MotionButton`, so `loading`, `loadingText`, `size` and
 * every Motion prop keep working. Glow layers are absolutely positioned and
 * `aria-hidden`, so they never change the button's size.
 */
export function NeonButton({
  color = "var(--color-primary)",
  intensity = 1,
  flicker = false,
  solid = false,
  className,
  style,
  children,
  ...props
}: NeonButtonProps) {
  const reduceMotion = useReducedMotion();
  const ignite = flicker && !reduceMotion;
  const i = Math.max(0, intensity);

  const vars = {
    "--neon": color,
    "--neon-fg": solid
      ? "oklch(0.16 0.02 260)"
      : "color-mix(in oklab, var(--neon) 72%, white)",
    "--neon-bg": solid ? "var(--neon)" : "color-mix(in oklab, var(--neon) 6%, transparent)",
    "--neon-bg-hover": solid
      ? "color-mix(in oklab, var(--neon) 90%, white)"
      : "color-mix(in oklab, var(--neon) 12%, transparent)",
    "--neon-ring": "color-mix(in oklab, var(--neon) 45%, transparent)",
  } as React.CSSProperties;

  return (
    <MotionButton
      variant="default"
      className={cn(
        "group/neon isolate border border-(--neon) bg-(--neon-bg) text-(--neon-fg) shadow-none",
        "hover:bg-(--neon-bg-hover) focus-visible:border-(--neon) focus-visible:ring-(--neon-ring)",
        className
      )}
      style={{ ...vars, ...style } as MotionButtonProps["style"]}
      {...props}
    >
      {i > 0 && (
        <motion.span
          aria-hidden
          data-slot="neon-glow"
          className="pointer-events-none absolute inset-0 -z-10 rounded-[inherit]"
          initial={ignite ? { opacity: 0 } : false}
          whileInView={ignite ? IGNITE : undefined}
          viewport={{ once: true }}
        >
          {/* One soft glow layer; hover and focus only raise its opacity. */}
          <span
            className="absolute inset-0 rounded-[inherit] opacity-60 transition-opacity duration-200 group-hover/neon:opacity-100 group-focus-visible/neon:opacity-100 motion-reduce:transition-none"
            style={{
              boxShadow: `0 0 ${12 * i}px color-mix(in oklab, var(--neon) 30%, transparent)`,
            }}
          />
        </motion.span>
      )}
      {children}
    </MotionButton>
  );
}
