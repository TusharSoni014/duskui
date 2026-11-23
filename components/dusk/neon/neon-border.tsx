"use client";

import * as React from "react";
import {
  animate,
  motion,
  useInView,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  type AnimationPlaybackControls,
} from "motion/react";

import { cn } from "@/lib/utils";

export interface NeonBorderProps extends Omit<React.ComponentProps<"div">, "color"> {
  /** Any CSS color for the travelling light. Defaults to the theme primary. */
  color?: string;
  /** Optional second color the light fades into, for a two-tone beam. */
  secondaryColor?: string;
  /** Seconds for one lap around the border. */
  speed?: number;
  /** Border width in px. */
  thickness?: number;
  /** Corner radius: a number in px or any CSS length. */
  radius?: number | string;
  /** Soft glow around the beam, from 0 (off) to 1. */
  glow?: number;
  /** `always` runs continuously; `hover` lights up only on hover or keyboard focus inside. */
  trigger?: "always" | "hover";
  /** Classes for the inner content wrapper. */
  contentClassName?: string;
}

/** Masks a layer down to its padding box, leaving only a ring the width of its padding. */
const RING =
  "pointer-events-none absolute inset-0 rounded-[inherit] [mask-image:linear-gradient(#000_0_0),linear-gradient(#000_0_0)] [mask-clip:content-box,border-box] [mask-composite:exclude]";

/**
 * Wraps any content in a neon border with a beam of light travelling around it.
 *
 * The beam is a conic gradient whose angle is a Motion value, masked to the
 * border ring, so it works at any aspect ratio without measuring. It pauses
 * when off-screen. Reduced-motion users get a steady, fully lit border.
 */
export function NeonBorder({
  color = "var(--color-primary)",
  secondaryColor,
  speed = 6,
  thickness = 1,
  radius = 12,
  glow = 0.5,
  trigger = "always",
  className,
  contentClassName,
  style,
  children,
  onPointerEnter,
  onPointerLeave,
  onFocus,
  onBlur,
  ...props
}: NeonBorderProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const controls = React.useRef<AnimationPlaybackControls | null>(null);
  const hovered = React.useRef(false);
  const reduceMotion = useReducedMotion();
  const inView = useInView(ref);

  const angle = useMotionValue(0);
  const tail = secondaryColor ?? "var(--neon)";
  const beam = useMotionTemplate`conic-gradient(from ${angle}deg, transparent 0%, transparent 60%, color-mix(in oklab, ${tail} 45%, transparent) 80%, var(--neon) 95%, transparent 100%)`;

  const start = React.useCallback(() => {
    if (controls.current || reduceMotion) return;
    controls.current = animate(angle, angle.get() + 360, {
      duration: Math.max(0.5, speed),
      ease: "linear",
      repeat: Infinity,
    });
  }, [angle, reduceMotion, speed]);

  const stop = React.useCallback(() => {
    controls.current?.stop();
    controls.current = null;
  }, []);

  React.useEffect(() => {
    if (inView && (trigger === "always" || hovered.current)) start();
    else stop();
    return stop;
  }, [inView, trigger, start, stop]);

  const activate = () => {
    hovered.current = true;
    if (trigger === "hover" && inView) start();
  };
  const deactivate = () => {
    hovered.current = false;
    if (trigger === "hover") stop();
  };

  const r = typeof radius === "number" ? `${radius}px` : radius;
  const vars = { "--neon": color, borderRadius: r } as React.CSSProperties;

  // Reduced motion: no travelling beam, just a steady lit border.
  const lit = reduceMotion ? "var(--neon)" : beam;
  const beamVisibility =
    trigger === "hover"
      ? "opacity-0 transition-opacity duration-300 group-hover/neon-border:opacity-100 group-focus-within/neon-border:opacity-100 motion-reduce:transition-none"
      : undefined;

  return (
    <div
      ref={ref}
      data-slot="neon-border"
      className={cn("group/neon-border relative isolate", className)}
      style={{ ...vars, ...style }}
      onPointerEnter={(e) => {
        onPointerEnter?.(e);
        activate();
      }}
      onPointerLeave={(e) => {
        onPointerLeave?.(e);
        deactivate();
      }}
      onFocus={(e) => {
        onFocus?.(e);
        activate();
      }}
      onBlur={(e) => {
        onBlur?.(e);
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) deactivate();
      }}
      {...props}
    >
      {/* Dim resting tube so the shape reads even where the beam isn't. */}
      <span
        aria-hidden
        className={RING}
        style={{
          padding: thickness,
          background: "color-mix(in oklab, var(--neon) 15%, transparent)",
        }}
      />
      {glow > 0 && (
        // Blur is applied to the wrapper, after the inner ring is masked.
        <span
          aria-hidden
          className={cn("pointer-events-none absolute inset-0 rounded-[inherit]", beamVisibility)}
          style={{ filter: "blur(6px)" }}
        >
          <motion.span
            className={RING}
            style={{ padding: thickness * 2, background: lit, opacity: Math.min(0.5, 0.4 * glow) }}
          />
        </span>
      )}
      <motion.span
        aria-hidden
        className={cn(RING, beamVisibility)}
        style={{ padding: thickness, background: lit }}
      />
      <div
        data-slot="neon-border-content"
        className={cn("relative", contentClassName)}
        style={{ margin: thickness, borderRadius: `max(0px, calc(${r} - ${thickness}px))` }}
      >
        {children}
      </div>
    </div>
  );
}
