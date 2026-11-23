"use client";

import * as React from "react";
import { ChevronsUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const repos = ["duskui/registry", "duskui/icons", "duskui/docs"];

export default function CollapsibleBasicDemo() {
  const [open, setOpen] = React.useState(false);

  return (
    <Collapsible open={open} onOpenChange={setOpen} className="flex w-full max-w-xs flex-col gap-2">
      <div className="flex items-center justify-between gap-4 px-1">
        <h4 className="text-sm font-semibold">@ada starred 4 repositories</h4>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="icon-sm" aria-label={open ? "Hide repositories" : "Show all repositories"}>
            <ChevronsUpDown />
          </Button>
        </CollapsibleTrigger>
      </div>
      <div className="rounded-md border px-4 py-2 font-mono text-sm">duskui/ui</div>
      <CollapsibleContent className="flex flex-col gap-2">
        {repos.map((repo) => (
          <div key={repo} className="rounded-md border px-4 py-2 font-mono text-sm">
            {repo}
          </div>
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
}
