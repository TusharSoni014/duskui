"use client";

import * as React from "react";
import { LoadingSwitch } from "@/components/dusk/switch/loading-switch";

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default function LoadingSwitchDemo() {
  const id = React.useId();
  return (
    <div className="grid w-full max-w-sm gap-4">
      <div className="flex items-center justify-between gap-4 rounded-xl border bg-card p-4">
        <label htmlFor={`${id}-ok`} className="text-sm font-medium">
          Public profile
        </label>
        <LoadingSwitch id={`${id}-ok`} defaultChecked onCheckedChange={() => wait(1200)} />
      </div>
      <div className="flex items-center justify-between gap-4 rounded-xl border bg-card p-4">
        <label htmlFor={`${id}-fail`} className="grid gap-0.5 text-sm font-medium">
          Beta features
          <span className="text-xs font-normal text-muted-foreground">Always fails, to show the revert.</span>
        </label>
        <LoadingSwitch
          id={`${id}-fail`}
          onCheckedChange={async () => {
            await wait(1000);
            throw new Error("Network error");
          }}
        />
      </div>
    </div>
  );
}
