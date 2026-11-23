"use client"

import * as React from "react"
import * as NavigationMenuPrimitive from "@radix-ui/react-navigation-menu"
import { cva } from "class-variance-authority"
import { ChevronDownIcon } from "lucide-react"

import { cn } from "@/lib/utils"

/**
 * DuskUI Navigation Menu — the shadcn/ui Navigation Menu with DuskUI motion.
 *
 * Same parts, props and data-slot attributes as shadcn (including
 * `viewport={false}`), plus:
 * - The viewport eases its width and height between panels instead of
 *   snapping, and grows out of the top edge when it opens.
 * - Panels slide a short distance in from the side you're moving toward
 *   (Radix's `data-motion`), so travel direction is always clear.
 * - The indicator arrow glides between triggers and fades in and out.
 * - Triggers ease their hover and open states; the chevron flips.
 * - Under `prefers-reduced-motion` everything fades; nothing slides or resizes.
 * CSS only (tw-animate-css). Radix handles hover intent, keyboard, focus and aria.
 */
function NavigationMenu({
  className,
  children,
  viewport = true,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Root> & {
  /** Render panels in a shared viewport that morphs between them. `false` drops each panel under its trigger. */
  viewport?: boolean
}) {
  return (
    <NavigationMenuPrimitive.Root
      data-slot="navigation-menu"
      data-viewport={viewport}
      className={cn(
        "group/navigation-menu relative flex max-w-max flex-1 items-center justify-center",
        className
      )}
      {...props}
    >
      {children}
      {viewport && <NavigationMenuViewport />}
    </NavigationMenuPrimitive.Root>
  )
}

/** The row of items. */
function NavigationMenuList({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.List>) {
  return (
    <NavigationMenuPrimitive.List
      data-slot="navigation-menu-list"
      className={cn(
        "group flex flex-1 list-none items-center justify-center gap-1",
        className
      )}
      {...props}
    />
  )
}

/** One entry: a Trigger + Content pair, or a plain Link. */
function NavigationMenuItem({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Item>) {
  return (
    <NavigationMenuPrimitive.Item
      data-slot="navigation-menu-item"
      className={cn("relative", className)}
      {...props}
    />
  )
}

/** Trigger styles, exported so plain links in the list can match them. */
const navigationMenuTriggerStyle = cva(
  [
    "group inline-flex h-9 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-medium text-foreground/80 outline-none",
    "transition-[color,background-color,box-shadow] duration-200 ease-out motion-reduce:transition-none",
    "hover:bg-accent/70 hover:text-foreground focus:bg-accent/70 focus:text-foreground",
    "focus-visible:ring-[3px] focus-visible:ring-ring/50",
    "data-[state=open]:bg-accent/60 data-[state=open]:text-foreground data-[active=true]:text-primary",
    "disabled:pointer-events-none disabled:opacity-50",
  ]
)

/** Opens its panel on hover, click, Enter, Space or ArrowDown. */
function NavigationMenuTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Trigger>) {
  return (
    <NavigationMenuPrimitive.Trigger
      data-slot="navigation-menu-trigger"
      className={cn(navigationMenuTriggerStyle(), "group", className)}
      {...props}
    >
      {children}{" "}
      <ChevronDownIcon
        className="relative top-px ml-1 size-3 text-muted-foreground transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-data-[state=open]:rotate-180 group-data-[state=open]:text-foreground motion-reduce:transition-none"
        aria-hidden="true"
      />
    </NavigationMenuPrimitive.Trigger>
  )
}

/** A trigger's panel. Rendered into the viewport, or under the trigger with `viewport={false}`. */
function NavigationMenuContent({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Content>) {
  return (
    <NavigationMenuPrimitive.Content
      data-slot="navigation-menu-content"
      className={cn(
        "top-0 left-0 w-full p-2 pr-2.5 md:absolute md:w-auto",
        // Direction-aware panel swaps inside the viewport.
        "ease-[cubic-bezier(0.16,1,0.3,1)] data-[motion^=from-]:animate-in data-[motion^=to-]:animate-out data-[motion^=from-]:fade-in-0 data-[motion^=to-]:fade-out-0 data-[motion]:duration-300",
        "data-[motion=from-end]:slide-in-from-right-12 data-[motion=from-start]:slide-in-from-left-12 data-[motion=to-end]:slide-out-to-right-12 data-[motion=to-start]:slide-out-to-left-12",
        "motion-reduce:data-[motion=from-end]:slide-in-from-right-0 motion-reduce:data-[motion=from-start]:slide-in-from-left-0 motion-reduce:data-[motion=to-end]:slide-out-to-right-0 motion-reduce:data-[motion=to-start]:slide-out-to-left-0",
        // Without a viewport each panel is its own popover under the trigger.
        "group-data-[viewport=false]/navigation-menu:top-full group-data-[viewport=false]/navigation-menu:mt-1.5 group-data-[viewport=false]/navigation-menu:overflow-hidden group-data-[viewport=false]/navigation-menu:rounded-lg group-data-[viewport=false]/navigation-menu:border group-data-[viewport=false]/navigation-menu:bg-popover group-data-[viewport=false]/navigation-menu:text-popover-foreground",
        "group-data-[viewport=false]/navigation-menu:shadow-[inset_0_1px_0_rgb(255_255_255/0.05),0_16px_40px_-12px_rgb(0_0_0/0.7)]",
        "group-data-[viewport=false]/navigation-menu:origin-top group-data-[viewport=false]/navigation-menu:duration-200",
        "group-data-[viewport=false]/navigation-menu:data-[state=open]:animate-in group-data-[viewport=false]/navigation-menu:data-[state=open]:fade-in-0 group-data-[viewport=false]/navigation-menu:data-[state=open]:zoom-in-95",
        "group-data-[viewport=false]/navigation-menu:data-[state=closed]:animate-out group-data-[viewport=false]/navigation-menu:data-[state=closed]:fade-out-0 group-data-[viewport=false]/navigation-menu:data-[state=closed]:zoom-out-95",
        "**:data-[slot=navigation-menu-link]:focus:ring-0 **:data-[slot=navigation-menu-link]:focus:outline-none",
        className
      )}
      {...props}
    />
  )
}

/** The shared surface panels render into. Morphs to the size of the active panel. */
function NavigationMenuViewport({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Viewport>) {
  return (
    <div className="absolute top-full left-0 isolate z-50 flex justify-center">
      <NavigationMenuPrimitive.Viewport
        data-slot="navigation-menu-viewport"
        className={cn(
          "relative mt-1.5 h-(--radix-navigation-menu-viewport-height) w-full origin-top overflow-hidden rounded-xl border bg-popover text-popover-foreground md:w-(--radix-navigation-menu-viewport-width)",
          "shadow-[inset_0_1px_0_rgb(255_255_255/0.05),0_24px_56px_-16px_rgb(0_0_0/0.75),0_0_0_1px_rgb(0_0_0/0.2)]",
          "transition-[width,height] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
          "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=open]:duration-200",
          "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=closed]:duration-150",
          "motion-reduce:data-[state=open]:zoom-in-100 motion-reduce:data-[state=closed]:zoom-out-100",
          className
        )}
        {...props}
      />
    </div>
  )
}

/** A link inside a panel (or a plain item with `asChild`). Set `active` for the current page. */
function NavigationMenuLink({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Link>) {
  return (
    <NavigationMenuPrimitive.Link
      data-slot="navigation-menu-link"
      className={cn(
        "flex flex-col gap-1 rounded-md p-2 text-sm outline-none",
        "transition-[color,background-color,box-shadow] duration-150 ease-out motion-reduce:transition-none",
        "hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
        "focus-visible:ring-[3px] focus-visible:ring-ring/50",
        "data-[active=true]:bg-accent/50 data-[active=true]:text-primary data-[active=true]:hover:bg-accent",
        "[&_svg:not([class*='text-'])]:text-muted-foreground [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    />
  )
}

/** A small arrow under the open trigger. Glides between triggers. */
function NavigationMenuIndicator({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Indicator>) {
  return (
    <NavigationMenuPrimitive.Indicator
      data-slot="navigation-menu-indicator"
      className={cn(
        "top-full z-[1] flex h-1.5 items-end justify-center overflow-hidden",
        "transition-[transform,width,opacity] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] starting:opacity-0 motion-reduce:transition-opacity",
        className
      )}
      {...props}
    >
      <div className="relative top-[60%] size-2 rotate-45 rounded-tl-sm bg-primary shadow-[0_0_10px_var(--color-primary)]" />
    </NavigationMenuPrimitive.Indicator>
  )
}

export {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuContent,
  NavigationMenuTrigger,
  NavigationMenuLink,
  NavigationMenuIndicator,
  NavigationMenuViewport,
  navigationMenuTriggerStyle,
}
