"use client";

import * as React from "react";
import {
  AnimatePresence,
  motion,
  useAnimate,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";

import { Badge, type BadgeProps } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const rollSpring = { stiffness: 280, damping: 28, mass: 0.8 };

/** One number (0–9) in a digit's reel, placed above or below the window by its distance from the current value. */
function ReelNumber({ reel, number }: { reel: MotionValue<number>; number: number }) {
  const y = useTransform(reel, (latest) => {
    const current = ((latest % 10) + 10) % 10;
    let offset = (10 + number - current) % 10;
    // Take the short way round so 9 → 0 rolls forward, not back through 8, 7…
    if (offset > 5) offset -= 10;
    return `${offset}em`;
  });
  return (
    <motion.span className="absolute inset-0 flex items-center justify-center" style={{ y }}>
      {number}
    </motion.span>
  );
}

/** A single digit column. `place` is 1, 10, 100… */
function Digit({ value, place, instant }: { value: number; place: number; instant: boolean }) {
  const target = Math.floor(value / place);
  const reel = useSpring(target, rollSpring);

  React.useEffect(() => {
    if (instant) reel.jump(target);
    else reel.set(target);
  }, [reel, target, instant]);

  return (
    <span className="relative inline-block h-[1em] w-[1ch] overflow-hidden">
      {Array.from({ length: 10 }, (_, n) => (
        <ReelNumber key={n} reel={reel} number={n} />
      ))}
    </span>
  );
}

export interface AnimatedCountBadgeProps extends Omit<BadgeProps, "children" | "asChild"> {
  /** The count. Negative numbers are shown as 0. */
  value: number;
  /** Above this, show `max+` (e.g. 99+). */
  max?: number;
  /** Give the badge a small bounce whenever the count goes up. */
  bump?: boolean;
  /** Screen-reader text for the count, e.g. `(n) => \`${n} unread messages\``. */
  label?: (value: number) => string;
}

/**
 * A count badge whose digits roll like an odometer when the value changes.
 * Each digit is its own spring, new digits slide in with a width animation,
 * and the badge can bump on increases. The visual digits are hidden from
 * screen readers; a plain-text label is read instead. Instant under reduced motion.
 */
export function AnimatedCountBadge({
  value,
  max = 99,
  bump = true,
  label,
  className,
  ...props
}: AnimatedCountBadgeProps) {
  const reduceMotion = useReducedMotion() ?? false;
  const [scope, animate] = useAnimate<HTMLSpanElement>();
  const safe = Math.max(0, Math.floor(value));
  const shown = Math.min(safe, max);
  const overflow = safe > max;
  const places = Array.from({ length: String(shown).length }, (_, i) => 10 ** (String(shown).length - 1 - i));

  const previous = React.useRef(safe);
  React.useEffect(() => {
    if (bump && !reduceMotion && safe > previous.current && scope.current) {
      animate(scope.current, { scale: [1, 1.18, 1] }, { duration: 0.35, ease: "easeOut" });
    }
    previous.current = safe;
  }, [safe, bump, reduceMotion, animate, scope]);

  return (
    <Badge
      ref={scope}
      className={cn("min-w-5 rounded-full px-1.5 leading-none tabular-nums", className)}
      {...props}
    >
      <span aria-hidden className="inline-flex items-center">
        <AnimatePresence initial={false}>
          {places.map((place) => (
            <motion.span
              key={place}
              className="inline-flex justify-end overflow-hidden"
              initial={reduceMotion ? false : { width: "0ch", opacity: 0 }}
              animate={{ width: "1ch", opacity: 1 }}
              exit={{ width: "0ch", opacity: 0 }}
              transition={reduceMotion ? { duration: 0 } : { type: "spring", duration: 0.3, bounce: 0 }}
            >
              <Digit value={shown} place={place} instant={reduceMotion} />
            </motion.span>
          ))}
        </AnimatePresence>
        {overflow && <span>+</span>}
      </span>
      <span className="sr-only">{label ? label(safe) : safe}</span>
    </Badge>
  );
}
