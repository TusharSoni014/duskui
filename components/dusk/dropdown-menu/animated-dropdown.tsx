"use client";

import * as React from "react";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { AnimatePresence, motion, useReducedMotion, type Transition, type Variants } from "motion/react";

import { DropdownMenuShortcut, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const pillSpring: Transition = { type: "spring", stiffness: 520, damping: 38, mass: 0.6 };

type Side = "top" | "right" | "bottom" | "left";

type AnimatedDropdownContextValue = {
  /** Base for the shared highlight layoutId, unique per menu. */
  id: string;
  open: boolean;
  /** The item under the highlight pill, by its useId. */
  active: string | null;
  setActive: (id: string | null) => void;
  reduceMotion: boolean;
};

const AnimatedDropdownContext = React.createContext<AnimatedDropdownContextValue | null>(null);

function useAnimatedDropdown() {
  const context = React.useContext(AnimatedDropdownContext);
  if (!context) throw new Error("AnimatedDropdown parts must be used inside <AnimatedDropdown>.");
  return context;
}

export interface AnimatedDropdownProps
  extends Omit<React.ComponentProps<typeof DropdownMenuPrimitive.Root>, "open" | "defaultOpen" | "onOpenChange"> {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

/**
 * A dropdown menu with personality. It springs open out of its trigger, items
 * cascade in, and a highlight pill glides between items as you hover or arrow
 * through them (a shared Motion `layoutId`). Built on Radix Dropdown Menu, so
 * focus management, typeahead, arrow keys, Escape and aria all work. Under
 * reduced motion it fades and the pill jumps.
 */
export function AnimatedDropdown({ open: openProp, defaultOpen = false, onOpenChange, children, ...props }: AnimatedDropdownProps) {
  const id = React.useId();
  const reduceMotion = useReducedMotion() ?? false;
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen);
  const [active, setActive] = React.useState<string | null>(null);
  const open = openProp ?? internalOpen;

  const setOpen = React.useCallback(
    (next: boolean) => {
      if (openProp === undefined) setInternalOpen(next);
      if (!next) setActive(null);
      onOpenChange?.(next);
    },
    [openProp, onOpenChange]
  );

  const value = React.useMemo(
    () => ({ id, open, active, setActive, reduceMotion }),
    [id, open, active, reduceMotion]
  );

  return (
    <AnimatedDropdownContext.Provider value={value}>
      <DropdownMenuPrimitive.Root open={open} onOpenChange={setOpen} {...props}>
        {children}
      </DropdownMenuPrimitive.Root>
    </AnimatedDropdownContext.Provider>
  );
}

/** The element that opens the menu. Use `asChild` to render your own Button. */
export const AnimatedDropdownTrigger = DropdownMenuTrigger;

export interface AnimatedDropdownContentProps
  extends Omit<
    React.ComponentProps<typeof DropdownMenuPrimitive.Content>,
    "forceMount" | "asChild" | "children"
  > {
  children?: React.ReactNode;
  side?: Side;
  /** Delay between items as they cascade in, in seconds. */
  stagger?: number;
}

const offsets: Record<Side, { x?: number; y?: number }> = {
  bottom: { y: -8 },
  top: { y: 8 },
  left: { x: 8 },
  right: { x: -8 },
};

/** The menu surface. Springs open from the trigger's side and staggers its items in. */
export function AnimatedDropdownContent({
  className,
  side = "bottom",
  sideOffset = 6,
  stagger = 0.035,
  children,
  onPointerLeave,
  ...props
}: AnimatedDropdownContentProps) {
  const { open, reduceMotion, setActive } = useAnimatedDropdown();

  const variants: Variants = reduceMotion
    ? {
        closed: { opacity: 0, transition: { duration: 0.1 } },
        open: { opacity: 1, transition: { duration: 0.15 } },
      }
    : {
        closed: { opacity: 0, scale: 0.9, ...offsets[side], transition: { duration: 0.12, ease: "easeIn" } },
        open: {
          opacity: 1,
          scale: 1,
          x: 0,
          y: 0,
          transition: { type: "spring", duration: 0.4, bounce: 0.22, staggerChildren: stagger, delayChildren: 0.03 },
        },
      };

  return (
    <AnimatePresence>
      {open && (
        // forceMount hands mounting to AnimatePresence so the exit animation can play.
        <DropdownMenuPrimitive.Portal key="menu" forceMount>
          <DropdownMenuPrimitive.Content
            forceMount
            asChild
            side={side}
            sideOffset={sideOffset}
            onPointerLeave={(event) => {
              onPointerLeave?.(event);
              setActive(null);
            }}
            {...props}
          >
            <motion.div
              className={cn(
                "z-50 min-w-48 overflow-x-hidden overflow-y-auto rounded-xl border bg-popover p-1.5 text-popover-foreground outline-none",
                "max-h-(--radix-dropdown-menu-content-available-height) origin-(--radix-dropdown-menu-content-transform-origin)",
                "shadow-[inset_0_1px_0_rgb(255_255_255/0.05),0_16px_40px_-12px_rgb(0_0_0/0.7),0_0_0_1px_rgb(0_0_0/0.2)]",
                className
              )}
              variants={variants}
              initial="closed"
              animate="open"
              exit="closed"
            >
              {children}
            </motion.div>
          </DropdownMenuPrimitive.Content>
        </DropdownMenuPrimitive.Portal>
      )}
    </AnimatePresence>
  );
}

function useItemVariants(): Variants {
  const { reduceMotion } = useAnimatedDropdown();
  return reduceMotion
    ? { closed: { opacity: 0, transition: { duration: 0.1 } }, open: { opacity: 1 } }
    : {
        closed: { opacity: 0, y: -4, filter: "blur(2px)", transition: { duration: 0.1 } },
        open: { opacity: 1, y: 0, filter: "blur(0px)", transition: { type: "spring", duration: 0.35, bounce: 0.15 } },
      };
}

export interface AnimatedDropdownItemProps
  extends Omit<React.ComponentProps<typeof DropdownMenuPrimitive.Item>, "asChild"> {
  /** Leading icon. */
  icon?: React.ReactNode;
  /** Trailing keyboard hint, e.g. "⌘K". Visual only. */
  shortcut?: React.ReactNode;
  /** `destructive` tints the item and its highlight red. */
  variant?: "default" | "destructive";
}

/** A menu action. `onSelect` fires on click, Enter or Space and closes the menu. */
export function AnimatedDropdownItem({
  className,
  children,
  icon,
  shortcut,
  variant = "default",
  onFocus,
  ...props
}: AnimatedDropdownItemProps) {
  const itemId = React.useId();
  const { id, active, setActive, reduceMotion } = useAnimatedDropdown();
  const variants = useItemVariants();
  const isActive = active === itemId;

  return (
    <DropdownMenuPrimitive.Item
      asChild
      // Radix focuses items on hover and arrow keys, so focus drives the pill.
      onFocus={(event) => {
        onFocus?.(event);
        setActive(itemId);
      }}
      {...props}
    >
      <motion.div
        variants={variants}
        data-variant={variant}
        className={cn(
          "relative flex cursor-default items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm outline-none select-none",
          "transition-colors duration-150 data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
          variant === "destructive" ? "text-destructive" : "text-foreground/90 data-[highlighted]:text-foreground",
          "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
          className
        )}
      >
        {isActive && (
          <motion.span
            aria-hidden
            layoutId={`${id}-pill`}
            className={cn(
              "absolute inset-0 rounded-lg",
              variant === "destructive"
                ? "bg-destructive/15"
                : "bg-accent shadow-[inset_0_1px_0_rgb(255_255_255/0.04)]"
            )}
            transition={reduceMotion ? { duration: 0 } : pillSpring}
          />
        )}
        {icon && (
          <span
            aria-hidden
            className={cn(
              "relative flex transition-colors duration-150",
              variant === "destructive" ? "text-destructive" : isActive ? "text-primary" : "text-muted-foreground"
            )}
          >
            {icon}
          </span>
        )}
        <span className="relative flex-1 truncate">{children}</span>
        {shortcut && <DropdownMenuShortcut className="relative">{shortcut}</DropdownMenuShortcut>}
      </motion.div>
    </DropdownMenuPrimitive.Item>
  );
}

/** A small heading for a group of items. Cascades in with the items. */
export function AnimatedDropdownLabel({
  className,
  ...props
}: Omit<React.ComponentProps<typeof motion.div>, "variants">) {
  const variants = useItemVariants();
  return (
    <DropdownMenuPrimitive.Label asChild>
      <motion.div
        variants={variants}
        className={cn("px-2.5 pt-1.5 pb-1 text-xs font-medium text-muted-foreground", className)}
        {...props}
      />
    </DropdownMenuPrimitive.Label>
  );
}

/** A divider between groups. Draws in from the left as the menu opens. */
export function AnimatedDropdownSeparator({
  className,
  ...props
}: Omit<React.ComponentProps<typeof motion.div>, "variants">) {
  const { reduceMotion } = useAnimatedDropdown();
  return (
    <DropdownMenuPrimitive.Separator asChild>
      <motion.div
        variants={
          reduceMotion
            ? { closed: { opacity: 0, transition: { duration: 0.1 } }, open: { opacity: 1 } }
            : { closed: { scaleX: 0, opacity: 0, transition: { duration: 0.1 } }, open: { scaleX: 1, opacity: 1, transition: { duration: 0.3, ease: "easeOut" } } }
        }
        className={cn("-mx-1.5 my-1.5 h-px origin-left bg-border", className)}
        {...props}
      />
    </DropdownMenuPrimitive.Separator>
  );
}

/** Groups related items (role="group"). */
export const AnimatedDropdownGroup = DropdownMenuPrimitive.Group;
