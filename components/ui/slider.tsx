"use client"

import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"

import { cn } from "@/lib/utils"

/**
 * DuskUI Slider — a drop-in upgrade of the shadcn/ui Slider.
 *
 * Same API as shadcn: pass one value for a single thumb or several for a
 * range (`defaultValue={[20, 80]}`), horizontal or vertical. Plus:
 * - The thumb you're dragging grows a little and fills in, so it's clear which one moves.
 * - A solid range fill; the track lightens slightly on hover.
 * - A clear focus-visible ring for keyboard users (arrows, Page Up/Down, Home/End).
 * - Under `prefers-reduced-motion` sizes change instantly.
 * - `aria-label` / `aria-labelledby` on the Slider are forwarded to the thumbs
 *   (range thumbs are suffixed "minimum" / "maximum").
 * CSS only (no Motion). The root gets `data-dragging` while a pointer is down.
 */
function Slider({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  onPointerDown,
  onPointerUp,
  onPointerCancel,
  onLostPointerCapture,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  ...props
}: React.ComponentProps<typeof SliderPrimitive.Root>) {
  const [dragging, setDragging] = React.useState(false)

  // One thumb per value. With no value at all, render a single thumb at `min`.
  const thumbCount = (Array.isArray(value) ? value : Array.isArray(defaultValue) ? defaultValue : [min]).length
  const rangeNames = thumbCount === 2 ? ["minimum", "maximum"] : undefined

  // The root is a plain span, so its label is moved onto each thumb (role="slider").
  const thumbLabel = (index: number) => {
    if (!ariaLabel) return undefined
    if (thumbCount === 1) return ariaLabel
    return `${ariaLabel}, ${rangeNames?.[index] ?? `value ${index + 1} of ${thumbCount}`}`
  }

  return (
    <SliderPrimitive.Root
      data-slot="slider"
      data-dragging={dragging || undefined}
      defaultValue={defaultValue}
      value={value}
      min={min}
      max={max}
      className={cn(
        "group/slider relative flex w-full touch-none items-center select-none",
        "data-[disabled]:opacity-50 data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-44 data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col",
        className
      )}
      onPointerDown={(event) => {
        onPointerDown?.(event)
        if (!props.disabled && event.button === 0) setDragging(true)
      }}
      onPointerUp={(event) => {
        onPointerUp?.(event)
        setDragging(false)
      }}
      onPointerCancel={(event) => {
        onPointerCancel?.(event)
        setDragging(false)
      }}
      onLostPointerCapture={(event) => {
        onLostPointerCapture?.(event)
        setDragging(false)
      }}
      {...props}
    >
      <SliderPrimitive.Track
        data-slot="slider-track"
        className={cn(
          "relative grow overflow-hidden rounded-full bg-muted transition-colors duration-150 group-hover/slider:bg-secondary",
          "data-[orientation=horizontal]:h-1.5 data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-1.5"
        )}
      >
        <SliderPrimitive.Range
          data-slot="slider-range"
          className={cn(
            "absolute rounded-full bg-primary",
            "data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full"
          )}
        />
      </SliderPrimitive.Track>
      {Array.from({ length: thumbCount }, (_, index) => (
        <SliderPrimitive.Thumb
          data-slot="slider-thumb"
          key={index}
          aria-label={thumbLabel(index)}
          aria-labelledby={thumbCount === 1 ? ariaLabelledBy : undefined}
          className={cn(
            "block size-4 shrink-0 rounded-full border-2 border-primary bg-background outline-none",
            "shadow-sm transition-[scale,box-shadow,background-color] duration-150 ease-out",
            // The thumb being dragged is the focused one: Radix focuses it on pointer down.
            "group-data-[dragging]/slider:focus:scale-110 group-data-[dragging]/slider:focus:bg-primary",
            "focus-visible:ring-[3px] focus-visible:ring-ring/50",
            "data-[disabled]:pointer-events-none",
            "motion-reduce:transition-none"
          )}
        />
      ))}
    </SliderPrimitive.Root>
  )
}

export { Slider }
