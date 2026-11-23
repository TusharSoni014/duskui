"use client";

import * as React from "react";

import { CustomCursor } from "@/components/dusk/custom-cursor/custom-cursor";
import { Switch } from "@/components/ui/switch";

export default function CustomCursorPage() {
  const [on, setOn] = React.useState(false);

  return (
    <div className="flex flex-col items-center gap-3 text-center">
      <label className="flex items-center gap-3 text-sm text-white/80">
        <Switch checked={on} onCheckedChange={setOn} />
        Page-wide cursor
      </label>
      <p className="max-w-xs text-xs text-white/45">
        With <code className="font-mono text-white/70">scope=&quot;page&quot;</code> the cursor follows you across the
        whole document. Text fields keep their native caret.
      </p>
      <input
        type="text"
        placeholder="Try typing here"
        className="h-9 w-56 rounded-md border border-white/15 bg-transparent px-3 text-sm outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
      />
      {on && <CustomCursor scope="page" />}
    </div>
  );
}
