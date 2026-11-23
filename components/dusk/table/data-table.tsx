"use client";

import * as React from "react";
import { ArrowUpIcon, ChevronLeftIcon, ChevronRightIcon, ChevronsUpDownIcon, SearchIcon, SearchXIcon } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion, type Transition } from "motion/react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

export type SortDirection = "asc" | "desc";

export interface DataTableColumn<T> {
  /** Unique id, used for sorting. */
  id: string;
  header: React.ReactNode;
  /** The raw value, used to sort and filter. Leave it out for display-only columns. */
  accessor?: (row: T) => string | number | Date | null | undefined;
  /** Custom cell content. Defaults to the accessor value. */
  cell?: (row: T) => React.ReactNode;
  /** Show a sort button in the header. Defaults to true when there's an accessor. */
  sortable?: boolean;
  /** Include this column in the text filter. Defaults to true when there's an accessor or filterValue. */
  filterable?: boolean;
  /** Text the filter matches for this column. Defaults to the accessor value. */
  filterValue?: (row: T) => string;
  align?: "left" | "center" | "right";
  /** Classes for the header and body cells of this column. */
  className?: string;
}

export interface DataTableProps<T> extends Omit<React.ComponentProps<"div">, "children"> {
  data: T[];
  columns: DataTableColumn<T>[];
  /** A stable id per row. Rows animate by id when they move. */
  getRowId: (row: T) => string;
  /** Accessible name for the table. Rendered as a visually hidden caption. */
  caption: string;
  /** Rows per page. Pass 0 to show every row. */
  pageSize?: number;
  /** Show checkboxes to select rows. */
  selectable?: boolean;
  /** Controlled selected row ids. */
  selectedIds?: string[];
  onSelectionChange?: (ids: string[]) => void;
  /** Show the filter input. */
  filterable?: boolean;
  filterPlaceholder?: string;
  /** Initial sort. */
  defaultSort?: { id: string; direction: SortDirection };
  /** Shown when no row matches the filter. */
  emptyMessage?: React.ReactNode;
  /** Extra controls on the right of the toolbar. */
  toolbar?: React.ReactNode;
}

const rowLayout: Transition = { type: "spring", stiffness: 500, damping: 42, mass: 0.8 };
const iconSpring: Transition = { type: "spring", bounce: 0, duration: 0.2 };

function compare(a: unknown, b: unknown) {
  if (a == null && b == null) return 0;
  if (a == null) return 1;
  if (b == null) return -1;
  if (a instanceof Date && b instanceof Date) return a.getTime() - b.getTime();
  if (typeof a === "number" && typeof b === "number") return a - b;
  return String(a).localeCompare(String(b), undefined, { numeric: true, sensitivity: "base" });
}

/** Arrow that flips between ascending and descending, over a faint "unsorted" icon. */
function SortIcon({ direction }: { direction: SortDirection | null }) {
  const reduceMotion = useReducedMotion() ?? false;
  return (
    <span aria-hidden className="relative grid size-3.5 place-items-center">
      <motion.span
        className="col-start-1 row-start-1 flex"
        initial={false}
        animate={{ opacity: direction ? 0 : 0.45, scale: direction ? 0.6 : 1 }}
        transition={{ duration: 0.15 }}
      >
        <ChevronsUpDownIcon className="size-3.5" />
      </motion.span>
      <motion.span
        className="col-start-1 row-start-1 flex text-foreground"
        initial={false}
        animate={{
          opacity: direction ? 1 : 0,
          rotate: direction === "desc" ? 180 : 0,
          y: direction ? 0 : -3,
        }}
        transition={reduceMotion ? { duration: 0 } : iconSpring}
      >
        <ArrowUpIcon className="size-3.5" />
      </motion.span>
    </span>
  );
}

/** A table row that can animate. TableRow forwards its ref (React 19), so Motion can measure it. */
const MotionTableRow = motion.create(TableRow);

/**
 * A self-contained data table built on the DuskUI Table: click a header to
 * sort (ascending → descending → off) with an arrow that flips, type to
 * filter, select rows with the animated Checkbox and page through results.
 * Rows that stay on screen glide to their new place when the order changes
 * (layout animations) and new rows fade in, so you can follow what moved.
 * Pages pad with blank rows so the table never changes height while paging.
 * No table library needed. Under reduced motion rows swap instantly.
 */
