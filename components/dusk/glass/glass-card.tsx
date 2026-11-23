"use client";

import * as React from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";

import { cn } from "@/lib/utils";

/** Tiny SVG film grain. Breaks up banding in the blur and sells the "frosted" look. */
const NOISE =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

/** A 1px ring: the background is masked down to the padding box edge. */
const RING =
  "p-px [mask-composite:exclude] [mask:linear-gradient(#000_0_0)_content-box,linear-gradient(#000_0_0)]";

const tiltSpring = { stiffness: 220, damping: 22, mass: 0.6 };

export interface GlassCardProps
  extends Omit<
    React.ComponentProps<"div">,
    "onDrag" | "onDragStart" | "onDragEnd" | "onAnimationStart"
  > {
  /** Backdrop blur in px. */
  blur?: number;
  /** Backdrop saturation in percent. Values above 100 make the colors behind the glass glow. */
  saturation?: number;
  /**
   * Glass fill — any translucent CSS color. The default is a smoky tint of the
   * page background, which keeps white text readable over bright backdrops.
   */
  tint?: string;
  /** A specular light that follows the pointer across the surface and border. */
  highlight?: boolean;
  /** 3D tilt towards the pointer. `true` = 8°, or pass the max angle in degrees. */
  tilt?: boolean | number;
  /** Subtle film-grain texture on the glass. */
  noise?: boolean;
}

/**
 * A frosted-glass surface: backdrop blur + saturation, a gradient hairline
 * border, film grain and a specular highlight that tracks the pointer.
 *
 * - Pointer effects run on motion values, so moving the mouse never re-renders.
 * - Without `backdrop-filter` support the card falls back to an almost opaque
 *   fill so text stays readable.
 * - Tilt is skipped for touch input and when the user prefers reduced motion.
 */
export function GlassCard({
  blur = 16,
  saturation = 160,
  tint = "color-mix(in oklab, var(--background) 35%, transparent)",
  highlight = true,
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
  const glow = useSpring(0, { stiffness: 180, damping: 28 });

  const rotateX = useSpring(useTransform(py, [0, 1], [maxTilt, -maxTilt]), tiltSpring);
  const rotateY = useSpring(useTransform(px, [0, 1], [-maxTilt, maxTilt]), tiltSpring);

  const gx = useTransform(px, (v) => v * 100);
  const gy = useTransform(py, (v) => v * 100);
  const surface = useMotionTemplate`radial-gradient(28rem circle at ${gx}% ${gy}%, rgb(255 255 255 / 0.13), transparent 55%)`;
  const edge = useMotionTemplate`radial-gradient(16rem circle at ${gx}% ${gy}%, rgb(255 255 255 / 0.7), transparent 60%)`;

  const handleMove = (event: React.PointerEvent<HTMLDivElement>) => {
    onPointerMove?.(event);
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    if (event.pointerType === "touch") {
      // Touch: light only. Tilting under a finger fights with scrolling.
      px.jump(x);
      py.jump(y);
    } else {
      px.set(x);
      py.set(y);
    }
    glow.set(1);
  };

  const handleLeave = (event: React.PointerEvent<HTMLDivElement>) => {
    onPointerLeave?.(event);
    px.set(0.5);
    py.set(0.5);
    glow.set(0);
  };

  const layer = "pointer-events-none absolute inset-0 -z-10 rounded-[inherit]";

  return (
    <motion.div
      data-slot="glass-card"
      className={cn(
        "group/glass relative isolate overflow-hidden rounded-2xl p-6 text-foreground",
        // Fallback first: nearly opaque so text stays readable without blur.
        "bg-[color-mix(in_oklab,var(--background)_88%,transparent)]",
        "supports-[backdrop-filter]:bg-(color:--glass-tint) supports-[backdrop-filter]:backdrop-blur-(--glass-blur) supports-[backdrop-filter]:backdrop-saturate-(--glass-saturate)",
        "shadow-[inset_0_1px_0_rgb(255_255_255/0.14),0_24px_60px_-24px_rgb(0_0_0/0.7)]",
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
          className={cn(layer, "opacity-[0.07] mix-blend-overlay")}
          style={{ backgroundImage: NOISE }}
        />
      )}
      {/* Static hairline border: brighter at the top-left, like light catching an edge. */}
      <span
        aria-hidden
        className={cn(
          layer,
          RING,
          "bg-[linear-gradient(135deg,rgb(255_255_255/0.4),rgb(255_255_255/0.08)_35%,rgb(255_255_255/0.04)_65%,rgb(255_255_255/0.2))]",
          "transition-opacity duration-300 group-has-focus-visible/glass:opacity-0"
        )}
      />
      {/* Keyboard users get a visible edge when something inside the card has focus. */}
      <span
        aria-hidden
        className={cn(
          layer,
          RING,
          "bg-primary/70 opacity-0 transition-opacity duration-300 group-has-focus-visible/glass:opacity-100"
        )}
      />
      {highlight && (
        <>
          <motion.span
            aria-hidden
            className={layer}
            style={{ backgroundImage: surface, opacity: glow }}
          />
          <motion.span
            aria-hidden
            className={cn(layer, RING)}
            style={{ backgroundImage: edge, opacity: glow }}
          />
        </>
      )}
      {children}
    </motion.div>
  );
}
