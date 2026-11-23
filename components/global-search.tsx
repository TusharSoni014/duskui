"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { componentHref, searchComponents } from "@/lib/components-data";

export function GlobalSearch() {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const router = useRouter();

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const results = searchComponents(query);

  const handleSelect = (href: string) => {
    setOpen(false);
    setQuery("");
    router.push(href);
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-3 py-1.5 text-sm text-white/50 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 hover:text-white/70 transition-colors"
      >
        <Search className="w-4 h-4" />
        <span className="hidden sm:inline">Search components...</span>
        <kbd className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-mono bg-white/10 rounded">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
          placeholder="Search components..."
          value={query}
          onValueChange={setQuery}
        />
        <CommandList>
          <CommandEmpty>No components found.</CommandEmpty>
          <CommandGroup heading={query ? "Results" : "Components"}>
            {results.map((component) => (
              <CommandItem
                key={component.slug}
                value={`${component.name} ${component.keywords.join(" ")}`}
                onSelect={() => handleSelect(componentHref(component.slug))}
                className="flex cursor-pointer flex-col items-start gap-0.5"
              >
                <span>{component.name}</span>
                <span className="line-clamp-1 text-xs text-white/55">
                  {component.description}
                </span>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
