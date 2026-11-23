"use client";

import * as React from "react";
import { AnimatePresence, LayoutGroup, motion, useReducedMotion, type Transition } from "motion/react";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";

const pillSpring: Transition = { type: "spring", bounce: 0.22, duration: 0.45 };

type Size = "sm" | "default" | "lg";

type AnimatedToggleGroupContextValue = {
  type: "single" | "multiple";
  selected: string[];
  size: Size;
  layoutId: string;
  reduceMotion: boolean;
};

const AnimatedToggleGroupContext = React.createContext<AnimatedToggleGroupContextValue | null>(null);

function useAnimatedToggleGroup() {
  const context = React.useContext(AnimatedToggleGroupContext);
  if (!context) throw new Error("AnimatedToggleGroupItem must be used inside <AnimatedToggleGroup>.");
  return context;
}

type BaseProps = Omit<
  React.ComponentProps<typeof ToggleGroup>,
  "type" | "value" | "defaultValue" | "onValueChange" | "variant" | "spacing"
> & {
  size?: Size;
};

type SingleProps = BaseProps & {
  type: "single";
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
};

type MultipleProps = BaseProps & {
  type: "multiple";
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
};

export type AnimatedToggleGroupProps = SingleProps | MultipleProps;

const toArray = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value : value ? [value] : [];

/**
 * A toggle group on a recessed track. With `type="single"` one glowing pill
 * glides to the pressed item (a shared Motion `layoutId`); with
 * `type="multiple"` every pressed item gets its own pill that springs in and
 * shrinks away. Built on the DuskUI Toggle Group (Radix), so arrow keys move
 * focus, Space / Enter toggle and the state is exposed with aria-pressed (or
 * aria-checked for single). Under reduced motion the pills appear instantly.
 */
export function AnimatedToggleGroup(props: AnimatedToggleGroupProps) {
  const { type, value: valueProp, defaultValue, onValueChange, size = "default", className, children, ...rest } = props;
  const id = React.useId();
  const reduceMotion = useReducedMotion() ?? false;
  const [uncontrolled, setUncontrolled] = React.useState<string[]>(() => toArray(defaultValue));
  const selected = valueProp !== undefined ? toArray(valueProp) : uncontrolled;

  const handleChange = (next: string | string[]) => {
    if (valueProp === undefined) setUncontrolled(toArray(next));
    (onValueChange as ((value: string | string[]) => void) | undefined)?.(next);
  };

  const context = { type, selected, size, layoutId: `${id}-pill`, reduceMotion };

  const groupProps =
    type === "single"
      ? { type, value: selected[0] ?? "", onValueChange: handleChange }
      : { type, value: selected, onValueChange: handleChange };

  return (
    <AnimatedToggleGroupContext.Provider value={context}>
      <LayoutGroup id={id}>
        <ToggleGroup
          {...groupProps}
          size={size}
          spacing={1}
          className={cn(
            "relative isolate rounded-lg bg-muted p-1 shadow-[inset_0_1px_2px_rgb(0_0_0/0.35)]",
            className
          )}
          {...rest}
        >
          {children}
        </ToggleGroup>
      </LayoutGroup>
    </AnimatedToggleGroupContext.Provider>
  );
}

const itemSizes: Record<Size, string> = {
  sm: "h-7 min-w-7 px-2 text-xs",
  default: "h-8 min-w-8 px-2.5",
  lg: "h-9 min-w-9 px-3",
};

/** One toggle. Children are its label and/or icon; give icon-only items an aria-label. */
export function AnimatedToggleGroupItem({
  value,
  className,
  children,
  ...props
}: React.ComponentProps<typeof ToggleGroupItem>) {
  const { type, selected, size, layoutId, reduceMotion } = useAnimatedToggleGroup();
  const on = selected.includes(value);
  const pillClass =
    "pointer-events-none absolute inset-0 -z-10 rounded-md bg-primary/12 shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--color-primary)_35%,transparent),0_0_18px_-6px_var(--color-primary)]";

  return (
    <ToggleGroupItem
      value={value}
      className={cn(
        "group/item relative isolate rounded-md border-0 shadow-none active:scale-[0.94]",
        // The pill replaces the base "on" surface.
        "hover:bg-white/[0.04] data-[state=on]:bg-transparent data-[state=on]:text-primary data-[state=on]:shadow-none data-[state=on]:hover:bg-transparent",
        "data-[state=on]:[&_svg:not([class*='text-'])]:text-primary",
        itemSizes[size],
        className
      )}
      {...props}
    >
      {type === "single" ? (
        on && (
          <motion.span
            aria-hidden
            layoutId={layoutId}
            transition={reduceMotion ? { duration: 0 } : pillSpring}
            className={pillClass}
          />
        )
      ) : (
        <AnimatePresence initial={false}>
          {on && (
            <motion.span
              key="pill"
              aria-hidden
              initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={reduceMotion ? { opacity: 0, transition: { duration: 0.1 } } : { opacity: 0, scale: 0.7, transition: { duration: 0.15 } }}
              transition={reduceMotion ? { duration: 0.1 } : { type: "spring", bounce: 0.35, duration: 0.4 }}
              className={pillClass}
            />
          )}
        </AnimatePresence>
      )}
      {children}
    </ToggleGroupItem>
  );
}
