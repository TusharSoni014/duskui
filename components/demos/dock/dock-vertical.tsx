"use client";

import * as React from "react";
import { BarChart3, Bell, House, Inbox, Users } from "lucide-react";

import { Dock, DockItem } from "@/components/dusk/dock/dock";

const items = [
  { label: "Home", icon: House },
  { label: "Inbox", icon: Inbox },
  { label: "Analytics", icon: BarChart3 },
  { label: "Team", icon: Users },
  { label: "Notifications", icon: Bell },
];

export default function DockVerticalDemo() {
  const [active, setActive] = React.useState("Home");

  return (
    <div className="flex w-full max-w-md items-center">
      <Dock position="left" iconSize={40} magnification={64} aria-label="Sidebar">
        {items.map(({ label, icon: Icon }) => (
          <DockItem key={label} label={label} active={active === label} onClick={() => setActive(label)}>
            <Icon />
          </DockItem>
        ))}
      </Dock>
    </div>
  );
}
