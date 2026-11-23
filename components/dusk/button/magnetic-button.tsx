"use client";

import * as React from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";

import { MotionButton, type MotionButtonProps } from "@/components/ui/button";

export interface MagneticButtonProps extends MotionButtonProps {
  /** How strongly the button follows the cursor (0–1). */
  strength?: number;
}

const spring = { stiffness: 220, damping: 24, mass: 0.5 };

/**
 * The button is pulled slightly toward the cursor and eases back on leave.
 * The label moves a touch further than the surface for a parallax feel.
 * Only reacts to a mouse, never to touch, and is static with reduced motion.
 */
export function MagneticButton({
  strength = 0.15,
  children,
  onPointerMove,
  onPointerLeave,
  ...props
}: MagneticButtonProps) {
  const reduceMotion = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, spring);
  const springY = useSpring(y, spring);
  const labelX = useTransform(springX, (v) => v * 0.3);
  const labelY = useTransform(springY, (v) => v * 0.3);

  const handleMove = (event: React.PointerEvent<HTMLButtonElement>) => {
    onPointerMove?.(event);
    if (reduceMotion || event.pointerType !== "mouse") return;
    const rect = event.currentTarget.getBoundingClientRect();
    x.set((event.clientX - (rect.left + rect.width / 2)) * strength);
    y.set((event.clientY - (rect.top + rect.height / 2)) * strength);
  };

  const handleLeave = (event: React.PointerEvent<HTMLButtonElement>) => {
    onPointerLeave?.(event);
    x.set(0);
    y.set(0);
  };

  return (
    <MotionButton
      style={{ x: springX, y: springY }}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      {...props}
    >
      <motion.span
        className="inline-flex items-center [gap:inherit]"
        style={{ x: labelX, y: labelY }}
      >
        {children}
      </motion.span>
    </MotionButton>
  );
}
