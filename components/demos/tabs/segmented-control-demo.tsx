"use client";

import * as React from "react";
import { LayoutGrid, List, Rows3 } from "lucide-react";
import { SegmentedControl } from "@/components/dusk/tabs/segmented-control";

export default function SegmentedControlDemo() {
  const [view, setView] = React.useState("grid");

  return (
    <div className="grid justify-items-center gap-6">
      <SegmentedControl
        aria-label="View"
        value={view}
        onValueChange={setView}
        options={[
          { value: "grid", label: "Grid", icon: <LayoutGrid /> },
          { value: "list", label: "List", icon: <List /> },
          { value: "rows", label: "Compact", icon: <Rows3 /> },
        ]}
      />
      <SegmentedControl
        aria-label="Billing period"
        size="sm"
        defaultValue="yearly"
        name="billing"
        options={[
          { value: "monthly", label: "Monthly" },
          { value: "yearly", label: "Yearly · save 20%" },
        ]}
      />
      <p className="text-xs text-muted-foreground" aria-live="polite">
        View: <span className="text-foreground">{view}</span>
      </p>
    </div>
  );
}
