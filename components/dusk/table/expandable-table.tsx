"use client";

import * as React from "react";
import { ChevronRightIcon } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion, type Transition } from "motion/react";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

export interface ExpandableColumn<T> {
  id: string;
  header: React.ReactNode;
  cell: (row: T) => React.ReactNode;
  align?: "left" | "center" | "right";
  className?: string;
}

export interface ExpandableTableProps<T> extends Omit<React.ComponentProps<"div">, "children"> {
  data: T[];
  columns: ExpandableColumn<T>[];
  getRowId: (row: T) => string;
  /** Content of the detail panel under an expanded row. */
  renderDetail: (row: T) => React.ReactNode;
  /** Accessible name for the table, rendered as a visually hidden caption. */
  caption: string;
  /** Only one row open at a time. */
  single?: boolean;
  /** Row ids that start expanded. */
  defaultExpanded?: string[];
  /** Label for the expand buttons. Receives the row. */
  getExpandLabel?: (row: T) => string;
}

const reveal: Transition = { type: "spring", duration: 0.4, bounce: 0 };

/**
 * A table whose rows open to reveal a detail panel. The chevron turns, the
 * panel's height springs open from zero and its content fades up, and the
 * open row stays highlighted. Each toggle is a real button with
 * `aria-expanded` and `aria-controls`. Built on the DuskUI Table; under
 * reduced motion panels open instantly.
 */
export function ExpandableTable<T>({
  data,
  columns,
  getRowId,
  renderDetail,
  caption,
  single = false,
  defaultExpanded = [],
  getExpandLabel = () => "Show details",
  className,
  ...props
}: ExpandableTableProps<T>) {
  const reduceMotion = useReducedMotion() ?? false;
  const baseId = React.useId();
  const [expanded, setExpanded] = React.useState<Set<string>>(() => new Set(defaultExpanded));

  const toggle = (id: string) =>
    setExpanded((current) => {
      const next = new Set(single ? [] : current);
      if (current.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const colSpan = columns.length + 1;

  return (
    <div data-slot="expandable-table" className={cn("w-full overflow-hidden rounded-xl border bg-card/40", className)} {...props}>
      <Table>
        <caption className="sr-only">{caption}</caption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-10 pr-0">
              <span className="sr-only">Expand</span>
            </TableHead>
            {columns.map((column) => (
              <TableHead
                key={column.id}
                scope="col"
                className={cn(column.align === "right" && "text-right", column.align === "center" && "text-center", column.className)}
              >
                {column.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row) => {
            const id = getRowId(row);
            const open = expanded.has(id);
            const panelId = `${baseId}-${id}`;
            return (
              <React.Fragment key={id}>
                <TableRow
                  data-state={open ? "selected" : undefined}
                  className={cn(open && "border-b-transparent")}
                >
                  <TableCell className="w-10 pr-0">
                    <button
                      type="button"
                      aria-expanded={open}
                      aria-controls={open ? panelId : undefined}
                      aria-label={getExpandLabel(row)}
                      onClick={() => toggle(id)}
                      className={cn(
                        "grid size-7 place-items-center rounded-md text-muted-foreground outline-none",
                        "transition-colors duration-150 hover:bg-accent hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50",
                        open && "text-foreground"
                      )}
                    >
                      <motion.span
                        aria-hidden
                        className="flex"
                        initial={false}
                        animate={{ rotate: open ? 90 : 0 }}
                        transition={reduceMotion ? { duration: 0 } : { duration: 0.2, ease: "easeOut" }}
                      >
                        <ChevronRightIcon className="size-4" />
                      </motion.span>
                    </button>
                  </TableCell>
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      className={cn(column.align === "right" && "text-right", column.align === "center" && "text-center", column.className)}
                    >
                      {column.cell(row)}
                    </TableCell>
                  ))}
                </TableRow>

                <AnimatePresence initial={false}>
                  {open && (
                    <tr key="detail" id={panelId} className="border-b bg-muted/30 last:border-0">
                      <td colSpan={colSpan} className="p-0">
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={reduceMotion ? { duration: 0 } : reveal}
                          className="overflow-hidden"
                        >
                          <motion.div
                            initial={{ y: reduceMotion ? 0 : -6 }}
                            animate={{ y: 0 }}
                            exit={{ y: reduceMotion ? 0 : -6 }}
                            transition={reduceMotion ? { duration: 0 } : reveal}
                            className="px-4 pt-1 pb-4 pl-14 whitespace-normal"
                          >
                            {renderDetail(row)}
                          </motion.div>
                        </motion.div>
                      </td>
                    </tr>
                  )}
                </AnimatePresence>
              </React.Fragment>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
