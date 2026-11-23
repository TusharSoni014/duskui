"use client";

import * as React from "react";
import { Calendar, Camera, Compass, Folder, Mail, MessageCircle, Music, Settings, Trash2 } from "lucide-react";

import { Dock, DockItem, DockSeparator } from "@/components/dusk/dock/dock";

const apps = [
  { label: "Finder", icon: Folder },
  { label: "Browser", icon: Compass },
  { label: "Mail", icon: Mail },
  { label: "Messages", icon: MessageCircle },
  { label: "Calendar", icon: Calendar },
  { label: "Photos", icon: Camera },
  { label: "Music", icon: Music },
  { label: "Settings", icon: Settings },
];

export default function DockDemo() {
  const [active, setActive] = React.useState("Browser");

  return (
    <div className="flex h-56 w-full items-end justify-center">
      <Dock aria-label="Applications">
        {apps.map(({ label, icon: Icon }) => (
          <DockItem key={label} label={label} active={active === label} onClick={() => setActive(label)}>
            <Icon />
          </DockItem>
        ))}
        <DockSeparator />
        <DockItem label="Trash">
          <Trash2 />
        </DockItem>
      </Dock>
    </div>
  );
}
