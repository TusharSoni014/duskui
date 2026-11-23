"use client";

import * as React from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

type CheckedState = boolean | "indeterminate";

export interface TaskCheckboxProps
  extends Omit<React.ComponentProps<typeof Checkbox>, "children" | "checked" | "defaultChecked"> {
  checked?: CheckedState;
  defaultChecked?: CheckedState;
  /** The task text. A line draws through it when checked, across every wrapped line. */
  label: React.ReactNode;
  /** Optional secondary line (due date, project…). */
  description?: React.ReactNode;
  /** Small ring and particle burst around the box when checked. Off by default. */
  celebrate?: boolean;
  /** Classes for the outer row. */
  containerClassName?: string;
}

// Six particles around a circle, precomputed so SSR and client markup match.
const particles = [
  [0, -1],
  [0.866, -0.5],
  [0.866, 0.5],
  [0, 1],
  [-0.866, 0.5],
  [-0.866, -0.5],
] as const;

/**
 * A to-do row: checking it draws the check, strikes the label through from
 * left to right (wrapping onto every line) and dims the text; `celebrate`
 * adds a small ring + particle burst. The whole label is clickable.
 * Built on the DuskUI Checkbox (Radix), so it works in forms and with the keyboard.
 */
export function TaskCheckbox({
  checked: checkedProp,
  defaultChecked = false,
  onCheckedChange,
  label,
  description,
  celebrate = false,
  id,
  className,
  containerClassName,
  ...props
}: TaskCheckboxProps) {
  const autoId = React.useId();
  const checkboxId = id ?? autoId;
  const descriptionId = `${checkboxId}-description`;
  const reduceMotion = useReducedMotion();
  const [uncontrolled, setUncontrolled] = React.useState<CheckedState>(defaultChecked);
  // Bumped on every check so the burst replays.
  const [burst, setBurst] = React.useState(0);
  const checked = checkedProp ?? uncontrolled;
  const done = checked === true;

  return (
    <div
      data-slot="task-checkbox"
      data-done={done || undefined}
      className={cn("group/task flex items-start gap-3", containerClassName)}
    >
      <span className="relative mt-0.5 grid">
        <Checkbox
          id={checkboxId}
          checked={checked}
          aria-describedby={description ? descriptionId : undefined}
          onCheckedChange={(next) => {
            if (checkedProp === undefined) setUncontrolled(next);
            if (next === true) setBurst((b) => b + 1);
            onCheckedChange?.(next);
          }}
          className={cn("size-[1.125rem] rounded-[5px]", className)}
          {...props}
        />
        {celebrate && !reduceMotion && (
          <AnimatePresence>
            {done && burst > 0 && (
              <motion.span
                key={burst}
                aria-hidden
                className="pointer-events-none absolute inset-0"
                exit={{ opacity: 0, transition: { duration: 0.1 } }}
              >
                <motion.span
                  className="absolute inset-0 rounded-[5px] border border-primary"
                  initial={{ scale: 1, opacity: 0.5 }}
                  animate={{ scale: 1.8, opacity: 0 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                />
                {particles.map(([x, y]) => (
                  <motion.span
                    key={`${x}-${y}`}
                    className="absolute top-1/2 left-1/2 -mt-[2px] -ml-[2px] size-1 rounded-full bg-primary"
                    initial={{ x: 0, y: 0, scale: 1, opacity: 0.7 }}
                    animate={{ x: x * 12, y: y * 12, scale: 0, opacity: 0 }}
                    transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                  />
                ))}
              </motion.span>
            )}
          </AnimatePresence>
        )}
      </span>
      <div className="grid min-w-0 gap-0.5">
        <label
          htmlFor={checkboxId}
          className="cursor-pointer text-sm leading-6 font-medium text-foreground transition-colors duration-300 group-data-done/task:text-muted-foreground"
        >
          {/* An inline background line: it draws across wrapped lines one after another. */}
          <span
            className={cn(
              "bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1.5px] bg-[position:0_58%] bg-no-repeat",
              "transition-[background-size] duration-300 ease-[cubic-bezier(0.65,0,0.35,1)] motion-reduce:transition-none",
              "group-data-done/task:bg-[length:100%_1.5px]"
            )}
          >
            {label}
          </span>
        </label>
        {description && (
          <p
            id={descriptionId}
            className="text-xs text-muted-foreground transition-opacity duration-300 group-data-done/task:opacity-60"
          >
            {description}
          </p>
        )}
      </div>
    </div>
  );
}
