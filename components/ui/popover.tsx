"use client"

import * as React from "react"
import * as PopoverPrimitive from "@radix-ui/react-popover"

import { cn } from "@/lib/utils"

/**
 * DuskUI Popover — a drop-in upgrade of the shadcn/ui Popover.
 *
 * Same parts, props and data-slot attributes as shadcn, plus:
 * - Grows out of its trigger: the scale origin follows Radix's transform
 *   origin and it shifts in slightly from the side it opens on (150ms
 *   ease-out), then closes quicker than it opened.
 * - A neutral shadow on the surface.
 * - Never taller than the space available; long content scrolls.
 * - `PopoverClose` for close buttons inside the content.
 * - Under `prefers-reduced-motion` it only fades.
 * CSS only (tw-animate-css). Radix handles focus, Escape, outside clicks,
 * collision avoidance and aria.
 */
function Popover({
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Root>) {
  return <PopoverPrimitive.Root data-slot="popover" {...props} />
}

/** The element that toggles the popover. Use `asChild` to render your own Button. */
function PopoverTrigger({
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Trigger>) {
  return <PopoverPrimitive.Trigger data-slot="popover-trigger" {...props} />
}

/** The floating panel. Portalled and positioned next to the trigger (or anchor). */
function PopoverContent({
  className,
  align = "center",
  sideOffset = 6,
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Content>) {
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        data-slot="popover-content"
        align={align}
        sideOffset={sideOffset}
        className={cn(
          "z-50 max-h-(--radix-popover-content-available-height) w-72 overflow-y-auto rounded-xl border bg-popover p-4 text-popover-foreground outline-hidden",
          "origin-(--radix-popover-content-transform-origin)",
          "shadow-md ease-out",
          "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=open]:duration-150",
          "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=closed]:duration-100",
          "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
          "motion-reduce:data-[state=open]:zoom-in-100 motion-reduce:data-[state=closed]:zoom-out-100",
          "motion-reduce:data-[side=bottom]:slide-in-from-top-0 motion-reduce:data-[side=left]:slide-in-from-right-0 motion-reduce:data-[side=right]:slide-in-from-left-0 motion-reduce:data-[side=top]:slide-in-from-bottom-0",
          className
        )}
        {...props}
      />
    </PopoverPrimitive.Portal>
  )
}

/** Positions the popover against something other than the trigger. */
function PopoverAnchor({
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Anchor>) {
  return <PopoverPrimitive.Anchor data-slot="popover-anchor" {...props} />
}

/** Closes the popover. Use `asChild` to render your own Button. */
function PopoverClose({
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Close>) {
  return <PopoverPrimitive.Close data-slot="popover-close" {...props} />
}

export { Popover, PopoverTrigger, PopoverContent, PopoverAnchor, PopoverClose }
