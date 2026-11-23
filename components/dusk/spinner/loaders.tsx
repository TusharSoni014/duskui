"use client";

import * as React from "react";
import { motion, useReducedMotion, type Transition } from "motion/react";

import { cn } from "@/lib/utils";

export interface LoaderProps extends Omit<React.ComponentProps<"span">, "children"> {
  /** Width and height in pixels. */
  size?: number;
  /** Text announced to screen readers. */
  label?: string;
  /** Seconds per loop. Lower is faster. */
  speed?: number;
}

// Every animated element sets an explicit `initial` that doesn't depend on
// reduced motion, so the server HTML and the first client render always match.

/**
 * Shared wrapper: an accessible `role="status"` box with a screen-reader-only
 * label and the loader drawn in `currentColor` (color it with `text-*`).
 */
function LoaderRoot({
  size,
  label = "Loading",
  className,
  style,
  children,
  slot,
  ...props
}: Omit<LoaderProps, "speed"> & { slot: string; children: React.ReactNode }) {
  return (
    <span
      role="status"
      data-slot={slot}
      className={cn("relative inline-flex shrink-0 items-center justify-center text-primary", className)}
      style={{ width: size, height: size, ...style }}
      {...props}
    >
      <span aria-hidden className="relative block size-full">
        {children}
      </span>
      <span className="sr-only">{label}</span>
    </span>
  );
}

/** Reduced-motion fallback for every loader: elements fade in turn instead of moving. */
function fade(index: number, count: number, speed: number): Transition {
  return { duration: speed, repeat: Infinity, ease: "easeInOut", delay: (index / count) * speed };
}

/** Three dots that hop one after another, like a typing indicator. */
export function DotsLoader({ size = 32, speed = 1.1, ...props }: LoaderProps) {
  const reduceMotion = useReducedMotion() ?? false;
  return (
    <LoaderRoot slot="dots-loader" size={size} {...props}>
      <span className="absolute inset-0 flex items-center justify-between px-[6%]">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="block aspect-square w-[22%] rounded-full bg-current shadow-[0_0_8px_-1px_currentColor]"
            initial={{ y: "0%", opacity: 0.5 }}
            animate={reduceMotion ? { opacity: [0.3, 1, 0.3] } : { y: ["0%", "-80%", "0%"], opacity: [0.5, 1, 0.5] }}
            transition={
              reduceMotion
                ? fade(i, 3, speed)
                : { duration: speed * 0.6, repeat: Infinity, repeatDelay: speed * 0.4, ease: "easeInOut", delay: i * speed * 0.15 }
            }
          />
        ))}
      </span>
    </LoaderRoot>
  );
}

/** Equalizer bars that rise and fall in a wave. */
export function BarsLoader({ size = 32, speed = 1, bars = 5, ...props }: LoaderProps & { bars?: number }) {
  const reduceMotion = useReducedMotion() ?? false;
  return (
    <LoaderRoot slot="bars-loader" size={size} {...props}>
      <span className="absolute inset-0 flex items-center justify-between gap-[8%] py-[10%]">
        {Array.from({ length: bars }, (_, i) => (
          <motion.span
            key={i}
            className="block h-full flex-1 origin-center rounded-full bg-current"
            initial={{ scaleY: 0.6, opacity: 1 }}
            animate={reduceMotion ? { opacity: [0.3, 1, 0.3] } : { scaleY: [0.35, 1, 0.35] }}
            transition={
              reduceMotion
                ? fade(i, bars, speed)
                : { duration: speed, repeat: Infinity, ease: "easeInOut", delay: (i / bars) * speed * 0.6 }
            }
          />
        ))}
      </span>
    </LoaderRoot>
  );
}

