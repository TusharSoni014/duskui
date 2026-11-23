"use client";

import * as React from "react";
import { flushSync } from "react-dom";
import { AnimatePresence, motion, useAnimate, useReducedMotion, type Transition, type Variants } from "motion/react";
import { MinusIcon, PlusIcon } from "lucide-react";

import { cn } from "@/lib/utils";

export interface NumberInputProps
  extends Omit<
    React.ComponentProps<"input">,
    "value" | "defaultValue" | "onChange" | "type" | "min" | "max" | "step" | "size" | "children"
  > {
  /** The number (controlled). `null` means empty. */
  value?: number | null;
  defaultValue?: number | null;
  /** Fires with the committed number after a step, or when typing is committed (blur / Enter). */
  onValueChange?: (value: number | null) => void;
  min?: number;
  max?: number;
  /** Amount for the buttons and Arrow keys. */
  step?: number;
  /** Amount for PageUp / PageDown and Shift + Arrow. Defaults to `step * 10`. */
  largeStep?: number;
  /** BCP 47 locale for `Intl.NumberFormat`. Fixed by default so server and browser render the same string. */
  locale?: string;
  /** `Intl.NumberFormat` options, e.g. `{ style: "currency", currency: "USD" }` or `{ style: "percent" }`. */
  formatOptions?: Intl.NumberFormatOptions;
  /** Step with the mouse wheel while the field is focused. */
  allowWheel?: boolean;
  size?: "sm" | "default" | "lg";
  /** Accessible name of the − button. */
  decrementLabel?: string;
  /** Accessible name of the + button. */
  incrementLabel?: string;
  /** Classes for the inner `<input>`. `className` styles the outer field. */
  inputClassName?: string;
}

const sizes = {
  sm: { root: "h-8 text-sm", button: "w-8 [&_svg]:size-3.5" },
  default: { root: "h-9 text-sm", button: "w-9 [&_svg]:size-4" },
  lg: { root: "h-11 text-base", button: "w-11 [&_svg]:size-4" },
} as const;

const rollSpring: Transition = { type: "spring", stiffness: 520, damping: 40, mass: 0.7 };

const roll: Variants = {
  enter: (direction: number) => ({ y: direction > 0 ? "60%" : "-60%", opacity: 0 }),
  center: { y: "0%", opacity: 1 },
  exit: (direction: number) => ({ y: direction > 0 ? "-60%" : "60%", opacity: 0 }),
};

const fade: Variants = {
  enter: { opacity: 0 },
  center: { opacity: 1 },
  exit: { opacity: 0 },
};

function decimalPlaces(n: number) {
  if (!Number.isFinite(n)) return 0;
  const [, fraction = ""] = String(n).split(".");
  return Math.min(fraction.replace(/e.*$/, "").length, 10);
}

/** Parses a localized string ("1,234.5", "1.234,5 €", "-12 %") into a number. Empty → null, garbage → NaN. */
function createParser(locale: string, percent: boolean) {
  const parts = new Intl.NumberFormat(locale).formatToParts(-12345.6);
  const group = parts.find((part) => part.type === "group")?.value ?? ",";
  const decimal = parts.find((part) => part.type === "decimal")?.value ?? ".";
  return (text: string): number | null => {
    let s = text.trim().replace(/[−‒–]/g, "-");
    if (!s) return null;
    s = s.split(group).join("").replace(/[\s  ]/g, "");
    s = s.split(decimal).join(".");
    s = s.replace(/[^0-9.-]/g, "");
    if (!/^-?(\d+\.?\d*|\.\d+)$/.test(s)) return NaN;
    const n = Number(s);
    return percent ? n / 100 : n;
  };
}

