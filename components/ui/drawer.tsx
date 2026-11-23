"use client"

import * as React from "react"
import { Drawer as DrawerPrimitive } from "vaul"

import { cn } from "@/lib/utils"

/**
 * DuskUI Drawer — the shadcn/ui Drawer (vaul), styled for DuskUI.
 *
 * Same parts, props and data-slot attributes as shadcn (Drawer, DrawerTrigger,
 * DrawerPortal, DrawerOverlay, DrawerContent, DrawerHeader, DrawerFooter,
 * DrawerTitle, DrawerDescription, DrawerClose), plus:
 * - A handle bar on bottom drawers so it reads as draggable.
 *   `showHandle={false}` hides it.
 * - A dimmed backdrop and a neutral shadow.
 * - Long content scrolls inside the drawer; the safe-area inset is respected.
 * - Under `prefers-reduced-motion` the drawer fades in and out instead of
 *   sliding (dragging still follows your finger).
 * vaul handles drag-to-dismiss, snap points and velocity; Radix Dialog
 * underneath handles the focus trap, Escape and aria.
 */
function Drawer({
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Root>) {
  return <DrawerPrimitive.Root data-slot="drawer" {...props} />
}

/** The element that opens the drawer. Use `asChild` to render your own Button. */
function DrawerTrigger({
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Trigger>) {
  return <DrawerPrimitive.Trigger data-slot="drawer-trigger" {...props} />
}

/** Portals the overlay and content to `document.body`. */
function DrawerPortal({
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Portal>) {
  return <DrawerPrimitive.Portal data-slot="drawer-portal" {...props} />
}

/** Closes the drawer. Use `asChild` to render your own Button. */
function DrawerClose({
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Close>) {
  return <DrawerPrimitive.Close data-slot="drawer-close" {...props} />
}

/**
 * vaul injects its slide / fade keyframes as unlayered CSS, which beats
 * Tailwind's layered utilities, so the reduced-motion override needs `!`.
 */
const reducedMotion =
  "motion-reduce:data-[state=open]:[animation-name:fadeIn]! motion-reduce:data-[state=closed]:[animation-name:fadeOut]! motion-reduce:transition-none!"

/** The dimmed backdrop. Fades with the drawer and as you drag it. */
function DrawerOverlay({
  className,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Overlay>) {
  return (
    <DrawerPrimitive.Overlay
      data-slot="drawer-overlay"
      className={cn("fixed inset-0 z-50 bg-black/60", className)}
      {...props}
    />
  )
}

/** The drawer surface. Slides in from the Drawer's `direction` (bottom by default). */
function DrawerContent({
  className,
  children,
  showHandle = true,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Content> & {
  /** Show the handle bar at the top of bottom drawers. */
  showHandle?: boolean
}) {
  return (
    <DrawerPortal data-slot="drawer-portal">
      <DrawerOverlay />
      <DrawerPrimitive.Content
        data-slot="drawer-content"
        className={cn(
          "group/drawer-content fixed z-50 flex h-auto flex-col bg-background shadow-lg outline-none",
          // Bottom
          "data-[vaul-drawer-direction=bottom]:inset-x-0 data-[vaul-drawer-direction=bottom]:bottom-0 data-[vaul-drawer-direction=bottom]:mt-24 data-[vaul-drawer-direction=bottom]:max-h-[85dvh] data-[vaul-drawer-direction=bottom]:rounded-t-2xl data-[vaul-drawer-direction=bottom]:border-t",
          "data-[vaul-drawer-direction=bottom]:pb-[env(safe-area-inset-bottom)]",
          // Top
          "data-[vaul-drawer-direction=top]:inset-x-0 data-[vaul-drawer-direction=top]:top-0 data-[vaul-drawer-direction=top]:mb-24 data-[vaul-drawer-direction=top]:max-h-[85dvh] data-[vaul-drawer-direction=top]:rounded-b-2xl data-[vaul-drawer-direction=top]:border-b",
          "data-[vaul-drawer-direction=top]:pt-[env(safe-area-inset-top)]",
          // Right
          "data-[vaul-drawer-direction=right]:inset-y-0 data-[vaul-drawer-direction=right]:right-0 data-[vaul-drawer-direction=right]:w-3/4 data-[vaul-drawer-direction=right]:border-l data-[vaul-drawer-direction=right]:sm:max-w-sm",
          // Left
          "data-[vaul-drawer-direction=left]:inset-y-0 data-[vaul-drawer-direction=left]:left-0 data-[vaul-drawer-direction=left]:w-3/4 data-[vaul-drawer-direction=left]:border-r data-[vaul-drawer-direction=left]:sm:max-w-sm",
          reducedMotion,
          className
        )}
        {...props}
      >
        {showHandle && (
          <div
            aria-hidden
            data-slot="drawer-handle"
            className={cn(
              "mx-auto mt-3 mb-1 hidden h-1.5 w-12 shrink-0 rounded-full bg-white/15",
              "group-data-[vaul-drawer-direction=bottom]/drawer-content:block"
            )}
          />
        )}
        {children}
      </DrawerPrimitive.Content>
    </DrawerPortal>
  )
}

/** Wraps the title and description. Centered on bottom / top drawers, left-aligned from `md` up. */
function DrawerHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="drawer-header"
      className={cn(
        "flex flex-col gap-1 p-4",
        "group-data-[vaul-drawer-direction=bottom]/drawer-content:text-center group-data-[vaul-drawer-direction=top]/drawer-content:text-center",
        "md:gap-1.5 md:text-left md:group-data-[vaul-drawer-direction=bottom]/drawer-content:text-left md:group-data-[vaul-drawer-direction=top]/drawer-content:text-left",
        className
      )}
      {...props}
    />
  )
}

/** Action row, pinned to the bottom of the drawer. */
function DrawerFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="drawer-footer"
      className={cn("mt-auto flex flex-col gap-2 p-4", className)}
      {...props}
    />
  )
}

/** Accessible title, announced when the drawer opens. Required by Radix. */
function DrawerTitle({
  className,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Title>) {
  return (
    <DrawerPrimitive.Title
      data-slot="drawer-title"
      className={cn("text-lg leading-none font-semibold tracking-tight text-foreground", className)}
      {...props}
    />
  )
}

/** Supporting text linked to the drawer via aria-describedby. */
function DrawerDescription({
  className,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Description>) {
  return (
    <DrawerPrimitive.Description
      data-slot="drawer-description"
      className={cn("text-sm leading-relaxed text-muted-foreground", className)}
      {...props}
    />
  )
}

export {
  Drawer,
  DrawerPortal,
  DrawerOverlay,
  DrawerTrigger,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
}
