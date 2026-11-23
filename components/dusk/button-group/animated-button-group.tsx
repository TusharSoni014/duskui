"use client";

import * as React from "react";
import { LayoutGroup, motion, useReducedMotion, type Transition } from "motion/react";

import { buttonVariants } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { cn } from "@/lib/utils";

export interface AnimatedButtonGroupOption {
  value: string;
  /** Visible label. Omit for an icon-only segment, but then set `aria-label`. */
  label?: React.ReactNode;
  icon?: React.ReactNode;
  "aria-label"?: string;
  disabled?: boolean;
}

export interface AnimatedButtonGroupProps
  extends Omit<React.ComponentProps<"div">, "onChange" | "defaultValue" | "dir"> {
  options: AnimatedButtonGroupOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** Form field name. The selected value is submitted with a hidden input. */
  name?: string;
  size?: "sm" | "default" | "lg";
  orientation?: "horizontal" | "vertical";
  disabled?: boolean;
}

const indicatorSpring: Transition = { type: "spring", bounce: 0.18, duration: 0.42 };

const iconSizes = { sm: "icon-sm", default: "icon", lg: "icon-lg" } as const;

/**
 * Joined outline buttons where the selected one is lit by a mint indicator
 * that slides between segments on a spring. It behaves like a radio group:
 * one Tab stop, arrow keys (and Home / End) move and select, and the value
 * can be submitted with a form. Under reduced motion the indicator jumps.
 */
export function AnimatedButtonGroup({
  options,
  value: valueProp,
  defaultValue,
  onValueChange,
  name,
  size = "default",
  orientation = "horizontal",
  disabled = false,
  className,
  ...props
}: AnimatedButtonGroupProps) {
  const id = React.useId();
  const reduceMotion = useReducedMotion() ?? false;
  const refs = React.useRef<Array<HTMLButtonElement | null>>([]);
  const [uncontrolled, setUncontrolled] = React.useState(defaultValue ?? options[0]?.value ?? "");
  const value = valueProp ?? uncontrolled;

  const select = (next: string) => {
    if (next === value) return;
    if (valueProp === undefined) setUncontrolled(next);
    onValueChange?.(next);
  };

  const enabled = options.map((option, index) => ({ option, index })).filter(({ option }) => !option.disabled);

  const onKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    const prevKeys = orientation === "vertical" ? ["ArrowUp"] : ["ArrowLeft", "ArrowUp"];
    const nextKeys = orientation === "vertical" ? ["ArrowDown"] : ["ArrowRight", "ArrowDown"];
    const position = enabled.findIndex((entry) => entry.index === index);
    let target: number | undefined;
    if (nextKeys.includes(event.key)) target = enabled[(position + 1) % enabled.length]?.index;
    else if (prevKeys.includes(event.key)) target = enabled[(position - 1 + enabled.length) % enabled.length]?.index;
    else if (event.key === "Home") target = enabled[0]?.index;
    else if (event.key === "End") target = enabled[enabled.length - 1]?.index;
    if (target === undefined) return;
    event.preventDefault();
    refs.current[target]?.focus();
    select(options[target].value);
  };

  const hasSelection = options.some((option) => option.value === value && !option.disabled);

  return (
    <LayoutGroup id={id}>
      <ButtonGroup
        role="radiogroup"
        aria-orientation={orientation}
        aria-disabled={disabled || undefined}
        orientation={orientation}
        className={cn(disabled && "pointer-events-none opacity-50", className)}
        {...props}
      >
        {options.map((option, index) => {
          const checked = option.value === value;
          const iconOnly = !option.label;
          const tabbable = hasSelection ? checked : index === enabled[0]?.index;
          return (
            <button
              key={option.value}
              ref={(node) => {
                refs.current[index] = node;
              }}
              type="button"
              role="radio"
              aria-checked={checked}
              aria-label={option["aria-label"]}
              data-slot="button"
              data-state={checked ? "on" : "off"}
              disabled={disabled || option.disabled}
              tabIndex={tabbable ? 0 : -1}
              onClick={() => select(option.value)}
              onKeyDown={(event) => onKeyDown(event, index)}
              className={cn(
                buttonVariants({ variant: "outline", size: iconOnly ? iconSizes[size] : size }),
                "text-muted-foreground hover:bg-accent/60 data-[state=on]:text-primary dark:hover:bg-input/45",
                "data-[state=on]:hover:bg-transparent dark:data-[state=on]:hover:bg-input/30"
              )}
            >
              {checked && (
                <motion.span
                  aria-hidden
                  layoutId="indicator"
                  transition={reduceMotion ? { duration: 0 } : indicatorSpring}
                  className="pointer-events-none absolute inset-0 rounded-[inherit] bg-primary/10 shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--color-primary)_55%,transparent),0_0_18px_-6px_var(--color-primary)]"
                />
              )}
              <span className="relative z-[1] inline-flex items-center gap-2">
                {option.icon}
                {option.label}
              </span>
            </button>
          );
        })}
      </ButtonGroup>
      {name && <input type="hidden" name={name} value={value} />}
    </LayoutGroup>
  );
}
