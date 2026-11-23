"use client";

import * as React from "react";
import { AnimatePresence, motion, useAnimate } from "motion/react";

import { cn } from "@/lib/utils";

export interface OTPInputProps
  extends Omit<React.ComponentProps<"input">, "value" | "defaultValue" | "onChange" | "maxLength"> {
  length?: number;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** Called once every slot is filled. */
  onComplete?: (value: string) => void;
  /** Insert a separator after every N slots. 0 to disable. */
  groupSize?: number;
  /** Shake and turn red. */
  invalid?: boolean;
  /** Characters allowed. Defaults to digits. */
  pattern?: string;
}

/**
 * One-time-code field. A single real <input> sits invisibly over the slots,
 * so paste, SMS autofill (autocomplete="one-time-code"), backspace and screen
 * readers all work natively. The slots are just a visual layer.
 */
export function OTPInput({
  length = 6,
  value,
  defaultValue = "",
  onValueChange,
  onComplete,
  groupSize = 3,
  invalid = false,
  pattern = "[0-9]",
  disabled,
  className,
  onFocus,
  onBlur,
  ...props
}: OTPInputProps) {
  const id = React.useId();
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [scope, animate] = useAnimate<HTMLDivElement>();
  const [internal, setInternal] = React.useState(defaultValue);
  const [focused, setFocused] = React.useState(false);
  const current = (value ?? internal).slice(0, length);
  const allowed = React.useMemo(() => new RegExp(`^${pattern}$`), [pattern]);

  React.useEffect(() => {
    if (invalid && scope.current) {
      animate(scope.current, { x: [0, -6, 6, -4, 4, 0] }, { duration: 0.4 });
    }
  }, [invalid, animate, scope]);

  const update = (raw: string) => {
    const next = [...raw].filter((ch) => allowed.test(ch)).join("").slice(0, length);
    if (value === undefined) setInternal(next);
    onValueChange?.(next);
    if (next.length === length && current.length !== length) onComplete?.(next);
  };

  const activeIndex = focused ? Math.min(current.length, length - 1) : -1;

  return (
    <div
      ref={scope}
      className={cn("relative inline-flex items-center gap-2", disabled && "opacity-50", className)}
    >
      <input
        ref={inputRef}
        inputMode={pattern === "[0-9]" ? "numeric" : "text"}
        autoComplete="one-time-code"
        maxLength={length}
        value={current}
        disabled={disabled}
        aria-invalid={invalid || undefined}
        aria-label={props["aria-label"] ?? `${length}-character code`}
        className="absolute inset-0 z-10 cursor-text bg-transparent text-transparent caret-transparent outline-none selection:bg-transparent disabled:cursor-not-allowed"
        onChange={(e) => update(e.target.value)}
        onFocus={(e) => {
          setFocused(true);
          e.target.setSelectionRange(e.target.value.length, e.target.value.length);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          onBlur?.(e);
        }}
        // Keep the caret at the end so typing always fills the next slot.
        onSelect={(e) => {
          const el = e.currentTarget;
          el.setSelectionRange(el.value.length, el.value.length);
        }}
        {...props}
      />

      {Array.from({ length }, (_, i) => {
        const char = current[i];
        const isActive = i === activeIndex;
        return (
          <React.Fragment key={i}>
            {groupSize > 0 && i > 0 && i % groupSize === 0 && (
              <span aria-hidden className="h-0.5 w-2.5 rounded-full bg-border" />
            )}
            <div
              aria-hidden
              className={cn(
                "relative flex size-11 items-center justify-center rounded-lg border border-input bg-transparent font-mono text-lg font-medium shadow-xs transition-colors duration-200 dark:bg-input/30",
                char && "border-ring/40",
                invalid && "border-destructive text-destructive"
              )}
            >
              {isActive && (
                <motion.span
                  layoutId={`${id}-active`}
                  className={cn(
                    "absolute -inset-px rounded-lg border-2 ring-[3px]",
                    invalid ? "border-destructive ring-destructive/20" : "border-ring ring-ring/25"
                  )}
                  transition={{ type: "spring", duration: 0.3, bounce: 0.15 }}
                />
              )}
              <AnimatePresence mode="popLayout" initial={false}>
                {char ? (
                  <motion.span
                    key={char + i}
                    initial={{ opacity: 0, y: 8, scale: 0.6 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.6 }}
                    transition={{ type: "spring", duration: 0.3, bounce: 0.3 }}
                  >
                    {char}
                  </motion.span>
                ) : isActive ? (
                  <motion.span
                    key="caret"
                    className="h-5 w-px bg-foreground"
                    animate={{ opacity: [1, 1, 0, 0] }}
                    transition={{ duration: 1, repeat: Infinity, times: [0, 0.5, 0.5, 1] }}
                  />
                ) : null}
              </AnimatePresence>
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
}
