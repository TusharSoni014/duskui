"use client";

import * as React from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "motion/react";

import { cn } from "@/lib/utils";

export interface DotSpotlightProps extends React.ComponentProps<"div"> {
  /** Color of the dots the spotlight lights up. Defaults to a soft white. */
  color?: string;
  /** Color of the resting dots. */
  dotColor?: string;
  /** Distance between dots in px. */
  gap?: number;
  /** Dot radius in px. */
  dotSize?: number;
  /** Radius of the spotlight in px. */
  radius?: number;
  /** Fade the pattern out toward the edges. */
  fade?: boolean;
}

/** Brightness of the spotlight while it rests in the center (touch, reduced motion, cursor away). */
const IDLE = 0.4;
const dots = (color: string, r: number) =>
  `radial-gradient(circle at center, ${color} ${r}px, transparent ${r + 0.75}px)`;

/**
 * A dot-grid background where a small, soft spotlight follows the cursor and
 * brightens only the dots beneath it. No color wash: the light lives in the
 * dots. Fills its nearest positioned parent.
 *
 * The light is a CSS mask driven by spring-smoothed motion values, so moving
 * the cursor never re-renders React. On touch screens, under reduced motion,
 * or when the cursor leaves, the light rests dimly in the center.
 */
export function DotSpotlight({
  color = "rgb(255 255 255 / 0.4)",
  dotColor = "rgb(255 255 255 / 0.1)",
  gap = 20,
  dotSize = 1.25,
  radius = 160,
  fade = true,
  className,
  style,
  ...props
}: DotSpotlightProps) {
  const reduceMotion = useReducedMotion();
  const rootRef = React.useRef<HTMLDivElement>(null);

  // Position in percent of the container, so the server can render the centered resting state.
  const mx = useMotionValue(50);
  const my = useMotionValue(50);
  const lit = useMotionValue(IDLE);
  const sx = useSpring(mx, { stiffness: 220, damping: 30 });
  const sy = useSpring(my, { stiffness: 220, damping: 30 });
  const sLit = useSpring(lit, { stiffness: 160, damping: 26 });
  const mask = useMotionTemplate`radial-gradient(${radius}px circle at ${sx}% ${sy}%, #000, transparent)`;

  React.useEffect(() => {
    const root = rootRef.current;
    if (!root || reduceMotion) return;
    // Only devices with a real hover pointer get a moving light.
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    let inView = true;
    const rest = () => {
      mx.set(50);
      my.set(50);
      lit.set(IDLE);
    };
    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse" || !inView || document.hidden) return;
      const rect = root.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      if (x < 0 || y < 0 || x > rect.width || y > rect.height || !rect.width || !rect.height) {
        rest();
        return;
      }
      mx.set((x / rect.width) * 100);
      my.set((y / rect.height) * 100);
      lit.set(1);
    };
    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      if (!inView) rest();
    });
    observer.observe(root);
    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", rest);
    return () => {
      observer.disconnect();
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", rest);
      rest();
    };
  }, [reduceMotion, mx, my, lit]);

  const tile = `${gap}px ${gap}px`;

  return (
    <div
      ref={rootRef}
      aria-hidden
      data-slot="dot-spotlight"
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden",
        fade && "[mask-image:radial-gradient(ellipse_at_center,#000_45%,transparent_90%)]",
        className
      )}
      style={style}
      {...props}
    >
      <div
        className="absolute inset-0"
        style={{ backgroundImage: dots(dotColor, dotSize), backgroundSize: tile, backgroundPosition: "center" }}
      />
      <motion.div
        className="absolute inset-0"
        style={{
          backgroundImage: dots(color, dotSize),
          backgroundSize: tile,
          backgroundPosition: "center",
          maskImage: mask,
          WebkitMaskImage: mask,
          opacity: sLit,
        }}
      />
    </div>
  );
}
