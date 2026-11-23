"use client";

import * as React from "react";
import * as TogglePrimitive from "@radix-ui/react-toggle";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/**
 * DuskUI Toggle — a drop-in upgrade of the shadcn/ui Toggle.
 *
 * Same API (variant, size, pressed, onPressedChange) and data-slot as shadcn
 * plus a tactile press, smooth color transitions and a mint "on" state: the
 * icon lights up and the surface gets a faint inner highlight. CSS only;
 * Radix handles aria-pressed and keyboard.
 */
const toggleVariants = cva(
  [
    "inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium text-muted-foreground outline-none select-none",
    "transition-[color,background-color,border-color,box-shadow,scale] duration-150 ease-out motion-reduce:transition-none",
    "hover:bg-muted hover:text-foreground active:scale-[0.96] motion-reduce:active:scale-100",
    "data-[state=on]:bg-accent data-[state=on]:text-accent-foreground data-[state=on]:shadow-[inset_0_1px_0_rgb(255_255_255/0.05)]",
    "data-[state=on]:[&_svg:not([class*='text-'])]:text-primary",
    "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
    "aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40",
    "disabled:pointer-events-none disabled:opacity-50",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg]:transition-colors [&_svg:not([class*='size-'])]:size-4",
  ],
  {
    variants: {
      variant: {
        default: "bg-transparent",
        outline:
          "border border-input bg-transparent shadow-xs hover:border-ring/40 hover:bg-accent/60 dark:bg-input/20",
      },
      size: {
        default: "h-9 min-w-9 px-2",
        sm: "h-8 min-w-8 px-1.5",
        lg: "h-10 min-w-10 px-2.5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function Toggle({
  className,
  variant,
  size,
  ...props
}: React.ComponentProps<typeof TogglePrimitive.Root> & VariantProps<typeof toggleVariants>) {
  return (
    <TogglePrimitive.Root
      data-slot="toggle"
      className={cn(toggleVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Toggle, toggleVariants };
