import { AtSign, BookOpen, Code2, Rss } from "lucide-react";

import { Dock, DockItem, DockSeparator } from "@/components/dusk/dock/dock";

export default function DockLinksDemo() {
  return (
    <div className="flex h-40 w-full items-start justify-center pt-4">
      <Dock position="top" iconSize={36} magnification={56} distance={110} aria-label="Social">
        <DockItem label="Docs" href="#docs" active>
          <BookOpen />
        </DockItem>
        <DockItem label="Source code" href="#source">
          <Code2 />
        </DockItem>
        <DockSeparator />
        <DockItem label="Blog" href="#blog">
          <Rss />
        </DockItem>
        <DockItem label="Contact" href="#contact">
          <AtSign />
        </DockItem>
      </Dock>
    </div>
  );
}
