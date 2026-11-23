"use client";

import * as React from "react";
import { AnimatePresence, motion, useReducedMotion, type Transition } from "motion/react";

import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

const heightSpring: Transition = { type: "spring", bounce: 0.15, duration: 0.35 };

// Shared by the textarea and its invisible twin, so both wrap text identically.
const metrics = "px-3 py-2 text-base leading-6 md:text-sm md:leading-6 border";

export interface AutoResizeTextareaProps
  extends Omit<React.ComponentProps<"textarea">, "value" | "defaultValue" | "rows"> {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** Height when empty, in lines. */
  minRows?: number;
  /** Grows up to this many lines, then scrolls. */
  maxRows?: number;
  /** Character limit. Shows a counter ring that turns amber, then red, near the limit. */
  maxLength?: number;
  /** Fraction of `maxLength` at which the counter turns amber. */
  warnAt?: number;
  /** `false` lets people type past the limit and marks the field invalid instead of blocking input. */
  enforceLimit?: boolean;
  /** Classes for the wrapper. `className` styles the textarea. */
  containerClassName?: string;
}

/**
 * A textarea that springs to fit its content instead of jumping a line at a
 * time, between `minRows` and `maxRows`. An invisible twin with the same text
 * is measured with a ResizeObserver, so it works in every browser and never
 * reads layout on keystrokes. With `maxLength` a counter ring fills as you
 * type and turns amber, then red near the limit; screen readers hear only the
 * threshold changes, not every keystroke. Under reduced motion the height
 * changes instantly.
 */
export function AutoResizeTextarea({
  value: valueProp,
  defaultValue = "",
  onValueChange,
  onChange,
  minRows = 2,
  maxRows = 8,
  maxLength,
  warnAt = 0.8,
  enforceLimit = true,
  className,
  containerClassName,
  id,
  "aria-describedby": ariaDescribedBy,
  "aria-invalid": ariaInvalid,
  ...props
}: AutoResizeTextareaProps) {
  const autoId = React.useId();
  const fieldId = id ?? autoId;
  const counterId = `${fieldId}-counter`;
  const reduceMotion = useReducedMotion();
  const twinRef = React.useRef<HTMLDivElement>(null);
  const [uncontrolled, setUncontrolled] = React.useState(defaultValue);
  const [height, setHeight] = React.useState<number | null>(null);
  const value = valueProp ?? uncontrolled;

  React.useLayoutEffect(() => {
    const twin = twinRef.current;
    if (!twin) return;
    const observer = new ResizeObserver(([entry]) =>
      setHeight(Math.round(entry.borderBoxSize?.[0]?.blockSize ?? twin.offsetHeight))
    );
    observer.observe(twin);
    return () => observer.disconnect();
  }, []);

  const count = value.length;
  const ratio = maxLength ? count / maxLength : 0;
  const level = !maxLength ? "ok" : count > maxLength ? "over" : count === maxLength ? "full" : ratio >= warnAt ? "warn" : "ok";
  const remaining = maxLength ? maxLength - count : 0;
  const invalid = ariaInvalid ?? (level === "over" || undefined);

  // Lines are 1.5rem; padding + border add 1.125rem (2.375rem with room for the counter).
  const chrome = maxLength ? 2.375 : 1.125;
  const minHeight = `${minRows * 1.5 + chrome}rem`;
  const maxHeight = `${maxRows * 1.5 + chrome}rem`;

  return (
    <div data-slot="auto-resize-textarea" className={cn("relative w-full", containerClassName)}>
      {/* The twin: same text, same metrics, invisible. Its height is the target height. */}
      <div
        ref={twinRef}
        aria-hidden
        className={cn(
          "pointer-events-none invisible absolute inset-x-0 top-0 overflow-hidden border-transparent break-words whitespace-pre-wrap",
          metrics,
          maxLength && "pb-7"
        )}
        style={{ minHeight, maxHeight }}
      >
        {/* A trailing newline needs a character after it to take up a line. */}
        {value}{" "}
      </div>

      <motion.div
        initial={false}
        animate={height === null ? undefined : { height }}
        transition={reduceMotion ? { duration: 0 } : heightSpring}
        className="relative"
        style={{ minHeight }}
      >
        <Textarea
          id={fieldId}
          value={value}
          maxLength={enforceLimit ? maxLength : undefined}
          aria-invalid={invalid}
          aria-describedby={cn(ariaDescribedBy, maxLength && counterId) || undefined}
          onChange={(event) => {
            if (valueProp === undefined) setUncontrolled(event.target.value);
            onValueChange?.(event.target.value);
            onChange?.(event);
          }}
          className={cn("field-sizing-fixed h-full min-h-0 resize-none", metrics, maxLength && "pb-7", className)}
          {...props}
        />
      </motion.div>

      {maxLength ? (
        <CharacterCounter
          id={counterId}
          count={count}
          max={maxLength}
          level={level}
          remaining={remaining}
          reduceMotion={reduceMotion ?? false}
        />
      ) : null}
    </div>
  );
}

type Level = "ok" | "warn" | "full" | "over";

const levelColor: Record<Level, string> = {
  ok: "text-muted-foreground",
  warn: "text-amber-400",
  full: "text-destructive",
  over: "text-destructive",
};

function CharacterCounter({
  id,
  count,
  max,
  level,
  remaining,
  reduceMotion,
}: {
  id: string;
  count: number;
  max: number;
  level: Level;
  remaining: number;
  reduceMotion: boolean;
}) {
  const progress = Math.min(count / max, 1);
  const radius = 7;
  const circumference = 2 * Math.PI * radius;
  const showNumber = level !== "ok";

  const announcement =
    level === "over"
      ? `${-remaining} characters over the limit`
      : level === "full"
        ? "Character limit reached"
        : level === "warn"
          ? `${remaining} characters left`
          : "";

  // Announce only when the level changes, not on every keystroke.
  const [spoken, setSpoken] = React.useState("");
  const [lastLevel, setLastLevel] = React.useState<Level>(level);
  if (lastLevel !== level) {
    setLastLevel(level);
    setSpoken(announcement);
  }

  return (
    <div
      className={cn(
        "pointer-events-none absolute right-2.5 bottom-2 flex items-center gap-1.5 text-xs tabular-nums transition-colors duration-200",
        levelColor[level]
      )}
    >
      <AnimatePresence initial={false} mode="popLayout">
        {showNumber && (
          <motion.span
            key="number"
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, x: 6, filter: "blur(2px)" }}
            animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, x: 6, filter: "blur(2px)" }}
            transition={{ type: "spring", duration: 0.3, bounce: 0 }}
          >
            {remaining}
          </motion.span>
        )}
      </AnimatePresence>
      <motion.svg
        viewBox="0 0 18 18"
        className="size-4.5 -rotate-90"
        aria-hidden
        animate={level === "full" || level === "over" ? (reduceMotion ? {} : { scale: [1, 1.25, 1] }) : { scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <circle cx="9" cy="9" r={radius} fill="none" stroke="currentColor" strokeOpacity={0.2} strokeWidth={2} />
        <motion.circle
          cx="9"
          cy="9"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={false}
          animate={{ strokeDashoffset: circumference * (1 - progress) }}
          transition={reduceMotion ? { duration: 0 } : { type: "spring", duration: 0.3, bounce: 0 }}
          className={cn(level === "ok" && "text-primary")}
        />
      </motion.svg>
      <span id={id} className="sr-only">
        {count} of {max} characters used
      </span>
      <span className="sr-only" aria-live="polite">
        {spoken}
      </span>
    </div>
  );
}
