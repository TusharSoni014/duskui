"use client";

import * as React from "react";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { LayoutGroup, motion, useReducedMotion, type Transition } from "motion/react";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";

const outlineSpring: Transition = { type: "spring", bounce: 0.1, duration: 0.3 };

type RadioCardsContextValue = { value: string; layoutId: string; reduceMotion: boolean };

const RadioCardsContext = React.createContext<RadioCardsContextValue | null>(null);

function useRadioCards() {
  const context = React.useContext(RadioCardsContext);
  if (!context) throw new Error("RadioCard must be used inside <RadioCards>.");
  return context;
}

export interface RadioCardsProps
  extends Omit<React.ComponentProps<typeof RadioGroupPrimitive.Root>, "value" | "defaultValue" | "onValueChange"> {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
}

/**
 * Selectable cards for plans, shipping speeds or any one-of-many choice. A
 * 1px primary outline glides from card to card (a shared Motion `layoutId`).
 * It is a Radix radio group underneath,
 * so arrow keys move the selection, the value submits with forms via `name`
 * and each card is announced as a radio named by its title. Lay the cards out
 * with `className` (it is a CSS grid). Under reduced motion the outline jumps.
 */
export function RadioCards({
  value: valueProp,
  defaultValue = "",
  onValueChange,
  className,
  children,
  ...props
}: RadioCardsProps) {
  const id = React.useId();
  const reduceMotion = useReducedMotion() ?? false;
  const [uncontrolled, setUncontrolled] = React.useState(defaultValue);
  const value = valueProp ?? uncontrolled;

  const context = React.useMemo(
    () => ({ value, layoutId: `${id}-outline`, reduceMotion }),
    [value, id, reduceMotion]
  );

  return (
    <RadioCardsContext.Provider value={context}>
      <LayoutGroup id={id}>
        <RadioGroup
          value={value}
          onValueChange={(next) => {
            if (valueProp === undefined) setUncontrolled(next);
            onValueChange?.(next);
          }}
          className={cn("grid gap-3", className)}
          {...props}
        >
          {children}
        </RadioGroup>
      </LayoutGroup>
    </RadioCardsContext.Provider>
  );
}

export interface RadioCardProps
  extends Omit<React.ComponentProps<typeof RadioGroupPrimitive.Item>, "children" | "title"> {
  value: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  /** Leading icon element. */
  icon?: React.ReactNode;
  /** Content on the right of the title, e.g. a price. */
  aside?: React.ReactNode;
  /** Extra content under the description (features, badges…). */
  children?: React.ReactNode;
  /** Classes for the card (the `<label>`). `className` styles the radio. */
  containerClassName?: string;
}

/** One card. The whole card is the click target; the radio inside keeps Radix semantics. */
export function RadioCard({
  value,
  title,
  description,
  icon,
  aside,
  children,
  id,
  disabled,
  className,
  containerClassName,
  ...props
}: RadioCardProps) {
  const autoId = React.useId();
  const radioId = id ?? autoId;
  const { value: selected, layoutId, reduceMotion } = useRadioCards();
  const checked = selected === value;

  return (
    <label
      htmlFor={radioId}
      data-slot="radio-card"
      data-state={checked ? "checked" : "unchecked"}
      data-disabled={disabled || undefined}
      className={cn(
        "group/card relative isolate flex cursor-pointer items-start gap-3 rounded-xl border bg-card p-4 select-none",
        "shadow-xs",
        "transition-[background-color,border-color] duration-150 ease-out motion-reduce:transition-none",
        "hover:bg-accent/50 data-[state=checked]:border-transparent",
        "has-focus-visible:ring-[3px] has-focus-visible:ring-ring/40",
        "data-disabled:cursor-not-allowed data-disabled:opacity-50 data-disabled:hover:border-border",
        containerClassName
      )}
    >
      {checked && (
        <motion.span
          aria-hidden
          layoutId={layoutId}
          transition={reduceMotion ? { duration: 0 } : outlineSpring}
          className="pointer-events-none absolute -inset-px -z-10 rounded-xl border border-primary"
        />
      )}

      {icon && (
        <span
          aria-hidden
          className={cn(
            "grid size-9 shrink-0 place-items-center rounded-md border border-white/10 bg-white/[0.03] text-muted-foreground",
            "transition-colors duration-150 motion-reduce:transition-none",
            "group-data-[state=checked]/card:text-foreground",
            "[&_svg:not([class*='size-'])]:size-4"
          )}
        >
          {icon}
        </span>
      )}

      <span className="grid min-w-0 flex-1 gap-1">
        <span className="flex items-baseline justify-between gap-3">
          <span id={`${radioId}-title`} className="text-sm leading-5 font-medium">
            {title}
          </span>
          {aside && (
            <span className="shrink-0 text-sm font-medium tabular-nums">
              {aside}
            </span>
          )}
        </span>
        {description && (
          <span id={`${radioId}-description`} className="text-sm text-muted-foreground">
            {description}
          </span>
        )}
        {children}
      </span>

      <RadioGroupItem
        id={radioId}
        value={value}
        disabled={disabled}
        aria-labelledby={`${radioId}-title`}
        aria-describedby={description ? `${radioId}-description` : undefined}
        className={cn("mt-0.5 size-[1.125rem] [&_[data-slot=radio-group-indicator]>span]:size-2.5", className)}
        {...props}
      />
    </label>
  );
}
