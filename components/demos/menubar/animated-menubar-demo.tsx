"use client";

import * as React from "react";
import {
  Copy,
  FilePlus,
  FolderOpen,
  Link2,
  Mail,
  PanelLeft,
  Printer,
  Redo2,
  Save,
  Scissors,
  Share2,
  Trash2,
  Undo2,
} from "lucide-react";

import {
  AnimatedMenubar,
  AnimatedMenubarCheckboxItem,
  AnimatedMenubarContent,
  AnimatedMenubarItem,
  AnimatedMenubarLabel,
  AnimatedMenubarMenu,
  AnimatedMenubarSeparator,
  AnimatedMenubarSub,
  AnimatedMenubarSubContent,
  AnimatedMenubarSubTrigger,
  AnimatedMenubarTrigger,
} from "@/components/dusk/menubar/animated-menubar";
import { MenubarItem } from "@/components/ui/menubar";

export default function AnimatedMenubarDemo() {
  const [sidebar, setSidebar] = React.useState(true);
  const [statusBar, setStatusBar] = React.useState(true);
  const [focusMode, setFocusMode] = React.useState(false);

  return (
    <AnimatedMenubar>
      <AnimatedMenubarMenu value="file">
        <AnimatedMenubarTrigger>File</AnimatedMenubarTrigger>
        <AnimatedMenubarContent>
          <AnimatedMenubarItem icon={<FilePlus />} shortcut="⌘N">
            New file
          </AnimatedMenubarItem>
          <AnimatedMenubarItem icon={<FolderOpen />} shortcut="⌘O">
            Open…
          </AnimatedMenubarItem>
          <AnimatedMenubarItem icon={<Save />} shortcut="⌘S">
            Save
          </AnimatedMenubarItem>
          <AnimatedMenubarSeparator />
          <AnimatedMenubarSub>
            <AnimatedMenubarSubTrigger icon={<Share2 />}>Share</AnimatedMenubarSubTrigger>
            <AnimatedMenubarSubContent>
              <MenubarItem>
                <Link2 /> Copy link
              </MenubarItem>
              <MenubarItem>
                <Mail /> Email
              </MenubarItem>
            </AnimatedMenubarSubContent>
          </AnimatedMenubarSub>
          <AnimatedMenubarItem icon={<Printer />} shortcut="⌘P">
            Print…
          </AnimatedMenubarItem>
        </AnimatedMenubarContent>
      </AnimatedMenubarMenu>

      <AnimatedMenubarMenu value="edit">
        <AnimatedMenubarTrigger>Edit</AnimatedMenubarTrigger>
        <AnimatedMenubarContent>
          <AnimatedMenubarItem icon={<Undo2 />} shortcut="⌘Z">
            Undo
          </AnimatedMenubarItem>
          <AnimatedMenubarItem icon={<Redo2 />} shortcut="⇧⌘Z">
            Redo
          </AnimatedMenubarItem>
          <AnimatedMenubarSeparator />
          <AnimatedMenubarItem icon={<Scissors />} shortcut="⌘X">
            Cut
          </AnimatedMenubarItem>
          <AnimatedMenubarItem icon={<Copy />} shortcut="⌘C">
            Copy
          </AnimatedMenubarItem>
          <AnimatedMenubarSeparator />
          <AnimatedMenubarItem icon={<Trash2 />} variant="destructive">
            Delete
          </AnimatedMenubarItem>
        </AnimatedMenubarContent>
      </AnimatedMenubarMenu>

      <AnimatedMenubarMenu value="view">
        <AnimatedMenubarTrigger>View</AnimatedMenubarTrigger>
        <AnimatedMenubarContent>
          <AnimatedMenubarLabel>Appearance</AnimatedMenubarLabel>
          <AnimatedMenubarCheckboxItem checked={sidebar} onCheckedChange={setSidebar} shortcut="⌘B">
            Sidebar
          </AnimatedMenubarCheckboxItem>
          <AnimatedMenubarCheckboxItem checked={statusBar} onCheckedChange={setStatusBar}>
            Status bar
          </AnimatedMenubarCheckboxItem>
          <AnimatedMenubarCheckboxItem checked={focusMode} onCheckedChange={setFocusMode} shortcut="⌘.">
            Focus mode
          </AnimatedMenubarCheckboxItem>
          <AnimatedMenubarSeparator />
          <AnimatedMenubarItem icon={<PanelLeft />} shortcut="⌃⌘F">
            Enter full screen
          </AnimatedMenubarItem>
        </AnimatedMenubarContent>
      </AnimatedMenubarMenu>

      <AnimatedMenubarMenu value="window">
        <AnimatedMenubarTrigger>Window</AnimatedMenubarTrigger>
        <AnimatedMenubarContent>
          <AnimatedMenubarItem shortcut="⌘M">Minimize</AnimatedMenubarItem>
          <AnimatedMenubarItem>Zoom</AnimatedMenubarItem>
          <AnimatedMenubarSeparator />
          <AnimatedMenubarItem>Bring all to front</AnimatedMenubarItem>
        </AnimatedMenubarContent>
      </AnimatedMenubarMenu>
    </AnimatedMenubar>
  );
}
