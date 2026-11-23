"use client"

import * as React from "react"
import * as TooltipPrimitive from "@radix-ui/react-tooltip"

import { cn } from "@/lib/utils"

/**
 * DuskUI Tooltip — a drop-in upgrade of the shadcn/ui Tooltip.
 *
 * Same parts, props and data-slot attributes as shadcn (Tooltip,
 * TooltipTrigger, TooltipContent, TooltipProvider) plus:
 * - An elevated dark surface with a hairline border and a matching arrow.
 * - Opens from the trigger: scales from the Radix transform origin, slides a
 *   few pixels from the side it opens on and un-blurs, on an expo-out curve.
 *   Closes faster than it opens.
 * - `showArrow={false}` to hide the arrow.
 * - Under `prefers-reduced-motion` it only fades.
 * CSS only (tw-animate-css), powered by Radix for hover/focus intent and aria.
 */
function TooltipProvider({
  delayDuration = 0,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Provider>) {
  return (
    <TooltipPrimitive.Provider
      data-slot="tooltip-provider"
      delayDuration={delayDuration}
      {...props}
    />
  )
}

/** Root. Wraps itself in a TooltipProvider, like shadcn, so it works anywhere. */
function Tooltip({
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Root>) {
  return (
    <TooltipProvider>
      <TooltipPrimitive.Root data-slot="tooltip" {...props} />
    </TooltipProvider>
  )
}

/** The element that shows the tooltip on hover and keyboard focus. Use `asChild` for your own button. */
function TooltipTrigger({
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Trigger>) {
  return <TooltipPrimitive.Trigger data-slot="tooltip-trigger" {...props} />
}

/** The floating label, portalled to `document.body`. */
function TooltipContent({
  className,
  sideOffset = 0,
  showArrow = true,
  children,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Content> & {
  /** Render the small arrow pointing at the trigger. */
  showArrow?: boolean
}) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        data-slot="tooltip-content"
        sideOffset={sideOffset}
        className={cn(
          "z-50 w-fit max-w-xs origin-(--radix-tooltip-content-transform-origin) rounded-md border border-white/10 bg-popover px-2.5 py-1.5 text-xs text-balance text-popover-foreground",
          "shadow-[inset_0_1px_0_rgb(255_255_255/0.06),0_8px_24px_-6px_rgb(0_0_0/0.65)]",
          "animate-in fade-in-0 zoom-in-90 blur-in-[3px] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)]",
          "data-[side=bottom]:slide-in-from-top-1 data-[side=left]:slide-in-from-right-1 data-[side=right]:slide-in-from-left-1 data-[side=top]:slide-in-from-bottom-1",
          "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=closed]:duration-100 data-[state=closed]:ease-in",
          "motion-reduce:[--tw-enter-scale:1]! motion-reduce:[--tw-enter-translate-x:0]! motion-reduce:[--tw-enter-translate-y:0]! motion-reduce:[--tw-exit-scale:1]!",
          className
        )}
        {...props}
      >
        {children}
        {showArrow && (
          <TooltipPrimitive.Arrow className="z-50 size-2.5 translate-y-[calc(-50%_-_1px)] rotate-45 rounded-[2px] border-r border-b border-white/10 bg-popover fill-popover" />
        )}
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  )
}

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }
