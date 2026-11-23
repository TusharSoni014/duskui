"use client"

import * as React from "react"
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area"

import { cn } from "@/lib/utils"

/**
 * DuskUI Scroll Area — the shadcn/ui Scroll Area with DuskUI polish.
 *
 * Same parts, props and data-slot attributes as shadcn, plus:
 * - Scrollbars fade in when you hover (or scroll, with `type="scroll"`) and
 *   fade out after `scrollHideDelay`, instead of popping.
 * - A slim thumb that brightens on hover and while dragged.
 * - `viewportRef` and `viewportClassName` to reach the scrolling element
 *   (for scroll listeners, `useScroll` or masks).
 * - A visible focus ring on the viewport for keyboard scrolling.
 * - Under `prefers-reduced-motion` scrollbars appear without fading.
 * CSS only. Radix keeps native scrolling (wheel, touch, keyboard) and
 * custom-styled scrollbars in sync.
 */
function ScrollArea({
  className,
  children,
  viewportRef,
  viewportClassName,
  ...props
}: React.ComponentProps<typeof ScrollAreaPrimitive.Root> & {
  /** Ref to the scrolling element. */
  viewportRef?: React.Ref<HTMLDivElement>
  /** Classes for the scrolling element. */
  viewportClassName?: string
}) {
  return (
    <ScrollAreaPrimitive.Root
      data-slot="scroll-area"
      className={cn("relative", className)}
      {...props}
    >
      <ScrollAreaPrimitive.Viewport
        ref={viewportRef}
        data-slot="scroll-area-viewport"
        className={cn(
          "size-full rounded-[inherit] outline-none transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-1",
          viewportClassName
        )}
      >
        {children}
      </ScrollAreaPrimitive.Viewport>
      <ScrollBar />
      <ScrollAreaPrimitive.Corner />
    </ScrollAreaPrimitive.Root>
  )
}

/** A scrollbar. One vertical bar is included; add `<ScrollBar orientation="horizontal" />` for sideways scrolling. */
function ScrollBar({
  className,
  orientation = "vertical",
  ...props
}: React.ComponentProps<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>) {
  return (
    <ScrollAreaPrimitive.ScrollAreaScrollbar
      data-slot="scroll-area-scrollbar"
      orientation={orientation}
      className={cn(
        "group/scrollbar flex touch-none p-px select-none",
        // Radix unmounts hidden bars after the exit animation, so they fade both ways.
        "data-[state=visible]:animate-in data-[state=visible]:fade-in-0 data-[state=visible]:duration-200",
        "data-[state=hidden]:animate-out data-[state=hidden]:fade-out-0 data-[state=hidden]:duration-200",
        "motion-reduce:animate-none",
        orientation === "vertical" &&
          "h-full w-2.5 border-l border-l-transparent",
        orientation === "horizontal" &&
          "h-2.5 flex-col border-t border-t-transparent",
        className
      )}
      {...props}
    >
      <ScrollAreaPrimitive.ScrollAreaThumb
        data-slot="scroll-area-thumb"
        className={cn(
          "relative flex-1 rounded-full bg-white/15 transition-colors duration-150 motion-reduce:transition-none",
          "group-hover/scrollbar:bg-white/30 active:bg-white/40",
          // A larger hit area than the visible thumb.
          "before:absolute before:top-1/2 before:left-1/2 before:size-full before:min-h-11 before:min-w-11 before:-translate-x-1/2 before:-translate-y-1/2"
        )}
      />
    </ScrollAreaPrimitive.ScrollAreaScrollbar>
  )
}

export { ScrollArea, ScrollBar }
