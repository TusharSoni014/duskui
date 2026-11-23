"use client";

import * as React from "react";
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from "motion/react";
import {
  ChevronRight,
  File,
  FileArchive,
  FileBraces,
  FileCode,
  FileCog,
  FileImage,
  FileLock,
  FileMusic,
  FileSpreadsheet,
  FileTerminal,
  FileText,
  FileType,
  FileVideoCamera,
  Folder,
  FolderOpen,
  type LucideIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";

export interface FileTreeItem {
  /** Unique, stable id (a path works well). */
  id: string;
  name: string;
  /** Present (even empty) for folders. */
  children?: FileTreeItem[];
  /** Replaces the icon picked from the extension. */
  icon?: React.ReactNode;
  /** Small trailing content, e.g. a git status letter. */
  badge?: React.ReactNode;
  /** Focusable but cannot be selected. */
  disabled?: boolean;
}

export interface FileTreeProps
  extends Omit<React.ComponentProps<"ul">, "onSelect" | "children" | "defaultValue"> {
  items: FileTreeItem[];
  /** Open folder ids (controlled). */
  expanded?: string[];
  defaultExpanded?: string[];
  onExpandedChange?: (expanded: string[]) => void;
  /** Selected item id (controlled). */
  selected?: string | null;
  defaultSelected?: string | null;
  onSelectedChange?: (id: string, item: FileTreeItem) => void;
  /** Draw vertical guides for each nesting level. The selected item's branch is highlighted. */
  indentGuides?: boolean;
  /** Indent per level in px. */
  indent?: number;
}

type Row = {
  item: FileTreeItem;
  depth: number;
  parentId: string | null;
  posinset: number;
  setsize: number;
};

const isFolder = (item: FileTreeItem) => Array.isArray(item.children);

const ICONS: Array<[RegExp, LucideIcon, string]> = [
  // Lock and config files first, so `package-lock.json` or `next.config.ts` don't read as plain code.
  [/(\.lock|-lock\.json|-lock\.ya?ml)$/i, FileLock, "text-white/45"],
  [/(\.config\.[a-z]+|^\.[\w.-]+)$/i, FileCog, "text-white/55"],
  [/\.(tsx?|jsx?|mjs|cjs|vue|svelte|astro|py|rb|go|rs|java|kt|swift|c|cpp|h|php)$/i, FileCode, "text-sky-400"],
  [/\.(json|jsonc|ya?ml|toml)$/i, FileBraces, "text-amber-300"],
  [/\.(css|scss|sass|less)$/i, FileType, "text-pink-400"],
  [/\.(mdx?|txt|rst)$/i, FileText, "text-white/60"],
  [/\.(png|jpe?g|gif|webp|avif|svg|ico)$/i, FileImage, "text-violet-400"],
  [/\.(mp4|mov|webm|mkv)$/i, FileVideoCamera, "text-rose-400"],
  [/\.(mp3|wav|ogg|flac)$/i, FileMusic, "text-fuchsia-400"],
  [/\.(zip|tar|gz|tgz|rar|7z)$/i, FileArchive, "text-orange-300"],
  [/\.(csv|tsv|xlsx?)$/i, FileSpreadsheet, "text-emerald-400"],
  [/\.(sh|bash|zsh|ps1)$/i, FileTerminal, "text-lime-300"],
];

/** The lucide icon and color class used for a file name. */
export function fileIcon(name: string): { Icon: LucideIcon; className: string } {
  for (const [pattern, Icon, className] of ICONS) {
    if (pattern.test(name)) return { Icon, className };
  }
  return { Icon: File, className: "text-white/50" };
}

function flatten(items: FileTreeItem[], open: Set<string>, depth = 0, parentId: string | null = null, out: Row[] = []) {
  items.forEach((item, index) => {
    out.push({ item, depth, parentId, posinset: index + 1, setsize: items.length });
    if (isFolder(item) && open.has(item.id)) flatten(item.children!, open, depth + 1, item.id, out);
  });
  return out;
}

function findPath(items: FileTreeItem[], id: string, trail: string[] = []): string[] | null {
  for (const item of items) {
    if (item.id === id) return trail;
    if (item.children) {
      const found = findPath(item.children, id, [...trail, item.id]);
      if (found) return found;
    }
  }
  return null;
}

type TreeContextValue = {
  open: Set<string>;
  selected: string | null;
  focusable: string | null;
  branch: Set<string>;
  indent: number;
  indentGuides: boolean;
  instant: boolean;
  layoutId: string;
  register: (id: string, el: HTMLLIElement | null) => void;
  onItemClick: (item: FileTreeItem) => void;
  onItemFocus: (id: string) => void;
};

const TreeContext = React.createContext<TreeContextValue | null>(null);

/**
 * An accessible file tree for React: folders and files with icons picked from
 * the extension, folders that spring open and closed, a selection highlight
 * that glides between rows, and optional indent guides.
 *
 * Follows the WAI-ARIA tree pattern: one tab stop (roving tabindex), arrow
 * keys to move / open / close, Home and End, Enter or Space to select (and
 * toggle folders), `*` to open all siblings, and type-ahead by name. Expanded
 * and selected state can be controlled. Rendered from data, so the initial
 * tree is in the server HTML; collapsed branches are not rendered.
 * Reduced motion turns the animations off.
 */
export function FileTree({
  items,
  expanded: expandedProp,
  defaultExpanded = [],
  onExpandedChange,
  selected: selectedProp,
  defaultSelected = null,
  onSelectedChange,
  indentGuides = true,
  indent = 16,
  className,
  onKeyDown,
  "aria-label": ariaLabel = "Files",
  ...props
}: FileTreeProps) {
  const reduceMotion = useReducedMotion();
  const layoutId = React.useId();
  const [expandedState, setExpandedState] = React.useState(defaultExpanded);
  const [selectedState, setSelectedState] = React.useState(defaultSelected);
  const [focusedId, setFocusedId] = React.useState<string | null>(null);
  const expanded = expandedProp ?? expandedState;
  const selected = selectedProp !== undefined ? selectedProp : selectedState;

  const open = React.useMemo(() => new Set(expanded), [expanded]);
  const rows = React.useMemo(() => flatten(items, open), [items, open]);
  const branch = React.useMemo(() => new Set(selected ? findPath(items, selected) ?? [] : []), [items, selected]);

  // The single tab stop: the focused row, else the selected row, else the first.
  // If the remembered row was hidden by collapsing an ancestor, fall back to that ancestor.
  const visible = React.useMemo(() => new Set(rows.map((r) => r.item.id)), [rows]);
  const pick = (id: string | null) => {
    if (!id) return null;
    if (visible.has(id)) return id;
    const path = findPath(items, id);
    return path?.filter((p) => visible.has(p)).pop() ?? null;
  };
  const focusable = pick(focusedId) ?? pick(selected) ?? rows[0]?.item.id ?? null;

  const elements = React.useRef(new Map<string, HTMLLIElement>());
  const register = React.useCallback((id: string, el: HTMLLIElement | null) => {
    if (el) elements.current.set(id, el);
    else elements.current.delete(id);
  }, []);

  const setExpanded = (next: string[]) => {
    if (expandedProp === undefined) setExpandedState(next);
    onExpandedChange?.(next);
  };
  const toggle = (id: string, force?: boolean) => {
    const isOpen = open.has(id);
    const next = force ?? !isOpen;
    if (next === isOpen) return;
    setExpanded(next ? [...expanded, id] : expanded.filter((e) => e !== id));
  };
  const select = (item: FileTreeItem) => {
    if (item.disabled) return;
    if (selectedProp === undefined) setSelectedState(item.id);
    onSelectedChange?.(item.id, item);
  };
  const focusRow = (id: string | undefined) => {
    if (!id) return;
    setFocusedId(id);
    elements.current.get(id)?.focus();
  };

  const typeahead = React.useRef({ buffer: "", time: 0 });

  const handleKeyDown = (event: React.KeyboardEvent<HTMLUListElement>) => {
    onKeyDown?.(event);
    if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey) return;
    const index = rows.findIndex((r) => r.item.id === focusable);
    const row = rows[index];
    if (!row) return;
    const { item } = row;
    const folder = isFolder(item);
    let handled = true;

    switch (event.key) {
      case "ArrowDown":
        focusRow(rows[index + 1]?.item.id);
        break;
      case "ArrowUp":
        focusRow(rows[index - 1]?.item.id);
        break;
      case "ArrowRight":
        if (folder && !open.has(item.id)) toggle(item.id, true);
        else if (folder && item.children!.length) focusRow(rows[index + 1]?.item.id);
        break;
      case "ArrowLeft":
        if (folder && open.has(item.id)) toggle(item.id, false);
        else focusRow(row.parentId ?? undefined);
        break;
      case "Home":
        focusRow(rows[0]?.item.id);
        break;
      case "End":
        focusRow(rows[rows.length - 1]?.item.id);
        break;
      case "Enter":
      case " ":
        select(item);
        if (folder) toggle(item.id);
        break;
      case "*": {
        const siblings = rows
          .filter((r) => r.parentId === row.parentId && isFolder(r.item) && !open.has(r.item.id))
          .map((r) => r.item.id);
        if (siblings.length) setExpanded([...expanded, ...siblings]);
        break;
      }
      default: {
        if (event.key.length !== 1 || !/\S/.test(event.key)) {
          handled = false;
          break;
        }
        const now = event.timeStamp;
        const t = typeahead.current;
        t.buffer = now - t.time > 600 ? event.key : t.buffer + event.key;
        t.time = now;
        const query = t.buffer.toLowerCase();
        // Repeating one letter cycles through matches; a longer string refines from the current row.
        const cycling = query.length > 1 && query.split("").every((c) => c === query[0]);
        const needle = cycling ? query[0] : query;
        const startAt = cycling || query.length === 1 ? index + 1 : index;
        for (let k = 0; k < rows.length; k++) {
          const candidate = rows[(startAt + k) % rows.length];
          if (candidate.item.name.toLowerCase().startsWith(needle)) {
            focusRow(candidate.item.id);
            break;
          }
        }
      }
    }
    if (handled) event.preventDefault();
  };

  const context: TreeContextValue = {
    open,
    selected,
    focusable,
    branch,
    indent,
    indentGuides,
    instant: !!reduceMotion,
    layoutId,
    register,
    onItemClick: (item) => {
      setFocusedId(item.id);
      select(item);
      if (isFolder(item)) toggle(item.id);
    },
    onItemFocus: setFocusedId,
  };

  return (
    <TreeContext.Provider value={context}>
      <LayoutGroup id={layoutId}>
        <ul
          role="tree"
          aria-label={ariaLabel}
          data-slot="file-tree"
          className={cn("relative select-none text-sm", className)}
          onKeyDown={handleKeyDown}
          {...props}
        >
          {items.map((item, index) => (
            <TreeNode key={item.id} item={item} depth={0} posinset={index + 1} setsize={items.length} />
          ))}
        </ul>
      </LayoutGroup>
    </TreeContext.Provider>
  );
}

