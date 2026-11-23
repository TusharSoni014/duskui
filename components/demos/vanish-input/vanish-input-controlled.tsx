"use client";

import * as React from "react";

import { VanishInput } from "@/components/dusk/vanish-input/vanish-input";

export default function VanishInputControlled() {
  const [value, setValue] = React.useState("");
  const limit = 60;

  return (
    <div className="flex w-full flex-col items-center gap-3 rounded-xl border border-white/10 bg-background px-6 py-10">
      <VanishInput
        value={value}
        onValueChange={(v) => setValue(v.slice(0, limit))}
        placeholders={["Leave a short note…", "Say hi to the team…"]}
        label="Note"
        submitLabel="Send note"
        containerClassName="max-w-md"
       
      />
      <p className="text-xs tabular-nums text-white/50">
        {value.length}/{limit} characters
      </p>
    </div>
  );
}
