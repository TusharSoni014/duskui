"use client";

import * as React from "react";
import { AnimatePresence, motion, useReducedMotion, type TargetAndTransition } from "motion/react";

import { cn } from "@/lib/utils";

export type CountdownUnit = "days" | "hours" | "minutes" | "seconds";

export interface CountdownProps extends Omit<React.ComponentProps<"div">, "children"> {
  /**
   * When the countdown ends: a `Date`, a timestamp in ms or any string `Date.parse` understands (prefer ISO 8601
   * with an offset). Pass `null` while it's unknown (e.g. computed in an effect) to keep the placeholders.
   */
  target: Date | number | string | null;
  /** Which units to show, largest first. The largest one absorbs the rest, e.g. hours can go past 24 without days. */
  units?: CountdownUnit[];
  /** Text under (or after, when compact) each unit. */
  labels?: Partial<Record<CountdownUnit, string>>;
  /** `"default"` shows boxed digits with labels; `"compact"` is a single inline line. */
  variant?: "default" | "compact";
  /** How a digit changes: rolling up, or flipping over like a drum. */
  animation?: "roll" | "flip";
  /** Called once when the countdown reaches zero (also on mount if the target has already passed). */
  onComplete?: () => void;
  /** Rendered instead of the digits once the countdown is over. */
  completed?: React.ReactNode;
  /** Accessible name of the timer. */
  label?: string;
  /** What screen readers hear when it ends. */
  completeText?: string;
  /** Classes for each unit's box. */
  unitClassName?: string;
}

const ORDER: CountdownUnit[] = ["days", "hours", "minutes", "seconds"];
const SECONDS: Record<CountdownUnit, number> = { days: 86400, hours: 3600, minutes: 60, seconds: 1 };
const LONG: Record<CountdownUnit, string> = { days: "Days", hours: "Hours", minutes: "Minutes", seconds: "Seconds" };
const SHORT: Record<CountdownUnit, string> = { days: "d", hours: "h", minutes: "m", seconds: "s" };

// One shared clock for every countdown on the page, ticking on the second boundary.
const listeners = new Set<() => void>();
let timer: ReturnType<typeof setTimeout> | undefined;
const readSecond = () => Math.floor(Date.now() / 1000);
function tick() {
  timer = setTimeout(() => {
    listeners.forEach((listener) => listener());
    tick();
  }, 1000 - (Date.now() % 1000) + 10);
}
function subscribeClock(listener: () => void) {
  listeners.add(listener);
  if (listeners.size === 1) tick();
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) {
      clearTimeout(timer);
      timer = undefined;
    }
  };
}
/** The server (and hydration) has no clock: render placeholders, then tick on the client. */
const serverSecond = () => null;

function toMs(target: Exclude<CountdownProps["target"], null>) {
  if (typeof target === "number") return target;
  if (target instanceof Date) return target.getTime();
  return Date.parse(target);
}

function split(totalSeconds: number, units: CountdownUnit[]) {
  let rest = totalSeconds;
  return units.map((unit) => {
    const value = Math.floor(rest / SECONDS[unit]);
    rest -= value * SECONDS[unit];
    return { unit, value };
  });
}

function plural(n: number, word: string) {
  return `${n} ${word}${n === 1 ? "" : "s"}`;
}

/** Spoken summary, rounded to the minute so the live region updates at most once a minute. */
function spoken(totalSeconds: number) {
  if (totalSeconds < 60) return "Less than a minute remaining";
  const minutes = Math.ceil(totalSeconds / 60);
  const d = Math.floor(minutes / 1440);
  const h = Math.floor((minutes % 1440) / 60);
  const m = minutes % 60;
  const parts = [d && plural(d, "day"), h && plural(h, "hour"), m && plural(m, "minute")].filter(Boolean);
  return `${parts.join(", ")} remaining`;
}

