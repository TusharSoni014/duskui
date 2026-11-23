"use client"

import * as React from "react"
import * as SheetPrimitive from "@radix-ui/react-dialog"
import { XIcon } from "lucide-react"

import { cn } from "@/lib/utils"

/**
 * DuskUI Sheet — a drop-in upgrade of the shadcn/ui Sheet.
 *
 * Same parts, props and data-slot attributes as shadcn (including `side`), plus:
 * - Slides in on an expo-out curve with a slight fade, and closes faster than
 *   it opens so dismissing never feels sluggish.
 * - A blurred backdrop, layered shadow and an inner-edge highlight.
 * - Long content scrolls inside the sheet instead of overflowing the screen.
 * - A larger close button with hover and focus-visible states, and an
 *   optional `showCloseButton={false}`.
 * - Respects safe-area insets on notched phones.
 * - Under `prefers-reduced-motion` it only fades (no slide).
 * CSS only (tw-animate-css), powered by Radix Dialog for focus trap, Escape and aria.
 */
function Sheet({ ...props }: React.ComponentProps<typeof SheetPrimitive.Root>) {
  return <SheetPrimitive.Root data-slot="sheet" {...props} />
}

/** The element that opens the sheet. Use `asChild` to render your own Button. */
function SheetTrigger({
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Trigger>) {
  return <SheetPrimitive.Trigger data-slot="sheet-trigger" {...props} />
}

/** Closes the sheet. Use `asChild` to render your own Button. */
function SheetClose({
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Close>) {
  return <SheetPrimitive.Close data-slot="sheet-close" {...props} />
}

/** Portals the overlay and content to `document.body`. */
function SheetPortal({
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Portal>) {
  return <SheetPrimitive.Portal data-slot="sheet-portal" {...props} />
}

/** The dimmed, blurred backdrop. Clicking it closes the sheet. */
function SheetOverlay({
  className,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Overlay>) {
  return (
    <SheetPrimitive.Overlay
      data-slot="sheet-overlay"
      className={cn(
        "fixed inset-0 z-50 bg-black/60 backdrop-blur-[2px]",
        "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:duration-300",
        "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:duration-200",
        className
      )}
      {...props}
    />
  )
}

const sideClasses = {
  right: [
    "inset-y-0 right-0 h-full w-3/4 border-l sm:max-w-sm",
    "pr-[env(safe-area-inset-right)]",
    "shadow-[inset_1px_0_0_rgb(255_255_255/0.04),-24px_0_64px_-16px_rgb(0_0_0/0.7)]",
    "data-[state=open]:slide-in-from-right data-[state=closed]:slide-out-to-right",
  ],
  left: [
    "inset-y-0 left-0 h-full w-3/4 border-r sm:max-w-sm",
    "pl-[env(safe-area-inset-left)]",
    "shadow-[inset_-1px_0_0_rgb(255_255_255/0.04),24px_0_64px_-16px_rgb(0_0_0/0.7)]",
    "data-[state=open]:slide-in-from-left data-[state=closed]:slide-out-to-left",
  ],
  top: [
    "inset-x-0 top-0 h-auto max-h-[calc(100dvh-2rem)] border-b",
    "pt-[env(safe-area-inset-top)]",
    "shadow-[inset_0_-1px_0_rgb(255_255_255/0.04),0_24px_64px_-16px_rgb(0_0_0/0.7)]",
    "data-[state=open]:slide-in-from-top data-[state=closed]:slide-out-to-top",
  ],
  bottom: [
    "inset-x-0 bottom-0 h-auto max-h-[calc(100dvh-2rem)] border-t",
    "pb-[env(safe-area-inset-bottom)]",
    "shadow-[inset_0_1px_0_rgb(255_255_255/0.05),0_-24px_64px_-16px_rgb(0_0_0/0.7)]",
    "data-[state=open]:slide-in-from-bottom data-[state=closed]:slide-out-to-bottom",
  ],
} as const

/** The sheet surface. Slides in from `side` with its overlay. */
function SheetContent({
  className,
  children,
  side = "right",
  showCloseButton = true,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Content> & {
  /** Edge of the screen the sheet slides in from. */
  side?: "top" | "right" | "bottom" | "left"
  /** Render the X button in the top-right corner. */
  showCloseButton?: boolean
}) {
  return (
    <SheetPortal>
      <SheetOverlay />
      <SheetPrimitive.Content
        data-slot="sheet-content"
        data-side={side}
        className={cn(
          "bg-background fixed z-50 flex flex-col gap-4 overflow-y-auto overscroll-contain outline-none",
          "ease-[cubic-bezier(0.32,0.72,0,1)]",
          "data-[state=open]:animate-in data-[state=open]:fade-in-50 data-[state=open]:duration-500",
          "data-[state=closed]:animate-out data-[state=closed]:fade-out-50 data-[state=closed]:duration-250",
          sideClasses[side],
          // Reduced motion: fade only, no slide.
          "motion-reduce:data-[state=open]:fade-in-0 motion-reduce:data-[state=closed]:fade-out-0",
          "motion-reduce:data-[state=open]:slide-in-from-left-0 motion-reduce:data-[state=open]:slide-in-from-right-0 motion-reduce:data-[state=open]:slide-in-from-top-0 motion-reduce:data-[state=open]:slide-in-from-bottom-0",
          "motion-reduce:data-[state=closed]:slide-out-to-left-0 motion-reduce:data-[state=closed]:slide-out-to-right-0 motion-reduce:data-[state=closed]:slide-out-to-top-0 motion-reduce:data-[state=closed]:slide-out-to-bottom-0",
          className
        )}
        {...props}
      >
        {children}
        {showCloseButton && (
          <SheetPrimitive.Close
            data-slot="sheet-close"
            className={cn(
              "absolute top-3 right-3 inline-flex size-8 items-center justify-center rounded-md text-muted-foreground outline-none",
              "transition-[color,background-color,box-shadow] duration-150 hover:bg-accent hover:text-foreground",
              "focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none",
              "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
            )}
          >
            <XIcon />
            <span className="sr-only">Close</span>
          </SheetPrimitive.Close>
        )}
      </SheetPrimitive.Content>
    </SheetPortal>
  )
}

/** Wraps the title and description. Leaves room for the close button. */
function SheetHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-header"
      className={cn("flex flex-col gap-1.5 p-4 pr-12", className)}
      {...props}
    />
  )
}

/** Action row, pinned to the bottom of the sheet. */
function SheetFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-footer"
      className={cn("mt-auto flex flex-col gap-2 p-4", className)}
      {...props}
    />
  )
}

/** Accessible title, announced when the sheet opens. Required by Radix. */
function SheetTitle({
  className,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Title>) {
  return (
    <SheetPrimitive.Title
      data-slot="sheet-title"
      className={cn("text-foreground text-lg leading-none font-semibold tracking-tight", className)}
      {...props}
    />
  )
}

/** Supporting text linked to the sheet via aria-describedby. */
function SheetDescription({
  className,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Description>) {
  return (
    <SheetPrimitive.Description
      data-slot="sheet-description"
      className={cn("text-muted-foreground text-sm leading-relaxed", className)}
      {...props}
    />
  )
}

export {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
  SheetPortal,
  SheetOverlay,
}
