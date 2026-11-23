"use client";

import * as React from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { LayoutGroup, motion, useReducedMotion, type Variants } from "motion/react";

import { Accordion, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

type MotionAccordionContextValue = {
  open: string[];
  hovered: string | null;
  setHovered: (value: string | null) => void;
};

const MotionAccordionContext = React.createContext<MotionAccordionContextValue | null>(null);
const MotionAccordionItemContext = React.createContext<{ open: boolean } | null>(null);

function useMotionAccordion() {
  const context = React.useContext(MotionAccordionContext);
  if (!context) throw new Error("MotionAccordion parts must be used inside <MotionAccordion>.");
  return context;
}

export interface MotionAccordionProps
  extends Omit<React.ComponentProps<"div">, "defaultValue" | "dir"> {
  /** `single` keeps one item open at a time; `multiple` lets any number stay open. */
  type?: "single" | "multiple";
  /** Single mode only: allow closing the open item. */
  collapsible?: boolean;
  /** Open item values. Always an array, in both modes. */
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
  disabled?: boolean;
  dir?: "ltr" | "rtl";
}

/**
 * An accordion with gentle spring physics: panels ease open, their content
 * fades in, a soft highlight glides between items under the cursor and the
 * open item gets a quiet outline. Answers stay in the DOM while closed
 * (inert), so search engines still index them.
 * Built on the DuskUI Accordion (Radix) for keyboard support and aria.
 */
export function MotionAccordion({
  type = "single",
  collapsible = true,
  value: valueProp,
  defaultValue = [],
  onValueChange,
  className,
  children,
  onPointerLeave,
  ...props
}: MotionAccordionProps) {
  const layoutId = React.useId();
  const [uncontrolled, setUncontrolled] = React.useState(defaultValue);
  const [hovered, setHovered] = React.useState<string | null>(null);
  const open = valueProp ?? uncontrolled;

  const setOpen = (next: string[]) => {
    if (valueProp === undefined) setUncontrolled(next);
    onValueChange?.(next);
  };

  const shared = {
    ...props,
    className: cn("flex w-full flex-col gap-1", className),
    onPointerLeave: (event: React.PointerEvent<HTMLDivElement>) => {
      onPointerLeave?.(event);
      setHovered(null);
    },
    children,
  };

  return (
    <MotionAccordionContext.Provider value={{ open, hovered, setHovered }}>
      <LayoutGroup id={layoutId}>
        {type === "multiple" ? (
          <Accordion type="multiple" value={open} onValueChange={setOpen} {...shared} />
        ) : (
          <Accordion
            type="single"
            collapsible={collapsible}
            value={open[0] ?? ""}
            onValueChange={(next) => setOpen(next ? [next] : [])}
            {...shared}
          />
        )}
      </LayoutGroup>
    </MotionAccordionContext.Provider>
  );
}

/** One item. Shows the gliding hover highlight and a quiet outline while open. */
export function MotionAccordionItem({
  value,
  className,
  children,
  onPointerEnter,
  ...props
}: React.ComponentProps<typeof AccordionItem>) {
  const { open, hovered, setHovered } = useMotionAccordion();
  const isOpen = open.includes(value);

  return (
    <MotionAccordionItemContext.Provider value={{ open: isOpen }}>
      <AccordionItem
        value={value}
        onPointerEnter={(event) => {
          onPointerEnter?.(event);
          if (event.pointerType === "mouse") setHovered(value);
        }}
        className={cn(
          "relative isolate rounded-xl border border-transparent px-4 last:border",
          "transition-[border-color,background-color] duration-200 ease-out motion-reduce:transition-none",
          "data-[state=open]:border-white/10 data-[state=open]:bg-white/[0.02]",
          className
        )}
        {...props}
      >
        {hovered === value && (
          <motion.div
            layoutId="motion-accordion-hover"
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10 rounded-xl bg-white/[0.04]"
            transition={{ type: "spring", bounce: 0.15, duration: 0.4 }}
          />
        )}
        {children}
      </AccordionItem>
    </MotionAccordionItemContext.Provider>
  );
}

/** The item's toggle button (the DuskUI AccordionTrigger with a rotating chevron). */
export function MotionAccordionTrigger({ className, ...props }: React.ComponentProps<typeof AccordionTrigger>) {
  return <AccordionTrigger className={cn("text-[0.9375rem]", className)} {...props} />;
}

const panel = (instant: boolean): Variants => ({
  open: { height: "auto", transition: instant ? { duration: 0 } : { type: "spring", bounce: 0, duration: 0.3 } },
  closed: { height: 0, transition: instant ? { duration: 0 } : { type: "spring", bounce: 0, duration: 0.25 } },
});

const inner: Variants = {
  open: { opacity: 1, y: 0, transition: { duration: 0.2, delay: 0.05, ease: "easeOut" } },
  closed: { opacity: 0, y: -4, transition: { duration: 0.15 } },
};

/** The panel. Animates its height and fades its content. `className` styles the inner wrapper. */
export function MotionAccordionContent({
  className,
  children,
  ...props
}: Omit<React.ComponentProps<typeof AccordionPrimitive.Content>, "forceMount" | "asChild">) {
  const item = React.useContext(MotionAccordionItemContext);
  if (!item) throw new Error("MotionAccordionContent must be used inside <MotionAccordionItem>.");
  const reduceMotion = useReducedMotion();
  const state = item.open ? "open" : "closed";

  return (
    <AccordionPrimitive.Content forceMount asChild {...props}>
      <motion.div
        data-slot="accordion-content"
        initial={false}
        animate={state}
        variants={panel(!!reduceMotion)}
        // Closed panels stay mounted for the animation; inert hides them from focus and assistive tech.
        inert={!item.open}
        className="overflow-hidden text-sm"
      >
        <motion.div
          variants={inner}
          className={cn("pb-4 leading-relaxed text-muted-foreground", className)}
        >
          {children}
        </motion.div>
      </motion.div>
    </AccordionPrimitive.Content>
  );
}
