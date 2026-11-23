"use client";

import * as React from "react";
import { Switch } from "@/components/ui/switch";

const settings = [
  { key: "deploys", title: "Deploy notifications", hint: "Email me when a production deploy finishes.", on: true },
  { key: "mentions", title: "Mentions", hint: "Notify me when someone @mentions me.", on: true },
  { key: "digest", title: "Weekly digest", hint: "A Monday summary of activity.", on: false },
];

export default function SwitchSettingsDemo() {
  const id = React.useId();
  return (
    <div className="w-full max-w-md divide-y rounded-xl border bg-card">
      {settings.map((s) => (
        <div key={s.key} className="flex items-center justify-between gap-4 p-4">
          <div className="grid gap-0.5">
            <label htmlFor={`${id}-${s.key}`} className="text-sm font-medium">
              {s.title}
            </label>
            <p id={`${id}-${s.key}-hint`} className="text-xs text-muted-foreground">
              {s.hint}
            </p>
          </div>
          <Switch id={`${id}-${s.key}`} aria-describedby={`${id}-${s.key}-hint`} defaultChecked={s.on} />
        </div>
      ))}
    </div>
  );
}
