"use client";

import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { Command as CommandPrimitive } from "cmdk";
import { ChevronDownIcon, SearchXIcon, XIcon } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion, type Transition, type Variants } from "motion/react";

import { Popover, PopoverAnchor } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export interface MultiComboboxOption {
  value: string;
  label: string;
  /** Leading icon element. Also shown on the chip. */
  icon?: React.ReactNode;
  /** Extra search terms that match this option. */
  keywords?: string[];
  disabled?: boolean;
}

export interface MultiComboboxProps {
  options: MultiComboboxOption[];
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
  /** Input placeholder while nothing is selected. */
  placeholder?: string;
  /** Shown when the search matches nothing. */
  emptyMessage?: React.ReactNode;
  /** Stop adding once this many are selected. */
  max?: number;
  /** Form field name. Each value is submitted with its own hidden input. */
  name?: string;
  disabled?: boolean;
  /** Accessible name for the search input and list (cmdk wires it to a hidden label). */
  "aria-label"?: string;
  /** Classes for the field. */
  className?: string;
  /** Classes for the floating panel. */
  contentClassName?: string;
}

const pillSpring: Transition = { type: "spring", stiffness: 520, damping: 38, mass: 0.6 };
const layoutSpring: Transition = { type: "spring", bounce: 0.1, duration: 0.3 };

function filterOptions(options: MultiComboboxOption[], query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return options;
  const starts: MultiComboboxOption[] = [];
  const contains: MultiComboboxOption[] = [];
  for (const option of options) {
    const label = option.label.toLowerCase();
    if (label.startsWith(q)) starts.push(option);
    else if (label.includes(q) || option.keywords?.some((k) => k.toLowerCase().includes(q))) contains.push(option);
  }
  return [...starts, ...contains];
}

function Highlight({ label, query }: { label: string; query: string }) {
  const q = query.trim();
  const index = q ? label.toLowerCase().indexOf(q.toLowerCase()) : -1;
  if (index < 0) return <>{label}</>;
  return (
    <>
      {label.slice(0, index)}
      <mark className="bg-transparent font-semibold text-foreground">{label.slice(index, index + q.length)}</mark>
      {label.slice(index + q.length)}
    </>
  );
}

/**
 * A multi-select combobox: type to filter, pick as many options as you like
 * and each one becomes a chip that scales into the field. Chips slide over to
 * make room and shrink away when removed (with their ✕, or Backspace in the
 * empty input). The list keeps its layout animations, a gliding highlight and
 * checkboxes that draw themselves. cmdk handles Up/Down/Home/End/Enter and
 * aria; Radix positions the panel and closes it on Escape, Tab or an outside
 * click. Changes are announced to screen readers. Under reduced motion it fades.
 */
