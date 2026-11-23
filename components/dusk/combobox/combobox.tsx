"use client";

import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { Command as CommandPrimitive } from "cmdk";
import { CheckIcon, ChevronsUpDownIcon, SearchIcon, SearchXIcon } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion, type Transition, type Variants } from "motion/react";

import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export interface ComboboxOption {
  value: string;
  label: string;
  /** Secondary text on the right of the option. */
  description?: React.ReactNode;
  /** Leading icon element. Also shown in the trigger when selected. */
  icon?: React.ReactNode;
  /** Extra search terms that match this option. */
  keywords?: string[];
  disabled?: boolean;
}

export interface ComboboxProps
  extends Omit<React.ComponentProps<typeof Button>, "value" | "defaultValue" | "onChange" | "children"> {
  options: ComboboxOption[];
  value?: string;
  defaultValue?: string;
  /** Called with the new value, or "" when the selection is cleared. */
  onValueChange?: (value: string) => void;
  /** Trigger text when nothing is selected. */
  placeholder?: string;
  searchPlaceholder?: string;
  /** Shown when the search matches nothing. */
  emptyMessage?: React.ReactNode;
  /** Picking the selected option again clears the selection. */
  allowDeselect?: boolean;
  /** Form field name. The value is submitted with a hidden input. */
  name?: string;
  /** Classes for the floating panel. `className` styles the trigger. */
  contentClassName?: string;
}

const pillSpring: Transition = { type: "spring", stiffness: 520, damping: 38, mass: 0.6 };
const layoutSpring: Transition = { type: "spring", bounce: 0.15, duration: 0.35 };

/** Options whose label starts with the query come first; the rest keep their order. */
function filterOptions(options: ComboboxOption[], query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return options;
  const starts: ComboboxOption[] = [];
  const contains: ComboboxOption[] = [];
  for (const option of options) {
    const label = option.label.toLowerCase();
    if (label.startsWith(q)) starts.push(option);
    else if (label.includes(q) || option.keywords?.some((k) => k.toLowerCase().includes(q))) contains.push(option);
  }
  return [...starts, ...contains];
}

/** Highlights the first match of `query` inside `label`. */
function Highlight({ label, query }: { label: string; query: string }) {
  const q = query.trim();
  const index = q ? label.toLowerCase().indexOf(q.toLowerCase()) : -1;
  if (index < 0) return <>{label}</>;
  return (
    <>
      {label.slice(0, index)}
      <mark className="rounded-[3px] bg-primary/15 text-primary">{label.slice(index, index + q.length)}</mark>
      {label.slice(index + q.length)}
    </>
  );
}

/**
 * A searchable select (shadcn's Popover + Command recipe) with motion. The
 * panel springs out of the trigger, the options cascade in, and as you type
 * the list filters with layout animations: matches slide into their new
 * places, the list height eases to fit, matched text lights up and a
 * highlight pill glides with the arrow keys. A friendly empty state appears
 * when nothing matches. cmdk handles Up/Down/Home/End/Enter and aria
 * (combobox + listbox), Radix handles focus, Escape and outside clicks.
 * Under reduced motion it fades only.
 */
