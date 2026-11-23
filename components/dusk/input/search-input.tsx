"use client";

import * as React from "react";
import { AnimatePresence, motion } from "motion/react";
import { Loader2, Search, X } from "lucide-react";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export interface SearchInputProps
  extends Omit<React.ComponentProps<"input">, "type" | "value" | "defaultValue" | "onChange"> {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** Swap the search icon for a spinner while results load. */
  loading?: boolean;
  /** Focus with ⌘/Ctrl + this key. Shows a hint while empty. */
  shortcut?: string;
}

const pop = {
  initial: { opacity: 0, scale: 0.6, filter: "blur(3px)" },
  animate: { opacity: 1, scale: 1, filter: "blur(0px)" },
  exit: { opacity: 0, scale: 0.6, filter: "blur(3px)" },
  transition: { type: "spring", duration: 0.25, bounce: 0 },
} as const;

/** Search field with loading spinner, animated clear button, Escape to clear and a ⌘K shortcut. */
export function SearchInput({
  value,
  defaultValue = "",
  onValueChange,
  loading = false,
  shortcut,
  className,
  onKeyDown,
  placeholder = "Search…",
  ...props
}: SearchInputProps) {
  const ref = React.useRef<HTMLInputElement>(null);
  const [internal, setInternal] = React.useState(defaultValue);
  const current = value ?? internal;

  const update = (next: string) => {
    if (value === undefined) setInternal(next);
    onValueChange?.(next);
  };

  React.useEffect(() => {
    if (!shortcut) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === shortcut.toLowerCase() && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        ref.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [shortcut]);

  return (
    <div className="group/search relative w-full">
      <span className="pointer-events-none absolute left-3 top-1/2 inline-flex -translate-y-1/2 text-muted-foreground [&_svg]:size-4">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span key={loading ? "loading" : "idle"} className="inline-flex" {...pop}>
            {loading ? <Loader2 className="animate-spin" /> : <Search />}
          </motion.span>
        </AnimatePresence>
      </span>

      <Input
        ref={ref}
        type="search"
        value={current}
        placeholder={placeholder}
        aria-busy={loading || undefined}
        className={cn("pl-9 pr-16", className)}
        onChange={(e) => update(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Escape" && current) {
            e.preventDefault();
            update("");
          }
          onKeyDown?.(e);
        }}
        {...props}
      />

      <span className="absolute right-1.5 top-1/2 inline-flex -translate-y-1/2 items-center">
        <AnimatePresence mode="popLayout" initial={false}>
          {current ? (
            <motion.button
              key="clear"
              type="button"
              aria-label="Clear search"
              className="inline-flex size-6 items-center justify-center rounded-md text-muted-foreground outline-none transition-colors hover:bg-accent hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50 [&_svg]:size-3.5"
              onClick={() => {
                update("");
                ref.current?.focus();
              }}
              {...pop}
            >
              <X />
            </motion.button>
          ) : shortcut ? (
            <motion.kbd
              key="kbd"
              className="pointer-events-none mr-0.5 hidden h-5 items-center gap-0.5 rounded border border-border bg-muted/60 px-1.5 font-mono text-[10px] text-muted-foreground sm:inline-flex transition-opacity group-focus-within/search:opacity-0"
              {...pop}
            >
              <span className="text-xs">⌘</span>
              {shortcut.toUpperCase()}
            </motion.kbd>
          ) : null}
        </AnimatePresence>
      </span>
    </div>
  );
}
