"use client";

import * as React from "react";
import { motion, useReducedMotion } from "motion/react";

import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

type CheckedState = boolean | "indeterminate";

export interface CheckboxCardProps
  extends Omit<React.ComponentProps<typeof Checkbox>, "children" | "title" | "checked" | "defaultChecked"> {
  checked?: CheckedState;
  defaultChecked?: CheckedState;
  title: React.ReactNode;
  description?: React.ReactNode;
  /** Leading icon element. */
  icon?: React.ReactNode;
  /** Extra content under the description (price, badges…). */
  children?: React.ReactNode;
  /** Classes for the card (the `<label>`). `className` styles the checkbox. */
  containerClassName?: string;
}

/**
 * A selectable card for plans, add-ons or multi-select options. Selecting it
 * traces a mint outline around the card (an SVG rect drawn with `pathLength`),
 * tints the surface, lifts the icon and draws the check. The whole card is
 * the click target, while the checkbox inside keeps Radix semantics, so it is
 * announced as one checkbox named by the title and described by the text.
 */
export function CheckboxCard({
  checked: checkedProp,
  defaultChecked = false,
  onCheckedChange,
  title,
  description,
  icon,
  children,
  id,
  disabled,
  className,
  containerClassName,
  ...props
}: CheckboxCardProps) {
  const autoId = React.useId();
  const checkboxId = id ?? autoId;
  const reduceMotion = useReducedMotion();
  const [uncontrolled, setUncontrolled] = React.useState<CheckedState>(defaultChecked);
  const checked = checkedProp ?? uncontrolled;
  const selected = checked !== false;

  return (
    <motion.label
      htmlFor={checkboxId}
      data-slot="checkbox-card"
      data-state={checked === true ? "checked" : checked === "indeterminate" ? "indeterminate" : "unchecked"}
      data-disabled={disabled || undefined}
      whileTap={disabled ? undefined : { scale: 0.985 }}
      transition={{ type: "spring", bounce: 0.3, duration: 0.3 }}
      className={cn(
        "group/card relative isolate flex cursor-pointer items-start gap-3 rounded-xl border bg-card p-4 select-none",
        "shadow-[inset_0_1px_0_rgb(255_255_255/0.04),0_1px_2px_rgb(0_0_0/0.3)]",
        "transition-[background-color,border-color,box-shadow] duration-300 ease-out motion-reduce:transition-none",
        "hover:border-white/20",
        "has-focus-visible:ring-[3px] has-focus-visible:ring-ring/40",
        "data-[state=checked]:bg-primary/[0.04] data-[state=indeterminate]:bg-primary/[0.04]",
        "data-[state=checked]:shadow-[inset_0_1px_0_rgb(255_255_255/0.05),0_0_32px_-16px_var(--color-primary)]",
        "data-disabled:cursor-not-allowed data-disabled:opacity-50 data-disabled:hover:border-border",
        containerClassName
      )}
    >
      {/* The outline that traces itself around the card. Sits on the 1px border. */}
      <svg
        aria-hidden
        className="pointer-events-none absolute -top-[0.5px] -left-[0.5px] size-[calc(100%+1px)] overflow-visible"
      >
        <motion.rect
          width="100%"
          height="100%"
          rx="13.5"
          fill="none"
          stroke="var(--color-primary)"
          strokeWidth={1.5}
          initial={false}
          animate={{ pathLength: selected ? 1 : 0, opacity: selected ? 1 : 0 }}
          transition={
            reduceMotion
              ? { duration: 0 }
              : selected
                ? { pathLength: { duration: 0.6, ease: [0.65, 0, 0.35, 1] }, opacity: { duration: 0.1 } }
                : { pathLength: { duration: 0.3, ease: "easeIn" }, opacity: { duration: 0.2, delay: 0.15 } }
          }
        />
      </svg>

      {icon && (
        <span
          aria-hidden
          className={cn(
            "grid size-9 shrink-0 place-items-center rounded-lg border border-white/10 bg-white/[0.03] text-muted-foreground",
            "transition-[color,background-color,border-color,translate,box-shadow] duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] motion-reduce:transition-none",
            "group-data-[state=checked]/card:-translate-y-0.5 group-data-[state=checked]/card:border-primary/30",
            "group-data-[state=checked]/card:bg-primary/10 group-data-[state=checked]/card:text-primary",
            "group-data-[state=checked]/card:shadow-[0_6px_16px_-8px_var(--color-primary)]",
            "motion-reduce:group-data-[state=checked]/card:translate-y-0",
            "[&_svg:not([class*='size-'])]:size-4"
          )}
        >
          {icon}
        </span>
      )}

      <span className="grid min-w-0 flex-1 gap-1">
        <span id={`${checkboxId}-title`} className="text-sm leading-5 font-medium">
          {title}
        </span>
        {description && (
          <span id={`${checkboxId}-description`} className="text-sm text-muted-foreground">
            {description}
          </span>
        )}
        {children}
      </span>

      <Checkbox
        id={checkboxId}
        checked={checked}
        disabled={disabled}
        aria-labelledby={`${checkboxId}-title`}
        aria-describedby={description ? `${checkboxId}-description` : undefined}
        onCheckedChange={(next) => {
          if (checkedProp === undefined) setUncontrolled(next);
          onCheckedChange?.(next);
        }}
        className={cn("mt-0.5 size-[1.125rem] rounded-full", className)}
        {...props}
      />
    </motion.label>
  );
}
