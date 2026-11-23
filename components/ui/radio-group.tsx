"use client";

import * as React from "react";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";

import { cn } from "@/lib/utils";

/**
 * DuskUI Radio Group — a drop-in upgrade of the shadcn/ui Radio Group.
 *
 * Same parts, props and data-slot attributes as shadcn (RadioGroup,
 * RadioGroupItem) plus:
 * - The dot scales in quickly (CSS only, no overshoot) and shrinks away when
 *   another option is picked.
 * - The ring turns mint when checked.
 * - Works uncontrolled, in forms and with form reset (pure CSS, no extra state).
 * - Under `prefers-reduced-motion` the dot appears instantly.
 * Powered by Radix for roving focus (arrow keys), form submission and aria.
 */
function RadioGroup({ className, ...props }: React.ComponentProps<typeof RadioGroupPrimitive.Root>) {
  return (
    <RadioGroupPrimitive.Root
      data-slot="radio-group"
      className={cn("grid gap-3", className)}
      {...props}
    />
  );
}

/** One option. Pair it with a `<label htmlFor>` so the text is clickable and announced. */
function RadioGroupItem({ className, ...props }: React.ComponentProps<typeof RadioGroupPrimitive.Item>) {
  return (
    <RadioGroupPrimitive.Item
      data-slot="radio-group-item"
      className={cn(
        "peer group/radio relative grid aspect-square size-4 shrink-0 place-items-center rounded-full border border-input bg-input/30 text-primary shadow-xs outline-none",
        "transition-[border-color,box-shadow] duration-150 ease-out motion-reduce:transition-none",
        "data-[state=checked]:border-primary",
        "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
        "aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      {/* forceMount keeps the dot in the DOM so it can shrink away as well as scale in. */}
      <RadioGroupPrimitive.Indicator
        forceMount
        data-slot="radio-group-indicator"
        className="pointer-events-none grid place-items-center"
      >
        <span
          aria-hidden
          className={cn(
            "block size-2 rounded-full bg-current",
            "scale-0 opacity-0 group-data-[state=checked]/radio:scale-100 group-data-[state=checked]/radio:opacity-100",
            // Out: quick ease-in. In: short ease-out, no overshoot.
            "[transition:scale_120ms_ease-in,opacity_120ms_ease-in]",
            "group-data-[state=checked]/radio:[transition:scale_180ms_ease-out,opacity_150ms_ease-out]",
            "motion-reduce:transition-none motion-reduce:group-data-[state=checked]/radio:transition-none"
          )}
        />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  );
}

export { RadioGroup, RadioGroupItem };
