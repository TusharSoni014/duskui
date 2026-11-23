"use client";

import * as React from "react";
import { animate, useReducedMotion, type AnimationPlaybackControls } from "motion/react";

import { cn } from "@/lib/utils";

type ShinyTextTag = "span" | "p" | "div" | "strong" | "em" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

export interface ShinyTextProps extends Omit<React.HTMLAttributes<HTMLElement>, "color"> {
  /** Element to render. Use a heading level for titles. */
  as?: ShinyTextTag;
  /** Base text color (any CSS color). */
  color?: string;
  /** Color of the light band. */
  shineColor?: string;
  /** Seconds for one sweep across the text. */
  duration?: number;
  /** Seconds between sweeps. */
  repeatDelay?: number;
  /** Width of the light band as a fraction of the text width (0.1–1). */
  spread?: number;
  /** Angle of the band in degrees. */
  angle?: number;
  /** Sweep direction. */
  direction?: "ltr" | "rtl";
  /** `"loop"` sweeps continuously; `"hover"` sweeps once each time the pointer enters. */
  trigger?: "loop" | "hover";
}

// The gradient is 3x the text width; these are the positions where the band sits just outside each edge.
const OFF_LEFT = "100% 0";
const OFF_RIGHT = "0% 0";

/**
 * Text with a band of light sweeping across it: a gradient clipped to the
 * glyphs (`background-clip: text`) whose position Motion animates outside React.
 *
 * It's one real text element, so headings stay selectable, translatable and
 * indexable. The server renders the plain base color; the shine is purely
 * decorative and is switched off under reduced motion.
 */
export function ShinyText({
  as = "span",
  color = "color-mix(in oklab, var(--color-foreground) 55%, transparent)",
  shineColor = "var(--color-foreground)",
  duration = 1.8,
  repeatDelay = 2.5,
  spread = 0.35,
  angle = 110,
  direction = "ltr",
  trigger = "loop",
  className,
  style,
  children,
  onPointerEnter,
  ...props
}: ShinyTextProps) {
  const Comp = as as React.ElementType;
  const ref = React.useRef<HTMLElement>(null);
  const sweeping = React.useRef<AnimationPlaybackControls | null>(null);
  const reduceMotion = useReducedMotion();

  const band = (Math.min(1, Math.max(0.1, spread)) * (100 / 3)) / 2;
  const background = `linear-gradient(${angle}deg, ${color} calc(50% - ${band}%), ${shineColor} 50%, ${color} calc(50% + ${band}%))`;
  const [start, end] = direction === "ltr" ? [OFF_LEFT, OFF_RIGHT] : [OFF_RIGHT, OFF_LEFT];

  const sweep = React.useCallback(
    (repeat: boolean) => {
      const el = ref.current;
      if (!el) return null;
      return animate(
        el,
        { backgroundPosition: [start, end] },
        {
          duration,
          ease: [0.45, 0, 0.25, 1],
          ...(repeat ? { repeat: Infinity, repeatDelay } : null),
        }
      );
    },
    [start, end, duration, repeatDelay]
  );

  React.useEffect(() => {
    const el = ref.current;
    if (!el || reduceMotion || trigger !== "loop") return;
    const controls = sweep(true);
    return () => {
      controls?.stop();
      el.style.backgroundPosition = start;
    };
  }, [reduceMotion, trigger, sweep, start]);

  React.useEffect(() => () => sweeping.current?.stop(), []);

  const onEnter = (event: React.PointerEvent<HTMLElement>) => {
    onPointerEnter?.(event);
    if (reduceMotion || trigger !== "hover" || sweeping.current) return;
    const controls = sweep(false);
    sweeping.current = controls;
    controls?.finished.then(() => {
      sweeping.current = null;
    });
  };

  return (
    <Comp
      ref={ref}
      data-slot="shiny-text"
      onPointerEnter={onEnter}
      className={cn(
        "bg-clip-text text-transparent [-webkit-background-clip:text] [background-image:var(--shiny-gradient)] [background-repeat:no-repeat] [background-size:300%_100%]",
        // Keep selected text legible: the glyph fill is transparent otherwise.
        "selection:text-foreground",
        // Forced-colors modes drop backgrounds; fall back to the system text color.
        "forced-colors:[background-image:none] forced-colors:text-[CanvasText]",
        className
      )}
      style={
        {
          "--shiny-gradient": background,
          backgroundPosition: start,
          ...style,
        } as React.CSSProperties
      }
      {...props}
    >
      {children}
    </Comp>
  );
}
