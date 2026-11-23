"use client";

import * as React from "react";
import {
  animate,
  useInView,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
} from "motion/react";

import { cn } from "@/lib/utils";

type NumberTickerTag = "span" | "p" | "div" | "strong" | "data" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

export interface NumberTickerProps extends Omit<React.HTMLAttributes<HTMLElement>, "children" | "prefix"> {
  /** The number to count to. Changing it later springs from the current value to the new one. */
  value: number;
  /** Where the count starts the first time it comes into view. */
  from?: number;
  /** BCP 47 locale for `Intl.NumberFormat`. Fixed by default so server and browser render the same string. */
  locale?: string;
  /** ISO 4217 code, e.g. `"USD"`. Formats as currency. */
  currency?: string;
  /** Fixed number of decimals. Defaults to the decimals in `value` (or the currency's default). */
  decimals?: number;
  /** Any other `Intl.NumberFormat` options (`notation`, `style: "percent"`, `signDisplay`…). They win over the props above. */
  format?: Intl.NumberFormatOptions;
  /** Text before the number, e.g. `"~"`. */
  prefix?: string;
  /** Text after the number, e.g. `"+"` or `" users"`. */
  suffix?: string;
  /** Spring duration in seconds (the perceived length of the count). */
  duration?: number;
  /** Spring bounciness, 0–1. Keep at 0 to never overshoot the target. */
  bounce?: number;
  /** Seconds to wait after entering the view. */
  delay?: number;
  /** Count only the first time it scrolls into view. When `false` it recounts from `from` every time. */
  once?: boolean;
  /** Set to `false` to always show the final value. */
  animate?: boolean;
  /** Element to render. */
  as?: NumberTickerTag;
}

/** Number of decimal places in a plain number, e.g. 4.25 → 2. */
function decimalPlaces(n: number) {
  if (!Number.isFinite(n)) return 0;
  const [, fraction = ""] = String(n).split(".");
  return Math.min(fraction.replace(/e.*$/, "").length, 6);
}

/**
 * A number that counts up (or down) to its value with a spring when it
 * scrolls into view, formatted with `Intl.NumberFormat`.
 *
 * The final value is rendered on the server, so search engines, no-JS
 * visitors and screen readers always get the real number (the animated copy
 * is `aria-hidden`; a visually hidden copy holds the final value). Digits use
 * `tabular-nums` and the element reserves the width of its widest value, so
 * nothing around it jitters. Under reduced motion the final value is shown.
 */
export function NumberTicker({
  value,
  from = 0,
  locale = "en-US",
  currency,
  decimals,
  format,
  prefix = "",
  suffix = "",
  duration = 1.6,
  bounce = 0,
  delay = 0,
  once = true,
  animate: shouldAnimate = true,
  as = "span",
  className,
  ...props
}: NumberTickerProps) {
  const Comp = as as React.ElementType;
  const rootRef = React.useRef<HTMLElement>(null);
  const liveRef = React.useRef<HTMLSpanElement>(null);
  const primed = React.useRef(false);
  const played = React.useRef(false);

  const reduceMotion = useReducedMotion();
  const inView = useInView(rootRef, { once, amount: 0.5 });
  const motionValue = useMotionValue(value);

  // Options are compared by content so inline objects don't rebuild the formatter every render.
  const formatKey = JSON.stringify(format ?? null);
  const formatter = React.useMemo(() => {
    const extra = JSON.parse(formatKey) as Intl.NumberFormatOptions | null;
    const options: Intl.NumberFormatOptions = currency ? { style: "currency", currency } : {};
    const fixed =
      decimals ??
      (!currency &&
      (extra?.style ?? "decimal") === "decimal" &&
      extra?.minimumFractionDigits == null &&
      extra?.maximumFractionDigits == null &&
      extra?.notation == null
        ? decimalPlaces(value)
        : undefined);
    if (fixed != null) {
      options.minimumFractionDigits = fixed;
      options.maximumFractionDigits = fixed;
    }
    const nf = new Intl.NumberFormat(locale, { ...options, ...extra });
    const digits = nf.resolvedOptions().maximumFractionDigits ?? 0;
    const step = 0.5 * 10 ** -digits;
    // Snap values that would round to zero so a count never shows "-0".
    return (n: number) => `${prefix}${nf.format(Math.abs(n) < step ? 0 : n)}${suffix}`;
  }, [locale, currency, decimals, formatKey, value, prefix, suffix]);

  // Write the animated number straight to the DOM: no React render per frame.
  useMotionValueEvent(motionValue, "change", (latest) => {
    if (liveRef.current) liveRef.current.textContent = formatter(latest);
  });

  const enabled = shouldAnimate && !reduceMotion;

  // Before the first client paint, rewind to `from` so the count can play when it's seen.
  React.useLayoutEffect(() => {
    if (!enabled || primed.current) return;
    primed.current = true;
    motionValue.jump(from);
  }, [enabled, from, motionValue]);

  // React re-renders the final string; keep the DOM showing the motion value instead.
  React.useLayoutEffect(() => {
    if (liveRef.current) liveRef.current.textContent = formatter(motionValue.get());
  });

  React.useEffect(() => {
    if (!enabled) {
      motionValue.jump(value);
      return;
    }
    if (!inView) {
      if (!once && played.current) motionValue.jump(from);
      return;
    }
    played.current = true;
    const controls = animate(motionValue, value, { type: "spring", duration, bounce, delay });
    return () => controls.stop();
  }, [enabled, inView, once, value, from, duration, bounce, delay, motionValue]);

  const finalText = formatter(value);
  const fromText = formatter(from);
  const stack = "[grid-area:1/1] whitespace-nowrap";

  return (
    <Comp
      ref={rootRef}
      data-slot="number-ticker"
      {...(as === "data" ? { value: String(value) } : null)}
      className={cn("inline-grid justify-items-end tabular-nums", className)}
      {...props}
    >
      {/* The real value for screen readers and search engines. */}
      <span className="sr-only">{finalText}</span>
      {/* Invisible copies reserve the widest of the start and end values. */}
      <span aria-hidden className={cn(stack, "invisible select-none")}>
        {finalText}
      </span>
      <span aria-hidden className={cn(stack, "invisible select-none")}>
        {fromText}
      </span>
      <span ref={liveRef} aria-hidden className={stack}>
        {finalText}
      </span>
    </Comp>
  );
}
