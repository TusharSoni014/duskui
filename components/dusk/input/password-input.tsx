"use client";

import * as React from "react";
import { AnimatePresence, motion } from "motion/react";
import { Eye, EyeOff } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export interface PasswordInputProps
  extends Omit<React.ComponentProps<"input">, "type"> {
  /** Show a 4-step strength meter under the field. */
  showStrength?: boolean;
}

const levels = [
  { label: "Too short", color: "var(--color-destructive)" },
  { label: "Weak", color: "var(--color-destructive)" },
  { label: "Fair", color: "#f59e0b" },
  { label: "Good", color: "#84cc16" },
  { label: "Strong", color: "var(--color-primary)" },
] as const;

/** 0–4. Simple, dependency-free heuristic; swap in zxcvbn for real policies. */
export function passwordScore(value: string) {
  if (value.length < 8) return 0;
  let score = 1;
  if (/[a-z]/.test(value) && /[A-Z]/.test(value)) score++;
  if (/\d/.test(value) && /[^A-Za-z0-9]/.test(value)) score++;
  if (value.length >= 12) score++;
  return score;
}

const icon = {
  initial: { opacity: 0, scale: 0.5, filter: "blur(3px)" },
  animate: { opacity: 1, scale: 1, filter: "blur(0px)" },
  exit: { opacity: 0, scale: 0.5, filter: "blur(3px)" },
  transition: { type: "spring", duration: 0.25, bounce: 0 },
} as const;

/** Password field with an animated show/hide toggle and optional strength meter. */
export function PasswordInput({
  showStrength = false,
  className,
  value,
  defaultValue,
  onChange,
  ...props
}: PasswordInputProps) {
  const meterId = React.useId();
  const [visible, setVisible] = React.useState(false);
  const [internal, setInternal] = React.useState(String(defaultValue ?? ""));
  const current = value !== undefined ? String(value) : internal;
  const score = passwordScore(current);

  return (
    <div className="w-full">
      <div className="relative">
        <Input
          type={visible ? "text" : "password"}
          autoComplete="current-password"
          value={value}
          defaultValue={defaultValue}
          aria-describedby={showStrength ? meterId : undefined}
          className={cn("pr-10", className)}
          onChange={(e) => {
            setInternal(e.target.value);
            onChange?.(e);
          }}
          {...props}
        />
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label={visible ? "Hide password" : "Show password"}
          aria-pressed={visible}
          className="absolute right-0.5 top-1/2 size-8 -translate-y-1/2 text-muted-foreground hover:text-foreground active:scale-90"
          onClick={() => setVisible((v) => !v)}
        >
          <span className="relative inline-flex">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span key={visible ? "hide" : "show"} className="inline-flex" {...icon}>
                {visible ? <EyeOff /> : <Eye />}
              </motion.span>
            </AnimatePresence>
          </span>
        </Button>
      </div>

      {showStrength && (
        <div id={meterId} className="mt-2">
          <div className="flex gap-1" aria-hidden>
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="h-1 flex-1 overflow-hidden rounded-full bg-muted">
                <motion.div
                  className="h-full origin-left rounded-full"
                  initial={false}
                  animate={{
                    scaleX: current && score >= step ? 1 : 0,
                    backgroundColor: levels[score].color,
                  }}
                  transition={{ type: "spring", duration: 0.4, bounce: 0, delay: (step - 1) * 0.04 }}
                />
              </div>
            ))}
          </div>
          <p className="mt-1.5 h-4 text-xs text-muted-foreground" aria-live="polite">
            {current && (
              <>
                Strength: <span style={{ color: levels[score].color }}>{levels[score].label}</span>
              </>
            )}
          </p>
        </div>
      )}
    </div>
  );
}
