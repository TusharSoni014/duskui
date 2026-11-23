"use client";

import * as React from "react";
import { AnimatePresence, motion, useAnimate, useReducedMotion } from "motion/react";

import { Switch, type SwitchProps } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

export interface LoadingSwitchProps
  extends Omit<SwitchProps, "thumbContent" | "checked" | "defaultChecked" | "onCheckedChange"> {
  checked?: boolean;
  defaultChecked?: boolean;
  /**
   * Called with the requested state. Return a promise to show a spinner in the
   * thumb until it settles; if it rejects, the switch springs back and shakes.
   * When controlled, update `checked` inside the handler once the save succeeds.
   */
  onCheckedChange?: (checked: boolean) => void | Promise<unknown>;
  /** Called with the rejection reason when the promise fails. */
  onError?: (error: unknown) => void;
  /** Force the busy state from outside (e.g. while initial data loads). */
  loading?: boolean;
  /** Announced to screen readers while saving. */
  loadingLabel?: string;
  /** Announced to screen readers when the change is reverted. */
  errorLabel?: string;
}

function isPromise(value: unknown): value is Promise<unknown> {
  return !!value && typeof (value as Promise<unknown>).then === "function";
}

/**
 * A switch for settings that save to a server. It moves optimistically, shows
 * a spinner inside the thumb while `onCheckedChange` resolves, ignores extra
 * clicks while busy, and on failure springs back with a short shake and a red
 * ring. Progress and errors are announced politely to screen readers.
 */
export function LoadingSwitch({
  checked: checkedProp,
  defaultChecked = false,
  onCheckedChange,
  onError,
  loading = false,
  loadingLabel = "Saving",
  errorLabel = "Couldn't save. Change reverted.",
  className,
  thumbClassName,
  ...props
}: LoadingSwitchProps) {
  const reduceMotion = useReducedMotion();
  const [scope, animate] = useAnimate<HTMLSpanElement>();
  const [uncontrolled, setUncontrolled] = React.useState(defaultChecked);
  // The value we're saving, shown optimistically until the promise settles.
  const [pending, setPending] = React.useState<boolean | null>(null);
  const [failed, setFailed] = React.useState(false);
  const mounted = React.useRef(true);
  const errorTimer = React.useRef<ReturnType<typeof setTimeout>>(undefined);

  React.useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      clearTimeout(errorTimer.current);
    };
  }, []);

  const committed = checkedProp ?? uncontrolled;
  const shown = pending ?? committed;
  const busy = pending !== null || loading;

  const handleChange = async (next: boolean) => {
    if (busy) return;
    clearTimeout(errorTimer.current);
    setFailed(false);

    let result: void | Promise<unknown>;
    try {
      result = onCheckedChange?.(next);
    } catch (error) {
      onError?.(error);
      return;
    }

    if (!isPromise(result)) {
      if (checkedProp === undefined) setUncontrolled(next);
      return;
    }

    setPending(next);
    try {
      await result;
      if (mounted.current && checkedProp === undefined) setUncontrolled(next);
    } catch (error) {
      onError?.(error);
      if (!mounted.current) return;
      setFailed(true);
      errorTimer.current = setTimeout(() => setFailed(false), 2400);
      if (!reduceMotion && scope.current) {
        animate(scope.current, { x: [0, -3, 3, -2, 0] }, { duration: 0.3, delay: 0.15 });
      }
    } finally {
      if (mounted.current) setPending(null);
    }
  };

  return (
    <span ref={scope} data-slot="loading-switch" className="relative inline-flex">
      <Switch
        checked={shown}
        onCheckedChange={handleChange}
        aria-busy={busy || undefined}
        data-error={failed || undefined}
        className={cn("data-error:ring-[3px] data-error:ring-destructive/50", className)}
        thumbClassName={cn("text-background data-[state=checked]:text-foreground", thumbClassName)}
        thumbContent={
          <AnimatePresence initial={false}>
            {busy && (
              <motion.svg
                key="spinner"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden
                className="size-[70%]"
                initial={{ opacity: 0, scale: 0.4 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.4 }}
                transition={{ type: "spring", bounce: 0, duration: 0.25 }}
              >
                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity={0.25} strokeWidth={3} />
                <path
                  d="M21 12a9 9 0 0 0-9-9"
                  stroke="currentColor"
                  strokeWidth={3}
                  strokeLinecap="round"
                  className="origin-center animate-spin [animation-duration:0.7s] motion-reduce:[animation-duration:1.6s]"
                />
              </motion.svg>
            )}
          </AnimatePresence>
        }
        {...props}
      />
      <span role="status" className="sr-only">
        {pending !== null ? loadingLabel : failed ? errorLabel : ""}
      </span>
    </span>
  );
}
