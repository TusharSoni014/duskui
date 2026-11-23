"use client";

import * as React from "react";

import { NumberInput } from "@/components/dusk/number-input/number-input";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";

export default function NumberInputFormDemo() {
  const [submitted, setSubmitted] = React.useState<string | null>(null);

  return (
    <form
      className="grid w-full max-w-xs gap-4"
      onSubmit={(event) => {
        event.preventDefault();
        setSubmitted(String(new FormData(event.currentTarget).get("guests")));
      }}
    >
      <Field>
        <FieldLabel htmlFor="guests">Guests</FieldLabel>
        <NumberInput id="guests" name="guests" defaultValue={2} min={1} max={12} size="sm" aria-describedby="guests-hint" />
        <FieldDescription id="guests-hint">Between 1 and 12. Type a number and press Enter.</FieldDescription>
      </Field>
      <Button type="submit" size="sm" className="justify-self-start">
        Reserve
      </Button>
      <p className="text-xs text-muted-foreground" aria-live="polite">
        {submitted ? (
          <>
            Submitted <span className="font-mono text-foreground">guests={submitted}</span>
          </>
        ) : (
          "The form submits the raw number through a hidden input."
        )}
      </p>
    </form>
  );
}
