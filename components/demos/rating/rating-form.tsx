"use client";

import * as React from "react";

import { Rating } from "@/components/dusk/rating/rating";
import { Button } from "@/components/ui/button";

export default function RatingFormDemo() {
  const [submitted, setSubmitted] = React.useState<string | null>(null);

  return (
    <form
      className="flex w-full max-w-xs flex-col gap-4 rounded-xl border bg-card p-5"
      onSubmit={(event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        setSubmitted(JSON.stringify(Object.fromEntries(data)));
      }}
    >
      <div className="space-y-2">
        <p className="text-sm font-medium">Food</p>
        <Rating name="food" defaultValue={4} label="Food" />
      </div>
      <div className="space-y-2">
        <p className="text-sm font-medium">Service</p>
        <Rating name="service" allowHalf defaultValue={3.5} label="Service" />
      </div>
      <Button type="submit" size="sm">Submit review</Button>
      <output aria-live="polite" className="min-h-4 font-mono text-xs text-muted-foreground">
        {submitted}
      </output>
    </form>
  );
}
