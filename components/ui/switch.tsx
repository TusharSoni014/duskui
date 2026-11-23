"use client";

import * as React from "react";
import * as SwitchPrimitive from "@radix-ui/react-switch";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/**
 * DuskUI Switch — a drop-in upgrade of the shadcn/ui Switch.
 *
 * Same API and data-slot attributes as shadcn plus:
 * - The thumb travels on a spring curve (a CSS `linear()` spring, so there is
 *   no JavaScript per frame) and the track glows mint when on.
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
    "transition-[background-color,box-shadow] duration-200 ease-out motion-reduce:transition-none",
    "data-[state=unchecked]:bg-white/12 data-[state=unchecked]:shadow-[inset_0_1px_2px_rgb(0_0_0/0.4)] data-[state=unchecked]:hover:bg-white/18",
    "data-[state=checked]:bg-primary data-[state=checked]:shadow-[0_0_16px_-4px_var(--color-primary)]",
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
          "shadow-[0_1px_3px_rgb(0_0_0/0.45),inset_0_-1px_0_rgb(0_0_0/0.08)]",
          "data-[state=unchecked]:bg-foreground data-[state=checked]:bg-primary-foreground",
          "data-[state=checked]:translate-x-full rtl:data-[state=checked]:-translate-x-full",
          // Spring for travel (~8% overshoot), plain ease for color.
          "[transition:translate_420ms_linear(0,0.032,0.114,0.226,0.354,0.484,0.61,0.723,0.821,0.902,0.967,1.015,1.048,1.07,1.081,1.084,1.081,1.074,1.064,1.053,1.043,1.032,1.023,1.015,1.008,1.003,0.999,0.996,1),background-color_200ms_ease-out]",
          "motion-reduce:[transition:background-color_200ms_ease-out]",
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
