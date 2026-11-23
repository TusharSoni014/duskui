"use client";

import * as React from "react";
import { DatePicker } from "@/components/dusk/calendar/date-picker";

const TODAY = new Date(2026, 5, 12);

export default function DatePickerDemo() {
  const [date, setDate] = React.useState<Date | undefined>();

  return (
    <div className="grid w-full max-w-xs gap-2">
      <span id="delivery-label" className="text-sm font-medium">
        Delivery date
      </span>
      {/* Label + current value, so screen readers hear "Delivery date, June 15, 2026". */}
      <DatePicker
        id="delivery-date"
        aria-labelledby="delivery-label delivery-date"
        value={date}
        onValueChange={setDate}
        placeholder="Pick a delivery date"
        disabledDays={{ before: TODAY }}
        calendarProps={{ today: TODAY, defaultMonth: TODAY }}
        name="deliveryDate"
      />
      <p className="text-xs text-muted-foreground">We deliver every day, including weekends.</p>
    </div>
  );
}
