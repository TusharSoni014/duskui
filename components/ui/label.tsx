"use client";

import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";

import { cn } from "@/lib/utils";

/**
 * DuskUI Label — a drop-in upgrade of the shadcn/ui Label.
 *
 * Same API and data-slot as shadcn plus:
 * - Eases its color, so it can tint red when its Field turns invalid and dim
 *   when the Field or the peer control is disabled.
 * - Lays out a leading icon or a trailing badge with a consistent gap.
 * Powered by Radix, so double-clicking the label never selects its text and a
 * click focuses / toggles the linked control.
 */
function Label({ className, ...props }: React.ComponentProps<typeof LabelPrimitive.Root>) {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={cn(
        "flex items-center gap-2 text-sm leading-none font-medium select-none",
        "transition-[color,opacity] duration-200 ease-out motion-reduce:transition-none",
        "group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50",
        "peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
        "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    />
  );
}

export { Label };
