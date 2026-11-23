"use client";

import * as React from "react";
import { AnimatePresence, motion, useAnimate } from "motion/react";
import { Loader2, X } from "lucide-react";

import { Button, type ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type ButtonStatus = "idle" | "loading" | "success" | "error";

export interface StatusButtonProps extends Omit<ButtonProps, "loading"> {
  status?: ButtonStatus;
  /** Labels for each non-idle state. Idle shows `children`. */
  labels?: Partial<Record<Exclude<ButtonStatus, "idle">, React.ReactNode>>;
}

const defaultLabels = {
  loading: "Saving",
  success: "Saved",
  error: "Try again",
} as const;

const swap = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: { type: "spring", duration: 0.25, bounce: 0 },
} as const;

function AnimatedCheck() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <motion.path
        d="M4 12.5l5 5L20 6.5"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.35, delay: 0.1, ease: "easeOut" }}
      />
    </svg>
  );
}

/** Measures an element's width so the button can animate between label sizes. */
function useWidth<T extends HTMLElement>() {
  const ref = React.useRef<T>(null);
  const [width, setWidth] = React.useState<number>();
  React.useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) =>
      setWidth(entry.borderBoxSize?.[0]?.inlineSize ?? el.offsetWidth)
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return [ref, width] as const;
}

/**
 * One button that walks through idle → loading → success / error.
 * The width eases between labels, the success check draws itself and
 * errors give a short shake. Status changes are announced to screen readers.
 */
export function StatusButton({
  status = "idle",
  labels,
  className,
  children,
  onClick,
  ...props
}: StatusButtonProps) {
  const [scope, animate] = useAnimate<HTMLSpanElement>();
  const [measureRef, width] = useWidth<HTMLSpanElement>();
  const text = { ...defaultLabels, ...labels };

  React.useEffect(() => {
    if (status === "error" && scope.current) {
      animate(scope.current, { x: [0, -5, 5, -3, 3, 0] }, { duration: 0.4 });
    }
  }, [status, animate, scope]);

  const content: Record<ButtonStatus, React.ReactNode> = {
    idle: children,
    loading: (
      <>
        <Loader2 className="animate-spin" aria-hidden />
        {text.loading}
      </>
    ),
    success: (
      <>
        <AnimatedCheck />
        {text.success}
      </>
    ),
    error: (
      <>
        <X aria-hidden />
        {text.error}
      </>
    ),
  };

  return (
    <Button
      aria-busy={status === "loading" || undefined}
      aria-disabled={status === "loading" || undefined}
      onClick={(event) => {
        if (status === "loading") return event.preventDefault();
        onClick?.(event);
      }}
      className={cn(
        "overflow-hidden",
        // dark: + border overrides so the state colors win over every variant.
        status === "success" &&
          "border-transparent bg-emerald-500 text-white hover:bg-emerald-500/90 dark:bg-emerald-500 dark:hover:bg-emerald-500/90",
        status === "error" &&
          "border-transparent bg-destructive text-white hover:bg-destructive/90 dark:bg-destructive dark:hover:bg-destructive/90",
        className
      )}
      {...props}
    >
      <motion.span
        ref={scope}
        className="inline-flex justify-center"
        initial={false}
        animate={{ width: width ?? "auto" }}
        transition={{ type: "spring", duration: 0.3, bounce: 0 }}
      >
        <span ref={measureRef} aria-live="polite" className="relative inline-flex items-center whitespace-nowrap">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span key={status} className="inline-flex items-center gap-2" {...swap}>
              {content[status]}
            </motion.span>
          </AnimatePresence>
        </span>
      </motion.span>
    </Button>
  );
}

/**
 * Wires an async action to a StatusButton.
 * `const { status, run } = useStatusAction(save)` → `<StatusButton status={status} onClick={run} />`
 */
export function useStatusAction<T>(
  action: () => Promise<T>,
  { resetAfter = 1800 }: { resetAfter?: number } = {}
) {
  const [status, setStatus] = React.useState<ButtonStatus>("idle");
  const timer = React.useRef<ReturnType<typeof setTimeout>>(undefined);

  React.useEffect(() => () => clearTimeout(timer.current), []);

  const run = React.useCallback(async () => {
    clearTimeout(timer.current);
    setStatus("loading");
    try {
      const result = await action();
      setStatus("success");
      return result;
    } catch {
      setStatus("error");
      return undefined;
    } finally {
      timer.current = setTimeout(() => setStatus("idle"), resetAfter);
    }
  }, [action, resetAfter]);

  return { status, run, setStatus };
}
