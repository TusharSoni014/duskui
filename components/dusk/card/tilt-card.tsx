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

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const MotionCard = motion.create(Card);
type MotionCardProps = Omit<React.ComponentProps<typeof MotionCard>, "children" | "asChild"> & {
  children?: React.ReactNode;
};

export interface TiltCardProps extends MotionCardProps {
  /** Maximum rotation in degrees at the card's edges. */
  maxTilt?: number;
  /** Scale while hovered. 1 to disable. */
  hoverScale?: number;
  /** Show a light reflection that follows the cursor. */
  glare?: boolean;
  /** CSS perspective in px. Lower = more dramatic. */
  perspective?: number;
  /** Classes for the outer wrapper that receives the pointer events. */
  containerClassName?: string;
}

const spring = { stiffness: 260, damping: 24, mass: 0.6 };

/**
 * A card that tilts in 3D toward the cursor and springs back on leave, with a
 * glare highlight sliding across the surface. Elements inside the Card parts
 * (CardHeader, CardContent…) can pop out with `[transform:translateZ(40px)]`;
 * add `transform-3d` to any extra wrapper in between. Reacts to a mouse only
 * (never touch), and stays flat when the user prefers reduced motion.
 */
export function TiltCard({
  maxTilt = 10,
  hoverScale = 1.02,
  glare = true,
  perspective = 900,
  className,
  containerClassName,
  style,
  children,
  ...props
}: TiltCardProps) {
  const reduceMotion = useReducedMotion();
  // Pointer position in the card, 0–1 on each axis. 0.5 = center.
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const hover = useMotionValue(0);

  const rotateX = useSpring(useTransform(py, [0, 1], [maxTilt, -maxTilt]), spring);
  const rotateY = useSpring(useTransform(px, [0, 1], [-maxTilt, maxTilt]), spring);
  const scale = useSpring(useTransform(hover, [0, 1], [1, hoverScale]), spring);
  const glareOpacity = useSpring(hover, { stiffness: 200, damping: 30 });
  const glareX = useTransform(px, (v) => `${v * 100}%`);
  const glareY = useTransform(py, (v) => `${v * 100}%`);
  const glareBackground = useMotionTemplate`radial-gradient(farthest-corner circle at ${glareX} ${glareY}, rgb(255 255 255 / 0.14), transparent 55%)`;

  const handleMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (reduceMotion || event.pointerType !== "mouse") return;
    const rect = event.currentTarget.getBoundingClientRect();
    px.set((event.clientX - rect.left) / rect.width);
    py.set((event.clientY - rect.top) / rect.height);
    hover.set(1);
  };

  const handleLeave = () => {
    px.set(0.5);
    py.set(0.5);
    hover.set(0);
  };

  return (
    // The wrapper never moves, so its rect is stable while the card rotates.
    <div
      className={cn("group/tilt", containerClassName)}
      style={{ perspective }}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
    >
      <MotionCard
        className={cn(
          // isolation-auto: `isolate` would flatten the 3D scene. Card parts
          // (header, content, footer) keep it 3D so their children can use translateZ.
          "isolation-auto transform-3d will-change-transform [&>[data-slot]]:transform-3d",
          className
        )}
        style={{ ...style, rotateX, rotateY, scale }}
        {...props}
      >
        {children}
        {glare && (
          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-[inherit]"
            style={{ background: glareBackground, opacity: glareOpacity }}
          />
        )}
      </MotionCard>
    </div>
  );
}
