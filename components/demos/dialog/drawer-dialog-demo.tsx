"use client";

import * as React from "react";
import { SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DrawerDialog } from "@/components/dusk/dialog/drawer-dialog";

const options = ["Ready to ship", "In review", "Has open issues", "Archived"];

export default function DrawerDialogDemo() {
  const [open, setOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<string[]>(["Ready to ship"]);

  return (
    <DrawerDialog
      open={open}
      onOpenChange={setOpen}
      trigger={
        <Button variant="outline">
          <SlidersHorizontal />
          Filters
        </Button>
      }
      title="Filter projects"
      description="Drag the handle down, flick, or press Escape to close."
      footer={
        <>
          <Button variant="outline" onClick={() => setSelected([])}>
            Clear
          </Button>
          <Button onClick={() => setOpen(false)}>Show results</Button>
        </>
      }
    >
      <fieldset className="grid gap-2">
        <legend className="mb-2 text-sm font-medium">Status</legend>
        {options.map((option) => (
          <label
            key={option}
            className="flex cursor-pointer items-center gap-3 rounded-lg border px-3 py-2.5 text-sm transition-colors hover:bg-accent/50 has-[:checked]:border-primary/40 has-[:checked]:bg-primary/5"
          >
            <input
              type="checkbox"
              className="size-4 accent-[var(--color-primary)]"
              checked={selected.includes(option)}
              onChange={(e) =>
                setSelected((s) => (e.target.checked ? [...s, option] : s.filter((o) => o !== option)))
              }
            />
            {option}
          </label>
        ))}
      </fieldset>
    </DrawerDialog>
  );
}
