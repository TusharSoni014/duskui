"use client";

import * as React from "react";
import { SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function DropdownMenuCheckboxesDemo() {
  const [columns, setColumns] = React.useState({ status: true, owner: true, updated: false });
  const [sort, setSort] = React.useState("newest");

  const toggle = (key: keyof typeof columns) => (checked: boolean) =>
    setColumns((c) => ({ ...c, [key]: checked }));

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <SlidersHorizontal />
          View
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-52" align="start">
        <DropdownMenuLabel>Columns</DropdownMenuLabel>
        {/* preventDefault keeps the menu open so you can toggle several. */}
        <DropdownMenuCheckboxItem checked={columns.status} onCheckedChange={toggle("status")} onSelect={(e) => e.preventDefault()}>
          Status
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem checked={columns.owner} onCheckedChange={toggle("owner")} onSelect={(e) => e.preventDefault()}>
          Owner
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem checked={columns.updated} onCheckedChange={toggle("updated")} onSelect={(e) => e.preventDefault()}>
          Last updated
        </DropdownMenuCheckboxItem>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Sort by</DropdownMenuLabel>
        <DropdownMenuRadioGroup value={sort} onValueChange={setSort}>
          <DropdownMenuRadioItem value="newest" onSelect={(e) => e.preventDefault()}>
            Newest first
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="oldest" onSelect={(e) => e.preventDefault()}>
            Oldest first
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="name" onSelect={(e) => e.preventDefault()}>
            Name
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