export function Combobox({
  options,
  value: valueProp,
  defaultValue = "",
  onValueChange,
  placeholder = "Select an option…",
  searchPlaceholder = "Search…",
  emptyMessage = "No results found.",
  allowDeselect = true,
  name,
  disabled,
  className,
  contentClassName,
  ...props
}: ComboboxProps) {
  const id = React.useId();
  const reduceMotion = useReducedMotion() ?? false;
  const [uncontrolled, setUncontrolled] = React.useState(defaultValue);
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [highlight, setHighlight] = React.useState("");
  const value = valueProp ?? uncontrolled;
  const selected = options.find((option) => option.value === value);
  const filtered = React.useMemo(() => filterOptions(options, query), [options, query]);

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (next) {
      setQuery("");
      setHighlight(value);
    }
  };

  const select = (next: string) => {
    const resolved = allowDeselect && next === value ? "" : next;
    if (valueProp === undefined) setUncontrolled(resolved);
    onValueChange?.(resolved);
    setOpen(false);
  };

  const surface: Variants = reduceMotion
    ? { closed: { opacity: 0, transition: { duration: 0.1 } }, open: { opacity: 1, transition: { duration: 0.15 } } }
    : {
        closed: { opacity: 0, scale: 0.92, y: -6, transition: { duration: 0.12, ease: "easeIn" } },
        open: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", duration: 0.4, bounce: 0.2 } },
      };

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          aria-haspopup="listbox"
          disabled={disabled}
          className={cn(
            "w-full min-w-48 justify-between px-3 font-normal hover:border-ring/40",
            open && "border-ring/60 ring-[3px] ring-ring/15",
            className
          )}
          {...props}
        >
          <span className="relative flex min-w-0 flex-1 items-center overflow-hidden">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span
                key={selected?.value ?? "placeholder"}
                className={cn("flex min-w-0 items-center gap-2", !selected && "text-muted-foreground")}
                initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 8, filter: "blur(2px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)", transitionEnd: { filter: "none" } }}
                exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -8, filter: "blur(2px)" }}
                transition={{ type: "spring", duration: 0.3, bounce: 0 }}
              >
                {selected?.icon && (
                  <span aria-hidden className="flex text-primary">
                    {selected.icon}
                  </span>
                )}
                <span className="truncate">{selected?.label ?? placeholder}</span>
              </motion.span>
            </AnimatePresence>
          </span>
          <ChevronsUpDownIcon
            aria-hidden
            className={cn("text-muted-foreground transition-colors duration-200", open && "text-foreground")}
          />
        </Button>
      </PopoverTrigger>

      {name && <input type="hidden" name={name} value={value} />}

      <AnimatePresence>
        {open && (
          // forceMount hands mounting to AnimatePresence so the exit animation can play.
          <PopoverPrimitive.Portal key="combobox" forceMount>
            <PopoverPrimitive.Content forceMount asChild align="start" sideOffset={6}>
              <motion.div
                variants={surface}
                initial="closed"
                animate="open"
                exit="closed"
                className={cn(
                  "z-50 w-(--radix-popover-trigger-width) min-w-56 overflow-hidden rounded-xl border bg-popover text-popover-foreground outline-none",
                  "origin-(--radix-popover-content-transform-origin)",
                  "shadow-[inset_0_1px_0_rgb(255_255_255/0.05),0_16px_40px_-12px_rgb(0_0_0/0.7),0_0_0_1px_rgb(0_0_0/0.2)]",
                  contentClassName
                )}
              >
                <CommandPrimitive
                  shouldFilter={false}
                  value={highlight}
                  onValueChange={setHighlight}
                  loop
                  label={placeholder}
                  className="flex flex-col"
                >
                  <div className="flex h-10 items-center gap-2 border-b px-3">
                    <SearchIcon aria-hidden className="size-4 shrink-0 text-muted-foreground" />
                    <CommandPrimitive.Input
                      value={query}
                      onValueChange={setQuery}
                      placeholder={searchPlaceholder}
                      className="h-full w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                    />
                  </div>

                  {/* The wrapper scrolls (layoutScroll keeps layout animations right while scrolled); the list eases its height. */}
                  <motion.div layoutScroll className="max-h-72 scroll-py-1.5 overflow-x-hidden overflow-y-auto overscroll-contain">
                    <CommandPrimitive.List
                      label={placeholder}
                      className={cn(
                        "h-(--cmdk-list-height) overflow-clip transition-[height] duration-200 ease-out motion-reduce:transition-none",
                        filtered.length > 0 && "[&_[cmdk-list-sizer]]:p-1.5"
                      )}
                    >
                      {filtered.map((option, index) => {
                        const isSelected = option.value === value;
                        const isHighlighted = option.value === highlight;
                        return (
                          <CommandPrimitive.Item
                            key={option.value}
                            value={option.value}
                            disabled={option.disabled}
                            onSelect={() => select(option.value)}
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
                                "relative flex cursor-default items-center gap-2.5 rounded-lg py-2 pr-9 pl-2.5 text-sm text-foreground/85 outline-none select-none",
                                "transition-colors duration-150 data-[selected=true]:text-foreground",
                                "data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50",
                                "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
                              )}
                            >
                              {isHighlighted && (
                                <motion.span
                                  aria-hidden
                                  layoutId={`${id}-pill`}
                                  transition={reduceMotion ? { duration: 0 } : pillSpring}
                                  className="absolute inset-0 rounded-lg bg-accent shadow-[inset_0_1px_0_rgb(255_255_255/0.04)]"
                                />
                              )}
                              {option.icon && (
                                <span
                                  aria-hidden
                                  className={cn(
                                    "relative flex transition-colors duration-150",
                                    isHighlighted || isSelected ? "text-primary" : "text-muted-foreground"
                                  )}
                                >
                                  {option.icon}
                                </span>
                              )}
                              <span className="relative min-w-0 flex-1 truncate">
                                <Highlight label={option.label} query={query} />
                              </span>
                              {option.description && (
                                <span className="relative shrink-0 text-xs text-muted-foreground">{option.description}</span>
                              )}
                              <span className="absolute right-2.5 flex size-4 items-center justify-center">
                                <AnimatePresence initial={false}>
                                  {isSelected && (
                                    <motion.span
                                      key="check"
                                      initial={reduceMotion ? { opacity: 0 } : { scale: 0, rotate: -45, opacity: 0 }}
                                      animate={{ scale: 1, rotate: 0, opacity: 1 }}
                                      exit={{ opacity: 0, scale: reduceMotion ? 1 : 0.5 }}
                                      transition={reduceMotion ? { duration: 0.15 } : { type: "spring", bounce: 0.5, duration: 0.45, delay: 0.1 }}
                                      className="flex text-primary drop-shadow-[0_0_6px_var(--color-primary)]"
                                    >
                                      <CheckIcon className="size-4" />
                                    </motion.span>
                                  )}
                                </AnimatePresence>
                              </span>
                            </motion.div>
                          </CommandPrimitive.Item>
                        );
                      })}
                    </CommandPrimitive.List>
                  </motion.div>

                  <AnimatePresence initial={false}>
                    {filtered.length === 0 && (
                      <motion.div
                        key="empty"
                        role="status"
                        initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.95, y: 4 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ type: "spring", duration: 0.35, bounce: 0.2 }}
                        className="flex flex-col items-center gap-2 px-4 py-6 text-center text-sm text-muted-foreground"
                      >
                        <motion.span
                          aria-hidden
                          className="grid size-9 place-items-center rounded-full border border-white/10 bg-white/[0.03]"
                          initial={reduceMotion ? false : { rotate: -12 }}
                          animate={{ rotate: 0 }}
                          transition={{ type: "spring", bounce: 0.6, duration: 0.6 }}
                        >
                          <SearchXIcon className="size-4" />
                        </motion.span>
                        <span>{emptyMessage}</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </CommandPrimitive>
              </motion.div>
            </PopoverPrimitive.Content>
          </PopoverPrimitive.Portal>
        )}
      </AnimatePresence>
    </Popover>
  );
}