/** One character cell. Digits roll vertically in the direction of change; the invisible copy fixes the width. */
function RollingChar({ char, direction, reduceMotion }: { char: string; direction: number; reduceMotion: boolean }) {
  return (
    <span className="relative inline-flex justify-center overflow-hidden whitespace-pre">
      <span className="invisible">{char}</span>
      <AnimatePresence initial={false} custom={direction}>
        <motion.span
          key={char}
          custom={direction}
          variants={reduceMotion ? fade : roll}
          initial="enter"
          animate="center"
          exit="exit"
          transition={reduceMotion ? { duration: 0.12 } : rollSpring}
          className="absolute inset-0 flex items-center justify-center"
        >
          {char}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

/**
 * A number stepper: − / + buttons around a real text input whose digits roll
 * up or down when the value changes, like a mechanical counter. Digits use
 * `tabular-nums` and every character keeps its own fixed cell, so nothing
 * jitters. Hold a button to repeat (it accelerates), use Arrow keys,
 * Shift + Arrow / PageUp / PageDown for big steps, Home / End for the limits,
 * or type a value and press Enter. Values are formatted with
 * `Intl.NumberFormat` (currency, percent, units…) and clamped to min / max;
 * hitting a limit gives a small nudge. It's an `<input inputMode="decimal">`
 * with `role="spinbutton"`, so screen readers announce the value and range.
 */
export function NumberInput({
  value: valueProp,
  defaultValue = null,
  onValueChange,
  min,
  max,
  step = 1,
  largeStep,
  locale = "en-US",
  formatOptions,
  allowWheel = false,
  size = "default",
  decrementLabel = "Decrease",
  incrementLabel = "Increase",
  disabled = false,
  readOnly = false,
  name,
  id: idProp,
  className,
  inputClassName,
  onKeyDown,
  onBlur,
  ...props
}: NumberInputProps) {
  const autoId = React.useId();
  const id = idProp ?? autoId;
  const reduceMotion = useReducedMotion() ?? false;
  const [scope, animate] = useAnimate<HTMLDivElement>();
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [uncontrolled, setUncontrolled] = React.useState<number | null>(defaultValue);
  const value = valueProp !== undefined ? valueProp : uncontrolled;
  // The raw text while the user is typing; null shows the formatted value.
  const [draft, setDraft] = React.useState<string | null>(null);

  // Roll direction follows the change, including changes made by the parent.
  const [previous, setPrevious] = React.useState(value);
  const [direction, setDirection] = React.useState(1);
  if (value !== previous) {
    setPrevious(value);
    setDirection((value ?? 0) >= (previous ?? 0) ? 1 : -1);
  }

  const formatKey = JSON.stringify(formatOptions ?? null);
  const { format, parse, digits } = React.useMemo(() => {
    const options = (JSON.parse(formatKey) as Intl.NumberFormatOptions | null) ?? {};
    const percent = options.style === "percent";
    const nf = new Intl.NumberFormat(locale, {
      ...(options.maximumFractionDigits == null && options.style !== "currency"
        ? { maximumFractionDigits: Math.max(decimalPlaces(step), percent ? 0 : 2) }
        : null),
      ...options,
    });
    const fractionDigits = nf.resolvedOptions().maximumFractionDigits ?? 0;
    return {
      format: (n: number) => nf.format(n),
      parse: createParser(locale, percent),
      // Values are rounded to what the field can show, so the display never lies.
      digits: Math.min(fractionDigits + (percent ? 2 : 0), 15),
    };
  }, [locale, formatKey, step]);

  const clamp = (n: number) => Math.min(max ?? Infinity, Math.max(min ?? -Infinity, n));
  const round = (n: number) => Number(n.toFixed(digits));

  const commit = (next: number | null) => {
    const normalized = next === null ? null : round(clamp(next));
    if (normalized === value) return;
    if (valueProp === undefined) setUncontrolled(normalized);
    onValueChange?.(normalized);
  };

  const nudge = (dir: number) => {
    if (reduceMotion || !scope.current) return;
    animate(scope.current, { x: [0, dir * 4, 0] }, { duration: 0.25, ease: "easeOut" });
  };

  /** Reads (and clears) the typed text. Garbage falls back to the last good value. */
  const takeDraft = () => {
    if (draft === null) return value;
    setDraft(null);
    const parsed = parse(draft);
    if (parsed !== null && Number.isNaN(parsed)) return value;
    return parsed === null ? null : round(clamp(parsed));
  };

  /** Commits typed text. */
  const commitDraft = () => {
    if (draft !== null) commit(takeDraft());
  };

  /** Steps by `dir * amount` from the typed or current value. Returns false at a limit so press-and-hold can stop. */
  const stepBy = (dir: 1 | -1, amount = step) => {
    if (disabled || readOnly) return false;
    const base = takeDraft();
    if (base === null) {
      commit(clamp(0));
      return true;
    }
    const precision = Math.max(decimalPlaces(amount), decimalPlaces(base));
    const next = clamp(Number((base + dir * amount).toFixed(precision)));
    if (next === base) {
      commit(base);
      nudge(dir);
      return false;
    }
    commit(next);
    return dir > 0 ? max === undefined || next < max : min === undefined || next > min;
  };

  // Timers read the latest stepBy through a ref, updated after every render.
  const stepRef = React.useRef(stepBy);
  React.useLayoutEffect(() => {
    stepRef.current = stepBy;
  });

  const holdTimer = React.useRef<number | undefined>(undefined);
  const stopHold = React.useCallback(() => {
    window.clearTimeout(holdTimer.current);
    holdTimer.current = undefined;
  }, []);
  React.useEffect(() => stopHold, [stopHold]);

  const startHold = (dir: 1 | -1) => (event: React.PointerEvent<HTMLButtonElement>) => {
    if (event.button !== 0 || disabled || readOnly) return;
    // Keep focus where it is (the input, if it had it) and avoid text selection.
    event.preventDefault();
    stopHold();
    if (!stepRef.current(dir)) return;
    let interval = 120;
    const repeat = () => {
      if (!stepRef.current(dir)) return stopHold();
      interval = Math.max(35, interval * 0.88);
      holdTimer.current = window.setTimeout(repeat, interval);
    };
    holdTimer.current = window.setTimeout(repeat, 420);
    window.addEventListener("pointerup", stopHold, { once: true });
    window.addEventListener("pointercancel", stopHold, { once: true });
    window.addEventListener("blur", stopHold, { once: true });
  };

  React.useEffect(() => {
    const input = inputRef.current;
    if (!allowWheel || !input) return;
    let last = 0;
    const onWheel = (event: WheelEvent) => {
      if (document.activeElement !== input || Math.abs(event.deltaY) < 1) return;
      event.preventDefault();
      const now = event.timeStamp;
      if (now - last < 60) return;
      last = now;
      stepRef.current(event.deltaY < 0 ? 1 : -1);
    };
    input.addEventListener("wheel", onWheel, { passive: false });
    return () => input.removeEventListener("wheel", onWheel);
  }, [allowWheel]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    onKeyDown?.(event);
    if (event.defaultPrevented) return;
    const big = largeStep ?? step * 10;
    switch (event.key) {
      case "ArrowUp":
        event.preventDefault();
        stepBy(1, event.shiftKey ? big : step);
        break;
      case "ArrowDown":
        event.preventDefault();
        stepBy(-1, event.shiftKey ? big : step);
        break;
      case "PageUp":
        event.preventDefault();
        stepBy(1, big);
        break;
      case "PageDown":
        event.preventDefault();
        stepBy(-1, big);
        break;
      case "Home":
        if (min !== undefined && !readOnly) {
          event.preventDefault();
          setDraft(null);
          commit(min);
        }
        break;
      case "End":
        if (max !== undefined && !readOnly) {
          event.preventDefault();
          setDraft(null);
          commit(max);
        }
        break;
      case "Enter":
        // Commit synchronously so a submitting form sees the new value.
        if (draft !== null) flushSync(() => commitDraft());
        break;
      case "Escape":
        if (draft !== null) {
          event.preventDefault();
          setDraft(null);
        }
        break;
    }
  };

  const display = value === null ? "" : format(value);
  const editing = draft !== null;
  const atMin = value !== null && min !== undefined && value <= min;
  const atMax = value !== null && max !== undefined && value >= max;

  const stepButton = (dir: 1 | -1) => {
    const limited = dir > 0 ? atMax : atMin;
    return (
      <button
        type="button"
        tabIndex={-1}
        aria-label={dir > 0 ? incrementLabel : decrementLabel}
        aria-controls={id}
        aria-disabled={limited || undefined}
        disabled={disabled || readOnly}
        onPointerDown={startHold(dir)}
        onPointerLeave={stopHold}
        onContextMenu={(event) => event.preventDefault()}
        // Keyboard / screen-reader activation (pointer presses are handled on pointerdown).
        onClick={(event) => {
          if (event.detail === 0) stepBy(dir);
        }}
        className={cn(
          "grid shrink-0 touch-manipulation place-items-center text-muted-foreground outline-none select-none",
          "transition-[color,background-color] duration-150 ease-out motion-reduce:transition-none",
          "hover:bg-accent/60 hover:text-foreground active:bg-accent dark:hover:bg-input/50",
          "aria-disabled:cursor-not-allowed aria-disabled:text-muted-foreground/40 aria-disabled:hover:bg-transparent",
          "disabled:pointer-events-none",
          "[&_svg]:transition-transform [&_svg]:duration-150 active:[&_svg]:scale-90 aria-disabled:active:[&_svg]:scale-100 motion-reduce:active:[&_svg]:scale-100",
          dir > 0 ? "order-last border-l border-input" : "order-first border-r border-input",
          sizes[size].button
        )}
      >
        {dir > 0 ? <PlusIcon aria-hidden /> : <MinusIcon aria-hidden />}
      </button>
    );
  };

  return (
    <div
      ref={scope}
      data-slot="number-input"
      data-disabled={disabled || undefined}
      className={cn(
        "relative flex w-36 items-stretch overflow-hidden rounded-md border border-input bg-transparent shadow-xs dark:bg-input/30",
        "transition-[border-color,box-shadow,background-color] duration-200 ease-out motion-reduce:transition-none",
        "hover:border-ring/40 dark:hover:bg-input/40",
        "focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/30",
        "has-[input[aria-invalid=true]]:border-destructive has-[input[aria-invalid=true]]:ring-destructive/20 dark:has-[input[aria-invalid=true]]:ring-destructive/40",
        "data-disabled:cursor-not-allowed data-disabled:opacity-50",
        sizes[size].root,
        className
      )}
    >
      {stepButton(-1)}
      <div className="relative min-w-0 flex-1">
        <input
          ref={inputRef}
          id={id}
          type="text"
          role="spinbutton"
          inputMode="decimal"
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          aria-valuenow={value ?? undefined}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuetext={display || undefined}
          disabled={disabled}
          readOnly={readOnly}
          value={editing ? draft : display}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={(event) => {
            commitDraft();
            onBlur?.(event);
          }}
          className={cn(
            "size-full min-w-0 bg-transparent px-2 text-center font-medium tabular-nums outline-none placeholder:font-normal placeholder:text-muted-foreground disabled:cursor-not-allowed",
            "selection:bg-primary/30",
            // While the rolling overlay shows, the real text is invisible but still selectable and caret-able.
            !editing && display && "text-transparent caret-foreground selection:text-transparent",
            inputClassName
          )}
          {...props}
        />
        {!editing && display && (
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden px-2 font-medium whitespace-nowrap tabular-nums"
          >
            {display.split("").map((char, index, chars) => (
              // Keyed from the right so the units digit stays put when the number grows.
              <RollingChar
                key={chars.length - index}
                char={char}
                direction={direction}
                reduceMotion={reduceMotion}
              />
            ))}
          </span>
        )}
      </div>
      {stepButton(1)}
      {name && <input type="hidden" name={name} value={value ?? ""} disabled={disabled} />}
    </div>
  );
}