export function MultiCombobox({
  options,
  value: valueProp,
  defaultValue = [],
  onValueChange,
  placeholder = "Search…",
  emptyMessage = "No results found.",
  max,
  name,
  disabled = false,
  "aria-label": ariaLabel = "Options",
  className,
  contentClassName,
}: MultiComboboxProps) {
  const autoId = React.useId();
  const reduceMotion = useReducedMotion() ?? false;
  const fieldRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [uncontrolled, setUncontrolled] = React.useState<string[]>(defaultValue);
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [highlight, setHighlight] = React.useState("");
  const [announcement, setAnnouncement] = React.useState("");
  const selected = valueProp ?? uncontrolled;
  const filtered = React.useMemo(() => filterOptions(options, query), [options, query]);
  const byValue = React.useMemo(() => new Map(options.map((o) => [o.value, o])), [options]);
  const full = max !== undefined && selected.length >= max;

  const commit = (next: string[]) => {
    if (valueProp === undefined) setUncontrolled(next);
    onValueChange?.(next);
  };

  const toggle = (value: string) => {
    const label = byValue.get(value)?.label ?? value;
    if (selected.includes(value)) {
      commit(selected.filter((v) => v !== value));
      setAnnouncement(`${label} removed`);
    } else if (!full) {
      commit([...selected, value]);
      setAnnouncement(`${label} added, ${selected.length + 1} selected`);
    }
    setQuery("");
  };

  const remove = (value: string) => {
    commit(selected.filter((v) => v !== value));
    setAnnouncement(`${byValue.get(value)?.label ?? value} removed`);
    inputRef.current?.focus();
  };

  const surface: Variants = reduceMotion
    ? { closed: { opacity: 0, transition: { duration: 0.1 } }, open: { opacity: 1, transition: { duration: 0.15 } } }
    : {
        closed: { opacity: 0, scale: 0.96, y: -4, transition: { duration: 0.12, ease: "easeIn" } },
        open: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", duration: 0.25, bounce: 0 } },
      };

  const chip = reduceMotion
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : {
        initial: { opacity: 0, scale: 0.9 },
        animate: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 0.9, transition: { duration: 0.15 } },
      };

  return (
    <Popover open={open && !disabled} onOpenChange={setOpen}>
      <CommandPrimitive
        shouldFilter={false}
        value={highlight}
        onValueChange={setHighlight}
        loop
        label={ariaLabel}
        className="relative w-full"
      >
        <PopoverAnchor asChild>
          <div
            ref={fieldRef}
            data-slot="multi-combobox"
            data-state={open ? "open" : "closed"}
            data-disabled={disabled || undefined}
            onPointerDown={(event) => {
              if (disabled || (event.target as HTMLElement).closest("button")) return;
              if (event.target !== inputRef.current) event.preventDefault();
              inputRef.current?.focus();
              setOpen(true);
            }}
            className={cn(
              "relative flex min-h-9 w-full cursor-text flex-wrap items-center gap-1 rounded-md border border-input bg-transparent py-1 pr-8 pl-1.5 text-sm shadow-xs dark:bg-input/30",
              "transition-[border-color,box-shadow,background-color] duration-200 ease-out motion-reduce:transition-none",
              "hover:border-ring/40 dark:hover:bg-input/45",
              "focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/30",
              "data-disabled:pointer-events-none data-disabled:opacity-50",
              className
            )}
          >
            <AnimatePresence initial={false} mode="popLayout">
              {selected.map((value) => {
                const option = byValue.get(value);
                const label = option?.label ?? value;
                return (
                  <motion.span
                    key={value}
                    layout={reduceMotion ? false : "position"}
                    {...chip}
                    transition={{ type: "spring", bounce: 0.1, duration: 0.25 }}
                    className="inline-flex h-6 max-w-full items-center gap-1 rounded-md border border-white/10 bg-white/[0.06] pr-0.5 pl-1.5 text-xs font-medium text-foreground [&_svg:not([class*='size-'])]:size-3.5"
                  >
                    {option?.icon && (
                      <span aria-hidden className="flex">
                        {option.icon}
                      </span>
                    )}
                    <span className="truncate">{label}</span>
                    <button
                      type="button"
                      aria-label={`Remove ${label}`}
                      disabled={disabled}
                      onClick={() => remove(value)}
                      className="grid size-4.5 place-items-center rounded-sm text-muted-foreground outline-none transition-colors hover:bg-white/10 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/60"
                    >
                      <XIcon className="size-3" />
                    </button>
                  </motion.span>
                );
              })}
            </AnimatePresence>

            <CommandPrimitive.Input
              ref={inputRef}
              value={query}
              disabled={disabled}
              placeholder={selected.length ? undefined : placeholder}
              onValueChange={(next) => {
                setQuery(next);
                setOpen(true);
              }}
              onKeyDown={(event) => {
                if (event.key === "Backspace" && !query && selected.length) {
                  event.preventDefault();
                  remove(selected[selected.length - 1]);
                } else if ((event.key === "ArrowDown" || event.key === "ArrowUp") && !open) {
                  event.preventDefault();
                  setOpen(true);
                } else if (event.key === "Escape" && !open && query) {
                  setQuery("");
                }
              }}
              className="h-6 min-w-16 flex-1 bg-transparent px-1 outline-none placeholder:text-muted-foreground"
            />

            <ChevronDownIcon
              aria-hidden
              className={cn(
                "pointer-events-none absolute top-2.5 right-2.5 size-4 text-muted-foreground transition-[rotate,color] duration-200 ease-out motion-reduce:transition-none",
                open && "rotate-180 text-foreground"
              )}
            />
          </div>
        </PopoverAnchor>

        {name && selected.map((value) => <input key={value} type="hidden" name={name} value={value} />)}
        <span className="sr-only" aria-live="polite">
          {announcement}
        </span>

        <AnimatePresence>
          {open && !disabled && (
            <PopoverPrimitive.Portal key="multi-combobox" forceMount>
              <PopoverPrimitive.Content
                forceMount
                asChild
                align="start"
                sideOffset={6}
                // Focus stays in the input while the list is open.
                onOpenAutoFocus={(event) => event.preventDefault()}
                onCloseAutoFocus={(event) => event.preventDefault()}
                onInteractOutside={(event) => {
                  if (fieldRef.current?.contains(event.target as Node)) event.preventDefault();
                }}
              >
                <motion.div
                  variants={surface}
                  initial="closed"
                  animate="open"
                  exit="closed"
                  // Clicking an option must not steal focus from the input.
                  onMouseDown={(event) => event.preventDefault()}
                  className={cn(
                    "z-50 w-(--radix-popover-trigger-width) min-w-56 overflow-hidden rounded-xl border bg-popover text-popover-foreground outline-none",
                    "origin-(--radix-popover-content-transform-origin)",
                    "shadow-lg",
                    contentClassName
                  )}
                >
                  {/* The wrapper scrolls (layoutScroll keeps layout animations right while scrolled); the list eases its height. */}
                  <motion.div layoutScroll className="max-h-72 scroll-py-1.5 overflow-x-hidden overflow-y-auto overscroll-contain">
                    <CommandPrimitive.List
                      label={ariaLabel}
                      aria-multiselectable
                      className={cn(
                        "h-(--cmdk-list-height) overflow-clip transition-[height] duration-200 ease-out motion-reduce:transition-none",
                        filtered.length > 0 && "[&_[cmdk-list-sizer]]:p-1.5"
                      )}
                    >
                      {filtered.map((option, index) => {
                        const isSelected = selected.includes(option.value);
                        const isHighlighted = option.value === highlight;
                        const isDisabled = option.disabled || (full && !isSelected);
                        return (
                          <CommandPrimitive.Item
                            key={option.value}
                            value={option.value}
                            disabled={isDisabled}
                            onSelect={() => toggle(option.value)}
                            aria-checked={isSelected}
                            asChild
                          >
                            <motion.div
                              layout={reduceMotion ? false : "position"}
                              initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -4 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{
                                layout: layoutSpring,
                                default: { type: "spring", duration: 0.3, bounce: 0.1, delay: Math.min(index, 8) * 0.02 },
                              }}
                              className={cn(
                                "relative flex cursor-default items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm text-foreground/85 outline-none select-none",
                                "transition-colors duration-150 data-[selected=true]:text-foreground",
                                "data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50",
                                "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
                              )}
                            >
                              {isHighlighted && (
                                <motion.span
                                  aria-hidden
                                  layoutId={`${autoId}-pill`}
                                  transition={reduceMotion ? { duration: 0 } : pillSpring}
                                  className="absolute inset-0 rounded-lg bg-accent"
                                />
                              )}
                              <span
                                aria-hidden
                                className={cn(
                                  "relative grid size-4 shrink-0 place-items-center rounded-[4px] border transition-[background-color,border-color] duration-150",
                                  isSelected ? "border-primary bg-primary text-primary-foreground" : "border-input bg-input/30"
                                )}
                              >
                                <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={2.25} strokeLinecap="round" strokeLinejoin="round" className="size-3.5">
                                  <motion.path
                                    d="M3.5 8.5l3 3 6-7"
                                    initial={false}
                                    animate={{ pathLength: isSelected ? 1 : 0, opacity: isSelected ? 1 : 0 }}
                                    transition={reduceMotion ? { duration: 0 } : { duration: isSelected ? 0.25 : 0.1, ease: "easeOut" }}
                                  />
                                </svg>
                              </span>
                              {option.icon && (
                                <span
                                  aria-hidden
                                  className={cn(
                                    "relative flex transition-colors duration-150",
                                    isHighlighted || isSelected ? "text-foreground" : "text-muted-foreground"
                                  )}
                                >
                                  {option.icon}
                                </span>
                              )}
                              <span className="relative min-w-0 flex-1 truncate">
                                <Highlight label={option.label} query={query} />
                              </span>
                            </motion.div>
                          </CommandPrimitive.Item>
                        );
                      })}
                    </CommandPrimitive.List>
                  </motion.div>

                  {filtered.length === 0 && (
                    <motion.div
                      role="status"
                      initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.98, y: 4 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className="flex flex-col items-center gap-2 px-4 py-6 text-center text-sm text-muted-foreground"
                    >
                      <span
                        aria-hidden
                        className="grid size-9 place-items-center rounded-full border border-white/10 bg-white/[0.03]"
                      >
                        <SearchXIcon className="size-4" />
                      </span>
                      <span>{emptyMessage}</span>
                    </motion.div>
                  )}

                  {max !== undefined && (
                    <div className="flex items-center justify-between border-t px-3 py-2 text-xs text-muted-foreground">
                      <span>
                        <span className={cn("tabular-nums", full && "text-foreground")}>{selected.length}</span> of {max} selected
                      </span>
                      {selected.length > 0 && (
                        <button
                          type="button"
                          onClick={() => {
                            commit([]);
                            setAnnouncement("All selections cleared");
                          }}
                          className="rounded-sm text-foreground/80 outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/60"
                        >
                          Clear
                        </button>
                      )}
                    </div>
                  )}
                </motion.div>
              </PopoverPrimitive.Content>
            </PopoverPrimitive.Portal>
          )}
        </AnimatePresence>
      </CommandPrimitive>
    </Popover>
  );
}
