"use client";

import * as React from "react";
import { Calendar } from "@/components/ui/calendar";

const TODAY = new Date(2026, 5, 12);

export default function CalendarDisabledDemo() {
  const [date, setDate] = React.useState<Date | undefined>(new Date(2026, 5, 17));

  return (
    <div className="flex flex-col items-center gap-3">
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        today={TODAY}
        defaultMonth={TODAY}
        // No past days and no weekends.
        disabled={[{ before: TODAY }, { dayOfWeek: [0, 6] }]}
        showWeekNumber
        className="rounded-xl border bg-card/40 max-sm:[--cell-size:--spacing(8)]"
      />
      <p className="text-sm text-muted-foreground">Weekdays from today onward.</p>
    </div>
  );
}
