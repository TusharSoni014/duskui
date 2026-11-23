"use client";

import * as React from "react";
import { Bell, BellOff } from "lucide-react";
import { IconSwitch } from "@/components/dusk/switch/icon-switch";

export default function IconSwitchDemo() {
  const [dark, setDark] = React.useState(true);
  return (
    <div className="flex flex-wrap items-center justify-center gap-8">
      <div className="flex items-center gap-3">
        <IconSwitch checked={dark} onCheckedChange={setDark} aria-label="Dark mode" />
        <span className="w-20 text-sm text-muted-foreground" aria-hidden>
          {dark ? "Dark" : "Light"}
        </span>
      </div>
      <IconSwitch
        aria-label="Notifications"
        defaultChecked
        checkedIcon={<Bell />}
        uncheckedIcon={<BellOff />}
      />
    </div>
  );
}
