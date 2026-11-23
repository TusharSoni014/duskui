"use client";

import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import {
  AnimatePresence,
  LayoutGroup,
  motion,
  useReducedMotion,
  type Transition,
  type Variants,
} from "motion/react";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

type Indicator = "pill" | "underline";

type AnimatedTabsContextValue = {
  value: string;
  /** -1 when moving to a trigger on the left, 1 to the right, 0 initially. */
  direction: number;
  indicator: Indicator;
};

const AnimatedTabsContext = React.createContext<AnimatedTabsContextValue | null>(null);

function useAnimatedTabs() {
  const context = React.useContext(AnimatedTabsContext);
  if (!context) throw new Error("AnimatedTabs parts must be used inside <AnimatedTabs>.");
  return context;
}

const indicatorSpring: Transition = { type: "spring", bounce: 0.2, duration: 0.5 };
const panelSpring: Transition = { type: "spring", bounce: 0, duration: 0.4 };

export interface AnimatedTabsProps
  extends Omit<React.ComponentProps<typeof Tabs>, "value" | "defaultValue" | "onValueChange"> {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** Shape of the active indicator that glides between triggers. */
  indicator?: Indicator;
}

/**
 * Tabs with a mint indicator (pill or underline) that glides between triggers
 * and panels that slide in from the direction you're travelling. The panel
 * area springs to the new height, so content below never jumps.
 *
 * Compose it like shadcn Tabs: AnimatedTabs › AnimatedTabsList ›
 * AnimatedTabsTrigger, then AnimatedTabsPanels › AnimatedTabsContent.
 * Built on the DuskUI Tabs (Radix), so arrow keys, Home/End and aria work as usual.
 */
export function AnimatedTabs({
  value: valueProp,
  defaultValue = "",
  onValueChange,
  indicator = "pill",
  children,
  ...props
}: AnimatedTabsProps) {
  const layoutId = React.useId();
  const rootRef = React.useRef<HTMLDivElement>(null);
  const [uncontrolled, setUncontrolled] = React.useState(defaultValue);
  const [direction, setDirection] = React.useState(0);
  const value = valueProp ?? uncontrolled;

  const handleValueChange = (next: string) => {
    // Direction comes from the triggers' DOM order, so any markup works.
    const root = rootRef.current;
    const order = Array.from(root?.querySelectorAll<HTMLElement>("[data-animated-tab]") ?? [])
      .filter((el) => el.closest('[data-slot="tabs"]') === root)
      .map((el) => el.dataset.animatedTab);
    setDirection(Math.sign(order.indexOf(next) - order.indexOf(value)));
    if (valueProp === undefined) setUncontrolled(next);
    onValueChange?.(next);
  };

  return (
    <AnimatedTabsContext.Provider value={{ value, direction, indicator }}>
      <LayoutGroup id={layoutId}>
        <Tabs ref={rootRef} value={value} onValueChange={handleValueChange} {...props}>
          {children}
        </Tabs>
      </LayoutGroup>
    </AnimatedTabsContext.Provider>
  );
}

/** The trigger row. Inherits the indicator style from AnimatedTabs. */
export function AnimatedTabsList({ className, ...props }: React.ComponentProps<typeof TabsList>) {
  const { indicator } = useAnimatedTabs();
  return (
    <TabsList
      variant={indicator === "underline" ? "line" : "default"}
      className={cn(indicator === "pill" && "h-10 bg-muted/70 p-1", className)}
      {...props}
    />
  );
}

/** A trigger. The indicator is rendered inside the active one and glides via a shared layoutId. */
export function AnimatedTabsTrigger({
  value,
  className,
  children,
  ...props
}: React.ComponentProps<typeof TabsTrigger>) {
  const { value: active, indicator } = useAnimatedTabs();
  const isActive = active === value;

  return (
    <TabsTrigger
      value={value}
      data-animated-tab={value}
      className={cn(
        // Replace the base active surface / underline with the moving indicator.
        "isolate data-[state=active]:border-transparent data-[state=active]:bg-transparent data-[state=active]:shadow-none after:hidden",
        indicator === "pill" ? "px-3 data-[state=active]:text-primary" : "px-3 data-[state=active]:text-foreground",
        className
      )}
      {...props}
    >
      {isActive && (
        <motion.span
          layoutId="animated-tabs-indicator"
          aria-hidden
          transition={indicatorSpring}
          className={cn(
            "pointer-events-none absolute -z-10",
            indicator === "pill"
              ? "inset-0 rounded-md bg-primary/12 shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--color-primary)_35%,transparent),0_0_18px_-6px_var(--color-primary)]"
              : "inset-x-1.5 -bottom-px h-0.5 rounded-full bg-primary shadow-[0_0_10px_var(--color-primary)]"
          )}
        />
      )}
      {children}
    </TabsTrigger>
  );
}

/**
 * Wraps the panels. Stacks them in one grid cell so the outgoing and incoming
 * panels can cross, and springs its height to the active panel.
 */
export function AnimatedTabsPanels({ className, children, ...props }: React.ComponentProps<"div">) {
  const reduceMotion = useReducedMotion();
  const innerRef = React.useRef<HTMLDivElement>(null);
  const [height, setHeight] = React.useState<number | "auto">("auto");

  React.useLayoutEffect(() => {
    const el = innerRef.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) =>
      setHeight(entry.borderBoxSize?.[0]?.blockSize ?? el.offsetHeight)
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <motion.div
      data-slot="animated-tabs-panels"
      initial={false}
      animate={{ height }}
      transition={reduceMotion ? { duration: 0 } : panelSpring}
      className={cn("relative", className)}
      {...(props as React.ComponentProps<typeof motion.div>)}
    >
      <div ref={innerRef} className="grid *:col-start-1 *:row-start-1">
        {children}
      </div>
    </motion.div>
  );
}

/** A panel. Slides and un-blurs in from the side of travel; the old panel leaves the other way. */
export function AnimatedTabsContent({
  value,
  className,
  children,
  ...props
}: Omit<React.ComponentProps<typeof TabsPrimitive.Content>, "forceMount" | "asChild">) {
  const { value: active, direction } = useAnimatedTabs();
  const reduceMotion = useReducedMotion();
  const offset = reduceMotion ? 0 : 28;

  const variants: Variants = {
    enter: (dir: number) => ({ opacity: 0, x: dir * offset, filter: "blur(4px)" }),
    center: { opacity: 1, x: 0, filter: "blur(0px)", transitionEnd: { filter: "none" } },
    exit: (dir: number) => ({ opacity: 0, x: dir * -offset, filter: "blur(4px)" }),
  };

  return (
    <AnimatePresence initial={false} custom={direction}>
      {active === value && (
        <TabsPrimitive.Content key={value} value={value} forceMount asChild {...props}>
          <motion.div
            data-slot="tabs-content"
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={panelSpring}
            className={cn(
              "rounded-md outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50",
              // The outgoing panel stays visible for a moment; keep it from catching clicks.
              "data-[state=inactive]:pointer-events-none",
              className
            )}
          >
            {children}
          </motion.div>
        </TabsPrimitive.Content>
      )}
    </AnimatePresence>
  );
}
