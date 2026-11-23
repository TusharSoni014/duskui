"use client";

import * as React from "react";

import { TagInput } from "@/components/dusk/tag-input/tag-input";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";

export default function TagInputFormDemo() {
  const [error, setError] = React.useState<string | null>(null);
  const [submitted, setSubmitted] = React.useState<string[] | null>(null);

  return (
    <form
      className="grid w-full max-w-md gap-4"
      onSubmit={(event) => {
        event.preventDefault();
        setSubmitted(new FormData(event.currentTarget).getAll("invitees").map(String));
      }}
    >
      <Field data-invalid={error ? true : undefined}>
        <FieldLabel htmlFor="invitees">Invite teammates</FieldLabel>
        <TagInput
          id="invitees"
          name="invitees"
          max={4}
          placeholder="name@company.com"
          transform={(tag) => tag.trim().toLowerCase()}
          validate={(tag) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(tag) || `${tag} isn't an email address.`}
          onReject={(_, __, message) => setError(message)}
          onValueChange={() => setError(null)}
          aria-invalid={!!error}
          aria-describedby={error ? "invitees-error" : "invitees-hint"}
        />
        {error ? (
          <FieldError id="invitees-error">{error}</FieldError>
        ) : (
          <FieldDescription id="invitees-hint">Paste a comma-separated list to add several at once.</FieldDescription>
        )}
      </Field>
      <Button type="submit" size="sm" className="justify-self-start">
        Send invites
      </Button>
      {submitted && (
        <p className="text-xs text-muted-foreground" aria-live="polite">
          Submitted {submitted.length ? submitted.join(", ") : "nothing"}.
        </p>
      )}
    </form>
  );
}
