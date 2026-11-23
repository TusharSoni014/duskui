"use client";

import * as React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { AnimatePresence, motion, useReducedMotion, type Transition } from "motion/react";

import { Tooltip, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

type Side = "top" | "right" | "bottom" | "left";

export interface AnimatedTooltipProps
  extends Omit<
    React.ComponentProps<typeof TooltipPrimitive.Content>,
    "content" | "children" | "asChild" | "forceMount" | "side"
  > {
  /** What the tooltip says. */
  content: React.ReactNode;
  /** The trigger. Must accept a ref and props (a button, link or DuskUI Button). */
  children: React.ReactElement;
  side?: Side;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Hover delay in ms before opening. */
  delayDuration?: number;
  showArrow?: boolean;
}

const spring: Transition = { type: "spring", bounce: 0.1, duration: 0.2 };

// Where the tooltip starts, relative to its final spot: pulled back toward the trigger.
const fromSide: Record<Side, { x?: number; y?: number }> = {
  top: { y: 4 },
  bottom: { y: -4 },
  left: { x: 4 },
  right: { x: -4 },
};

/**
 * A tooltip that scales out of its trigger: it scales up slightly from the Radix
 * transform origin and travels a few pixels away from the side it opens on,
 * then fades back on exit. One-line API: wrap any trigger.
 * Built on the DuskUI Tooltip (Radix), so it opens on hover and keyboard focus,
 * closes on Escape and is linked to the trigger with aria-describedby.
 */
export function AnimatedTooltip({
  content,
  children,
  side = "top",
  sideOffset,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  delayDuration = 150,
  showArrow = true,
  className,
  ...props
}: AnimatedTooltipProps) {
  const reduceMotion = useReducedMotion();
  const [uncontrolled, setUncontrolled] = React.useState(defaultOpen);
  const open = openProp ?? uncontrolled;
  const offset = reduceMotion ? {} : fromSide[side];

  const setOpen = (next: boolean) => {
    if (openProp === undefined) setUncontrolled(next);
    onOpenChange?.(next);
  };

  return (
    <Tooltip open={open} onOpenChange={setOpen} delayDuration={delayDuration}>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <AnimatePresence>
        {open && (
          // forceMount lets AnimatePresence keep the content around for the exit animation.
          <TooltipPrimitive.Portal forceMount key="tooltip">
            <TooltipPrimitive.Content forceMount asChild side={side} sideOffset={sideOffset ?? (showArrow ? 2 : 8)} {...props}>
              <motion.div
                data-slot="tooltip-content"
                initial={{ opacity: 0, scale: 0.96, ...offset }}
                animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
                exit={{
                  opacity: 0,
                  scale: 0.96,
                  ...offset,
                  transition: { duration: 0.1, ease: "easeIn" },
                }}
                transition={spring}
                style={{ transformOrigin: "var(--radix-tooltip-content-transform-origin)" }}
                className={cn(
                  "z-50 w-fit max-w-xs rounded-md border border-white/10 bg-popover px-3 py-1.5 text-xs text-balance text-popover-foreground",
                  "shadow-md",
                  className
                )}
              >
                {content}
                {showArrow && (
                  <TooltipPrimitive.Arrow className="z-50 size-2.5 translate-y-[calc(-50%_-_1px)] rotate-45 rounded-[2px] border-r border-b border-white/10 bg-popover fill-popover" />
                )}
              </motion.div>
            </TooltipPrimitive.Content>
          </TooltipPrimitive.Portal>
        )}
      </AnimatePresence>
    </Tooltip>
  );
}
