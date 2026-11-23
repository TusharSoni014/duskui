"use client";

import * as React from "react";
import { animate, useInView, usePageInView, useReducedMotion, type AnimationPlaybackControls } from "motion/react";

import { cn } from "@/lib/utils";

type AuroraTextTag = "span" | "p" | "div" | "strong" | "em" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

export interface AuroraTextProps extends Omit<React.HTMLAttributes<HTMLElement>, "color"> {
  /** Element to render. Use a heading level for titles. */
  as?: AuroraTextTag;
  /** Aurora colors (any CSS color), at least two. Each becomes a soft drifting blob. */
  colors?: string[];
  /** Speed multiplier. 1 is one slow loop every 14 seconds; 2 is twice as fast. */
  speed?: number;
}

const DEFAULT_COLORS = ["var(--color-primary)", "#38bdf8", "#818cf8"];

/** Where each blob sits on the oversized canvas (percent). Cycled for long palettes. */
const BLOBS: [number, number][] = [
  [18, 30],
  [72, 22],
  [40, 78],
  [86, 70],
  [55, 45],
  [10, 85],
];

/** A slow loop around the canvas, so the blobs drift past the glyphs from every side. */
const PATH = ["0% 50%", "45% 0%", "100% 35%", "70% 100%", "20% 80%", "0% 50%"];

function auroraGradient(colors: string[]) {
  const palette = colors.length >= 2 ? colors : DEFAULT_COLORS;
  const blobs = palette.map((c, i) => {
    const [x, y] = BLOBS[i % BLOBS.length];
    return `radial-gradient(circle at ${x}% ${y}%, ${c} 0%, transparent 42%)`;
  });
  return [...blobs, `linear-gradient(115deg, ${[...palette, palette[0]].join(", ")})`].join(", ");
}

/**
 * Text filled with a slowly moving aurora: soft blobs of color drift through
 * the letters. It's a gradient clipped to the glyphs (`background-clip: text`)
 * whose position Motion animates outside React, so the heading stays one
 * real, selectable, indexable text element.
 *
 * The server renders the same gradient, standing still. The drift pauses
 * off-screen and in hidden tabs, and holds still under reduced motion.
 */
export function AuroraText({
  as = "span",
  colors = DEFAULT_COLORS,
  speed = 1,
  className,
  style,
  children,
  ...props
}: AuroraTextProps) {
  const Comp = as as React.ElementType;
  const rootRef = React.useRef<HTMLElement>(null);
  const controls = React.useRef<AnimationPlaybackControls[]>([]);
  const reduceMotion = useReducedMotion();
  const pageVisible = usePageInView();
  const inView = useInView(rootRef);

  const colorKey = colors.join("|");
  const gradient = React.useMemo(() => auroraGradient(colorKey.split("|")), [colorKey]);
  const duration = 14 / Math.max(0.05, speed);

  React.useEffect(() => {
    const root = rootRef.current;
    if (!root || reduceMotion) return;
    controls.current = [animate(root, { backgroundPosition: PATH }, { duration, ease: "easeInOut", repeat: Infinity })];
    return () => {
      controls.current.forEach((c) => c.stop());
      controls.current = [];
      root.style.backgroundPosition = PATH[0];
    };
  }, [duration, reduceMotion]);

  // Pause instead of stopping, so it resumes from the same spot.
  React.useEffect(() => {
    controls.current.forEach((c) => (inView && pageVisible ? c.play() : c.pause()));
  }, [inView, pageVisible, duration, reduceMotion]);

  const layer = cn(
    "bg-clip-text text-transparent [-webkit-background-clip:text] [background-image:var(--aurora-gradient)] [background-size:250%_250%]",
    // Forced-colors modes drop backgrounds; fall back to the system text color.
    "forced-colors:[background-image:none] forced-colors:text-[CanvasText]"
  );
  const vars = { "--aurora-gradient": gradient, backgroundPosition: PATH[0] } as React.CSSProperties;

  return (
    <Comp
      ref={rootRef}
      data-slot="aurora-text"
      // Keep selected text legible: the glyph fill is transparent otherwise.
      className={cn(layer, "selection:text-foreground", className)}
      style={{ ...vars, ...style }}
      {...props}
    >
      {children}
    </Comp>
  );
}
