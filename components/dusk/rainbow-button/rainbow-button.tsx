"use client";

import * as React from "react";
import {
  animate,
  useInView,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
} from "motion/react";

import { MotionButton, type MotionButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface RainbowButtonProps extends Omit<MotionButtonProps, "variant" | "asChild"> {
  /** `default` has a dark fill; `outline` is see-through. */
  variant?: "default" | "outline";
  /** Gradient colors, in order. The loop is seamless, so the last color blends back into the first. */
  colors?: string[];
  /** Seconds for the gradient to scroll one full cycle. */
  duration?: number;
  /** Border width in px. */
  borderWidth?: number;
}

const RAINBOW = ["#fb7185", "#fbbf24", "#a3e635", "#38bdf8", "#a78bfa"];

/*
 * The border is the button's own ::before, not a child, so it stays put while
 * the base Button crossfades its label to a spinner. It reads the gradient
 * and its scroll position from CSS variables.
 */
/** Button with a slowly scrolling rainbow gradient border. */
export function RainbowButton({
  variant = "default",
  colors = RAINBOW,
  duration = 6,
  borderWidth = 1,
  className,
  style,
  children,
  ...props
}: RainbowButtonProps) {
  const sentinel = React.useRef<HTMLSpanElement>(null);
  const reduceMotion = useReducedMotion();
  const inView = useInView(sentinel);
  const x = useMotionValue(0);
  const position = useMotionTemplate`${x}%`;

  React.useEffect(() => {
    if (reduceMotion || !inView) return;
    // The gradient repeats twice across a 200%-wide image, so 0% → 100% is one seamless cycle.
    const controls = animate(x, [x.get() % 100, (x.get() % 100) + 100], {
      duration: Math.max(0.5, duration),
      ease: "linear",
      repeat: Infinity,
    });
    return () => controls.stop();
  }, [duration, inView, reduceMotion, x]);

  const palette = colors.length ? colors : RAINBOW;
  const loop = [...palette, ...palette, palette[0]].join(", ");
  const vars = {
    "--rb-gradient": `linear-gradient(90deg, ${loop})`,
    "--rb-x": position,
    "--rb-w": `${borderWidth}px`,
  } as unknown as MotionButtonProps["style"];

  return (
    <MotionButton
      variant="default"
      data-rainbow-variant={variant}
      className={cn(
        "group/rainbow isolate bg-transparent text-white shadow-none",
        // Border layer (::before).
        "before:pointer-events-none before:absolute before:inset-0 before:-z-10 before:rounded-[inherit]",
        variant === "default"
          ? [
              // Fill and border in one layer: a dark padding-box over the gradient border-box.
              "[--rb-fill:oklch(0.13_0.02_260)] hover:bg-transparent hover:[--rb-fill:oklch(0.18_0.02_260)]",
              "before:border-(length:--rb-w) before:border-transparent",
              "before:[background:linear-gradient(var(--rb-fill),var(--rb-fill))_padding-box,var(--rb-gradient)_var(--rb-x)_0/200%_100%_repeat-x_border-box]",
            ]
          : [
              // Gradient masked down to a ring, so the fill stays see-through.
              "hover:bg-white/[0.04]",
              "before:p-(--rb-w) before:[background:var(--rb-gradient)_var(--rb-x)_0/200%_100%_repeat-x]",
              "before:[mask-image:linear-gradient(#000_0_0),linear-gradient(#000_0_0)] before:[mask-clip:content-box,border-box] before:[mask-composite:exclude]",
            ],
        className
      )}
      style={{ ...vars, ...style } as MotionButtonProps["style"]}
      {...props}
    >
      {/* Off-screen detection only: the gradient pauses when the button isn't visible. */}
      <span ref={sentinel} aria-hidden className="pointer-events-none absolute inset-0" />
      {children}
    </MotionButton>
  );
}
