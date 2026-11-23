"use client";

import * as React from "react";
import { animate, useMotionValue, useMotionValueEvent, useReducedMotion } from "motion/react";

import { cn } from "@/lib/utils";

type GlowTextTag = "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span" | "div" | "strong";

export interface GlowTextProps extends Omit<React.HTMLAttributes<HTMLElement>, "color"> {
  /** Element to render. Use a heading level for titles so the text stays in the document outline. */
  as?: GlowTextTag;
  /** Any CSS color. Defaults to the theme primary. */
  color?: string;
  /** Glow strength multiplier. 1 is the default, 0 removes the glow. */
  intensity?: number;
  /**
   * `breathe`: the glow slowly swells and fades.
   * `flicker`: steady glow with an occasional double flicker, like an old neon sign.
   * `none`: static glow. Reduced-motion users always get `none`.
   */
  animation?: "none" | "breathe" | "flicker";
  /** Seconds per animation cycle. Flicker cycles are clamped to at least 2s. */
  speed?: number;
}

/*
 * Flicker cycle: steady most of the time, then two short dips close together.
 * With the cycle clamped to >= 2s this is at most 2 flashes per second, under
 * the WCAG 2.3.1 limit of 3. Only the glow dims; the letters stay readable.
 */
const FLICKER = {
  values: [1, 1, 0.3, 1, 1, 0.45, 1, 1],
  times: [0, 0.62, 0.66, 0.7, 0.78, 0.82, 0.86, 1],
};

/**
 * Real, selectable text with a layered neon glow. The glow is a `text-shadow`
 * driven by a CSS variable that Motion animates outside React, so the text
 * never re-renders and search engines and screen readers see plain text.
 */
export function GlowText({
  as: Tag = "span",
  color = "var(--color-primary)",
  intensity = 1,
  animation = "breathe",
  speed,
  className,
  style,
  children,
  ...props
}: GlowTextProps) {
  const ref = React.useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const mode = reduceMotion ? "none" : animation;
  const glow = useMotionValue(1);

  useMotionValueEvent(glow, "change", (value) => {
    ref.current?.style.setProperty("--glow", value.toFixed(3));
  });

  React.useEffect(() => {
    if (mode === "none") {
      glow.set(1);
      return;
    }
    const controls =
      mode === "breathe"
        ? animate(glow, [1, 0.55, 1], {
            duration: Math.max(1, speed ?? 3.2),
            ease: "easeInOut",
            repeat: Infinity,
          })
        : animate(glow, FLICKER.values, {
            duration: Math.max(2, speed ?? 4),
            times: FLICKER.times,
            ease: "linear",
            repeat: Infinity,
          });
    return () => controls.stop();
  }, [mode, speed, glow]);

  const i = Math.max(0, intensity);
  const layer = (blur: number, alpha: number) =>
    `0 0 calc(${blur * i}px * var(--glow)) color-mix(in oklab, var(--glow-color) ${alpha}%, transparent)`;

  const vars = {
    "--glow": 1,
    "--glow-color": color,
    color: "color-mix(in oklab, var(--glow-color) 45%, white)",
    textShadow:
      i === 0
        ? undefined
        : [layer(2, 90), layer(6, 80), layer(14, 65), layer(28, 45), layer(56, 30)].join(", "),
  } as React.CSSProperties;

  // Cast keeps JSX happy with a union of intrinsic tags; every option accepts the same props.
  const Comp = Tag as "span";

  return (
    <Comp
      ref={ref as React.Ref<HTMLSpanElement>}
      data-slot="glow-text"
      className={cn("[text-wrap:balance]", className)}
      style={{ ...vars, ...style }}
      {...props}
    >
      {children}
    </Comp>
  );
}
