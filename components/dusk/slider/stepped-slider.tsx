"use client";

import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { motion, useReducedMotion } from "motion/react";

import { cn } from "@/lib/utils";

export type SteppedSliderStep = string | { value: string; label: React.ReactNode; valueText?: string };

export interface SteppedSliderProps
  extends Omit<
    React.ComponentProps<typeof SliderPrimitive.Root>,
    "value" | "defaultValue" | "onValueChange" | "onValueCommit" | "min" | "max" | "step" | "name" | "inverted" | "minStepsBetweenThumbs" | "orientation"
  > {
  /** The choices, in order. Strings are both the value and the label. */
  steps: SteppedSliderStep[];
  /** The selected step's value. */
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** Fires when the user finishes changing the value (pointer up or key press). */
  onValueCommit?: (value: string) => void;
  /** Submits the selected step's value with a form. */
  name?: string;
  /** Hide the labels under the ticks. */
  hideLabels?: boolean;
  /** Accessible name for the slider. */
  "aria-label"?: string;
}

function normalize(step: SteppedSliderStep) {
  return typeof step === "string"
    ? { value: step, label: step as React.ReactNode, valueText: step }
    : { ...step, valueText: step.valueText ?? (typeof step.label === "string" ? step.label : step.value) };
}

/**
 * A slider that snaps between named steps (sizes, plans, levels). Tick marks
 * light up as the range passes them, the selected tick stretches and glows,
 * and clicking a label jumps to it. Works with arrows, Home/End and Page keys,
 * announces the step's label via aria-valuetext and can submit the step's
 * value in a form. Ticks change instantly under reduced motion.
 */
export function SteppedSlider({
  steps,
  value: valueProp,
  defaultValue,
  onValueChange,
  onValueCommit,
  name,
  hideLabels = false,
  disabled,
  className,
  "aria-label": ariaLabel,
  onPointerDown,
  onPointerUp,
  onLostPointerCapture,
  ...props
}: SteppedSliderProps) {
  const reduceMotion = useReducedMotion() ?? false;
  const [dragging, setDragging] = React.useState(false);
  const items = React.useMemo(() => steps.map(normalize), [steps]);
  const [internal, setInternal] = React.useState(defaultValue ?? items[0]?.value);
  const selected = valueProp ?? internal;
  const index = Math.max(0, items.findIndex((item) => item.value === selected));
  const last = Math.max(1, items.length - 1);

  const toValue = (i: number) => items[Math.min(items.length - 1, Math.max(0, i))]?.value ?? "";

  return (
    <div className={cn("w-full", !hideLabels ? "pb-9" : "pb-3", className)}>
      <SliderPrimitive.Root
        value={[index]}
        min={0}
        max={last}
        step={1}
        disabled={disabled}
        onValueChange={([i]) => {
          const next = toValue(i);
          if (valueProp === undefined) setInternal(next);
          onValueChange?.(next);
        }}
        onValueCommit={([i]) => onValueCommit?.(toValue(i))}
        data-dragging={dragging || undefined}
        onPointerDown={(event) => {
          onPointerDown?.(event);
          if (!disabled && event.button === 0) setDragging(true);
        }}
        onPointerUp={(event) => {
          onPointerUp?.(event);
          setDragging(false);
        }}
        onLostPointerCapture={(event) => {
          onLostPointerCapture?.(event);
          setDragging(false);
        }}
        className="group/slider relative flex h-5 w-full touch-none items-center select-none data-[disabled]:opacity-50"
        {...props}
      >
        <SliderPrimitive.Track className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-muted">
          <SliderPrimitive.Range className="absolute h-full rounded-full bg-[linear-gradient(90deg,color-mix(in_oklab,var(--color-primary)_65%,transparent),var(--color-primary))]" />
        </SliderPrimitive.Track>

        {/* Ticks and labels. Inset by half a thumb so they line up with the thumb's centre at every step. */}
        <span aria-hidden className="absolute inset-x-2.5 top-full mt-1.5">
          {items.map((item, i) => {
            const percent = (i / last) * 100;
            const lit = i <= index;
            const current = i === index;
            return (
              <span key={item.value} className="absolute top-0 flex -translate-x-1/2 flex-col items-center" style={{ left: `${percent}%` }}>
                <motion.span
                  className={cn(
                    "block h-1.5 w-0.5 origin-top rounded-full transition-[background-color,box-shadow] duration-300",
                    lit ? "bg-primary" : "bg-muted-foreground/35",
                    current && "shadow-[0_0_8px_var(--color-primary)]"
                  )}
                  initial={false}
                  animate={{ scaleY: current && !reduceMotion ? 1.7 : 1 }}
                  transition={reduceMotion ? { duration: 0 } : { type: "spring", duration: 0.35, bounce: 0.5 }}
                />
                {!hideLabels && (
                  <motion.span
                    className={cn(
                      "mt-2 cursor-pointer text-xs whitespace-nowrap transition-colors duration-200",
                      current ? "font-medium text-foreground" : lit ? "text-foreground/70" : "text-muted-foreground",
                      disabled && "cursor-default"
                    )}
                    initial={false}
                    animate={{ y: current && !reduceMotion ? 1 : 0, scale: current && !reduceMotion ? 1.06 : 1 }}
                    transition={reduceMotion ? { duration: 0 } : { type: "spring", duration: 0.3, bounce: 0.3 }}
                  >
                    {item.label}
                  </motion.span>
                )}
              </span>
            );
          })}
        </span>

        <SliderPrimitive.Thumb
          aria-label={ariaLabel}
          aria-valuetext={items[index]?.valueText}
          className={cn(
            "block size-5 rounded-full border-2 border-primary bg-background shadow-[0_1px_3px_rgb(0_0_0/0.5)] outline-none",
            "transition-[scale,box-shadow] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none",
            "hover:scale-110 group-data-[dragging]/slider:scale-125 focus-visible:ring-[3px] focus-visible:ring-ring/50",
            "data-[disabled]:pointer-events-none"
          )}
        />
      </SliderPrimitive.Root>
      {name && <input type="hidden" name={name} value={items[index]?.value ?? ""} disabled={disabled} />}
    </div>
  );
}
