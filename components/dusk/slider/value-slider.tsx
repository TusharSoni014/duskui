"use client";

import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  useVelocity,
} from "motion/react";

import { cn } from "@/lib/utils";

export interface ValueSliderProps
  extends Omit<React.ComponentProps<typeof SliderPrimitive.Root>, "value" | "defaultValue" | "onValueChange"> {
  value?: number[];
  defaultValue?: number[];
  onValueChange?: (value: number[]) => void;
  /** Formats the number in the bubble and the screen-reader value text. */
  formatValue?: (value: number) => string;
  /** When the bubble is visible: while interacting (hover, focus, drag) or always. */
  showBubble?: "interacting" | "always";
  /** Accessible name. Range thumbs get “minimum” / “maximum” appended. */
  "aria-label"?: string;
}

const defaultFormat = (value: number) => String(value);

type ThumbProps = {
  value: number;
  index: number;
  count: number;
  range: number;
  visible: boolean;
  label?: string;
  format: (value: number) => string;
  dragging: boolean;
  onFocusChange: (index: number, focused: boolean) => void;
};

function ValueThumb({ value, index, count, range, visible, label, format, dragging, onFocusChange }: ThumbProps) {
  const reduceMotion = useReducedMotion() ?? false;
  // The value as a motion value, so its velocity can tilt the bubble without re-rendering.
  const position = useMotionValue(value);
  React.useEffect(() => {
    position.set(value);
  }, [position, value]);

  const velocity = useVelocity(position);
  // Moving right makes the bubble lean left, like it's being dragged along.
  const lean = useTransform(velocity, (v) => {
    if (reduceMotion || range <= 0) return 0;
    return Math.max(-14, Math.min(14, (-v / range) * 9));
  });
  const rotate = useSpring(lean, { stiffness: 300, damping: 18 });

  const names = count === 2 ? ["minimum", "maximum"] : undefined;
  const thumbLabel = label
    ? count === 1
      ? label
      : `${label}, ${names?.[index] ?? `value ${index + 1} of ${count}`}`
    : undefined;

  return (
    <SliderPrimitive.Thumb
      aria-label={thumbLabel}
      aria-valuetext={format(value)}
      // Show the bubble for keyboard focus only; Radix focuses thumbs without
      // focus-visible on pointer down, and dragging is handled separately.
      onFocus={(event) => onFocusChange(index, event.currentTarget.matches(":focus-visible"))}
      onKeyDown={() => onFocusChange(index, true)}
      onBlur={() => onFocusChange(index, false)}
      className={cn(
        "group/thumb relative block size-5 rounded-full outline-none",
        "focus-visible:ring-[3px] focus-visible:ring-ring/50 data-[disabled]:pointer-events-none"
      )}
    >
      {/* The visible knob scales on its own so the bubble keeps its size. */}
      <span
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-0 rounded-full border-2 border-primary bg-background shadow-[0_1px_3px_rgb(0_0_0/0.5)]",
          "transition-[scale,background-color,box-shadow] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none",
          "group-hover/thumb:scale-110",
          dragging &&
            "group-focus/thumb:scale-125 group-focus/thumb:bg-primary group-focus/thumb:shadow-[0_0_0_6px_color-mix(in_oklab,var(--color-primary)_18%,transparent)]"
        )}
      />
      <AnimatePresence>
        {visible && (
          <span key="bubble" aria-hidden className="pointer-events-none absolute bottom-full left-1/2 mb-3 -translate-x-1/2">
            <motion.span
              className="relative flex origin-bottom flex-col items-center"
              style={{ rotate }}
              initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 6, scale: 0.6 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 4, scale: 0.7, transition: { duration: 0.12 } }}
              transition={reduceMotion ? { duration: 0.15 } : { type: "spring", duration: 0.35, bounce: 0.35 }}
            >
              <span className="min-w-9 rounded-md bg-primary px-2 py-1 text-center text-xs font-semibold whitespace-nowrap text-primary-foreground tabular-nums shadow-[0_6px_16px_-4px_color-mix(in_oklab,var(--color-primary)_60%,transparent)]">
                {format(value)}
              </span>
              <span className="-mt-1 size-2 rotate-45 rounded-[1px] bg-primary" />
            </motion.span>
          </span>
        )}
      </AnimatePresence>
    </SliderPrimitive.Thumb>
  );
}

/**
 * A slider with a value bubble riding on each thumb. The bubble springs up on
 * hover, focus or drag, leans into the direction you're dragging (driven by
 * the value's velocity, so it never re-renders per frame) and settles upright
 * when you stop. Works for single values and ranges, and announces the
 * formatted value via aria-valuetext. No lean and a plain fade under reduced motion.
 */
export function ValueSlider({
  value: valueProp,
  defaultValue,
  onValueChange,
  min = 0,
  max = 100,
  formatValue = defaultFormat,
  showBubble = "interacting",
  className,
  disabled,
  "aria-label": ariaLabel,
  onPointerEnter,
  onPointerLeave,
  onPointerDown,
  onPointerUp,
  onLostPointerCapture,
  ...props
}: ValueSliderProps) {
  const [internal, setInternal] = React.useState<number[]>(defaultValue ?? [min]);
  const values = valueProp ?? internal;
  const [hovered, setHovered] = React.useState(false);
  const [dragging, setDragging] = React.useState(false);
  const [focused, setFocused] = React.useState<number[]>([]);

  const handleChange = (next: number[]) => {
    if (valueProp === undefined) setInternal(next);
    onValueChange?.(next);
  };

  const handleFocus = React.useCallback((index: number, isFocused: boolean) => {
    setFocused((current) =>
      isFocused ? (current.includes(index) ? current : [...current, index]) : current.filter((i) => i !== index)
    );
  }, []);

  const interacting = hovered || dragging;

  return (
    <SliderPrimitive.Root
      value={values}
      onValueChange={handleChange}
      min={min}
      max={max}
      disabled={disabled}
      data-dragging={dragging || undefined}
      className={cn(
        "relative flex w-full touch-none items-center py-2 select-none data-[disabled]:opacity-50",
        className
      )}
      onPointerEnter={(event) => {
        onPointerEnter?.(event);
        if (event.pointerType === "mouse") setHovered(true);
      }}
      onPointerLeave={(event) => {
        onPointerLeave?.(event);
        setHovered(false);
      }}
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
      {...props}
    >
      <SliderPrimitive.Track className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-muted">
        <SliderPrimitive.Range className="absolute h-full rounded-full bg-[linear-gradient(90deg,color-mix(in_oklab,var(--color-primary)_65%,transparent),var(--color-primary))]" />
      </SliderPrimitive.Track>
      {values.map((v, index) => (
        <ValueThumb
          key={index}
          value={v}
          index={index}
          count={values.length}
          range={max - min}
          label={ariaLabel}
          format={formatValue}
          dragging={dragging}
          visible={!disabled && (showBubble === "always" || interacting || focused.includes(index))}
          onFocusChange={handleFocus}
        />
      ))}
    </SliderPrimitive.Root>
  );
}
