"use client";

import * as React from "react";
import * as CollapsiblePrimitive from "@radix-ui/react-collapsible";
import { motion, useReducedMotion, type Transition, type Variants } from "motion/react";
import { ChevronDownIcon } from "lucide-react";

import { cn } from "@/lib/utils";

type MotionCollapsibleContextValue = { open: boolean; reduceMotion: boolean };

const MotionCollapsibleContext = React.createContext<MotionCollapsibleContextValue | null>(null);

function useMotionCollapsible() {
  const context = React.useContext(MotionCollapsibleContext);
  if (!context) throw new Error("MotionCollapsible parts must be used inside <MotionCollapsible>.");
  return context;
}

export interface MotionCollapsibleProps extends React.ComponentProps<typeof CollapsiblePrimitive.Root> {
  /** Outline the panel and brighten its border while open. */
  bordered?: boolean;
}

/**
 * A collapsible with gentle spring physics: the panel eases its height open,
 * the content fades in after it, and the chevron turns. Closed content stays mounted but `inert`, so it is
 * indexed by search engines yet skipped by keyboard and screen readers.
 * Built on Radix Collapsible (aria-expanded, aria-controls). Under reduced
 * motion it opens and closes instantly.
 */
export function MotionCollapsible({
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  bordered = true,
  className,
  ...props
}: MotionCollapsibleProps) {
  const reduceMotion = useReducedMotion() ?? false;
  const [uncontrolled, setUncontrolled] = React.useState(defaultOpen);
  const open = openProp ?? uncontrolled;

  const setOpen = (next: boolean) => {
    if (openProp === undefined) setUncontrolled(next);
    onOpenChange?.(next);
  };

  return (
    <MotionCollapsibleContext.Provider value={{ open, reduceMotion }}>
      <CollapsiblePrimitive.Root
        data-slot="collapsible"
        open={open}
        onOpenChange={setOpen}
        className={cn(
          "w-full",
          bordered && [
            "rounded-xl border bg-white/[0.015]",
            "transition-[border-color,background-color] duration-200 ease-out motion-reduce:transition-none",
            "data-[state=open]:border-white/15 data-[state=open]:bg-white/[0.025]",
          ],
          className
        )}
        {...props}
      />
    </MotionCollapsibleContext.Provider>
  );
}

const chevronSpring: Transition = { type: "spring", bounce: 0, duration: 0.25 };

export interface MotionCollapsibleTriggerProps
  extends Omit<React.ComponentProps<typeof CollapsiblePrimitive.Trigger>, "asChild"> {
  /** Replaces the chevron; it still rotates. `null` hides it. */
  icon?: React.ReactNode;
}

/** The full-width toggle row. Its chevron turns between down and up. */
export function MotionCollapsibleTrigger({ className, children, icon, ...props }: MotionCollapsibleTriggerProps) {
  const { open, reduceMotion } = useMotionCollapsible();

  return (
    <CollapsiblePrimitive.Trigger
      data-slot="collapsible-trigger"
      className={cn(
        "group/trigger flex w-full items-center justify-between gap-4 rounded-xl px-4 py-3 text-left text-sm font-medium outline-none",
        "transition-colors duration-150 hover:text-foreground motion-reduce:transition-none",
        "focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50",
        className
      )}
      {...props}
    >
      {children}
      {icon !== null && (
        <motion.span
          aria-hidden
          className={cn(
            "flex size-6 shrink-0 items-center justify-center rounded-md transition-colors duration-200",
            open ? "text-foreground" : "text-muted-foreground group-hover/trigger:text-foreground"
          )}
          initial={false}
          animate={{ rotate: open ? 180 : 0 }}
          transition={reduceMotion ? { duration: 0 } : chevronSpring}
        >
          {icon ?? <ChevronDownIcon className="size-4" />}
        </motion.span>
      )}
    </CollapsiblePrimitive.Trigger>
  );
}

const panel = (instant: boolean): Variants => ({
  open: {
    height: "auto",
    transition: instant ? { duration: 0 } : { type: "spring", bounce: 0, duration: 0.3 },
  },
  closed: {
    height: 0,
    transition: instant ? { duration: 0 } : { type: "spring", bounce: 0, duration: 0.25 },
  },
});

const inner = (instant: boolean): Variants => ({
  open: {
    opacity: 1,
    y: 0,
    transition: instant ? { duration: 0 } : { duration: 0.2, delay: 0.05, ease: "easeOut" },
  },
  // Same closed values either way (they're hidden at height 0), so server and client markup match.
  closed: { opacity: 0, y: -4, transition: { duration: instant ? 0 : 0.14 } },
});

/** The panel. Animates its height and fades its content. `className` styles the inner wrapper. */
export function MotionCollapsibleContent({
  className,
  children,
  ...props
}: Omit<React.ComponentProps<typeof CollapsiblePrimitive.Content>, "forceMount" | "asChild">) {
  const { open, reduceMotion } = useMotionCollapsible();
  const state = open ? "open" : "closed";

  return (
    <CollapsiblePrimitive.Content forceMount asChild {...props}>
      <motion.div
        data-slot="collapsible-content"
        initial={false}
        animate={state}
        variants={panel(reduceMotion)}
        // Closed content stays mounted for the animation; inert hides it from focus and assistive tech.
        inert={!open}
        className="overflow-hidden"
      >
        <motion.div
          variants={inner(reduceMotion)}
          className={cn("px-4 pb-4 text-sm leading-relaxed text-muted-foreground", className)}
        >
          {children}
        </motion.div>
      </motion.div>
    </CollapsiblePrimitive.Content>
  );
}
