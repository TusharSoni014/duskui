"use client";

import * as React from "react";
import {
  animate,
  motion,
  useMotionTemplate,
  useMotionValue,
  useTransform,
  type AnimationPlaybackControls,
} from "motion/react";

import { Button, type ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface HoldToConfirmButtonProps extends Omit<ButtonProps, "onClick"> {
  /** Fired once the hold completes. */
  onConfirm: () => void;
  /** How long the user must hold, in ms. */
  holdDuration?: number;
  /** Classes for the fill layer that wipes in while holding. */
  fillClassName?: string;
}

/**
 * Press and hold to confirm a destructive action. Releasing early springs
 * the progress back. Works with mouse, touch, and Space / Enter.
 */
export function HoldToConfirmButton({
  onConfirm,
  holdDuration = 1200,
  variant = "outline",
  className,
  fillClassName = "bg-[color-mix(in_oklab,var(--color-destructive)_70%,black)] text-white",
  children,
  disabled,
  ...props
}: HoldToConfirmButtonProps) {
  const progress = useMotionValue(0);
  const remaining = useTransform(progress, (v) => (1 - v) * 100);
  const clipPath = useMotionTemplate`inset(0 ${remaining}% 0 0)`;
  const controls = React.useRef<AnimationPlaybackControls | null>(null);
  const done = React.useRef(false);

  React.useEffect(() => () => controls.current?.stop(), []);

  const start = () => {
    if (disabled) return;
    done.current = false;
    controls.current?.stop();
    controls.current = animate(progress, 1, {
      duration: (holdDuration / 1000) * (1 - progress.get()),
      ease: "linear",
      onComplete: () => {
        done.current = true;
        onConfirm();
        controls.current = animate(progress, 0, { delay: 0.6, duration: 0.3 });
      },
    });
  };

  const cancel = () => {
    if (done.current) return;
    controls.current?.stop();
    controls.current = animate(progress, 0, { type: "spring", duration: 0.4, bounce: 0 });
  };

  const isActivationKey = (event: React.KeyboardEvent) =>
    event.key === " " || event.key === "Enter";

  return (
    <Button
      variant={variant}
      disabled={disabled}
      className={cn("overflow-hidden touch-none", className)}
      onPointerDown={(event) => {
        if (event.button === 0) start();
      }}
      onPointerUp={cancel}
      onPointerLeave={cancel}
      onPointerCancel={cancel}
      onKeyDown={(event) => {
        if (!isActivationKey(event)) return;
        event.preventDefault();
        if (!event.repeat) start();
      }}
      onKeyUp={(event) => {
        if (isActivationKey(event)) cancel();
      }}
      onContextMenu={(event) => event.preventDefault()}
      {...props}
    >
      {children}
      <span className="sr-only"> (press and hold to confirm)</span>
      {/* Same label in the fill colors, revealed left → right. */}
      <motion.span
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-0 inline-flex items-center justify-center [gap:inherit]",
          fillClassName
        )}
        style={{ clipPath }}
      >
        {children}
      </motion.span>
    </Button>
  );
}
