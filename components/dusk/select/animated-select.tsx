"use client";

import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { motion, useReducedMotion, type Transition, type Variants } from "motion/react";

import { SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

const pillSpring: Transition = { type: "spring", stiffness: 520, damping: 38, mass: 0.6 };

type AnimatedSelectContextValue = {
  /** Base for the shared highlight layoutId; changes every time the list opens. */
  layoutId: string;
  value: string | undefined;
  /** The item under the highlight, by its value. */
  active: string | null;
  setActive: (value: string | null) => void;
  reduceMotion: boolean;
};

const AnimatedSelectContext = React.createContext<AnimatedSelectContextValue | null>(null);

function useAnimatedSelect() {
  const context = React.useContext(AnimatedSelectContext);
  if (!context) throw new Error("AnimatedSelect parts must be used inside <AnimatedSelect>.");
  return context;
}

export interface AnimatedSelectProps
  extends Omit<
    React.ComponentProps<typeof SelectPrimitive.Root>,
    "value" | "defaultValue" | "onValueChange" | "open" | "defaultOpen" | "onOpenChange"
  > {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

/**
 * A select with personality. The list springs out of the trigger, items
 * cascade in, a highlight pill glides between items as you hover or arrow
 * through them (a shared Motion `layoutId`) and the check mark pops in.
 *
 * Compose it like the shadcn Select: AnimatedSelect › AnimatedSelectTrigger ›
 * AnimatedSelectValue, then AnimatedSelectContent › AnimatedSelectItem.
 * Built on Radix Select, so typeahead, arrow keys, Home/End, Escape, form
 * submission (`name`) and aria all work. Radix keeps closed content in a
 * detached fragment so the trigger can show the selected label, so the exit is
 * a quick CSS fade Radix waits for. Under reduced motion it only fades.
 */
export function AnimatedSelect({
  value: valueProp,
  defaultValue,
  onValueChange,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  children,
  ...props
}: AnimatedSelectProps) {
  const id = React.useId();
  const reduceMotion = useReducedMotion() ?? false;
  const [uncontrolledValue, setUncontrolledValue] = React.useState(defaultValue);
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);
  const [active, setActive] = React.useState<string | null>(null);
  const [session, setSession] = React.useState(0);
  const value = valueProp ?? uncontrolledValue;
  const open = openProp ?? uncontrolledOpen;

  const handleOpenChange = (next: boolean) => {
    if (openProp === undefined) setUncontrolledOpen(next);
    // A fresh layoutId per opening, so the pill never glides in from where it was last time.
    if (next) setSession((s) => s + 1);
    else setActive(null);
    onOpenChange?.(next);
  };

  const handleValueChange = (next: string) => {
    if (valueProp === undefined) setUncontrolledValue(next);
    onValueChange?.(next);
  };

  const context = React.useMemo(
    () => ({ layoutId: `${id}-pill-${session}`, value, active, setActive, reduceMotion }),
    [id, session, value, active, reduceMotion]
  );

  return (
    <AnimatedSelectContext.Provider value={context}>
      <SelectPrimitive.Root
        value={value}
        onValueChange={handleValueChange}
        open={open}
        onOpenChange={handleOpenChange}
        {...props}
      >
        {children}
      </SelectPrimitive.Root>
    </AnimatedSelectContext.Provider>
  );
}

/** The button that opens the list. Same props as the DuskUI SelectTrigger. */
export function AnimatedSelectTrigger({ className, ...props }: React.ComponentProps<typeof SelectTrigger>) {
  return <SelectTrigger className={cn("w-full min-w-48", className)} {...props} />;
}

/** Shows the selected item's label, or `placeholder`. */
export const AnimatedSelectValue = SelectValue;

export interface AnimatedSelectContentProps
  extends Omit<React.ComponentProps<typeof SelectPrimitive.Content>, "position" | "asChild" | "forceMount"> {
  /** Delay between items as they cascade in, in seconds. */
  stagger?: number;
}

/** The list surface. Drops below the trigger at its width, scales open and staggers its items in. */
export function AnimatedSelectContent({
  className,
  children,
  side = "bottom",
  sideOffset = 6,
  align = "start",
  stagger = 0.015,
  onPointerLeave,
  ...props
}: AnimatedSelectContentProps) {
  const { reduceMotion, setActive } = useAnimatedSelect();
  const offset = side === "top" ? 4 : side === "bottom" ? -4 : 0;

  const variants: Variants = reduceMotion
    ? { closed: { opacity: 0 }, open: { opacity: 1, transition: { duration: 0.15 } } }
    : {
        closed: { opacity: 0, scale: 0.96, y: offset },
        open: {
          opacity: 1,
          scale: 1,
          y: 0,
          transition: { type: "spring", duration: 0.25, bounce: 0.1, staggerChildren: stagger, delayChildren: 0.02 },
        },
      };

  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        position="popper"
        side={side}
        sideOffset={sideOffset}
        align={align}
        asChild
        onPointerLeave={(event) => {
          onPointerLeave?.(event);
          setActive(null);
        }}
        {...props}
      >
        <motion.div
          data-slot="select-content"
          variants={variants}
          initial="closed"
          animate="open"
          className={cn(
            "relative z-50 max-h-[min(20rem,var(--radix-select-content-available-height))] min-w-(--radix-select-trigger-width) overflow-hidden rounded-md border bg-popover text-popover-foreground outline-none",
            "origin-(--radix-select-content-transform-origin)",
            "shadow-md",
            // Exit: a quick CSS fade that Radix waits for before unmounting.
            "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=closed]:duration-100",
            "motion-reduce:data-[state=closed]:zoom-out-100",
            className
          )}
        >
          <SelectPrimitive.ScrollUpButton className="flex h-6 cursor-default items-center justify-center text-muted-foreground">
            <ChevronUpIcon className="size-4" />
          </SelectPrimitive.ScrollUpButton>
          <SelectPrimitive.Viewport className="scroll-my-1.5 p-1.5">{children}</SelectPrimitive.Viewport>
          <SelectPrimitive.ScrollDownButton className="flex h-6 cursor-default items-center justify-center text-muted-foreground">
            <ChevronDownIcon className="size-4" />
          </SelectPrimitive.ScrollDownButton>
        </motion.div>
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  );
}

