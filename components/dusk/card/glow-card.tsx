"use client";

import * as React from "react";
import { motion, useMotionTemplate, useMotionValue } from "motion/react";

import { Card, type CardProps } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface GlowCardProps extends Omit<CardProps, "asChild"> {
  /** Radius of the highlight in px. */
  radius?: number;
  /** Any CSS color. Mixed in at low opacity; defaults to white. */
  color?: string;
}

/**
 * A card whose 1px border catches a faint highlight where the cursor is, with
 * a barely visible tint on the surface. The highlight follows the pointer
 * through motion values, so moving the mouse never re-renders React. It also
 * shows while a child has keyboard focus, so the effect isn't mouse-only.
 */
export function GlowCard({
  radius = 160,
  color = "#ffffff",
  className,
  children,
  onPointerMove,
  onFocus,
  ...props
}: GlowCardProps) {
  // Start far outside so nothing shows before the first move.
  const x = useMotionValue(-radius * 2);
  const y = useMotionValue(-radius * 2);
  const border = useMotionTemplate`radial-gradient(${radius}px circle at ${x}px ${y}px, color-mix(in oklab, ${color} 35%, transparent), transparent 70%)`;
  const fill = useMotionTemplate`radial-gradient(${radius}px circle at ${x}px ${y}px, color-mix(in oklab, ${color} 4%, transparent), transparent 70%)`;
  const handleMove = (event: React.PointerEvent<HTMLDivElement>) => {
    onPointerMove?.(event);
    const rect = event.currentTarget.getBoundingClientRect();
    // +1 because the light layers sit on the 1px border (-inset-px).
    x.set(event.clientX - rect.left + 1);
    y.set(event.clientY - rect.top + 1);
  };

  const handleFocus = (event: React.FocusEvent<HTMLDivElement>) => {
    onFocus?.(event);
    // Keyboard focus without a prior hover: light the top edge.
    if (x.get() < 0) {
      x.set(event.currentTarget.offsetWidth / 2);
      y.set(0);
    }
  };

  // -z-10 + the Card's `isolate`: above the surface, below the content.
  const layer =
    "pointer-events-none absolute -inset-px -z-10 rounded-[inherit] opacity-0 transition-opacity duration-200 group-hover/glow:opacity-100 group-focus-within/glow:opacity-100";
  // The gradient is masked down to a 1px ring.
  const ring =
    "absolute inset-0 rounded-[inherit] p-px [mask-image:linear-gradient(#000_0_0),linear-gradient(#000_0_0)] [mask-clip:content-box,border-box] [mask-composite:exclude]";

  return (
    <Card
      className={cn("group/glow", className)}
      onPointerMove={handleMove}
      onFocus={handleFocus}
      {...props}
    >
      <motion.div aria-hidden className={layer} style={{ background: fill }} />
      <div aria-hidden className={layer}>
        <motion.div className={ring} style={{ background: border }} />
      </div>
      {children}
    </Card>
  );
}
