"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Command as CommandPrimitive, defaultFilter } from "cmdk";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type Transition,
} from "motion/react";
import { ChevronLeft, ChevronRight, CornerDownLeft, History, Search } from "lucide-react";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
  CommandShortcut,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";

export type CommandPaletteItem = {
  /** Unique within the palette. */
  id: string;
  label: string;
  icon?: React.ReactNode;
  /** Secondary line under the label. */
  description?: string;
  /** Keyboard hint, e.g. "⌘N". Visual only. */
  shortcut?: string;
  /** Extra search terms. */
  keywords?: string[];
  disabled?: boolean;
  /** Open a nested page (by page id) instead of running an action. */
  page?: string;
  /** Run the action. The palette closes afterwards unless `keepOpen` is set. */
  onSelect?: () => void;
  keepOpen?: boolean;
};

export type CommandPaletteGroup = {
  heading: string;
  items: CommandPaletteItem[];
};

export type CommandPalettePage = {
  id: string;
  /** Shown in the breadcrumb. */
  title: string;
  placeholder?: string;
  groups: CommandPaletteGroup[];
};

export interface CommandPaletteProps {
  /** Groups on the home page. */
  groups: CommandPaletteGroup[];
  /** Nested pages, opened by items with a `page`. */
  pages?: CommandPalettePage[];
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Element that opens the palette, usually a Button. */
  trigger?: React.ReactElement;
  /** Key that toggles the palette with ⌘ / Ctrl. `null` disables the shortcut. */
  hotkey?: string | null;
  placeholder?: string;
  emptyMessage?: React.ReactNode;
  /** Item ids shown under "Recent" before anything has been run. */
  defaultRecent?: string[];
  /** How many recent items to keep. 0 hides the group. */
  recentLimit?: number;
  /** Accessible title (visually hidden). */
  title?: string;
  /** Accessible description (visually hidden). */
  description?: string;
  className?: string;
}

const highlightSpring: Transition = { type: "spring", stiffness: 560, damping: 40, mass: 0.6 };
const heightSpring: Transition = { type: "spring", bounce: 0, duration: 0.35 };
const surfaceSpring: Transition = { type: "spring", duration: 0.35, bounce: 0.18 };

/** Search labels, descriptions and keywords, never internal ids. */
const filter = (_value: string, search: string, keywords?: string[]) =>
  defaultFilter("", search, keywords);

/**
 * A ⌘K command palette. A highlight glides between items as you arrow or
 * hover, recently run actions surface at the top, and items can open nested
 * pages — the list slides in from the side you're travelling, a breadcrumb
 * shows where you are and the panel springs to the new height. Backspace on
 * an empty search or Escape goes back a page. Built on cmdk and Radix Dialog:
 * filtering, keyboard navigation, focus trap and focus return all work.
 */
