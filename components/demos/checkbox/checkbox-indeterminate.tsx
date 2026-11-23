"use client";

import * as React from "react";
import { Checkbox } from "@/components/ui/checkbox";

const files = ["hero.png", "logo.svg", "og-image.jpg"];

export default function CheckboxIndeterminateDemo() {
  const id = React.useId();
  const [selected, setSelected] = React.useState<string[]>(["logo.svg"]);
  const all = selected.length === files.length;
  const some = selected.length > 0 && !all;

  return (
    <div className="w-full max-w-xs rounded-xl border bg-card p-4">
      <div className="flex items-center gap-2.5 border-b pb-3">
        <Checkbox
          id={`${id}-all`}
          checked={all ? true : some ? "indeterminate" : false}
          onCheckedChange={(checked) => setSelected(checked === true ? files : [])}
        />
        <label htmlFor={`${id}-all`} className="text-sm font-medium">
          Select all
        </label>
        <span className="ms-auto text-xs text-muted-foreground tabular-nums" aria-live="polite">
          {selected.length}/{files.length}
        </span>
      </div>
      <ul className="mt-3 grid gap-2.5">
        {files.map((file) => (
          <li key={file} className="flex items-center gap-2.5">
            <Checkbox
              id={`${id}-${file}`}
              checked={selected.includes(file)}
              onCheckedChange={(checked) =>
                setSelected((prev) => (checked === true ? [...prev, file] : prev.filter((f) => f !== file)))
              }
            />
            <label htmlFor={`${id}-${file}`} className="font-mono text-xs">
              {file}
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}
