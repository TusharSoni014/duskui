"use client";

import * as React from "react";

import { Rating } from "@/components/dusk/rating/rating";

const reviews = [
  { name: "Aurora Hotel", score: 4.7, count: 1284 },
  { name: "Harbor Loft", score: 4.2, count: 312 },
  { name: "Cedar Cabin", score: 3.6, count: 89 },
];

export default function RatingHalfDemo() {
  const [value, setValue] = React.useState(3.5);

  return (
    <div className="grid w-full max-w-md gap-6 sm:grid-cols-2">
      <div className="space-y-2">
        <p className="text-sm font-medium">Your rating</p>
        <Rating value={value} onValueChange={setValue} allowHalf label="Your rating" />
        <p className="text-xs text-muted-foreground tabular-nums">{value.toFixed(1)} / 5</p>
      </div>
      <ul className="space-y-3">
        {reviews.map((r) => (
          <li key={r.name} className="space-y-1">
            <p className="text-sm">{r.name}</p>
            <div className="flex items-center gap-2">
              <Rating value={r.score} readOnly size="sm" label={r.name} />
              <span className="text-xs text-muted-foreground tabular-nums">
                {r.score} · {r.count.toLocaleString("en-US")}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
