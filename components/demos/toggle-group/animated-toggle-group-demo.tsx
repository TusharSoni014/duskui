"use client";

import * as React from "react";
import { Bold, Code, Italic, LayoutGrid, List, Rows3, Underline } from "lucide-react";
import {
  AnimatedToggleGroup,
  AnimatedToggleGroupItem,
} from "@/components/dusk/toggle-group/animated-toggle-group";

export default function AnimatedToggleGroupDemo() {
  const [view, setView] = React.useState("grid");
  const [marks, setMarks] = React.useState<string[]>(["bold"]);

  return (
    <div className="grid justify-items-center gap-6">
      <AnimatedToggleGroup type="single" value={view} onValueChange={(v) => v && setView(v)} aria-label="View">
        <AnimatedToggleGroupItem value="grid">
          <LayoutGrid /> Grid
        </AnimatedToggleGroupItem>
        <AnimatedToggleGroupItem value="list">
          <List /> List
        </AnimatedToggleGroupItem>
        <AnimatedToggleGroupItem value="compact">
          <Rows3 /> Compact
        </AnimatedToggleGroupItem>
      </AnimatedToggleGroup>

      <AnimatedToggleGroup type="multiple" value={marks} onValueChange={setMarks} aria-label="Text formatting">
        <AnimatedToggleGroupItem value="bold" aria-label="Bold">
          <Bold />
        </AnimatedToggleGroupItem>
        <AnimatedToggleGroupItem value="italic" aria-label="Italic">
          <Italic />
        </AnimatedToggleGroupItem>
        <AnimatedToggleGroupItem value="underline" aria-label="Underline">
          <Underline />
        </AnimatedToggleGroupItem>
        <AnimatedToggleGroupItem value="code" aria-label="Inline code">
          <Code />
        </AnimatedToggleGroupItem>
      </AnimatedToggleGroup>

      <p className="text-xs text-muted-foreground" aria-live="polite">
        View: <span className="text-foreground">{view}</span> · Marks:{" "}
        <span className="text-foreground">{marks.length ? marks.join(", ") : "none"}</span>
      </p>
    </div>
  );
}
