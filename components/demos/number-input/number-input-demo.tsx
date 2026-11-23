"use client";

import * as React from "react";

import { NumberInput } from "@/components/dusk/number-input/number-input";

export default function NumberInputDemo() {
  const [seats, setSeats] = React.useState<number | null>(8);

  return (
    <div className="grid justify-items-center gap-2">
      <label htmlFor="seats" className="text-sm font-medium">
        Seats
      </label>
      <NumberInput id="seats" value={seats} onValueChange={setSeats} min={1} max={250} size="lg" className="w-44" allowWheel />
      <p className="text-xs text-muted-foreground">Hold + or − to speed up · Shift + ↑ for ±10</p>
    </div>
  );
}
