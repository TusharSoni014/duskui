"use client";

import * as React from "react";
import { Checkbox } from "@/components/ui/checkbox";

export default function CheckboxBasicDemo() {
  const id = React.useId();
  return (
    <div className="grid gap-4">
      <div className="flex items-center gap-2.5">
        <Checkbox id={`${id}-terms`} defaultChecked />
        <label htmlFor={`${id}-terms`} className="text-sm font-medium">
          Accept terms and conditions
        </label>
      </div>
      <div className="flex items-start gap-2.5">
        <Checkbox id={`${id}-updates`} className="mt-0.5" aria-describedby={`${id}-updates-hint`} />
        <div className="grid gap-1">
          <label htmlFor={`${id}-updates`} className="text-sm font-medium">
            Product updates
          </label>
          <p id={`${id}-updates-hint`} className="text-xs text-muted-foreground">
            One email a month. Unsubscribe anytime.
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2.5">
        <Checkbox id={`${id}-disabled`} disabled defaultChecked />
        <label htmlFor={`${id}-disabled`} className="text-sm font-medium opacity-50">
          Disabled
        </label>
      </div>
    </div>
  );
}
