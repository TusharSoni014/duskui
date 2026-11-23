"use client";

import * as React from "react";

import { Rating } from "@/components/dusk/rating/rating";

const words = ["Not rated", "Terrible", "Meh", "Good", "Great", "Loved it"];

export default function RatingDemo() {
  const [value, setValue] = React.useState(4);

  return (
    <div className="flex flex-col items-center gap-3">
      <p aria-hidden className="text-sm font-medium">How was your stay?</p>
      <Rating value={value} onValueChange={setValue} size="lg" label="How was your stay?" />
      <p className="h-5 text-sm text-muted-foreground" aria-hidden>
        {words[Math.ceil(value)]}
      </p>
    </div>
  );
}
