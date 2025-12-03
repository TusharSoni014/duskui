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
import { categories, searchComponents } from "@/lib/components-data";

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

  const filteredComponents = query ? searchComponents(query) : [];

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

          {query ? (
            // Show search results
            filteredComponents.length > 0 && (
              <CommandGroup heading="Results">
                {filteredComponents.map((component) => {
                  const category = categories.find(
                    (c) => c.slug === component.categorySlug
                  );
                  const Icon = category?.icon;

                  return (
                    <CommandItem
                      key={component.href}
                      value={component.name}
                      onSelect={() => handleSelect(component.href)}
                      className="flex items-center gap-3 cursor-pointer"
                    >
                      {Icon && <Icon className="w-4 h-4 text-primary" />}
                      <div className="flex flex-col">
                        <span>{component.name}</span>
                        <span className="text-xs text-white/40">
                          {component.category}
                        </span>
                      </div>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            )
          ) : (
            // Show categories when no query
            categories.map((category) => (
              <CommandGroup key={category.slug} heading={category.name}>
                {category.components.slice(0, 3).map((component) => (
                  <CommandItem
                    key={component.href}
                    value={component.name}
                    onSelect={() => handleSelect(component.href)}
                    className="flex items-center gap-3 cursor-pointer"
                  >
                    <category.icon className="w-4 h-4 text-primary" />
                    <span>{component.name}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            ))
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
}
