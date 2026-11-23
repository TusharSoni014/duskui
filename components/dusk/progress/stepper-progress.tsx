"use client";

import * as React from "react";
import { AnimatePresence, motion, useReducedMotion, type Transition } from "motion/react";

import { cn } from "@/lib/utils";

const fill: Transition = { type: "spring", stiffness: 120, damping: 22 };
const pop: Transition = { type: "spring", duration: 0.45, bounce: 0.45 };

export type StepperStep = {
  /** Short step name shown under the marker. */
  title: string;
  /** Optional second line. */
  description?: string;
};

export interface StepperProgressProps extends Omit<React.ComponentProps<"ol">, "children"> {
  steps: (StepperStep | string)[];
  /** Index of the step in progress. Steps before it are complete; `steps.length` means all done. */
  current: number;
  /** Accessible name for the list, e.g. "Checkout progress". */
  label?: string;
}

function Check({ instant }: { instant: boolean }) {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
      <motion.path
        d="M5 12.5l4.5 4.5L19 7.5"
        initial={{ pathLength: instant ? 1 : 0 }}
        animate={{ pathLength: 1 }}
        transition={instant ? { duration: 0 } : { duration: 0.35, ease: "easeOut", delay: 0.1 }}
      />
    </svg>
  );
}

/**
 * A horizontal stepper for multi-step flows. Connectors fill with a spring as
 * you advance, completed markers draw a check mark, and the current marker
 * has a soft breathing halo. Semantically an ordered list with
 * `aria-current="step"` on the active step and the state of each step spelled
 * out for screen readers. Static under reduced motion.
 */
export function StepperProgress({ steps, current, label = "Progress", className, ...props }: StepperProgressProps) {
  const reduceMotion = useReducedMotion() ?? false;
  const items = steps.map((step) => (typeof step === "string" ? { title: step } : step));
  const active = Math.min(Math.max(0, current), items.length);

  return (
    <ol aria-label={label} className={cn("flex w-full items-start", className)} {...props}>
      {items.map((step, index) => {
        const state = index < active ? "complete" : index === active ? "current" : "upcoming";
        const isLast = index === items.length - 1;
        return (
          <li
            key={`${step.title}-${index}`}
            aria-current={state === "current" ? "step" : undefined}
            className="relative flex min-w-0 flex-1 basis-0 flex-col items-center text-center"
            data-state={state}
          >
            {/* Connector to the next step. Columns are equal, so it spans one column minus both markers. */}
            {!isLast && (
              <span
                aria-hidden
                className="absolute top-4 left-[calc(50%+1.25rem)] h-0.5 w-[calc(100%-2.5rem)] -translate-y-1/2 overflow-hidden rounded-full bg-muted"
              >
                <motion.span
                  className="block h-full origin-left rounded-full bg-primary"
                  initial={false}
                  animate={{ scaleX: index < active ? 1 : 0 }}
                  transition={reduceMotion ? { duration: 0 } : fill}
                />
              </span>
            )}

            <span aria-hidden className="relative grid size-8 place-items-center">
              {state === "current" && !reduceMotion && (
                <motion.span
                  className="absolute inset-0 rounded-full bg-primary/25"
                  initial={{ scale: 1, opacity: 0.7 }}
                  animate={{ scale: 1.6, opacity: 0 }}
                  transition={{ duration: 1.8, ease: "easeOut", repeat: Infinity }}
                />
              )}
              <motion.span
                className={cn(
                  "relative grid size-8 place-items-center rounded-full border-2 text-xs font-semibold tabular-nums transition-colors duration-300",
                  state === "complete" && "border-primary bg-primary text-primary-foreground",
                  state === "current" && "border-primary bg-background text-primary",
                  state === "upcoming" && "border-border bg-background text-muted-foreground"
                )}
                initial={false}
                animate={{ scale: state === "current" && !reduceMotion ? 1.08 : 1 }}
                transition={pop}
              >
                <AnimatePresence initial={false} mode="popLayout">
                  {state === "complete" ? (
                    <motion.span
                      key="check"
                      initial={reduceMotion ? false : { scale: 0.4, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.4, opacity: 0, transition: { duration: 0.12 } }}
                      transition={pop}
                    >
                      <Check instant={reduceMotion} />
                    </motion.span>
                  ) : (
                    <motion.span
                      key="number"
                      initial={reduceMotion ? false : { scale: 0.4, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.4, opacity: 0, transition: { duration: 0.12 } }}
                      transition={pop}
                    >
                      {index + 1}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.span>
            </span>

            <span className="mt-2 max-w-28 px-1">
              <span
                className={cn(
                  "block truncate text-xs font-medium transition-colors duration-300 sm:text-sm",
                  state === "upcoming" ? "text-muted-foreground" : "text-foreground"
                )}
              >
                {step.title}
              </span>
              {step.description && (
                <span className="mt-0.5 hidden truncate text-xs text-muted-foreground sm:block">{step.description}</span>
              )}
              <span className="sr-only">
                {state === "complete" ? " (completed)" : state === "current" ? " (current step)" : " (not started)"}
              </span>
            </span>
          </li>
        );
      })}
    </ol>
  );
}
