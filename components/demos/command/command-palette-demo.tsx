"use client";

import {
  Bell,
  BookOpen,
  CreditCard,
  Globe,
  LayoutDashboard,
  Monitor,
  Moon,
  Palette,
  Plus,
  Search,
  Settings,
  Sparkles,
  UserPlus,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { CommandPalette, type CommandPaletteGroup, type CommandPalettePage } from "@/components/dusk/command/command-palette";

const groups: CommandPaletteGroup[] = [
  {
    heading: "Actions",
    items: [
      { id: "new-project", label: "New project", icon: <Plus />, shortcut: "⌘N", onSelect: () => toast.success("Project created") },
      { id: "invite", label: "Invite teammate", icon: <UserPlus />, keywords: ["team", "member"], onSelect: () => toast("Invite sent") },
      { id: "search-docs", label: "Search docs", icon: <BookOpen />, keywords: ["help"], onSelect: () => toast("Opening docs…") },
    ],
  },
  {
    heading: "Navigation",
    items: [
      { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard />, onSelect: () => toast("Dashboard") },
      { id: "billing", label: "Billing", icon: <CreditCard />, description: "Plans, invoices and payment", onSelect: () => toast("Billing") },
      { id: "notifications", label: "Notifications", icon: <Bell />, onSelect: () => toast("Notifications") },
    ],
  },
  {
    heading: "Preferences",
    items: [
      { id: "theme", label: "Change theme…", icon: <Palette />, page: "theme", keywords: ["appearance", "dark"] },
      { id: "language", label: "Change language…", icon: <Globe />, page: "language" },
      { id: "settings", label: "Settings", icon: <Settings />, shortcut: "⌘,", onSelect: () => toast("Settings") },
    ],
  },
];

const pages: CommandPalettePage[] = [
  {
    id: "theme",
    title: "Theme",
    placeholder: "Pick a theme…",
    groups: [
      {
        heading: "Theme",
        items: [
          { id: "theme-dusk", label: "Dusk mint", icon: <Sparkles />, onSelect: () => toast("Theme: Dusk mint") },
          { id: "theme-midnight", label: "Midnight", icon: <Moon />, onSelect: () => toast("Theme: Midnight") },
          { id: "theme-system", label: "Match system", icon: <Monitor />, onSelect: () => toast("Theme: System") },
        ],
      },
    ],
  },
  {
    id: "language",
    title: "Language",
    placeholder: "Search languages…",
    groups: [
      {
        heading: "Language",
        items: ["English", "Deutsch", "Español", "Français", "हिन्दी", "日本語"].map((label) => ({
          id: `lang-${label}`,
          label,
          onSelect: () => toast(`Language: ${label}`),
        })),
      },
    ],
  },
];

export default function CommandPaletteDemo() {
  return (
    <div className="flex flex-col items-center gap-3">
      <CommandPalette
        groups={groups}
        pages={pages}
        hotkey="j"
        defaultRecent={["billing", "new-project"]}
        trigger={
          <Button variant="outline" className="w-64 justify-start text-muted-foreground">
            <Search />
            Search or run a command…
            <kbd className="ml-auto rounded border border-white/10 bg-white/5 px-1.5 font-mono text-[0.7rem]">⌘J</kbd>
          </Button>
        }
      />
      <p className="text-xs text-muted-foreground">Try “Change theme…”, then Backspace to go back.</p>
    </div>
  );
}
