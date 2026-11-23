"use client"

import * as React from "react"
import * as CollapsiblePrimitive from "@radix-ui/react-collapsible"

import { cn } from "@/lib/utils"

/**
 * DuskUI Collapsible — a drop-in upgrade of the shadcn/ui Collapsible.
 *
 * Same parts, props and data-slot attributes as shadcn (Collapsible,
 * CollapsibleTrigger, CollapsibleContent), plus:
 * - The content eases its height open (200ms ease-out), using Radix's
 *   measured `--radix-collapsible-content-height`, and closes quicker than it
 *   opens.
 * - Content fades in while it grows, and fades out as it closes.
 * - Nothing below the panel jumps: the height animates, so the layout
 *   follows smoothly.
 * - Under `prefers-reduced-motion` the panel opens and closes instantly.
 * CSS only (tw-animate-css keyframes), powered by Radix for aria-expanded,
 * aria-controls and keyboard support.
 */
function Collapsible({
  ...props
}: React.ComponentProps<typeof CollapsiblePrimitive.Root>) {
  return <CollapsiblePrimitive.Root data-slot="collapsible" {...props} />
}

/** The button that toggles the panel. Use `asChild` to render your own Button. */
function CollapsibleTrigger({
  ...props
}: React.ComponentProps<typeof CollapsiblePrimitive.CollapsibleTrigger>) {
  return (
    <CollapsiblePrimitive.CollapsibleTrigger
      data-slot="collapsible-trigger"
      {...props}
    />
  )
}

/** The panel. Animates its height between 0 and its measured content height. */
function CollapsibleContent({
  className,
  ...props
}: React.ComponentProps<typeof CollapsiblePrimitive.CollapsibleContent>) {
  return (
    <CollapsiblePrimitive.CollapsibleContent
      data-slot="collapsible-content"
      className={cn(
        "overflow-hidden",
        // Height (Radix CSS var) and a fade run as one animation list, so Radix
        // waits for both before unmounting the closed panel.
        "[--tw-enter-opacity:0] [--tw-enter-translate-y:-4px] [--tw-exit-opacity:0]",
        "data-[state=open]:animate-[collapsible-down_200ms_ease-out,enter_200ms_ease-out]",
        "data-[state=closed]:animate-[collapsible-up_150ms_ease-in,exit_150ms_ease-in]",
        "motion-reduce:animate-none",
        className
      )}
      {...props}
    />
  )
}

export { Collapsible, CollapsibleTrigger, CollapsibleContent }