function useItemVariants(): Variants {
  const { reduceMotion } = useAnimatedSelect();
  return reduceMotion
    ? { closed: { opacity: 0 }, open: { opacity: 1 } }
    : {
        closed: { opacity: 0, y: -2 },
        open: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.2, ease: "easeOut" },
        },
      };
}

export interface AnimatedSelectItemProps
  extends Omit<React.ComponentProps<typeof SelectPrimitive.Item>, "asChild"> {
  /** Leading icon. Shown in the list and, when selected, in the trigger. */
  icon?: React.ReactNode;
  /** Secondary line under the label. Shown in the list only. */
  description?: React.ReactNode;
}

/** An option. Its children (and icon) become the trigger's value when selected. */
export function AnimatedSelectItem({
  value,
  className,
  children,
  icon,
  description,
  onFocus,
  ...props
}: AnimatedSelectItemProps) {
  const { layoutId, value: selected, active, setActive, reduceMotion } = useAnimatedSelect();
  const variants = useItemVariants();
  const isActive = active === value;
  const isSelected = selected === value;

  return (
    <SelectPrimitive.Item
      value={value}
      asChild
      // Radix focuses items on hover and arrow keys, so focus drives the pill.
      onFocus={(event) => {
        onFocus?.(event);
        setActive(value);
      }}
      {...props}
    >
      <motion.div
        variants={variants}
        className={cn(
          "relative flex w-full cursor-default items-center gap-2.5 rounded-sm py-2 pr-9 pl-2.5 text-sm text-foreground/85 outline-none select-none",
          "transition-colors duration-150 data-[highlighted]:text-foreground data-[state=checked]:text-foreground",
          "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
          "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
          className
        )}
      >
        {isActive && (
          <motion.span
            aria-hidden
            layoutId={layoutId}
            className="absolute inset-0 rounded-sm bg-accent"
            transition={reduceMotion ? { duration: 0 } : pillSpring}
          />
        )}
        {/* ItemText's children are also portalled into the trigger when selected. */}
        <SelectPrimitive.ItemText asChild>
          <span className="relative flex min-w-0 flex-1 items-center gap-2.5">
            {icon && (
              <span
                aria-hidden
                className={cn(
                  "flex transition-colors duration-150",
                  isActive || isSelected ? "text-foreground" : "text-muted-foreground"
                )}
              >
                {icon}
              </span>
            )}
            <span className="truncate">{children}</span>
          </span>
        </SelectPrimitive.ItemText>
        {description && (
          <span className="relative hidden shrink-0 text-xs text-muted-foreground sm:inline">{description}</span>
        )}
        <span className="absolute right-2.5 flex size-4 items-center justify-center">
          <SelectPrimitive.ItemIndicator asChild>
            <motion.span
              initial={reduceMotion ? { opacity: 0 } : { scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={reduceMotion ? { duration: 0.15 } : { type: "spring", bounce: 0.1, duration: 0.2 }}
              className="flex text-foreground"
            >
              <CheckIcon className="size-4" />
            </motion.span>
          </SelectPrimitive.ItemIndicator>
        </span>
      </motion.div>
    </SelectPrimitive.Item>
  );
}

/** Groups related items under an AnimatedSelectLabel. */
export const AnimatedSelectGroup = SelectPrimitive.Group;

/** A small heading for a group. Cascades in with the items. */
export function AnimatedSelectLabel({
  className,
  ...props
}: Omit<React.ComponentProps<typeof motion.div>, "variants">) {
  const variants = useItemVariants();
  return (
    <SelectPrimitive.Label asChild>
      <motion.div
        variants={variants}
        className={cn("px-2.5 pt-1.5 pb-1 text-xs font-medium text-muted-foreground", className)}
        {...props}
      />
    </SelectPrimitive.Label>
  );
}

/** A divider between groups. Draws in from the left as the list opens. */
export function AnimatedSelectSeparator({
  className,
  ...props
}: Omit<React.ComponentProps<typeof motion.div>, "variants">) {
  const { reduceMotion } = useAnimatedSelect();
  return (
    <SelectPrimitive.Separator asChild>
      <motion.div
        variants={
          reduceMotion
            ? { closed: { opacity: 0 }, open: { opacity: 1 } }
            : { closed: { scaleX: 0, opacity: 0 }, open: { scaleX: 1, opacity: 1, transition: { duration: 0.3, ease: "easeOut" } } }
        }
        className={cn("-mx-1.5 my-1.5 h-px origin-left bg-border", className)}
        {...props}
      />
    </SelectPrimitive.Separator>
  );
}
