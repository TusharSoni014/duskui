"use client"

import * as React from "react"
import * as ResizablePrimitive from "react-resizable-panels"

import { cn } from "@/lib/utils"

/**
 * DuskUI Resizable — the shadcn/ui Resizable, on react-resizable-panels v4.
 *
 * Same parts and data-slot attributes as shadcn (ResizablePanelGroup,
 * ResizablePanel, ResizableHandle with `withHandle`), plus:
 * - The handle line warms up on hover and glows mint while you drag it or
 *   while it has keyboard focus.
 * - The optional grip pill lights up and scales slightly while dragging.
 * - `orientation` (v4) is the prop; the older shadcn `direction` prop is
 *   still accepted as an alias.
 * - Under `prefers-reduced-motion` colors change without easing.
 * Sizes follow v4 rules: numbers are pixels, strings without a unit are
 * percentages (`defaultSize="25"`), and "px" / "%" / "rem" / "vh" work too.
 * The library handles pointer and keyboard resizing (arrow keys, Home, End)
 * and the separator's WAI-ARIA attributes.
 */
function ResizablePanelGroup({
  className,
  orientation,
  direction,
  ...props
}: React.ComponentProps<typeof ResizablePrimitive.Group> & {
  /** @deprecated v2 name, kept for shadcn compatibility. Use `orientation`. */
  direction?: "horizontal" | "vertical"
}) {
  const resolved = orientation ?? direction ?? "horizontal"
  return (
    <ResizablePrimitive.Group
      data-slot="resizable-panel-group"
      data-orientation={resolved}
      orientation={resolved}
      className={cn("h-full w-full", className)}
      {...props}
    />
  )
}

/** One resizable region. Must be a direct child of a ResizablePanelGroup. */
function ResizablePanel({
  ...props
}: React.ComponentProps<typeof ResizablePrimitive.Panel>) {
  return <ResizablePrimitive.Panel data-slot="resizable-panel" {...props} />
}

/** The draggable, focusable divider between two panels. */
function ResizableHandle({
  withHandle,
  className,
  ...props
}: React.ComponentProps<typeof ResizablePrimitive.Separator> & {
  /** Show a grip pill in the middle of the line. */
  withHandle?: boolean
}) {
  return (
    <ResizablePrimitive.Separator
      data-slot="resizable-handle"
      className={cn(
        "group/handle relative z-10 flex w-px shrink-0 items-center justify-center bg-border outline-none",
        // A wider invisible hit area for the pointer (the library also enforces a minimum target).
        "after:absolute after:inset-y-0 after:left-1/2 after:w-2 after:-translate-x-1/2",
        "aria-[orientation=horizontal]:h-px aria-[orientation=horizontal]:w-full",
        "aria-[orientation=horizontal]:after:inset-x-0 aria-[orientation=horizontal]:after:top-1/2 aria-[orientation=horizontal]:after:left-0 aria-[orientation=horizontal]:after:h-2 aria-[orientation=horizontal]:after:w-full aria-[orientation=horizontal]:after:translate-x-0 aria-[orientation=horizontal]:after:-translate-y-1/2",
        "transition-[background-color,box-shadow] duration-200 ease-out motion-reduce:transition-none",
        "data-[separator=hover]:bg-primary/40",
        "data-[separator=focus]:bg-primary data-[separator=focus]:shadow-[0_0_0_1px_var(--color-primary),0_0_12px_1px_color-mix(in_oklab,var(--color-primary)_55%,transparent)]",
        "data-[separator=active]:bg-primary data-[separator=active]:shadow-[0_0_0_1px_var(--color-primary),0_0_16px_2px_color-mix(in_oklab,var(--color-primary)_60%,transparent)]",
        "data-[separator=disabled]:opacity-50",
        className
      )}
      {...props}
    >
      {withHandle && (
        <div
          aria-hidden
          className={cn(
            "relative z-10 flex h-6 w-3 shrink-0 flex-col items-center justify-center gap-[3px] rounded-full border bg-background",
            "shadow-[inset_0_1px_0_rgb(255_255_255/0.05),0_2px_6px_rgb(0_0_0/0.4)]",
            "transition-[border-color,background-color,scale,box-shadow] duration-200 ease-out motion-reduce:transition-none",
            "group-aria-[orientation=horizontal]/handle:h-3 group-aria-[orientation=horizontal]/handle:w-6 group-aria-[orientation=horizontal]/handle:flex-row",
            "group-data-[separator=hover]/handle:border-primary/50",
            "group-data-[separator=focus]/handle:border-primary group-data-[separator=active]/handle:border-primary",
            "group-data-[separator=active]/handle:scale-110 group-data-[separator=active]/handle:bg-primary/15 motion-reduce:group-data-[separator=active]/handle:scale-100",
            "group-data-[separator=active]/handle:shadow-[0_0_12px_color-mix(in_oklab,var(--color-primary)_50%,transparent)]"
          )}
        >
          {[0, 1, 2].map((dot) => (
            <span
              key={dot}
              className={cn(
                "size-[3px] rounded-full bg-muted-foreground/70 transition-colors duration-200 motion-reduce:transition-none",
                "group-data-[separator=focus]/handle:bg-primary group-data-[separator=active]/handle:bg-primary"
              )}
            />
          ))}
        </div>
      )}
    </ResizablePrimitive.Separator>
  )
}

export { ResizablePanelGroup, ResizablePanel, ResizableHandle }
