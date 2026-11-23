"use client";

import * as React from "react";
import { Switch } from "@/components/ui/switch";

export default function SwitchBasicDemo() {
  const id = React.useId();
  return (
    <div className="flex items-center gap-3">
      <Switch id={id} defaultChecked />
      <label htmlFor={id} className="text-sm font-medium">
        Airplane mode
      </label>
    </div>
  );
}
