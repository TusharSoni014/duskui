"use client";

import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";

import { cn } from "@/lib/utils";

/**
 * DuskUI Checkbox — a drop-in upgrade of the shadcn/ui Checkbox.
 *
 * Same API and data-slot attributes as shadcn plus:
 * - The check mark draws itself (SVG `pathLength` + stroke-dashoffset) and
 *   erases faster than it draws.
 * - `checked="indeterminate"` draws a dash instead of a check.
 * - A smooth fill transition.
 * - Still works uncontrolled, in forms and with form reset (pure CSS, no
 *   extra React state).
 * - Under `prefers-reduced-motion` the mark appears instantly.
 * Powered by Radix for keyboard support, form submission and aria.
 */
function Checkbox({ className, ...props }: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        "peer group/checkbox relative grid size-4 shrink-0 place-items-center rounded-[4px] border border-input bg-input/30 shadow-xs outline-none",
        "transition-[background-color,border-color,box-shadow] duration-150 ease-out motion-reduce:transition-none",
        "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
        "aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "data-[state=checked]:border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
        "data-[state=indeterminate]:border-primary data-[state=indeterminate]:bg-primary data-[state=indeterminate]:text-primary-foreground",
        className
      )}
      {...props}
    >
      {/* forceMount keeps the SVG in the DOM so the mark can animate out as well as in. */}
      <CheckboxPrimitive.Indicator
        forceMount
        data-slot="checkbox-indicator"
        className="pointer-events-none grid place-content-center text-current"
      >
        <svg
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.25}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="size-3.5"
          aria-hidden
        >
          <path
            d="M3.5 8.5l3 3 6-7"
            pathLength={1}
            className={cn(
              "opacity-0 [stroke-dasharray:1] [stroke-dashoffset:1]",
              "transition-[stroke-dashoffset,opacity] duration-100 ease-in",
              "group-data-[state=checked]/checkbox:opacity-100 group-data-[state=checked]/checkbox:[stroke-dashoffset:0]",
              "group-data-[state=checked]/checkbox:delay-75 group-data-[state=checked]/checkbox:duration-250 group-data-[state=checked]/checkbox:ease-out",
              "motion-reduce:transition-none"
            )}
          />
          <path
            d="M4 8h8"
            pathLength={1}
            className={cn(
              "opacity-0 [stroke-dasharray:1] [stroke-dashoffset:1]",
              "transition-[stroke-dashoffset,opacity] duration-100 ease-in",
              "group-data-[state=indeterminate]/checkbox:opacity-100 group-data-[state=indeterminate]/checkbox:[stroke-dashoffset:0]",
              "group-data-[state=indeterminate]/checkbox:delay-75 group-data-[state=indeterminate]/checkbox:duration-200 group-data-[state=indeterminate]/checkbox:ease-out",
              "motion-reduce:transition-none"
            )}
          />
        </svg>
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}

export { Checkbox };