export function CommandPalette({
  groups,
  pages = [],
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  trigger,
  hotkey = "k",
  placeholder = "Type a command or search…",
  emptyMessage = "No results found.",
  defaultRecent = [],
  recentLimit = 3,
  title = "Command palette",
  description = "Search for a command to run.",
  className,
}: CommandPaletteProps) {
  const reduceMotion = useReducedMotion() ?? false;
  const layoutId = React.useId();
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen);
  const open = openProp ?? internalOpen;
  const [stack, setStack] = React.useState<string[]>([]);
  const [direction, setDirection] = React.useState(0);
  const [search, setSearch] = React.useState("");
  const [selected, setSelected] = React.useState("");
  const [recent, setRecent] = React.useState<string[]>(defaultRecent);
  const inputRef = React.useRef<HTMLInputElement>(null);
  // An action run as the palette closes is added to Recent once it has faded out.
  const pendingRecent = React.useRef<string | null>(null);

  const pageId = stack[stack.length - 1];
  const page = pageId ? pages.find((p) => p.id === pageId) : undefined;

  const setOpen = React.useCallback(
    (next: boolean) => {
      if (openProp === undefined) setInternalOpen(next);
      onOpenChange?.(next);
    },
    [openProp, onOpenChange]
  );

  // ⌘K / Ctrl+K toggles the palette.
  const openRef = React.useRef(open);
  React.useEffect(() => {
    openRef.current = open;
  }, [open]);
  React.useEffect(() => {
    if (!hotkey) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === hotkey.toLowerCase() && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setOpen(!openRef.current);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [hotkey, setOpen]);

  const findItem = (id: string) => {
    for (const group of [...groups, ...pages.flatMap((p) => p.groups)]) {
      const item = group.items.find((i) => i.id === id);
      if (item) return item;
    }
  };

  const go = (next: string[], dir: number) => {
    setDirection(dir);
    setStack(next);
    setSearch("");
    // Let cmdk pick the first item of the new page.
    setSelected("");
    inputRef.current?.focus();
  };

  const back = () => {
    if (stack.length) go(stack.slice(0, -1), -1);
  };

  const run = (item: CommandPaletteItem) => {
    if (item.page) {
      go([...stack, item.page], 1);
      return;
    }
    item.onSelect?.();
    if (item.keepOpen) {
      remember(item.id);
    } else {
      pendingRecent.current = item.id;
      setOpen(false);
    }
  };

  const remember = (id: string) => {
    if (recentLimit > 0) setRecent((r) => [id, ...r.filter((x) => x !== id)].slice(0, recentLimit));
  };

  const recentItems =
    !page && !search && recentLimit > 0
      ? recent
          .map(findItem)
          .filter((item): item is CommandPaletteItem => !!item && !item.page)
          .slice(0, recentLimit)
      : [];

  const visibleGroups = page ? page.groups : groups;

  const renderItem = (item: CommandPaletteItem, prefix: string) => {
    const value = `${prefix}:${item.id}`;
    const isSelected = selected === value;
    return (
      <CommandItem
        key={value}
        value={value}
        keywords={[item.label, item.description ?? "", ...(item.keywords ?? [])]}
        disabled={item.disabled}
        onSelect={() => run(item)}
        className={cn(
          "group/item gap-3 rounded-lg px-2.5 py-2",
          // The gliding highlight replaces the static selected background and marker.
          "data-[selected=true]:bg-transparent before:hidden"
        )}
      >
        {isSelected && (
          <motion.span
            aria-hidden
            // One highlight per page, so it glides within a page and simply appears on a new one.
            layoutId={`${layoutId}-${prefix === "recent" ? "home" : prefix}-highlight`}
            transition={reduceMotion ? { duration: 0 } : highlightSpring}
            className="absolute inset-0 rounded-lg bg-accent shadow-[inset_0_1px_0_rgb(255_255_255/0.05),inset_0_0_0_1px_color-mix(in_oklab,var(--color-primary)_18%,transparent)]"
          />
        )}
        {item.icon && (
          <span
            aria-hidden
            className={cn(
              "relative flex size-7 shrink-0 items-center justify-center rounded-md border bg-white/[0.03] transition-colors duration-150 [&_svg]:size-4",
              isSelected ? "border-primary/30 text-primary [&_svg]:!text-primary" : "text-muted-foreground"
            )}
          >
            {item.icon}
          </span>
        )}
        <span className="relative flex min-w-0 flex-1 flex-col">
          <span className="truncate">{item.label}</span>
          {item.description && (
            <span className="truncate text-xs text-muted-foreground">{item.description}</span>
          )}
        </span>
        {item.shortcut && <CommandShortcut className="relative">{item.shortcut}</CommandShortcut>}
        {item.page && (
          <ChevronRight
            aria-hidden
            className={cn(
              "relative transition-transform duration-200",
              isSelected && !reduceMotion && "translate-x-0.5"
            )}
          />
        )}
      </CommandItem>
    );
  };

  return (
    <DialogPrimitive.Root
      open={open}
      onOpenChange={setOpen}
    >
      {trigger && <DialogPrimitive.Trigger asChild>{trigger}</DialogPrimitive.Trigger>}
      <AnimatePresence
        onExitComplete={() => {
          // Reset once fully closed so the palette reopens on its home page.
          if (pendingRecent.current) remember(pendingRecent.current);
          pendingRecent.current = null;
          setStack([]);
          setDirection(0);
          setSearch("");
          setSelected("");
        }}
      >
        {open && (
          // forceMount hands mounting to AnimatePresence so the exit animation can play.
          <DialogPrimitive.Portal forceMount>
            <DialogPrimitive.Overlay forceMount asChild>
              <motion.div
                className="fixed inset-0 z-50 bg-black/60 backdrop-blur-[2px]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, transition: { duration: 0.15 } }}
                transition={{ duration: 0.2 }}
              />
            </DialogPrimitive.Overlay>
            <DialogPrimitive.Content
              forceMount
              asChild
              onOpenAutoFocus={(event) => {
                event.preventDefault();
                inputRef.current?.focus();
              }}
              onEscapeKeyDown={(event) => {
                // Escape steps back out of nested pages before closing.
                if (stack.length) {
                  event.preventDefault();
                  back();
                }
              }}
            >
              <motion.div
                className={cn(
                  "fixed top-[max(1rem,12dvh)] left-1/2 z-50 w-[calc(100%-2rem)] max-w-xl -translate-x-1/2 outline-none",
                  className
                )}
                initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: -8 }}
                animate={reduceMotion ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
                exit={
                  reduceMotion
                    ? { opacity: 0, transition: { duration: 0.1 } }
                    : { opacity: 0, scale: 0.98, y: -4, transition: { duration: 0.12, ease: "easeIn" } }
                }
                transition={surfaceSpring}
              >
                <DialogPrimitive.Title className="sr-only">{title}</DialogPrimitive.Title>
                <DialogPrimitive.Description className="sr-only">{description}</DialogPrimitive.Description>
                <Command
                  loop
                  filter={filter}
                  value={selected}
                  onValueChange={setSelected}
                  className="rounded-2xl border shadow-[inset_0_1px_0_rgb(255_255_255/0.05),0_24px_64px_-12px_rgb(0_0_0/0.75),0_0_0_1px_rgb(0_0_0/0.3)]"
                  onKeyDown={(event) => {
                    if (event.key === "Backspace" && !search && stack.length) {
                      event.preventDefault();
                      back();
                    }
                  }}
                >
                  <div className="flex items-center gap-2 border-b px-3">
                    <Search aria-hidden className="size-4 shrink-0 text-primary" />
                    <AnimatePresence initial={false} mode="popLayout">
                      {stack.length > 0 && (
                        <motion.nav
                          key="crumbs"
                          aria-label="Breadcrumb"
                          className="flex shrink-0 items-center gap-1"
                          initial={reduceMotion ? { opacity: 0 } : { opacity: 0, x: -6 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={reduceMotion ? { opacity: 0 } : { opacity: 0, x: -6 }}
                          transition={{ duration: 0.18 }}
                        >
                          <button
                            type="button"
                            onClick={back}
                            aria-label="Back"
                            className="inline-flex size-6 items-center justify-center rounded-md text-muted-foreground outline-none transition-colors hover:bg-accent hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50"
                          >
                            <ChevronLeft className="size-4" aria-hidden />
                          </button>
                          {stack.map((id, i) => (
                            <span
                              key={id}
                              aria-current={i === stack.length - 1 ? "page" : undefined}
                              className="rounded-md border border-primary/25 bg-primary/10 px-1.5 py-0.5 text-xs font-medium text-primary"
                            >
                              {pages.find((p) => p.id === id)?.title ?? id}
                            </span>
                          ))}
                        </motion.nav>
                      )}
                    </AnimatePresence>
                    <CommandPrimitive.Input
                      ref={inputRef}
                      value={search}
                      onValueChange={setSearch}
                      placeholder={page?.placeholder ?? placeholder}
                      className="h-12 min-w-0 flex-1 bg-transparent text-sm caret-primary outline-none placeholder:text-muted-foreground"
                    />
                    <kbd className="hidden shrink-0 rounded border border-white/10 bg-white/[0.04] px-1.5 py-0.5 font-mono text-[0.65rem] text-muted-foreground sm:inline">
                      esc
                    </kbd>
                  </div>

                  <AutoHeight transition={reduceMotion ? { duration: 0 } : heightSpring}>
                    <CommandList className="h-auto max-h-[min(380px,55dvh)] scroll-py-2 transition-none">
                      {/* A fresh key per page replays the slide-in from the travel direction. */}
                      <motion.div
                        key={pageId ?? "home"}
                        className="p-1.5"
                        initial={
                          direction === 0 || reduceMotion
                            ? false
                            : { opacity: 0, x: direction * 24, filter: "blur(3px)" }
                        }
                        animate={{ opacity: 1, x: 0, filter: "blur(0px)", transitionEnd: { filter: "none" } }}
                        transition={{ type: "spring", bounce: 0, duration: 0.3 }}
                      >
                        <CommandEmpty>{emptyMessage}</CommandEmpty>
                        {recentItems.length > 0 && (
                          <CommandGroup
                            heading={
                              <span className="flex items-center gap-1.5">
                                <History className="size-3" aria-hidden />
                                Recent
                              </span>
                            }
                          >
                            {recentItems.map((item) => renderItem(item, "recent"))}
                          </CommandGroup>
                        )}
                        {visibleGroups.map((group) => (
                          <CommandGroup key={group.heading} heading={group.heading}>
                            {group.items.map((item) => renderItem(item, pageId ?? "home"))}
                          </CommandGroup>
                        ))}
                      </motion.div>
                    </CommandList>
                  </AutoHeight>

                  <div className="flex items-center gap-4 border-t px-3 py-2 text-[0.7rem] text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <Kbd>↑</Kbd>
                      <Kbd>↓</Kbd>
                      navigate
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Kbd>
                        <CornerDownLeft className="size-3" aria-hidden />
                      </Kbd>
                      select
                    </span>
                    <span className="ml-auto flex items-center gap-1.5">
                      <Kbd>{stack.length ? "⌫" : "esc"}</Kbd>
                      {stack.length ? "back" : "close"}
                    </span>
                  </div>
                </Command>
              </motion.div>
            </DialogPrimitive.Content>
          </DialogPrimitive.Portal>
        )}
      </AnimatePresence>
    </DialogPrimitive.Root>
  );
}

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="inline-flex h-5 min-w-5 items-center justify-center rounded border border-white/10 bg-white/[0.04] px-1 font-mono text-[0.65rem]">
      {children}
    </kbd>
  );
}

/** Springs its height to its content, so the palette never jumps between pages or results. */
function AutoHeight({ children, transition }: { children: React.ReactNode; transition: Transition }) {
  const innerRef = React.useRef<HTMLDivElement>(null);
  const [height, setHeight] = React.useState<number | "auto">("auto");

  React.useLayoutEffect(() => {
    const el = innerRef.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) =>
      setHeight(entry.borderBoxSize?.[0]?.blockSize ?? el.offsetHeight)
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <motion.div initial={false} animate={{ height }} transition={transition} className="overflow-hidden">
      <div ref={innerRef}>{children}</div>
    </motion.div>
  );
}
