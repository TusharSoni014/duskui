"use client";

import * as React from "react";
import { motion, useReducedMotion } from "motion/react";

import { cn } from "@/lib/utils";

export interface PlasmaLoaderProps extends Omit<React.ComponentProps<"span">, "color" | "children"> {
  /** Width and height in px. */
  size?: number;
  /** Main plasma color, any CSS color. Defaults to the theme primary. */
  color?: string;
  /** Second color mixed into the plasma. Defaults to a hotter, whiter tint of `color`. */
  secondaryColor?: string;
  /** Seconds for the main blob to complete one orbit. */
  speed?: number;
  /** Text announced to screen readers. */
  label?: string;
}

type Blob = {
  /** Blob diameter as a fraction of `size`. */
  scale: number;
  /** Orbit duration multiplier. */
  pace: number;
  /** 1 clockwise, -1 counter-clockwise. */
  dir: 1 | -1;
  /** Starting angle in degrees. */
  phase: number;
  tone: "main" | "second" | "core";
};

// Blobs on different paces and directions keep meeting and merging, which the
// gooey filter turns into a single wobbling plasma ring.
const BLOBS: Blob[] = [
  { scale: 0.27, pace: 1, dir: 1, phase: 0, tone: "main" },
  { scale: 0.21, pace: 1.45, dir: -1, phase: 120, tone: "second" },
  { scale: 0.23, pace: 0.8, dir: 1, phase: 240, tone: "main" },
  { scale: 0.15, pace: 1.2, dir: 1, phase: 60, tone: "core" },
];

const TONES: Record<Blob["tone"], string> = {
  main: "radial-gradient(circle at 35% 35%, color-mix(in oklab, var(--plasma) 55%, white), var(--plasma))",
  second: "radial-gradient(circle at 35% 35%, var(--plasma-2), color-mix(in oklab, var(--plasma-2) 70%, var(--plasma)))",
  core: "radial-gradient(circle, white, color-mix(in oklab, var(--plasma) 60%, white))",
};

/**
 * A loading spinner made of glowing plasma blobs orbiting a ring. An SVG
 * "gooey" filter fuses the blobs as they pass each other.
 *
 * Accessible as a `role="status"` region with a screen-reader label. With
 * reduced motion the blobs stay put and the plasma gently pulses instead.
 */
export function PlasmaLoader({
  size = 48,
  color = "var(--color-primary)",
  secondaryColor,
  speed = 1.6,
  label = "Loading",
  className,
  style,
  ...props
}: PlasmaLoaderProps) {
  const reduceMotion = useReducedMotion();
  const filterId = `plasma-goo-${React.useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const orbit = size * 0.3;
  const duration = Math.max(0.4, speed);

  return (
    <span
      role="status"
      aria-live="polite"
      data-slot="plasma-loader"
      className={cn("relative inline-block shrink-0 align-middle", className)}
      style={
        {
          "--plasma": color,
          "--plasma-2": secondaryColor ?? "color-mix(in oklab, var(--plasma) 50%, white)",
          width: size,
          height: size,
          ...style,
        } as React.CSSProperties
      }
      {...props}
    >
      <span aria-hidden className="pointer-events-none absolute inset-0">
        {/* Faint track so the spinner reads as a ring even between blobs. */}
        <span
          className="absolute rounded-full border"
          style={{
            inset: size / 2 - orbit,
            borderColor: "color-mix(in oklab, var(--plasma) 18%, transparent)",
          }}
        />
        <span
          className="absolute inset-0"
          style={{
            filter: `drop-shadow(0 0 ${Math.max(2, size * 0.08)}px color-mix(in oklab, var(--plasma) 80%, transparent))`,
          }}
        >
          <motion.span
            className="absolute inset-0"
            style={{ filter: `url(#${filterId})` }}
            animate={reduceMotion ? { opacity: [1, 0.55, 1] } : { opacity: 1 }}
            transition={reduceMotion ? { duration: 2, ease: "easeInOut", repeat: Infinity } : { duration: 0 }}
          >
            {BLOBS.map((blob, i) => {
              const d = blob.scale * size;
              return (
                <motion.span
                  key={i}
                  className="absolute inset-0"
                  initial={{ rotate: blob.phase }}
                  animate={reduceMotion ? { rotate: blob.phase } : { rotate: blob.phase + 360 * blob.dir }}
                  transition={{ duration: duration * blob.pace, ease: "linear", repeat: Infinity }}
                >
                  <span
                    className="absolute rounded-full"
                    style={{
                      width: d,
                      height: d,
                      left: size / 2 - d / 2,
                      top: size / 2 - orbit - d / 2,
                      background: TONES[blob.tone],
                    }}
                  />
                </motion.span>
              );
            })}
          </motion.span>
        </span>
      </span>

      <svg aria-hidden focusable="false" className="absolute size-0 overflow-hidden">
        <defs>
          <filter id={filterId} x="-50%" y="-50%" width="200%" height="200%" colorInterpolationFilters="sRGB">
            <feGaussianBlur in="SourceGraphic" stdDeviation={Math.max(1.5, size * 0.07)} result="blur" />
            <feColorMatrix
              in="blur"
              type="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -8"
              result="goo"
            />
            <feBlend in="SourceGraphic" in2="goo" />
          </filter>
        </defs>
      </svg>

      <span className="sr-only">{label}</span>
    </span>
  );
}
