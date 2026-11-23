"use client";

import * as React from "react";
import { subDays } from "date-fns";
import { DateRangePicker, type DateRange } from "@/components/dusk/calendar/date-range-picker";

const TODAY = new Date(2026, 5, 12);

export default function DateRangePickerDemo() {
  const [range, setRange] = React.useState<DateRange | undefined>({ from: subDays(TODAY, 6), to: TODAY });

  return (
    <div className="grid w-full max-w-sm gap-2">
      <span id="report-range" className="text-sm font-medium">
        Report period
      </span>
      <DateRangePicker
        id="report-range-trigger"
        aria-labelledby="report-range report-range-trigger"
        value={range}
        onValueChange={setRange}
        today={TODAY}
        disabledDays={{ after: TODAY }}
      />
    </div>
  );
}
