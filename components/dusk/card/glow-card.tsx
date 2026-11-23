"use client";

import * as React from "react";
import { motion, useMotionTemplate, useMotionValue } from "motion/react";

import { Card, type CardProps } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface GlowCardProps extends Omit<CardProps, "asChild"> {
  /** Radius of the light in px. */
  radius?: number;
  /** Any CSS color. Defaults to the theme primary. */
  color?: string;
  /** Add a soft blurred bloom around the lit part of the border. */
  bloom?: boolean;
}

/**
 * A card whose border lights up where the cursor is, with a faint wash on the
 * surface. The light follows the pointer through motion values, so moving the
 * mouse never re-renders React. It also lights up while a child has keyboard
 * focus, so the effect isn't mouse-only.
 */
export function GlowCard({
  radius = 260,
  color = "var(--color-primary)",
  bloom = true,
  className,
  children,
  onPointerMove,
  onFocus,
  ...props
}: GlowCardProps) {
  // Start far outside so nothing shows before the first move.
  const x = useMotionValue(-radius * 2);
  const y = useMotionValue(-radius * 2);
  const border = useMotionTemplate`radial-gradient(${radius}px circle at ${x}px ${y}px, ${color}, transparent 70%)`;
  const fill = useMotionTemplate`radial-gradient(${radius * 1.4}px circle at ${x}px ${y}px, color-mix(in oklab, ${color} 9%, transparent), transparent 70%)`;

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
    "pointer-events-none absolute -inset-px -z-10 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover/glow:opacity-100 group-focus-within/glow:opacity-100";
  // The gradient is masked down to a 1px ring.
  const ring =
    "absolute inset-0 rounded-[inherit] p-px [mask-composite:exclude] [mask:linear-gradient(#000_0_0)_content-box,linear-gradient(#000_0_0)]";

  return (
    <Card
      className={cn("group/glow", className)}
      onPointerMove={handleMove}
      onFocus={handleFocus}
      {...props}
    >
      <motion.div aria-hidden className={layer} style={{ background: fill }} />
      {bloom && (
        // Blurring the wrapper (not the masked ring) lets the light spill outside the card.
        <div aria-hidden className={cn(layer, "blur-[6px] group-hover/glow:opacity-70 group-focus-within/glow:opacity-70")}>
          <motion.div className={ring} style={{ background: border }} />
        </div>
      )}
      <div aria-hidden className={layer}>
        <motion.div className={ring} style={{ background: border }} />
      </div>
      {children}
    </Card>
  );
}
