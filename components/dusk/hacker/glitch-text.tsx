"use client";

import * as React from "react";
import { useInView, usePageInView, useReducedMotion } from "motion/react";

import { cn } from "@/lib/utils";

type GlitchTag = "span" | "p" | "div" | "strong" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

export interface GlitchTextProps extends Omit<React.HTMLAttributes<HTMLElement>, "children"> {
  /** The text to glitch. Keep it to text (and inline formatting); it's rendered three times. */
  children: React.ReactNode;
  /** Element to render. Use a heading tag for titles. */
  as?: GlitchTag;
  /**
   * What starts a glitch burst:
   * - `"hover"`: on pointer enter / focus inside
   * - `"loop"`: every `interval` ms while on screen
   * - `"inView"`: once, when it first scrolls into view
   */
  trigger?: "hover" | "loop" | "inView";
  /** Milliseconds between bursts in `"loop"` mode (minimum 1000). */
  interval?: number;
  /** Length of one burst, in ms. */
  duration?: number;
  /** Maximum horizontal offset of the color layers, in px. */
  intensity?: number;
  /** Colors of the two split layers (any CSS color). */
  colors?: [string, string];
  /** Stop all glitching. */
  disabled?: boolean;
}

/** Never start bursts closer together than this — keeps it far below 3 flashes per second. */
const MIN_GAP = 1000;

const rand = (min: number, max: number) => min + Math.random() * (max - min);

/** A random horizontal slice, e.g. `inset(32% 0 51% 0)`. */
function randomSlice() {
  const top = rand(0, 85);
  const height = rand(6, 30);
  return `inset(${top.toFixed(1)}% 0 ${Math.max(0, 100 - top - height).toFixed(1)}% 0)`;
}

/**
 * Text with a digital glitch: two RGB-split copies jump around in clipped
 * horizontal slices for a short burst, on hover, on a loop or once in view.
 *
 * The real text stays a normal, selectable element; the colored copies are
 * `aria-hidden`. Bursts are throttled to at most one per second, pause while
 * off-screen or in a hidden tab, and are skipped entirely under reduced motion.
 */
export function GlitchText({
  children,
  as = "span",
  trigger = "hover",
  interval = 3200,
  duration = 450,
  intensity = 4,
  colors = ["#ff2bd6", "#00e5ff"],
  disabled = false,
  className,
  onPointerEnter,
  onFocus,
  ...props
}: GlitchTextProps) {
  const Comp = as as React.ElementType;
  const rootRef = React.useRef<HTMLElement>(null);
  const layerA = React.useRef<HTMLSpanElement>(null);
  const layerB = React.useRef<HTMLSpanElement>(null);
  const timer = React.useRef<ReturnType<typeof setTimeout>>(undefined);
  const nextAllowed = React.useRef(0);

  const reduceMotion = useReducedMotion();
  const pageVisible = usePageInView();
  const inView = useInView(rootRef, { amount: 0.5, once: trigger === "inView" });

  const glitch = React.useCallback(() => {
    if (disabled || reduceMotion) return;
    const now = performance.now();
    if (now < nextAllowed.current) return;
    nextAllowed.current = now + Math.max(duration, MIN_GAP);

    const layers = [layerA.current, layerB.current];
    const frames = Math.max(3, Math.round(duration / 75));
    let frame = 0;

    const step = () => {
      layers.forEach((el, i) => {
        if (!el) return;
        if (frame >= frames) {
          el.style.opacity = "0";
          el.style.clipPath = "";
          el.style.transform = "";
          return;
        }
        const dir = i === 0 ? -1 : 1;
        el.style.opacity = "1";
        el.style.clipPath = randomSlice();
        el.style.transform = `translate3d(${(dir * rand(0.3, 1) * intensity).toFixed(1)}px, ${rand(-0.6, 0.6).toFixed(1)}px, 0)`;
      });
      frame += 1;
      if (frame <= frames) timer.current = setTimeout(step, duration / frames);
    };
    clearTimeout(timer.current);
    step();
  }, [disabled, reduceMotion, duration, intensity]);

  // Loop mode: only while visible on screen and in a visible tab.
  React.useEffect(() => {
    if (trigger !== "loop" || !inView || !pageVisible) return;
    const id = setInterval(glitch, Math.max(MIN_GAP, interval));
    return () => clearInterval(id);
  }, [trigger, inView, pageVisible, interval, glitch]);

  // In-view mode: a single burst the first time it's seen.
  React.useEffect(() => {
    if (trigger === "inView" && inView) glitch();
  }, [trigger, inView, glitch]);

  React.useEffect(() => () => clearTimeout(timer.current), []);

  const layerClass =
    "pointer-events-none absolute inset-0 select-none opacity-0 [padding:inherit] will-change-[clip-path,transform]";

  return (
    <Comp
      ref={rootRef}
      data-slot="glitch-text"
      className={cn("relative", as === "span" && "inline-block", className)}
      onPointerEnter={(e: React.PointerEvent<HTMLElement>) => {
        if (trigger === "hover") glitch();
        onPointerEnter?.(e);
      }}
      onFocus={(e: React.FocusEvent<HTMLElement>) => {
        if (trigger === "hover") glitch();
        onFocus?.(e);
      }}
      {...props}
    >
      {children}
      <span ref={layerA} aria-hidden className={layerClass} style={{ color: colors[0] }}>
        {children}
      </span>
      <span ref={layerB} aria-hidden className={layerClass} style={{ color: colors[1] }}>
        {children}
      </span>
    </Comp>
  );
}
