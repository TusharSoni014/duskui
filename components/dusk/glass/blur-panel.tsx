"use client";

import * as React from "react";
import { motion, useScroll, useTransform } from "motion/react";

import { cn } from "@/lib/utils";

const elements = {
  div: motion.div,
  header: motion.header,
  nav: motion.nav,
  aside: motion.aside,
  footer: motion.footer,
  section: motion.section,
};

const intensities = { subtle: 0.35, medium: 0.65, strong: 1 } as const;

const edges = {
  top: "inset-x-0 top-0 h-px bg-linear-to-r",
  bottom: "inset-x-0 bottom-0 h-px bg-linear-to-r",
  left: "inset-y-0 left-0 w-px bg-linear-to-b",
  right: "inset-y-0 right-0 w-px bg-linear-to-b",
} as const;

export interface BlurPanelProps
  extends Omit<
    React.ComponentProps<"div">,
    "onDrag" | "onDragStart" | "onDragEnd" | "onAnimationStart"
  > {
  /** Element to render. Use `header`, `nav` or `aside` to get the right landmark. */
  as?: keyof typeof elements;
  /** How frosted the panel gets: a preset or a number from 0 to 1. */
  intensity?: keyof typeof intensities | number;
  /**
   * Scroll distance in px over which the glass fades in, as `[start, end]`.
   * Pass `false` for a panel that is always frosted (e.g. a sidebar).
   */
  scrollRange?: [number, number] | false;
  /** Scroll container to watch. Defaults to the page. */
  container?: React.RefObject<HTMLElement | null>;
  /** Which side gets the hairline edge as the panel frosts. */
  edge?: keyof typeof edges | "none";
}

/**
 * A panel whose backdrop blur, saturation and tint fade in as the page scrolls.
 * Make it a sticky header, a floating toolbar or a sidebar with `className`
 * (e.g. `sticky top-0`).
 *
 * Scroll is read through motion values and written to CSS variables, so
 * scrolling never re-renders React. Without `backdrop-filter` support the
 * panel fades to a near-opaque fill instead, keeping its content readable.
 */
export function BlurPanel({
  as = "div",
  intensity = "medium",
  scrollRange = [0, 80],
  container,
  edge = "bottom",
  className,
  style,
  children,
  ...props
}: BlurPanelProps) {
  const level = Math.min(
    1,
    Math.max(0, typeof intensity === "number" ? intensity : intensities[intensity])
  );
  const maxBlur = 4 + 20 * level;
  const maxTint = 25 + 50 * level;
  const maxSaturate = 80 * level;

  const { scrollY } = useScroll(container ? { container } : undefined);
  const progress = useTransform(scrollY, (y) => {
    if (!scrollRange) return 1;
    const [start, end] = scrollRange;
    if (end <= start) return y >= start ? 1 : 0;
    return Math.min(1, Math.max(0, (y - start) / (end - start)));
  });

  const blur = useTransform(progress, (p) => `${(p * maxBlur).toFixed(2)}px`);
  const saturate = useTransform(progress, (p) => `${(100 + p * maxSaturate).toFixed(1)}%`);
  const tint = useTransform(progress, (p) => `${(p * maxTint).toFixed(1)}%`);
  const fallbackTint = useTransform(progress, (p) => `${(p * 94).toFixed(1)}%`);
  const shadow = useTransform(progress, (p) => (p * 0.45).toFixed(3));

  const Comp = elements[as];

  return (
    <Comp
      data-slot="blur-panel"
      className={cn(
        "relative isolate text-foreground",
        // Fallback first: no backdrop-filter → fade to a near-opaque fill.
        "bg-[color-mix(in_oklab,var(--background)_var(--panel-fallback),transparent)]",
        "supports-[backdrop-filter]:bg-[color-mix(in_oklab,var(--background)_var(--panel-tint),transparent)]",
        "supports-[backdrop-filter]:backdrop-blur-(--panel-blur) supports-[backdrop-filter]:backdrop-saturate-(--panel-saturate)",
        "shadow-[0_8px_32px_-12px_rgb(0_0_0/var(--panel-shadow))]",
        className
      )}
      style={
        {
          "--panel-blur": blur,
          "--panel-saturate": saturate,
          "--panel-tint": tint,
          "--panel-fallback": fallbackTint,
          "--panel-shadow": shadow,
          ...style,
        } as React.ComponentProps<typeof motion.div>["style"]
      }
      {...props}
    >
      {edge !== "none" && (
        <motion.span
          aria-hidden
          className={cn(
            "pointer-events-none absolute from-transparent via-white/25 to-transparent",
            edges[edge]
          )}
          style={{ opacity: progress }}
        />
      )}
      {children}
    </Comp>
  );
}
