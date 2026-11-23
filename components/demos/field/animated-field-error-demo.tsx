"use client";

import * as React from "react";
import { AnimatedField, AnimatedFieldError } from "@/components/dusk/field/animated-field-error";
import { Button } from "@/components/ui/button";
import { FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

function check(value: string) {
  if (!value.trim()) return "Enter an email address.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) return "That email doesn't look right.";
  if (!value.trim().endsWith("@dusk.dev")) return "Use your @dusk.dev work email.";
  return undefined;
}

export default function AnimatedFieldErrorDemo() {
  const [email, setEmail] = React.useState("");
  const [submitted, setSubmitted] = React.useState(0);
  const [done, setDone] = React.useState(false);
  const error = submitted > 0 ? check(email) : undefined;

  return (
    <form
      noValidate
      className="grid w-full max-w-sm gap-4"
      onSubmit={(event) => {
        event.preventDefault();
        setSubmitted((n) => n + 1);
        setDone(!check(email));
      }}
    >
      <AnimatedField invalid={!!error} shakeKey={submitted}>
        <FieldLabel htmlFor="invite-email">Work email</FieldLabel>
        <Input
          id="invite-email"
          type="email"
          placeholder="ada@dusk.dev"
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
            setDone(false);
          }}
          aria-invalid={!!error || undefined}
          aria-describedby={error ? "invite-email-hint invite-email-error" : "invite-email-hint"}
        />
        <FieldDescription id="invite-email-hint">We&apos;ll send the invite here.</FieldDescription>
        <AnimatedFieldError id="invite-email-error">{error}</AnimatedFieldError>
      </AnimatedField>
      <Button type="submit">{done ? "Invite sent" : "Send invite"}</Button>
    </form>
  );
}
