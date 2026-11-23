"use client";

import { ChevronDown, Copy, Pencil, Share2, Star, Archive, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  AnimatedDropdown,
  AnimatedDropdownContent,
  AnimatedDropdownItem,
  AnimatedDropdownLabel,
  AnimatedDropdownSeparator,
  AnimatedDropdownTrigger,
} from "@/components/dusk/dropdown-menu/animated-dropdown";

export default function AnimatedDropdownDemo() {
  return (
    <AnimatedDropdown>
      <AnimatedDropdownTrigger asChild>
        <Button variant="outline" className="group">
          Actions
          <ChevronDown className="transition-transform duration-200 group-data-[state=open]:rotate-180" />
        </Button>
      </AnimatedDropdownTrigger>
      <AnimatedDropdownContent align="start" className="w-56">
        <AnimatedDropdownLabel>Project</AnimatedDropdownLabel>
        <AnimatedDropdownItem icon={<Pencil />} shortcut="⌘E" onSelect={() => toast("Renaming…")}>
          Rename
        </AnimatedDropdownItem>
        <AnimatedDropdownItem icon={<Copy />} shortcut="⌘D" onSelect={() => toast("Duplicated")}>
          Duplicate
        </AnimatedDropdownItem>
        <AnimatedDropdownItem icon={<Share2 />} onSelect={() => toast("Link copied")}>
          Share
        </AnimatedDropdownItem>
        <AnimatedDropdownItem icon={<Star />} onSelect={() => toast("Added to favorites")}>
          Add to favorites
        </AnimatedDropdownItem>
        <AnimatedDropdownSeparator />
        <AnimatedDropdownItem icon={<Archive />} disabled>
          Archive
        </AnimatedDropdownItem>
        <AnimatedDropdownItem icon={<Trash2 />} shortcut="⌫" variant="destructive" onSelect={() => toast.error("Project deleted")}>
          Delete
        </AnimatedDropdownItem>
      </AnimatedDropdownContent>
    </AnimatedDropdown>
  );
}