function Digit({ char, animation, reduce }: { char: string; animation: "roll" | "flip"; reduce: boolean }) {
  let enter: TargetAndTransition;
  let exit: TargetAndTransition;
  if (reduce) {
    enter = { opacity: 0 };
    exit = { opacity: 0, transition: { duration: 0.2 } };
  } else if (animation === "flip") {
    enter = { rotateX: -90, opacity: 0 };
    exit = { rotateX: 90, opacity: 0, transition: { duration: 0.25, ease: "easeIn" } };
  } else {
    enter = { y: "100%", opacity: 0 };
    exit = { y: "-100%", opacity: 0, transition: { duration: 0.3, ease: [0.4, 0, 1, 1] } };
  }
  return (
    <span
      className={cn(
        "relative inline-grid h-[1.15em] w-[1ch] place-items-center",
        animation === "flip" ? "[perspective:300px]" : "overflow-hidden"
      )}
    >
      <AnimatePresence initial={false}>
        <motion.span
          key={char}
          className="[grid-area:1/1] backface-hidden"
          initial={enter}
          animate={{ y: 0, rotateX: 0, opacity: 1 }}
          exit={exit}
          transition={reduce ? { duration: 0.2 } : { duration: 0.3, ease: "easeOut" }}
        >
          {char}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

function Digits({ text, animation, reduce }: { text: string; animation: "roll" | "flip"; reduce: boolean }) {
  const chars = text.split("");
  return (
    <span className="inline-flex tabular-nums">
      {chars.map((char, i) => (
        // Keyed from the right so the ones digit keeps its identity when the number gets shorter.
        <Digit key={chars.length - i} char={char} animation={animation} reduce={reduce} />
      ))}
    </span>
  );
}

/** A countdown to a target date with rolling or flipping digits, a compact variant and throttled screen reader announcements. */
export function Countdown({
  target,
  units = ORDER,
  labels,
  variant = "default",
  animation = "roll",
  onComplete,
  completed,
  label = "Countdown",
  completeText = "Countdown finished",
  unitClassName,
  className,
  ...props
}: CountdownProps) {
  const reduce = useReducedMotion() ?? false;
  const nowSecond = React.useSyncExternalStore(subscribeClock, readSecond, serverSecond);
  const targetMs = target === null ? null : toMs(target);
  const shown = ORDER.filter((u) => units.includes(u));
  const compact = variant === "compact";
  const names = { ...(compact ? SHORT : LONG), ...labels };

  // null until both the clock and the target are known; an invalid date counts as already over.
  const remaining =
    nowSecond === null || targetMs === null
      ? null
      : Number.isFinite(targetMs)
        ? Math.max(0, Math.floor(targetMs / 1000) - nowSecond)
        : 0;
  const done = remaining === 0;
  const parts = remaining === null ? null : split(remaining, shown);

  const onCompleteRef = React.useRef(onComplete);
  const fired = React.useRef(false);
  React.useEffect(() => {
    onCompleteRef.current = onComplete;
  });
  React.useEffect(() => {
    if (!done) {
      fired.current = false;
      return;
    }
    if (fired.current) return;
    fired.current = true;
    onCompleteRef.current?.();
  }, [done]);

  const announcement = remaining === null ? "" : done ? completeText : spoken(remaining);

  return (
    <div
      data-slot="countdown"
      data-state={remaining === null ? "pending" : done ? "complete" : "running"}
      role="group"
      aria-label={label}
      className={cn(
        compact
          ? "inline-flex items-baseline gap-2 font-mono text-sm tabular-nums text-foreground"
          : "inline-flex items-start gap-2 sm:gap-3",
        className
      )}
      {...props}
    >
      {done && completed ? (
        completed
      ) : (
        <>
          {shown.map((unit, i) => {
            const value = parts?.[i]?.value;
            // Two placeholder dashes until the client knows the time; same width as two digits.
            const text = value === undefined ? "––" : String(value).padStart(2, "0");
            return compact ? (
              <span key={unit} aria-hidden className={cn("inline-flex items-baseline", unitClassName)}>
                <Digits text={text} animation={animation} reduce={reduce} />
                <span className="ml-0.5 text-muted-foreground">{names[unit]}</span>
              </span>
            ) : (
              <div key={unit} aria-hidden className="flex flex-col items-center gap-2">
                <div
                  className={cn(
                    "relative flex min-w-[2.6em] justify-center overflow-hidden rounded-xl border border-white/10 bg-card px-2.5 py-2",
                    "text-2xl font-semibold leading-none text-foreground sm:text-5xl",
                    "after:pointer-events-none after:absolute after:inset-x-0 after:top-1/2 after:h-px after:bg-black/40",
                    unitClassName
                  )}
                >
                  <Digits text={text} animation={animation} reduce={reduce} />
                </div>
                <span className="text-xs text-muted-foreground">
                  {names[unit]}
                </span>
              </div>
            );
          })}
        </>
      )}
      <span className="sr-only" aria-live="polite" aria-atomic="true">
        {announcement}
      </span>
    </div>
  );
}
