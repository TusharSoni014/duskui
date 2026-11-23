"use client";

import * as React from "react";
import { Calendar } from "@/components/ui/calendar";

// Fixed dates keep the server and client render identical (no hydration mismatch).
const TODAY = new Date(2026, 5, 12);

export default function CalendarBasicDemo() {
  const [date, setDate] = React.useState<Date | undefined>(new Date(2026, 5, 16));

  return (
    <Calendar
      mode="single"
      selected={date}
      onSelect={setDate}
      today={TODAY}
      defaultMonth={TODAY}
      className="rounded-xl border bg-card/40"
    />
  );
}
