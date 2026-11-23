"use client"

import * as React from "react"
import * as AvatarPrimitive from "@radix-ui/react-avatar"

import { cn } from "@/lib/utils"

/**
 * DuskUI Avatar — a drop-in upgrade of the shadcn/ui Avatar.
 *
 * Same parts, props and data-slot attributes as shadcn, plus:
 * - The image fades in (with a slight settle and de-blur) once it has loaded,
 *   instead of popping in over the fallback.
 * - A hairline inner border so photos don't bleed into dark backgrounds.
 * - A tinted, on-theme fallback for initials and icons.
 * - Under `prefers-reduced-motion` the image only fades.
 * CSS only (tw-animate-css). Radix renders the image only after it loads and
 * shows the fallback while it loads or if it fails.
 */
function Avatar({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Root>) {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      className={cn(
        "relative flex size-8 shrink-0 overflow-hidden rounded-full select-none",
        // Hairline edge drawn above the image, following the avatar's radius.
        "after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit] after:border after:border-white/10",
        className
      )}
      {...props}
    />
  )
}

/** The photo. Rendered only once it has loaded, then fades in. Always pass `alt`. */
function AvatarImage({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Image>) {
  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      className={cn(
        "aspect-square size-full object-cover",
        "animate-in fade-in-0 zoom-in-110 blur-in-[2px] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
        "motion-reduce:zoom-in-100 motion-reduce:blur-in-0",
        className
      )}
      {...props}
    />
  )
}

/** Shown while the image loads or when it fails. Usually initials or an icon. */
function AvatarFallback({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Fallback>) {
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn(
        "flex size-full items-center justify-center rounded-full text-xs font-medium uppercase",
        "bg-[linear-gradient(140deg,color-mix(in_oklab,var(--color-primary)_22%,var(--color-muted)),var(--color-muted))] text-foreground/85",
        className
      )}
      {...props}
    />
  )
}

export { Avatar, AvatarImage, AvatarFallback }
