"use client";

import * as React from "react";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";

import { cn } from "@/lib/utils";

/** Tiny SVG film grain. Breaks up banding in the blur and sells the "frosted" look. */
const NOISE =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

/** A 1px ring: the background is masked down to the padding box edge. */
const RING =
  "p-px [mask-image:linear-gradient(#000_0_0),linear-gradient(#000_0_0)] [mask-clip:content-box,border-box] [mask-composite:exclude]";

const tiltSpring = { stiffness: 220, damping: 22, mass: 0.6 };

export interface GlassCardProps
  extends Omit<
    React.ComponentProps<"div">,
    "onDrag" | "onDragStart" | "onDragEnd" | "onAnimationStart"
  > {
  /** Backdrop blur in px. */
  blur?: number;
  /** Backdrop saturation in percent. Values above 100 make the colors behind the glass richer. */
  saturation?: number;
  /**
   * Glass fill — any translucent CSS color. The default is a smoky tint of the
   * page background, which keeps white text readable over bright backdrops.
   */
  tint?: string;
  /** 3D tilt towards the pointer. `true` = 8°, or pass the max angle in degrees. */
  tilt?: boolean | number;
  /** Subtle film-grain texture on the glass. */
  noise?: boolean;
}

/**
 * A frosted-glass surface: backdrop blur + saturation, a 1px hairline border
 * and a faint film grain.
 *
 * - Optional tilt runs on motion values, so moving the mouse never re-renders.
 * - Without `backdrop-filter` support the card falls back to an almost opaque
 *   fill so text stays readable.
 * - Tilt is skipped for touch input and when the user prefers reduced motion.
 */
export function GlassCard({
  blur = 16,
  saturation = 140,
  tint = "color-mix(in oklab, var(--background) 35%, transparent)",
  tilt = false,
  noise = true,
  className,
  style,
  children,
  onPointerMove,
  onPointerLeave,
  ...props
}: GlassCardProps) {
  const reduceMotion = useReducedMotion();
  const maxTilt = reduceMotion ? 0 : tilt === true ? 8 : tilt || 0;

  // Pointer position, normalised to 0–1 across the card.
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);

  const rotateX = useSpring(useTransform(py, [0, 1], [maxTilt, -maxTilt]), tiltSpring);
  const rotateY = useSpring(useTransform(px, [0, 1], [-maxTilt, maxTilt]), tiltSpring);

  const handleMove = (event: React.PointerEvent<HTMLDivElement>) => {
    onPointerMove?.(event);
    // Tilting under a finger fights with scrolling, so only a mouse or pen tilts.
    if (!maxTilt || event.pointerType === "touch") return;
    const rect = event.currentTarget.getBoundingClientRect();
    px.set((event.clientX - rect.left) / rect.width);
    py.set((event.clientY - rect.top) / rect.height);
  };

  const handleLeave = (event: React.PointerEvent<HTMLDivElement>) => {
    onPointerLeave?.(event);
    px.set(0.5);
    py.set(0.5);
  };

  const layer = "pointer-events-none absolute inset-0 -z-10 rounded-[inherit]";

  return (
    <motion.div
      data-slot="glass-card"
      className={cn(
        "group/glass relative isolate overflow-hidden rounded-xl p-6 text-foreground",
        // Fallback first: nearly opaque so text stays readable without blur.
        "bg-[color-mix(in_oklab,var(--background)_88%,transparent)]",
        "supports-[backdrop-filter]:bg-(color:--glass-tint) supports-[backdrop-filter]:backdrop-blur-(--glass-blur) supports-[backdrop-filter]:backdrop-saturate-(--glass-saturate)",
        "shadow-[inset_0_1px_0_rgb(255_255_255/0.06),0_12px_32px_-16px_rgb(0_0_0/0.5)]",
        className
      )}
      style={
        {
          "--glass-blur": `${blur}px`,
          "--glass-saturate": `${saturation}%`,
          "--glass-tint": tint,
          ...(maxTilt ? { rotateX, rotateY, transformPerspective: 900 } : null),
          ...style,
        } as React.ComponentProps<typeof motion.div>["style"]
      }
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      {...props}
    >
      {noise && (
        <span
          aria-hidden
          className={cn(layer, "opacity-[0.05] mix-blend-overlay")}
          style={{ backgroundImage: NOISE }}
        />
      )}
      {/* 1px hairline border. */}
      <span
        aria-hidden
        className={cn(
          layer,
          RING,
          "bg-white/12 transition-opacity duration-200 group-has-focus-visible/glass:opacity-0"
        )}
      />
      {/* Keyboard users get a visible edge when something inside the card has focus. */}
      <span
        aria-hidden
        className={cn(
          layer,
          RING,
          "bg-ring/70 opacity-0 transition-opacity duration-200 group-has-focus-visible/glass:opacity-100"
        )}
      />
      {children}
    </motion.div>
  );
}
