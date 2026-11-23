import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/**
 * DuskUI Kbd — keyboard keys styled as real keycaps.
 *
 * Same parts and data-slot attributes as shadcn/ui's Kbd (Kbd, KbdGroup) plus:
 * - A quiet keycap look: a hairline border and a subtle bottom lip, tuned
 *   for dark surfaces.
 * - `pressed`: the cap sinks by a pixel, loses its lip and brightens.
 *   Drive it from keyboard events to show which keys are held.
 * - `size`: sm, default, lg. Icons inside are sized automatically.
 * - Flattens itself inside tooltips.
 * CSS only, so it works in Server Components.
 */
const kbdVariants = cva(
  [
    "pointer-events-none inline-flex w-fit select-none items-center justify-center gap-1 rounded-[5px] border font-sans font-medium whitespace-nowrap",
    "border-white/10 bg-muted text-muted-foreground",
    "shadow-[inset_0_-1px_0_rgb(0_0_0/0.4)]",
    "transition-[translate,box-shadow,color,border-color,background-color] duration-100 ease-out motion-reduce:transition-none",
    "data-[pressed=true]:translate-y-px data-[pressed=true]:border-white/20 data-[pressed=true]:bg-accent data-[pressed=true]:text-foreground data-[pressed=true]:shadow-none",
    "motion-reduce:data-[pressed=true]:translate-y-0",
    "[&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-3",
    "[[data-slot=tooltip-content]_&]:border-transparent [[data-slot=tooltip-content]_&]:bg-white/15 [[data-slot=tooltip-content]_&]:bg-none [[data-slot=tooltip-content]_&]:text-current [[data-slot=tooltip-content]_&]:shadow-none",
  ],
  {
    variants: {
      size: {
        sm: "h-[1.125rem] min-w-[1.125rem] px-1 text-[0.625rem]",
        default: "h-5 min-w-5 px-1.5 text-xs",
        lg: "h-7 min-w-7 rounded-md px-2 text-sm [&_svg:not([class*='size-'])]:size-3.5",
      },
    },
    defaultVariants: { size: "default" },
  }
);

export interface KbdProps extends React.ComponentProps<"kbd">, VariantProps<typeof kbdVariants> {
  /** Show the key held down: it sinks and lights up. */
  pressed?: boolean;
}

function Kbd({ className, size, pressed = false, ...props }: KbdProps) {
  return (
    <kbd
      data-slot="kbd"
      data-size={size ?? "default"}
      data-pressed={pressed || undefined}
      className={cn(kbdVariants({ size }), className)}
      {...props}
    />
  );
}

/** Lays out a key combination, e.g. ⌘ + K. Renders a `<kbd>`, so nested Kbds read as one shortcut. */
function KbdGroup({ className, ...props }: React.ComponentProps<"kbd">) {
  return (
    <kbd
      data-slot="kbd-group"
      className={cn("inline-flex items-center gap-1 font-sans text-xs text-muted-foreground", className)}
      {...props}
    />
  );
}

export { Kbd, KbdGroup, kbdVariants };
