"use client";

import * as React from "react";
import { AnimatePresence, motion, useAnimate, useReducedMotion, type Transition } from "motion/react";

import { Field } from "@/components/ui/field";
import { cn } from "@/lib/utils";

const heightSpring: Transition = { type: "spring", duration: 0.32, bounce: 0 };
const swapSpring: Transition = { type: "spring", duration: 0.28, bounce: 0 };

export interface AnimatedFieldProps extends React.ComponentProps<typeof Field> {
  /** Marks the field invalid (sets `data-invalid`). */
  invalid?: boolean;
  /**
   * Change this value — e.g. a submit counter — to shake the field once.
   * It only shakes while `invalid` is true, and never on the first render.
   */
  shakeKey?: number | string;
}

/**
 * A Field that shakes once when `shakeKey` changes while it's invalid — the
 * classic "nope" after a failed submit. The shake is a short decaying
 * translate, so nothing around it reflows. Skipped under reduced motion.
 */
export function AnimatedField({ invalid = false, shakeKey, className, ...props }: AnimatedFieldProps) {
  const [scope, animate] = useAnimate<HTMLDivElement>();
  const reduceMotion = useReducedMotion() ?? false;
  const lastKey = React.useRef(shakeKey);

  React.useEffect(() => {
    if (lastKey.current === shakeKey) return;
    lastKey.current = shakeKey;
    if (!invalid || reduceMotion || !scope.current) return;
    animate(scope.current, { x: [0, -8, 7, -5, 3, -1, 0] }, { duration: 0.45, ease: "easeOut" });
  }, [shakeKey, invalid, reduceMotion, animate, scope]);

  return (
    <Field
      ref={scope}
      data-invalid={invalid || undefined}
      className={cn("will-change-transform", className)}
      {...props}
    />
  );
}

export interface AnimatedFieldErrorProps {
  /** Put this id in the control's `aria-describedby`. */
  id?: string;
  /** The message. Falsy hides the error. */
  children?: React.ReactNode;
  /**
   * Classes for the collapsing wrapper. It carries `-mt-3` to cancel the
   * Field's `gap-3` while collapsed; change it if your Field uses another gap.
   */
  className?: string;
}

/**
 * A field error that grows open and collapses shut (height + opacity) so the
 * form below glides instead of jumping. When the message changes it
 * cross-fades in place. The last message stays visible while collapsing, and
 * the element is a live `role="alert"`, so each new message is announced.
 * Under reduced motion it fades without moving.
 */
export function AnimatedFieldError({ id, children, className }: AnimatedFieldErrorProps) {
  const reduceMotion = useReducedMotion() ?? false;
  const hasError = Boolean(children);

  // Keep the last message so it can collapse with its text instead of blanking first.
  const [shown, setShown] = React.useState<React.ReactNode>(children);
  if (hasError && children !== shown) setShown(children);

  const swapKey = typeof shown === "string" || typeof shown === "number" ? String(shown) : "message";

  return (
    <AnimatePresence initial={false}>
      {hasError && (
        <motion.div
          key="field-error"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={reduceMotion ? { duration: 0.15 } : heightSpring}
          className={cn("-mt-3 overflow-hidden", className)}
        >
          <div id={id} role="alert" data-slot="field-error" className="grid pt-2 text-sm text-destructive">
            <AnimatePresence initial={false} mode="popLayout">
              <motion.span
                key={swapKey}
                className="[grid-area:1/1]"
                initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 4 }}
                transition={swapSpring}
              >
                {shown}
              </motion.span>
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
