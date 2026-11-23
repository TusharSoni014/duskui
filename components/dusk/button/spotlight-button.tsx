"use client";

import * as React from "react";
import { motion, useMotionTemplate, useMotionValue } from "motion/react";

import { Button, type ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface SpotlightButtonProps extends ButtonProps {
  /** Radius of the light in px. */
  radius?: number;
  /** Any CSS color. Mixed in at low opacity; defaults to white. */
  color?: string;
}

/**
 * A faint highlight follows the cursor along the 1px border, with a barely
 * visible tint on the surface. Pairs well with `variant="outline"` on dark
 * backgrounds.
 */
export function SpotlightButton({
  radius = 60,
  color = "#ffffff",
  variant = "outline",
  className,
  children,
  onPointerMove,
  ...props
}: SpotlightButtonProps) {
  const x = useMotionValue(-radius * 2);
  const y = useMotionValue(-radius * 2);
  const border = useMotionTemplate`radial-gradient(${radius}px circle at ${x}px ${y}px, color-mix(in oklab, ${color} 35%, transparent), transparent 70%)`;
  const fill = useMotionTemplate`radial-gradient(${radius}px circle at ${x}px ${y}px, color-mix(in oklab, ${color} 4%, transparent), transparent 70%)`;

  const handleMove = (event: React.PointerEvent<HTMLButtonElement>) => {
    onPointerMove?.(event);
    const rect = event.currentTarget.getBoundingClientRect();
    x.set(event.clientX - rect.left);
    y.set(event.clientY - rect.top);
  };

  const layer =
    "pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-200 group-hover/spotlight:opacity-100 group-focus-visible/spotlight:opacity-100";

  return (
    <Button
      variant={variant}
      className={cn("group/spotlight", className)}
      onPointerMove={handleMove}
      {...props}
    >
      {/* Border light: the gradient is masked to a 1px ring. */}
      <motion.span
        aria-hidden
        className={cn(
          layer,
          "p-px [mask-image:linear-gradient(#000_0_0),linear-gradient(#000_0_0)] [mask-clip:content-box,border-box] [mask-composite:exclude]"
        )}
        style={{ background: border }}
      />
      <motion.span aria-hidden className={layer} style={{ background: fill }} />
      {children}
    </Button>
  );
}
