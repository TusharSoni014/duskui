"use client";

import * as React from "react";

import { SortableList } from "@/components/dusk/sortable-list/sortable-list";

export default function SortableListSimpleDemo() {
  const [steps, setSteps] = React.useState(["Install", "Configure", "Build", "Test", "Deploy"]);

  return (
    <div className="flex w-full max-w-xs flex-col gap-4">
      <SortableList items={steps} onReorder={setSteps} label="Pipeline steps" renderItem={(step) => step} />
      <p className="text-center font-mono text-xs text-muted-foreground" aria-hidden>
        {steps.join(" → ")}
      </p>
    </div>
  );
}