export function DataTable<T>({
  data,
  columns,
  getRowId,
  caption,
  pageSize = 5,
  selectable = false,
  selectedIds,
  onSelectionChange,
  filterable = true,
  filterPlaceholder = "Filter…",
  defaultSort,
  emptyMessage = "No results.",
  toolbar,
  className,
  ...props
}: DataTableProps<T>) {
  const reduceMotion = useReducedMotion() ?? false;
  const filterId = React.useId();
  const [query, setQuery] = React.useState("");
  const [sort, setSort] = React.useState<{ id: string; direction: SortDirection } | null>(defaultSort ?? null);
  const [pageState, setPageState] = React.useState(0);
  const [uncontrolled, setUncontrolled] = React.useState<string[]>([]);
  const selected = React.useMemo(() => new Set(selectedIds ?? uncontrolled), [selectedIds, uncontrolled]);

  const setSelected = (next: Set<string>) => {
    const ids = [...next];
    if (selectedIds === undefined) setUncontrolled(ids);
    onSelectionChange?.(ids);
  };

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return data;
    const searchable = columns.filter((c) => (c.filterValue || c.accessor) && c.filterable !== false);
    return data.filter((row) =>
      searchable.some((c) => {
        let text: string;
        if (c.filterValue) text = c.filterValue(row);
        else {
          const value = c.accessor!(row);
          text = value instanceof Date ? value.toLocaleDateString() : String(value ?? "");
        }
        return text.toLowerCase().includes(q);
      })
    );
  }, [data, columns, query]);

  const sorted = React.useMemo(() => {
    const column = sort && columns.find((c) => c.id === sort.id);
    if (!sort || !column?.accessor) return filtered;
    const factor = sort.direction === "asc" ? 1 : -1;
    // Copy before sorting; ties keep their original order (Array#sort is stable).
    return [...filtered].sort((a, b) => factor * compare(column.accessor!(a), column.accessor!(b)));
  }, [filtered, sort, columns]);

  const size = pageSize > 0 ? pageSize : Math.max(1, sorted.length);
  const pageCount = Math.max(1, Math.ceil(sorted.length / size));
  const page = Math.min(pageState, pageCount - 1);
  const rows = sorted.slice(page * size, page * size + size);
  const fillers = pageSize > 0 && pageCount > 1 ? size - rows.length : 0;

  const pageIds = rows.map(getRowId);
  const pageSelected = pageIds.filter((id) => selected.has(id)).length;
  const headerState: boolean | "indeterminate" =
    pageIds.length > 0 && pageSelected === pageIds.length ? true : pageSelected > 0 ? "indeterminate" : false;

  const toggleSort = (id: string) => {
    setSort((current) => {
      if (!current || current.id !== id) return { id, direction: "asc" };
      if (current.direction === "asc") return { id, direction: "desc" };
      return null;
    });
    setPageState(0);
  };

  const colSpan = columns.length + (selectable ? 1 : 0);

  return (
    <div data-slot="data-table" className={cn("flex w-full flex-col gap-3", className)} {...props}>
      {(filterable || toolbar) && (
        <div className="flex flex-wrap items-center gap-2">
          {filterable && (
            <div className="relative w-full max-w-xs">
              <label htmlFor={filterId} className="sr-only">
                {filterPlaceholder}
              </label>
              <SearchIcon
                aria-hidden
                className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
              />
              <Input
                id={filterId}
                type="search"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setPageState(0);
                }}
                placeholder={filterPlaceholder}
                className="pl-9"
              />
            </div>
          )}
          {toolbar && <div className="ml-auto flex items-center gap-2">{toolbar}</div>}
        </div>
      )}

      <div className="overflow-hidden rounded-xl border bg-card/40">
        <Table>
          <caption className="sr-only">{caption}</caption>
          <TableHeader>
            <TableRow>
              {selectable && (
                <TableHead className="pl-4">
                  <Checkbox
                    checked={headerState}
                    disabled={pageIds.length === 0}
                    onCheckedChange={(value) => {
                      const next = new Set(selected);
                      for (const id of pageIds) {
                        if (value === true) next.add(id);
                        else next.delete(id);
                      }
                      setSelected(next);
                    }}
                    aria-label="Select all rows on this page"
                  />
                </TableHead>
              )}
              {columns.map((column) => {
                const sortable = column.sortable ?? Boolean(column.accessor);
                const direction = sort?.id === column.id ? sort.direction : null;
                return (
                  <TableHead
                    key={column.id}
                    scope="col"
                    aria-sort={sortable ? (direction === "asc" ? "ascending" : direction === "desc" ? "descending" : "none") : undefined}
                    className={cn(
                      column.align === "right" && "text-right",
                      column.align === "center" && "text-center",
                      column.className
                    )}
                  >
                    {sortable ? (
                      <button
                        type="button"
                        onClick={() => toggleSort(column.id)}
                        className={cn(
                          "-mx-2 inline-flex h-7 items-center gap-1.5 rounded-md px-2 outline-none select-none",
                          "transition-colors duration-150 hover:bg-accent hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50",
                          direction && "text-foreground",
                          column.align === "right" && "flex-row-reverse"
                        )}
                      >
                        {column.header}
                        <SortIcon direction={direction} />
                      </button>
                    ) : (
                      column.header
                    )}
                  </TableHead>
                );
              })}
            </TableRow>
          </TableHeader>
          <TableBody>
            <AnimatePresence initial={false}>
              {rows.map((row, index) => {
                const id = getRowId(row);
                const isSelected = selected.has(id);
                return (
                  <MotionTableRow
                    key={id}
                    layout={reduceMotion ? false : "position"}
                    initial={{ opacity: 0, y: reduceMotion ? 0 : 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    // Leaving rows disappear at once, so the table never holds two pages at the same time.
                    exit={{ opacity: 0, transition: { duration: 0 } }}
                    transition={{
                      layout: rowLayout,
                      default: { duration: 0.25, ease: "easeOut", delay: reduceMotion ? 0 : index * 0.025 },
                    }}
                    data-state={isSelected ? "selected" : undefined}
                    className="h-12"
                  >
                    {selectable && (
                      <TableCell className="pl-4">
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={(value) => {
                            const next = new Set(selected);
                            if (value === true) next.add(id);
                            else next.delete(id);
                            setSelected(next);
                          }}
                          aria-label={`Select row ${index + 1 + page * size}`}
                        />
                      </TableCell>
                    )}
                    {columns.map((column) => (
                      <TableCell
                        key={column.id}
                        className={cn(
                          column.align === "right" && "text-right",
                          column.align === "center" && "text-center",
                          column.className
                        )}
                      >
                        {column.cell ? column.cell(row) : String(column.accessor?.(row) ?? "")}
                      </TableCell>
                    ))}
                  </MotionTableRow>
                );
              })}
            </AnimatePresence>

            {rows.length === 0 && (
              <tr>
                <td colSpan={colSpan} className="p-0">
                  <motion.div
                    role="status"
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={reduceMotion ? { y: { duration: 0 } } : undefined}
                    className="flex items-center justify-center gap-2 text-muted-foreground"
                    // Keep the height of a full page (3rem per row) so the layout doesn't jump.
                    style={{ height: `${Math.max(1, Math.min(size, data.length)) * 3}rem` }}
                  >
                    <SearchXIcon aria-hidden className="size-4" />
                    {emptyMessage}
                  </motion.div>
                </td>
              </tr>
            )}

            {rows.length > 0 &&
              Array.from({ length: fillers }, (_, i) => (
                <tr key={`filler-${i}`} aria-hidden className="h-12 border-0">
                  <td colSpan={colSpan} />
                </tr>
              ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-muted-foreground">
        <p aria-live="polite" className="tabular-nums">
          {selectable
            ? `${selected.size} of ${data.length} row(s) selected.`
            : `${sorted.length} ${sorted.length === 1 ? "result" : "results"}`}
        </p>
        {pageSize > 0 && (
          <div className="flex items-center gap-2">
            <span className="tabular-nums" aria-live="polite">
              Page {page + 1} of {pageCount}
            </span>
            <Button
              variant="outline"
              size="icon-sm"
              onClick={() => setPageState(page - 1)}
              disabled={page === 0}
              aria-label="Previous page"
            >
              <ChevronLeftIcon />
            </Button>
            <Button
              variant="outline"
              size="icon-sm"
              onClick={() => setPageState(page + 1)}
              disabled={page >= pageCount - 1}
              aria-label="Next page"
            >
              <ChevronRightIcon />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