/** A ring whose arc fades out along a conic gradient, with a glowing head. */
export function RingLoader({ size = 32, speed = 0.9, thickness = 3, ...props }: LoaderProps & { thickness?: number }) {
  const reduceMotion = useReducedMotion() ?? false;
  const mask = `radial-gradient(farthest-side, transparent calc(100% - ${thickness}px), #000 calc(100% - ${thickness}px + 0.5px))`;
  return (
    <LoaderRoot slot="ring-loader" size={size} {...props}>
      {/* Track */}
      <span
        className="absolute inset-0 rounded-full bg-current opacity-15"
        style={{ mask, WebkitMask: mask }}
      />
      <motion.span
        className="absolute inset-0 rounded-full"
        initial={{ rotate: 0, opacity: 1 }}
        animate={reduceMotion ? { opacity: [0.4, 1, 0.4] } : { rotate: 360 }}
        transition={
          reduceMotion
            ? { duration: speed * 2, repeat: Infinity, ease: "easeInOut" }
            : { duration: speed, repeat: Infinity, ease: "linear" }
        }
      >
        <span
          className="absolute inset-0 rounded-full bg-[conic-gradient(from_0deg,transparent_0deg,currentColor_300deg,transparent_301deg)]"
          style={{ mask, WebkitMask: mask }}
        />
        {/* Glowing head at the end of the arc (300deg), half the ring thickness from the edge. */}
        <span
          className="absolute top-1/2 left-1/2 rounded-full bg-current shadow-[0_0_8px_1px_currentColor]"
          style={{
            width: thickness,
            height: thickness,
            transform: `translate(-50%, -50%) rotate(300deg) translateY(calc(-${size / 2}px + ${thickness / 2}px))`,
          }}
        />
      </motion.span>
    </LoaderRoot>
  );
}

/** Two dots orbiting a glowing core at different distances and speeds. */
export function OrbitLoader({ size = 32, speed = 1.4, ...props }: LoaderProps) {
  const reduceMotion = useReducedMotion() ?? false;
  const orbits = [
    { inset: "0%", duration: speed, dot: "18%" },
    { inset: "22%", duration: speed * 0.6, dot: "20%", reverse: true },
  ];
  return (
    <LoaderRoot slot="orbit-loader" size={size} {...props}>
      <motion.span
        className="absolute top-1/2 left-1/2 block size-[22%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-current shadow-[0_0_10px_currentColor]"
        initial={{ opacity: 0.6 }}
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ duration: speed, repeat: Infinity, ease: "easeInOut" }}
      />
      {orbits.map((orbit, i) => (
        <motion.span
          key={i}
          className="absolute rounded-full border border-current/15"
          style={{ inset: orbit.inset }}
          initial={{ rotate: 0, opacity: 1 }}
          animate={reduceMotion ? { opacity: [0.35, 1, 0.35] } : { rotate: orbit.reverse ? -360 : 360 }}
          transition={
            reduceMotion
              ? fade(i, orbits.length, speed)
              : { duration: orbit.duration, repeat: Infinity, ease: "linear" }
          }
        >
          <span
            className="absolute top-0 left-1/2 block aspect-square -translate-x-1/2 -translate-y-1/2 rounded-full bg-current shadow-[0_0_6px_currentColor]"
            style={{ width: orbit.dot }}
          />
        </motion.span>
      ))}
    </LoaderRoot>
  );
}

/** A core with rings that ripple outward and fade, like a radar ping. */
export function PulseLoader({ size = 32, speed = 1.6, rings = 2, ...props }: LoaderProps & { rings?: number }) {
  const reduceMotion = useReducedMotion() ?? false;
  return (
    <LoaderRoot slot="pulse-loader" size={size} {...props}>
      {Array.from({ length: rings }, (_, i) => (
        <motion.span
          key={i}
          className="absolute inset-0 rounded-full border-2 border-current"
          initial={{ scale: 0.3, opacity: 0 }}
          animate={reduceMotion ? { scale: 0.8, opacity: [0, 0.5, 0] } : { scale: [0.3, 1], opacity: [0.9, 0] }}
          transition={{
            duration: speed,
            repeat: Infinity,
            ease: "easeOut",
            delay: (i / rings) * speed,
            ...(reduceMotion && { scale: { duration: 0 } }),
          }}
        />
      ))}
      <motion.span
        className="absolute inset-[34%] rounded-full bg-current shadow-[0_0_12px_currentColor]"
        initial={{ scale: 0.85, opacity: 0.6 }}
        animate={reduceMotion ? { opacity: [0.6, 1, 0.6] } : { scale: [0.85, 1, 0.85] }}
        transition={{ duration: speed / 2, repeat: Infinity, ease: "easeInOut" }}
      />
    </LoaderRoot>
  );
}
