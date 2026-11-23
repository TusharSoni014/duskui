"use client";

import * as React from "react";
import * as SwitchPrimitive from "@radix-ui/react-switch";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/**
 * DuskUI Switch — a drop-in upgrade of the shadcn/ui Switch.
 *
 * Same API and data-slot attributes as shadcn plus:
 * - The thumb slides with a short ease-out (CSS only, no overshoot) and the
 *   track turns mint when on.
 * - `size`: sm, default, lg.
 * - `thumbContent`: render an icon or spinner inside the thumb.
 * - `thumbClassName`: style the thumb without forking the component.
 * - RTL aware; under `prefers-reduced-motion` the thumb moves instantly.
 * Powered by Radix for keyboard support, form submission and aria.
 */
const switchVariants = cva(
  [
    // border-2 + thumb = half the inner width, so the thumb travels exactly 100% of its size.
    "peer group/switch relative inline-flex shrink-0 items-center rounded-full border-2 border-transparent outline-none",
    "shadow-xs transition-[background-color,box-shadow] duration-150 ease-out motion-reduce:transition-none",
    "data-[state=unchecked]:bg-input data-[state=unchecked]:hover:bg-white/18",
    "data-[state=checked]:bg-primary",
    "focus-visible:ring-[3px] focus-visible:ring-ring/50",
    "aria-invalid:ring-[3px] aria-invalid:ring-destructive/40",
    "disabled:cursor-not-allowed disabled:opacity-50 aria-busy:cursor-wait",
  ],
  {
    variants: {
      size: {
        sm: "h-4 w-7",
        default: "h-5 w-9",
        lg: "h-6 w-11",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
);

const thumbSizes = {
  sm: "size-3",
  default: "size-4",
  lg: "size-5",
} as const;

export interface SwitchProps
  extends React.ComponentProps<typeof SwitchPrimitive.Root>,
    VariantProps<typeof switchVariants> {
  /** Content rendered inside the thumb, e.g. an icon or a spinner. */
  thumbContent?: React.ReactNode;
  /** Classes for the thumb. */
  thumbClassName?: string;
}

function Switch({ className, size, thumbContent, thumbClassName, ...props }: SwitchProps) {
  const resolved = size ?? "default";
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      data-size={resolved}
      className={cn(switchVariants({ size: resolved }), className)}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          "pointer-events-none grid place-items-center overflow-hidden rounded-full ring-0",
          "shadow-sm",
          "data-[state=unchecked]:bg-foreground data-[state=checked]:bg-primary-foreground",
          "data-[state=checked]:translate-x-full rtl:data-[state=checked]:-translate-x-full",
          "[transition:translate_200ms_ease-out,background-color_150ms_ease-out]",
          "motion-reduce:[transition:background-color_150ms_ease-out]",
          "[&_svg]:pointer-events-none [&_svg]:shrink-0",
          thumbSizes[resolved],
          thumbClassName
        )}
      >
        {thumbContent}
      </SwitchPrimitive.Thumb>
    </SwitchPrimitive.Root>
  );
}

export { Switch, switchVariants };
