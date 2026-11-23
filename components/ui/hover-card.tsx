"use client";

import * as React from "react";
import * as HoverCardPrimitive from "@radix-ui/react-hover-card";

import { cn } from "@/lib/utils";

/**
 * DuskUI Hover Card — a drop-in upgrade of the shadcn/ui Hover Card.
 *
 * Same parts, props and data-slot attributes as shadcn, plus:
 * - Snappier defaults: opens after 400ms and closes 200ms after the pointer
 *   leaves (Radix defaults are 700 / 300). Override with `openDelay` / `closeDelay`.
 * - Grows out of its trigger: the scale origin follows Radix's transform
 *   origin and it slides in from the side it opens on, on an expo-out curve,
 *   then closes quicker than it opened.
 * - A layered shadow and top highlight on the surface, and an optional arrow.
 * - Under `prefers-reduced-motion` it only fades.
 * CSS only (tw-animate-css). Radix handles hover intent, focus, Escape,
 * collision avoidance and positioning.
 */
function HoverCard({
  openDelay = 400,
  closeDelay = 200,
  ...props
}: React.ComponentProps<typeof HoverCardPrimitive.Root>) {
  return (
    <HoverCardPrimitive.Root
      data-slot="hover-card"
      openDelay={openDelay}
      closeDelay={closeDelay}
      {...props}
    />
  );
}

/** The element that opens the card on hover or keyboard focus. Usually a link (`asChild`). */
function HoverCardTrigger({ ...props }: React.ComponentProps<typeof HoverCardPrimitive.Trigger>) {
  return <HoverCardPrimitive.Trigger data-slot="hover-card-trigger" {...props} />;
}

/** The floating card. Portalled and positioned next to the trigger. */
function HoverCardContent({
  className,
  align = "center",
  sideOffset = 6,
  showArrow = false,
  children,
  ...props
}: React.ComponentProps<typeof HoverCardPrimitive.Content> & {
  /** Draw a small arrow pointing at the trigger. */
  showArrow?: boolean;
}) {
  return (
    <HoverCardPrimitive.Portal data-slot="hover-card-portal">
      <HoverCardPrimitive.Content
        data-slot="hover-card-content"
        align={align}
        sideOffset={sideOffset}
        className={cn(
          "z-50 w-64 rounded-xl border bg-popover p-4 text-popover-foreground outline-hidden",
          "origin-(--radix-hover-card-content-transform-origin)",
          "shadow-[inset_0_1px_0_rgb(255_255_255/0.05),0_16px_40px_-12px_rgb(0_0_0/0.7),0_0_0_1px_rgb(0_0_0/0.2)]",
          "ease-[cubic-bezier(0.16,1,0.3,1)]",
          "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-90 data-[state=open]:duration-250",
          "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=closed]:duration-120",
          "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
          "motion-reduce:data-[state=open]:zoom-in-100 motion-reduce:data-[state=closed]:zoom-out-100",
          "motion-reduce:data-[side=bottom]:slide-in-from-top-0 motion-reduce:data-[side=left]:slide-in-from-right-0 motion-reduce:data-[side=right]:slide-in-from-left-0 motion-reduce:data-[side=top]:slide-in-from-bottom-0",
          className
        )}
        {...props}
      >
        {children}
        {showArrow && (
          <HoverCardPrimitive.Arrow asChild width={14} height={7}>
            {/* Nudged 1px into the surface so its base covers the border line. */}
            <svg viewBox="0 0 14 7" className="block -translate-y-px fill-popover stroke-border" aria-hidden>
              <path d="M0 0 L7 6.5 L14 0" strokeWidth={1} />
            </svg>
          </HoverCardPrimitive.Arrow>
        )}
      </HoverCardPrimitive.Content>
    </HoverCardPrimitive.Portal>
  );
}

export { HoverCard, HoverCardTrigger, HoverCardContent };
