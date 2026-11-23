"use client";

import * as React from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { CheckIcon } from "lucide-react";

import { AnimatedField, AnimatedFieldError } from "@/components/dusk/field/animated-field-error";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { FieldContent, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export interface SignupValues {
  name: string;
  email: string;
  password: string;
  terms: boolean;
}

type FieldName = keyof SignupValues;
type Errors = Partial<Record<FieldName, string>>;

/** Dependency-free validation. Swap in Zod / Valibot and map their issues to the same shape. */
export function validateSignup(values: SignupValues): Errors {
  const errors: Errors = {};
  if (!values.name.trim()) errors.name = "Tell us what to call you.";
  if (!values.email.trim()) errors.email = "Enter your email address.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) errors.email = "That email doesn't look right.";
  if (!values.password) errors.password = "Choose a password.";
  else if (values.password.length < 8) errors.password = `Use at least 8 characters (${8 - values.password.length} more).`;
  if (!values.terms) errors.terms = "Please accept the terms to continue.";
  return errors;
}

const order: FieldName[] = ["name", "email", "password", "terms"];

export interface SignupFormProps extends Omit<React.ComponentProps<"form">, "onSubmit"> {
  /** Called with valid values. Return a promise to show the loading state until it settles. */
  onSubmit?: (values: SignupValues) => void | Promise<void>;
  /** Text on the submit button. */
  submitLabel?: string;
}

/**
 * A sign-up form that validates without a form library. Nothing is flagged
 * while you type the first time; on submit every invalid field shakes, its
 * error grows open and focus jumps to the first problem. After that, fields
 * re-validate as you type, so errors collapse the moment they're fixed.
 * A successful submit swaps the form for a confirmation.
 */
export function SignupForm({ onSubmit, submitLabel = "Create account", className, ...props }: SignupFormProps) {
  const id = React.useId();
  const reduceMotion = useReducedMotion() ?? false;
  const [values, setValues] = React.useState<SignupValues>({ name: "", email: "", password: "", terms: false });
  const [errors, setErrors] = React.useState<Errors>({});
  const [attempts, setAttempts] = React.useState(0);
  const [status, setStatus] = React.useState<"idle" | "submitting" | "done">("idle");
  const refs = React.useRef<Partial<Record<FieldName, HTMLElement | null>>>({});

  const update = <K extends FieldName>(key: K, value: SignupValues[K]) => {
    const next = { ...values, [key]: value };
    setValues(next);
    // Re-validate live only after the first submit attempt.
    if (attempts > 0) setErrors(validateSignup(next));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status !== "idle") return;
    const found = validateSignup(values);
    setErrors(found);
    setAttempts((n) => n + 1);
    const first = order.find((key) => found[key]);
    if (first) {
      refs.current[first]?.focus();
      return;
    }
    setStatus("submitting");
    try {
      await onSubmit?.(values);
      setStatus("done");
    } catch {
      setStatus("idle");
    }
  };

  const ids = (key: FieldName) => ({ input: `${id}-${key}`, error: `${id}-${key}-error`, hint: `${id}-${key}-hint` });
  const describedBy = (key: FieldName, hint = false) =>
    [hint && ids(key).hint, errors[key] && ids(key).error].filter(Boolean).join(" ") || undefined;

  const swap = reduceMotion
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : {
        initial: { opacity: 0, y: 8 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -8 },
      };

  return (
    <div className={cn("grid w-full", className)}>
      <AnimatePresence initial={false} mode="popLayout">
        {status === "done" ? (
          <motion.div
            key="done"
            {...swap}
            transition={{ duration: 0.25, ease: "easeOut" }}
            role="status"
            className="flex flex-col items-center gap-3 py-10 text-center [grid-area:1/1]"
          >
            <motion.span
              initial={reduceMotion ? false : { scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.2, ease: "easeOut", delay: 0.1 }}
              className="grid size-11 place-items-center rounded-full bg-primary/15 text-primary"
            >
              <CheckIcon className="size-5" />
            </motion.span>
            <p className="font-medium">Welcome aboard, {values.name.trim().split(" ")[0]}!</p>
            <p className="text-sm text-muted-foreground">We sent a confirmation link to {values.email.trim()}.</p>
          </motion.div>
        ) : (
          <motion.div
            key="form"
            {...swap}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="[grid-area:1/1]"
          >
            <form noValidate onSubmit={handleSubmit} {...props}>
              <FieldGroup className="gap-5">
                <AnimatedField invalid={!!errors.name} shakeKey={attempts}>
                  <FieldLabel htmlFor={ids("name").input}>Name</FieldLabel>
                  <Input
                    ref={(node) => {
                      refs.current.name = node;
                    }}
                    id={ids("name").input}
                    name="name"
                    autoComplete="name"
                    placeholder="Ada Lovelace"
                    value={values.name}
                    onChange={(e) => update("name", e.target.value)}
                    aria-invalid={!!errors.name || undefined}
                    aria-describedby={describedBy("name")}
                  />
                  <AnimatedFieldError id={ids("name").error}>{errors.name}</AnimatedFieldError>
                </AnimatedField>

                <AnimatedField invalid={!!errors.email} shakeKey={attempts}>
                  <FieldLabel htmlFor={ids("email").input}>Email</FieldLabel>
                  <Input
                    ref={(node) => {
                      refs.current.email = node;
                    }}
                    id={ids("email").input}
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="ada@example.com"
                    value={values.email}
                    onChange={(e) => update("email", e.target.value)}
                    aria-invalid={!!errors.email || undefined}
                    aria-describedby={describedBy("email")}
                  />
                  <AnimatedFieldError id={ids("email").error}>{errors.email}</AnimatedFieldError>
                </AnimatedField>

                <AnimatedField invalid={!!errors.password} shakeKey={attempts}>
                  <FieldLabel htmlFor={ids("password").input}>Password</FieldLabel>
                  <Input
                    ref={(node) => {
                      refs.current.password = node;
                    }}
                    id={ids("password").input}
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    value={values.password}
                    onChange={(e) => update("password", e.target.value)}
                    aria-invalid={!!errors.password || undefined}
                    aria-describedby={describedBy("password", true)}
                  />
                  <FieldDescription id={ids("password").hint}>At least 8 characters.</FieldDescription>
                  <AnimatedFieldError id={ids("password").error}>{errors.password}</AnimatedFieldError>
                </AnimatedField>

                <AnimatedField orientation="horizontal" invalid={!!errors.terms} shakeKey={attempts} className="items-start">
                  <Checkbox
                    ref={(node) => {
                      refs.current.terms = node;
                    }}
                    id={ids("terms").input}
                    name="terms"
                    checked={values.terms}
                    onCheckedChange={(checked) => update("terms", checked === true)}
                    aria-invalid={!!errors.terms || undefined}
                    aria-describedby={describedBy("terms")}
                    className="mt-0.5"
                  />
                  <FieldContent>
                    <FieldLabel htmlFor={ids("terms").input} className="font-normal">
                      I agree to the terms and privacy policy
                    </FieldLabel>
                    <AnimatedFieldError id={ids("terms").error} className="-mt-1.5">
                      {errors.terms}
                    </AnimatedFieldError>
                  </FieldContent>
                </AnimatedField>

                <Button type="submit" loading={status === "submitting"} loadingText="Creating account…" className="w-full">
                  {submitLabel}
                </Button>
              </FieldGroup>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
