"use client";

import * as React from "react";
import { motion, useReducedMotion } from "motion/react";

import { Badge, type BadgeProps } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const tones = {
  primary: "bg-primary",
  success: "bg-emerald-400",
  warning: "bg-amber-400",
  danger: "bg-red-500",
  info: "bg-sky-400",
  muted: "bg-muted-foreground",
} as const;

export type PulseTone = keyof typeof tones;

export interface PulseDotProps extends React.ComponentProps<"span"> {
  /** Dot color. */
  tone?: PulseTone;
  /** Emit the expanding ring. Turn off for idle states like "offline". */
  pulse?: boolean;
  /** Seconds per pulse. Lower = more urgent. */
  speed?: number;
}

/**
 * A status dot with a faint ring that expands and fades, like a live indicator.
 * Decorative (aria-hidden) — always pair it with text. The ring stops under
 * reduced motion and the solid dot stays.
 */
export function PulseDot({ tone = "success", pulse = true, speed = 2, className, ...props }: PulseDotProps) {
  const reduceMotion = useReducedMotion();
  return (
    <span
      aria-hidden
      data-slot="pulse-dot"
      className={cn("relative inline-flex size-2 shrink-0", className)}
      {...props}
    >
      {pulse && !reduceMotion && (
        <motion.span
          className={cn("absolute inset-0 rounded-full", tones[tone])}
          initial={{ scale: 1, opacity: 0.35 }}
          animate={{ scale: 2, opacity: 0 }}
          transition={{ duration: speed, ease: "easeOut", repeat: Infinity }}
        />
      )}
      <span className={cn("relative inline-flex size-full rounded-full", tones[tone])} />
    </span>
  );
}

export interface PulseBadgeProps extends Omit<BadgeProps, "dot" | "asChild"> {
  tone?: PulseTone;
  pulse?: boolean;
  speed?: number;
}

/**
 * A Badge with a pulsing status dot — "Live", "Online", "Deploying"… Uses the
 * outline variant by default so the colored dot carries the status.
 */
export function PulseBadge({
  tone = "success",
  pulse = true,
  speed,
  variant = "outline",
  className,
  children,
  ...props
}: PulseBadgeProps) {
  return (
    <Badge variant={variant} className={cn("gap-2 overflow-visible", className)} {...props}>
      <PulseDot tone={tone} pulse={pulse} speed={speed} className="size-1.5" />
      {children}
    </Badge>
  );
}
