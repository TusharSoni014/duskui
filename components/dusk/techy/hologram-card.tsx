"use client";

import * as React from "react";
import {
  motion,
  useInView,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type HTMLMotionProps,
} from "motion/react";

import { cn } from "@/lib/utils";

export interface HologramCardProps extends Omit<HTMLMotionProps<"div">, "children"> {
  children?: React.ReactNode;
  /** Maximum tilt in degrees. 0 disables the tilt. */
  maxTilt?: number;
  /** Show the light glare that follows the pointer. */
  glare?: boolean;
  /** Show CRT scanlines and the sweeping scan beam. */
  scanlines?: boolean;
  /** Accent color for the scan beam and the rim glow. Any CSS color. */
  color?: string;
}

const spring = { stiffness: 180, damping: 20, mass: 0.6 };
const foil =
  "linear-gradient(115deg, #ff6ad5 0%, #8b5cf6 18%, #5ef2ff 34%, #7dffb3 50%, #fff27a 66%, #ff9a6a 82%, #ff6ad5 100%)";
const rim =
  "#ff6ad5, #8b5cf6, #5ef2ff, #7dffb3, #fff27a, #ff9a6a, #ff6ad5";

/**
 * A card with a holographic foil: an iridescent gradient that shifts as it
 * tilts toward the pointer, a rainbow rim, scanlines and a moving glare.
 *
 * Pointer tracking uses motion values and springs, so it never re-renders.
 * It reacts to a mouse only (touch scrolls normally) and is fully static
 * with reduced motion.
 */
export function HologramCard({
  children,
  maxTilt = 10,
  glare = true,
  scanlines = true,
  color = "var(--color-primary)",
  className,
  style,
  onPointerMove,
  onPointerLeave,
  ...props
}: HologramCardProps) {
  const reduceMotion = useReducedMotion();
  const ref = React.useRef<HTMLDivElement>(null);
  const inView = useInView(ref);

  // Pointer position over the card, 0–1 on both axes; 0.5 is the center.
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const hover = useMotionValue(0);
  const sx = useSpring(px, spring);
  const sy = useSpring(py, spring);
  const sHover = useSpring(hover, { stiffness: 160, damping: 26 });

  const rotateX = useTransform(sy, [0, 1], [maxTilt, -maxTilt]);
  const rotateY = useTransform(sx, [0, 1], [-maxTilt, maxTilt]);
  const foilX = useTransform(sx, (v) => 15 + v * 70);
  const foilY = useTransform(sy, (v) => 15 + v * 70);
  const foilPosition = useMotionTemplate`0 0, ${foilX}% ${foilY}%`;
  const foilOpacity = useTransform(sHover, [0, 1], [0.14, 0.32]);
  const rimAngle = useTransform(sx, (v) => v * 240 + 60);
  const rimBackground = useMotionTemplate`conic-gradient(from ${rimAngle}deg, ${rim})`;
  const rimOpacity = useTransform(sHover, [0, 1], [0.35, 0.9]);
  const glareX = useTransform(sx, (v) => v * 100);
  const glareY = useTransform(sy, (v) => v * 100);
  const glareBackground = useMotionTemplate`radial-gradient(circle at ${glareX}% ${glareY}%, rgb(255 255 255 / 0.2), transparent 55%)`;

  const handleMove = (event: React.PointerEvent<HTMLDivElement>) => {
    onPointerMove?.(event);
    if (reduceMotion || event.pointerType !== "mouse") return;
    const el = event.currentTarget;
    const rect = el.getBoundingClientRect();
    // Measure against the untransformed size around the (stable) center so the tilt can't feed back.
    const x = (event.clientX - (rect.left + rect.width / 2)) / el.offsetWidth + 0.5;
    const y = (event.clientY - (rect.top + rect.height / 2)) / el.offsetHeight + 0.5;
    px.set(Math.min(Math.max(x, 0), 1));
    py.set(Math.min(Math.max(y, 0), 1));
    hover.set(1);
  };

  const handleLeave = (event: React.PointerEvent<HTMLDivElement>) => {
    onPointerLeave?.(event);
    px.set(0.5);
    py.set(0.5);
    hover.set(0);
  };

  const layer = "pointer-events-none absolute inset-0 rounded-[inherit]";
  const still = reduceMotion || maxTilt === 0;

  return (
    <motion.div
      ref={ref}
      className={cn(
        "relative isolate rounded-2xl border border-white/10 bg-card p-6 text-card-foreground shadow-2xl shadow-black/40",
        className
      )}
      style={{
        transformPerspective: 900,
        rotateX: still ? 0 : rotateX,
        rotateY: still ? 0 : rotateY,
        ...style,
      }}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      {...props}
    >
      {/* Iridescent foil with fine diagonal etching. */}
      <motion.div
        aria-hidden
        className={cn(layer, "-z-10 mix-blend-screen")}
        style={{
          backgroundImage: `repeating-linear-gradient(115deg, transparent 0 6px, rgb(255 255 255 / 0.05) 6px 7px), ${foil}`,
          backgroundSize: "100% 100%, 300% 300%",
          backgroundPosition: reduceMotion ? "0 0, 50% 50%" : foilPosition,
          opacity: reduceMotion ? 0.18 : foilOpacity,
        }}
      />

      {/* Rainbow rim: the conic gradient is masked down to a 1px ring. */}
      <motion.div
        aria-hidden
        className={cn(
          layer,
          "-m-px p-px [mask-composite:exclude] [mask:linear-gradient(#000_0_0)_content-box,linear-gradient(#000_0_0)]"
        )}
        style={{
          background: rimBackground,
          opacity: reduceMotion ? 0.5 : rimOpacity,
        }}
      />

      {scanlines && (
        <div
          aria-hidden
          className={cn(layer, "-z-10 overflow-hidden")}
          style={{
            backgroundImage:
              "repeating-linear-gradient(to bottom, rgb(255 255 255 / 0.045) 0 1px, transparent 1px 3px)",
          }}
        >
          {!reduceMotion && inView && (
            <motion.div
              className="absolute inset-x-0 top-0 h-1/3"
              style={{
                background: `linear-gradient(to bottom, transparent, color-mix(in oklab, ${color} 14%, transparent) 85%, color-mix(in oklab, ${color} 45%, transparent))`,
              }}
              initial={{ y: "-100%" }}
              animate={{ y: "300%" }}
              transition={{ duration: 3.2, ease: "linear", repeat: Infinity, repeatDelay: 1.6 }}
            />
          )}
        </div>
      )}

      {glare && !reduceMotion && (
        <motion.div
          aria-hidden
          className={cn(layer, "z-10 mix-blend-overlay")}
          style={{ background: glareBackground, opacity: sHover }}
        />
      )}

      {children}
    </motion.div>
  );
}
