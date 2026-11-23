"use client";

import * as React from "react";
import { LayoutGroup, motion, type Transition } from "motion/react";

import { cn } from "@/lib/utils";

export interface SegmentedControlOption {
  value: string;
  label: React.ReactNode;
  /** Optional leading icon element, e.g. `<List />`. */
  icon?: React.ReactNode;
  disabled?: boolean;
}

export interface SegmentedControlProps
  extends Omit<React.ComponentProps<"div">, "onChange" | "defaultValue" | "dir"> {
  options: SegmentedControlOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** Form field name. The selected value is submitted with the form. */
  name?: string;
  size?: "sm" | "default" | "lg";
  disabled?: boolean;
  /** Stretch to the container's width with equal segments. */
  fullWidth?: boolean;
}

const thumbSpring: Transition = { type: "spring", bounce: 0.22, duration: 0.45 };

const sizes = {
  sm: "h-7 px-2.5 text-xs gap-1 [&_svg:not([class*='size-'])]:size-3.5",
  default: "h-8 px-3 text-sm gap-1.5 [&_svg:not([class*='size-'])]:size-4",
  lg: "h-10 px-4 text-sm gap-2 [&_svg:not([class*='size-'])]:size-4",
} as const;

/**
 * An iOS-style segmented control: a raised thumb springs between options.
 * It is a real radio group (native `<input type="radio">`), so arrow keys,
 * form submission and screen readers work without extra code. Use it to pick
 * a value (view mode, billing period, units); use Animated Tabs to switch panels.
 */
export function SegmentedControl({
  options,
  value: valueProp,
  defaultValue,
  onValueChange,
  name,
  size = "default",
  disabled = false,
  fullWidth = false,
  className,
  ...props
}: SegmentedControlProps) {
  const id = React.useId();
  const [uncontrolled, setUncontrolled] = React.useState(defaultValue ?? options[0]?.value ?? "");
  const value = valueProp ?? uncontrolled;

  const select = (next: string) => {
    if (valueProp === undefined) setUncontrolled(next);
    onValueChange?.(next);
  };

  return (
    <LayoutGroup id={id}>
      <div
        role="radiogroup"
        aria-disabled={disabled || undefined}
        data-slot="segmented-control"
        className={cn(
          "relative isolate inline-flex w-fit items-center rounded-lg bg-muted p-1 shadow-[inset_0_1px_2px_rgb(0_0_0/0.35)]",
          fullWidth && "flex w-full",
          disabled && "opacity-50",
          className
        )}
        {...props}
      >
        {options.map((option) => {
          const checked = option.value === value;
          const isDisabled = disabled || option.disabled;
          return (
            <label
              key={option.value}
              data-state={checked ? "checked" : "unchecked"}
              className={cn(
                "relative inline-flex cursor-pointer items-center justify-center whitespace-nowrap rounded-md font-medium text-muted-foreground select-none",
                "transition-[color,box-shadow] duration-200 ease-out motion-reduce:transition-none",
                "hover:text-foreground data-[state=checked]:text-foreground",
                "has-focus-visible:ring-[3px] has-focus-visible:ring-ring/50",
                "has-disabled:cursor-not-allowed has-disabled:opacity-50 has-disabled:hover:text-muted-foreground",
                "[&_svg]:pointer-events-none [&_svg]:shrink-0",
                sizes[size],
                fullWidth && "flex-1"
              )}
            >
              <input
                type="radio"
                name={name ?? id}
                value={option.value}
                checked={checked}
                disabled={isDisabled}
                onChange={() => select(option.value)}
                className="sr-only"
              />
              {checked && (
                <motion.span
                  layoutId="segmented-thumb"
                  aria-hidden
                  transition={thumbSpring}
                  className="pointer-events-none absolute inset-0 -z-10 rounded-md border border-white/10 bg-background shadow-[inset_0_1px_0_rgb(255_255_255/0.06),0_2px_6px_-1px_rgb(0_0_0/0.5)]"
                />
              )}
              {option.icon}
              <span>{option.label}</span>
            </label>
          );
        })}
      </div>
    </LayoutGroup>
  );
}
