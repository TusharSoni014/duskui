"use client";

import * as React from "react";
import { FileText, LayoutDashboard, Moon, Plus, Settings } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";

export default function CommandDialogDemo() {
  const [open, setOpen] = React.useState(false);

  const run = (message: string) => () => {
    setOpen(false);
    toast(message);
  };

  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)}>
        Open command dialog
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search pages and actions…" />
        <CommandList>
          <CommandEmpty>Nothing matches that search.</CommandEmpty>
          <CommandGroup heading="Pages">
            <CommandItem onSelect={run("Dashboard")}>
              <LayoutDashboard />
              Dashboard
            </CommandItem>
            <CommandItem onSelect={run("Docs")}>
              <FileText />
              Documentation
            </CommandItem>
            <CommandItem onSelect={run("Settings")}>
              <Settings />
              Settings
              <CommandShortcut>⌘,</CommandShortcut>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Actions">
            <CommandItem onSelect={run("New project created")}>
              <Plus />
              New project
              <CommandShortcut>⌘N</CommandShortcut>
            </CommandItem>
            <CommandItem onSelect={run("Theme toggled")}>
              <Moon />
              Toggle theme
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
