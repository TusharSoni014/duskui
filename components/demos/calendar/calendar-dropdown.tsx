"use client";

import * as React from "react";
import { Calendar } from "@/components/ui/calendar";

const TODAY = new Date(2026, 5, 12);

export default function CalendarDropdownDemo() {
  const [date, setDate] = React.useState<Date | undefined>(new Date(1994, 2, 21));

  return (
    <Calendar
      mode="single"
      selected={date}
      onSelect={setDate}
      captionLayout="dropdown"
      startMonth={new Date(1940, 0)}
      endMonth={new Date(2026, 11)}
      today={TODAY}
      defaultMonth={new Date(1994, 2)}
      className="rounded-xl border bg-card/40"
    />
  );
}
