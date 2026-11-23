"use client";

import { Calculator, Calendar, CreditCard, Settings, Smile, User } from "lucide-react";
import { toast } from "sonner";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";

export default function CommandBasicDemo() {
  return (
    <Command className="w-full max-w-sm rounded-xl border shadow-md">
      <CommandInput placeholder="Type a command or search…" />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Suggestions">
          <CommandItem onSelect={() => toast("Opening calendar")}>
            <Calendar />
            Calendar
          </CommandItem>
          <CommandItem onSelect={() => toast("Searching emoji")}>
            <Smile />
            Search emoji
          </CommandItem>
          <CommandItem disabled>
            <Calculator />
            Calculator
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Settings">
          <CommandItem onSelect={() => toast("Profile")}>
            <User />
            Profile
            <CommandShortcut>⌘P</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={() => toast("Billing")}>
            <CreditCard />
            Billing
            <CommandShortcut>⌘B</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={() => toast("Settings")}>
            <Settings />
            Settings
            <CommandShortcut>⌘S</CommandShortcut>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  );
}