function TreeNode({
  item,
  depth,
  posinset,
  setsize,
}: {
  item: FileTreeItem;
  depth: number;
  posinset: number;
  setsize: number;
}) {
  const ctx = React.useContext(TreeContext)!;
  const folder = isFolder(item);
  const isOpen = folder && ctx.open.has(item.id);
  const isSelected = ctx.selected === item.id;
  const padding = 8 + depth * ctx.indent;
  const { Icon, className: iconColor } = fileIcon(item.name);
  const spring = ctx.instant ? { duration: 0 } : { type: "spring" as const, bounce: 0.1, duration: 0.35 };

  return (
    <li
      ref={(el) => ctx.register(item.id, el)}
      role="treeitem"
      aria-level={depth + 1}
      aria-posinset={posinset}
      aria-setsize={setsize}
      aria-expanded={folder ? isOpen : undefined}
      aria-selected={item.disabled ? undefined : isSelected}
      aria-disabled={item.disabled || undefined}
      tabIndex={ctx.focusable === item.id ? 0 : -1}
      onFocus={(event) => {
        if (event.target === event.currentTarget) ctx.onItemFocus(item.id);
      }}
      className="outline-none"
    >
      <div
        onClick={(event) => {
          event.stopPropagation();
          ctx.onItemClick(item);
        }}
        className={cn(
          "relative flex h-8 cursor-pointer items-center gap-1.5 rounded-md pr-2 transition-colors duration-150",
          "text-white/70 hover:bg-white/[0.04] hover:text-white",
          "[li:focus-visible>&]:ring-2 [li:focus-visible>&]:ring-ring/60",
          isSelected && "text-white hover:bg-transparent",
          item.disabled && "cursor-not-allowed opacity-50"
        )}
        style={{ paddingLeft: padding }}
      >
        {isSelected && (
          <motion.span
            layoutId={`${ctx.layoutId}-selection`}
            aria-hidden
            className="absolute inset-0 rounded-md bg-primary/12 shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--color-primary)_28%,transparent)]"
            transition={ctx.instant ? { duration: 0 } : { type: "spring", bounce: 0.18, duration: 0.4 }}
          />
        )}
        <span aria-hidden className="relative grid size-4 shrink-0 place-items-center text-white/40">
          {folder && (
            <ChevronRight
              className={cn(
                "size-3.5 transition-transform duration-200 motion-reduce:transition-none",
                isOpen && "rotate-90"
              )}
            />
          )}
        </span>
        <span aria-hidden className="relative grid size-4 shrink-0 place-items-center">
          {item.icon ??
            (folder ? (
              isOpen ? (
                <FolderOpen className="size-4 text-primary" />
              ) : (
                <Folder className="size-4 text-primary/80" />
              )
            ) : (
              <Icon className={cn("size-4", iconColor)} />
            ))}
        </span>
        <span className={cn("relative truncate", isSelected && "font-medium")}>{item.name}</span>
        {item.badge != null && <span className="relative ml-auto pl-2 text-xs text-white/45">{item.badge}</span>}
      </div>

      {folder && (
        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.ul
              key="group"
              role="group"
              className="relative overflow-hidden"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ height: spring, opacity: { duration: ctx.instant ? 0 : 0.2 } }}
            >
              {ctx.indentGuides && (
                <span
                  aria-hidden
                  className={cn(
                    "pointer-events-none absolute inset-y-1 w-px transition-colors duration-200",
                    ctx.branch.has(item.id) ? "bg-primary/45" : "bg-white/10"
                  )}
                  style={{ left: padding + 7.5 }}
                />
              )}
              {item.children!.map((child, index) => (
                <TreeNode
                  key={child.id}
                  item={child}
                  depth={depth + 1}
                  posinset={index + 1}
                  setsize={item.children!.length}
                />
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      )}
    </li>
  );
}
