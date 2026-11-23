"use client";

import * as React from "react";
import { MultiCombobox } from "@/components/dusk/combobox/multi-combobox";

const skills = [
  "React",
  "TypeScript",
  "Next.js",
  "Tailwind CSS",
  "Motion",
  "Node.js",
  "GraphQL",
  "PostgreSQL",
  "Rust",
  "Figma",
].map((label) => ({ value: label.toLowerCase().replace(/[^a-z0-9]+/g, "-"), label }));

export default function MultiComboboxDemo() {
  const [value, setValue] = React.useState(["react", "motion"]);

  return (
    <div className="grid w-full max-w-sm gap-2">
      <p className="text-sm font-medium">
        Skills
      </p>
      <MultiCombobox
        aria-label="Skills"
        options={skills}
        value={value}
        onValueChange={setValue}
        placeholder="Search skills…"
        max={5}
        name="skills"
      />
      <p className="text-xs text-muted-foreground">Pick up to 5. Backspace removes the last one.</p>
    </div>
  );
}
