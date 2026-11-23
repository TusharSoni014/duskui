"use client";

import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { AnimatePresence, motion, useReducedMotion, type Variants } from "motion/react";

import { PopoverAnchor, PopoverClose, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

type AnimatedPopoverContextValue = { open: boolean; reduceMotion: boolean };

const AnimatedPopoverContext = React.createContext<AnimatedPopoverContextValue | null>(null);

function useAnimatedPopover() {
  const context = React.useContext(AnimatedPopoverContext);
  if (!context) throw new Error("AnimatedPopover parts must be used inside <AnimatedPopover>.");
  return context;
}

export interface AnimatedPopoverProps
  extends Omit<React.ComponentProps<typeof PopoverPrimitive.Root>, "open" | "defaultOpen" | "onOpenChange"> {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

/**
 * A popover that springs out of its trigger. The scale origin comes from
 * Radix's `--radix-popover-content-transform-origin`, so it always grows from
 * the edge nearest the trigger, even after flipping to avoid the viewport
 * edge; the content then fades up a beat later and the exit is quick. Radix
 * handles focus, Escape, outside clicks and aria. Fades only under reduced motion.
 */
export function AnimatedPopover({ open: openProp, defaultOpen = false, onOpenChange, ...props }: AnimatedPopoverProps) {
  const reduceMotion = useReducedMotion() ?? false;
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen);
  const open = openProp ?? internalOpen;

  const setOpen = React.useCallback(
    (next: boolean) => {
      if (openProp === undefined) setInternalOpen(next);
      onOpenChange?.(next);
    },
    [openProp, onOpenChange]
  );

  const value = React.useMemo(() => ({ open, reduceMotion }), [open, reduceMotion]);

  return (
    <AnimatedPopoverContext.Provider value={value}>
      <PopoverPrimitive.Root open={open} onOpenChange={setOpen} {...props} />
    </AnimatedPopoverContext.Provider>
  );
}

/** The element that toggles the popover. Use `asChild` to render your own Button. */
export const AnimatedPopoverTrigger = PopoverTrigger;
/** Positions the popover against something other than the trigger. */
export const AnimatedPopoverAnchor = PopoverAnchor;
/** Closes the popover. Use `asChild` to render your own Button. */
export const AnimatedPopoverClose = PopoverClose;

export interface AnimatedPopoverContentProps
  extends Omit<React.ComponentProps<typeof PopoverPrimitive.Content>, "forceMount" | "asChild" | "children"> {
  children?: React.ReactNode;
  /** Draw a small arrow pointing at the trigger. */
  showArrow?: boolean;
}

/** The floating panel. Portalled, positioned by Radix and animated by Motion. */
export function AnimatedPopoverContent({
  className,
  children,
  align = "center",
  sideOffset = 8,
  showArrow = false,
  ...props
}: AnimatedPopoverContentProps) {
  const { open, reduceMotion } = useAnimatedPopover();

  const surface: Variants = reduceMotion
    ? { closed: { opacity: 0, transition: { duration: 0.1 } }, open: { opacity: 1, transition: { duration: 0.15 } } }
    : {
        closed: { opacity: 0, scale: 0.85, filter: "blur(4px)", transition: { duration: 0.14, ease: "easeIn" } },
        open: {
          opacity: 1,
          scale: 1,
          filter: "blur(0px)",
          transitionEnd: { filter: "none" },
          transition: { type: "spring", duration: 0.45, bounce: 0.25 },
        },
      };

  const inner: Variants = reduceMotion
    ? { closed: { opacity: 1 }, open: { opacity: 1 } }
    : {
        closed: { opacity: 0, y: 4, transition: { duration: 0.08 } },
        open: { opacity: 1, y: 0, transition: { duration: 0.25, ease: "easeOut", delay: 0.08 } },
      };

  return (
    <AnimatePresence>
      {open && (
        // forceMount hands mounting to AnimatePresence so the exit animation can play.
        <PopoverPrimitive.Portal key="popover" forceMount>
          <PopoverPrimitive.Content forceMount asChild align={align} sideOffset={sideOffset} {...props}>
            <motion.div
              className={cn(
                "z-50 w-72 rounded-xl border bg-popover p-4 text-popover-foreground outline-none",
                "origin-(--radix-popover-content-transform-origin)",
                "shadow-[inset_0_1px_0_rgb(255_255_255/0.05),0_16px_40px_-12px_rgb(0_0_0/0.7),0_0_0_1px_rgb(0_0_0/0.2)]",
                className
              )}
              variants={surface}
              initial="closed"
              animate="open"
              exit="closed"
            >
              <motion.div variants={inner}>{children}</motion.div>
              {showArrow && (
                <PopoverPrimitive.Arrow asChild width={14} height={7}>
                  {/* Nudged 1px into the surface so its base covers the border line. */}
                  <svg viewBox="0 0 14 7" className="block -translate-y-px fill-popover stroke-border" aria-hidden>
                    <path d="M0 0 L7 6.5 L14 0" strokeWidth={1} />
                  </svg>
                </PopoverPrimitive.Arrow>
              )}
            </motion.div>
          </PopoverPrimitive.Content>
        </PopoverPrimitive.Portal>
      )}
    </AnimatePresence>
  );
}
