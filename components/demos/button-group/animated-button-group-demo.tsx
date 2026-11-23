"use client";

import * as React from "react";
import { CalendarDaysIcon, ColumnsIcon, LayoutGridIcon, ListIcon } from "lucide-react";

import { AnimatedButtonGroup } from "@/components/dusk/button-group/animated-button-group";

export default function AnimatedButtonGroupDemo() {
  const [view, setView] = React.useState("board");

  return (
    <div className="flex flex-col items-center gap-6">
      <AnimatedButtonGroup
        aria-label="View"
        value={view}
        onValueChange={setView}
        options={[
          { value: "list", label: <span className="max-sm:sr-only">List</span>, icon: <ListIcon /> },
          { value: "board", label: <span className="max-sm:sr-only">Board</span>, icon: <ColumnsIcon /> },
          { value: "calendar", label: <span className="max-sm:sr-only">Calendar</span>, icon: <CalendarDaysIcon /> },
          { value: "grid", label: <span className="max-sm:sr-only">Gallery</span>, icon: <LayoutGridIcon /> },
        ]}
      />
      <AnimatedButtonGroup
        aria-label="Time range"
        size="sm"
        defaultValue="7d"
        options={[
          { value: "24h", label: "24h" },
          { value: "7d", label: "7d" },
          { value: "30d", label: "30d" },
          { value: "90d", label: "90d" },
        ]}
      />
    </div>
  );
}
