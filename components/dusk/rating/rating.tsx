"use client";

import * as React from "react";
import { motion, useReducedMotion } from "motion/react";
import { Star, type LucideProps } from "lucide-react";

import { cn } from "@/lib/utils";

const sizes = { sm: 18, md: 24, lg: 32 } as const;

export interface RatingProps
  extends Omit<React.ComponentProps<"div">, "children" | "defaultValue" | "onChange" | "role"> {
  value?: number;
  defaultValue?: number;
  onValueChange?: (value: number) => void;
  /** Number of icons. */
  count?: number;
  /** Allow half steps (3.5). */
  allowHalf?: boolean;
  /** Display only. Fractions like 4.3 fill precisely. */
  readOnly?: boolean;
  disabled?: boolean;
  /** Clicking the current value again resets to 0. */
  clearable?: boolean;
  /** Icon size: a preset or pixels. */
  size?: keyof typeof sizes | number;
  /** Fill color (any CSS color). Defaults to the primary mint. */
  color?: string;
  /** Any lucide icon (or component taking className, fill, strokeWidth). */
  icon?: React.ComponentType<LucideProps>;
  /** Name for a hidden input, so the value is submitted with a form. */
  name?: string;
  /** Accessible name, e.g. "Rate your stay". */
  label?: string;
  /** Text read for a value. Defaults to "3.5 out of 5 stars". */
  getValueText?: (value: number, count: number) => string;
}

const clamp = (value: number, max: number) => Math.min(max, Math.max(0, value));

/**
 * A star rating input with hover preview, half steps and a small pop as stars fill, exposed as a keyboard-friendly slider that also submits with forms.
 */
export function Rating({
  value: valueProp,
  defaultValue = 0,
  onValueChange,
  count = 5,
  allowHalf = false,
  readOnly = false,
  disabled = false,
  clearable = true,
  size = "md",
  color,
  icon: Icon = Star,
  name,
  label = "Rating",
  getValueText = (v, max) => `${v} out of ${max} star${max === 1 ? "" : "s"}`,
  className,
  style,
  onKeyDown,
  ...props
}: RatingProps) {
  const reduceMotion = useReducedMotion();
  const [uncontrolled, setUncontrolled] = React.useState(defaultValue);
  const [hover, setHover] = React.useState<number | null>(null);
  // Bumped on every pick so the filled stars replay their pop.
  const [pop, setPop] = React.useState(0);
  const value = clamp(valueProp ?? uncontrolled, count);
  const step = allowHalf ? 0.5 : 1;
  const interactive = !readOnly && !disabled;
  const display = interactive && hover !== null ? hover : value;
  const px = typeof size === "number" ? size : sizes[size];
  const rootStyle = { "--rating-color": color ?? "var(--color-primary)", ...style } as React.CSSProperties;

  const commit = (next: number) => {
    const snapped = clamp(Math.round(next / step) * step, count);
    if (valueProp === undefined) setUncontrolled(snapped);
    if (snapped > 0) setPop((p) => p + 1);
    onValueChange?.(snapped);
  };

  const valueAt = (event: React.MouseEvent<HTMLElement>, index: number) => {
    if (!allowHalf) return index + 1;
    const rect = event.currentTarget.getBoundingClientRect();
    return event.clientX - rect.left < rect.width / 2 ? index + 0.5 : index + 1;
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(event);
    if (!interactive || event.defaultPrevented) return;
    let next: number | null = null;
    if (event.key === "ArrowRight" || event.key === "ArrowUp") next = value + step;
    else if (event.key === "ArrowLeft" || event.key === "ArrowDown") next = value - step;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = count;
    else if (/^[0-9]$/.test(event.key) && Number(event.key) <= count) next = Number(event.key);
    if (next === null) return;
    event.preventDefault();
    if (clamp(next, count) !== value) commit(next);
  };

  const stars = Array.from({ length: count }, (_, index) => {
    const fill = clamp(display - index, 1);
    const filled = value >= index + step - 0.001;
    const previewing = interactive && hover !== null;
    return (
      <span
        key={index}
        aria-hidden
        data-star={index}
        className={cn("relative grid shrink-0 place-items-center", interactive && "cursor-pointer")}
        style={{ width: px, height: px }}
        onPointerMove={interactive ? (event) => event.pointerType === "mouse" && setHover(valueAt(event, index)) : undefined}
        onClick={
          interactive
            ? (event) => {
                const next = valueAt(event, index);
                commit(clearable && next === value ? 0 : next);
              }
            : undefined
        }
      >
        <motion.span
          key={filled ? pop : "idle"}
          className="relative grid size-full place-items-center"
          initial={pop === 0 || !filled || reduceMotion ? false : { scale: 0.85 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", bounce: 0.15, duration: 0.25, delay: reduceMotion ? 0 : index * 0.03 }}
        >
          <Icon className="absolute size-full text-muted-foreground/35" strokeWidth={1.5} />
          <span
            className={cn(
              "absolute inset-0 grid place-items-center",
              "transition-[clip-path,opacity] duration-150 ease-out motion-reduce:transition-none",
              "text-(--rating-color)",
              previewing && "opacity-70"
            )}
            style={{ clipPath: `inset(0 ${100 - fill * 100}% 0 0)` }}
          >
            <Icon
              className="size-full"
              fill="currentColor"
              strokeWidth={1.5}
            />
          </span>
        </motion.span>
      </span>
    );
  });

  if (readOnly) {
    return (
      <div
        role="img"
        aria-label={`${label}: ${getValueText(value, count)}`}
        data-slot="rating"
        data-readonly=""
        className={cn("inline-flex items-center gap-1", disabled && "opacity-50", className)}
        style={rootStyle}
        {...props}
      >
        {stars}
        {name ? <input type="hidden" name={name} value={value} /> : null}
      </div>
    );
  }

  return (
    <div
      role="slider"
      tabIndex={disabled ? -1 : 0}
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={count}
      aria-valuenow={value}
      aria-valuetext={getValueText(value, count)}
      aria-disabled={disabled || undefined}
      data-slot="rating"
      className={cn(
        "inline-flex items-center gap-1 rounded-md outline-none select-none",
        "focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:ring-offset-4 focus-visible:ring-offset-background",
        disabled && "pointer-events-none opacity-50",
        className
      )}
      style={rootStyle}
      onKeyDown={handleKeyDown}
      onPointerLeave={() => setHover(null)}
      {...props}
    >
      {stars}
      {name ? <input type="hidden" name={name} value={value} /> : null}
    </div>
  );
}
