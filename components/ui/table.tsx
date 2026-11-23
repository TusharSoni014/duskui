import * as React from "react";

import { cn } from "@/lib/utils";

export interface TableProps extends React.ComponentProps<"table"> {
  /** Classes for the scrolling wrapper around the `<table>`. */
  containerClassName?: string;
}

/**
 * DuskUI Table — a drop-in upgrade of the shadcn/ui Table.
 *
 * Same parts and data-slot attributes as shadcn (Table, TableHeader,
 * TableBody, TableFooter, TableRow, TableHead, TableCell, TableCaption) plus:
 * - Row hover polish: the row warms up and a thin mint bar fades in on its
 *   leading edge. Selected rows (`data-state="selected"`) keep the bar lit.
 * - Quieter header text, tabular numbers and a tinted footer for dark UIs.
 * - `containerClassName` for the horizontally scrolling wrapper (e.g. a border
 *   or a max height with a sticky header).
 * CSS only, so it works in Server Components. Real table semantics throughout.
 */
function Table({ className, containerClassName, ...props }: TableProps) {
  return (
    <div
      data-slot="table-container"
      className={cn("relative w-full overflow-x-auto", containerClassName)}
    >
      <table
        data-slot="table"
        className={cn("w-full caption-bottom border-collapse text-sm tabular-nums", className)}
        {...props}
      />
    </div>
  );
}

/** `<thead>`. Rows inside don't get the hover highlight. */
function TableHeader({ className, ...props }: React.ComponentProps<"thead">) {
  return (
    <thead
      data-slot="table-header"
      className={cn("[&_tr]:border-b", className)}
      {...props}
    />
  );
}

/** `<tbody>`. */
function TableBody({ className, ...props }: React.ComponentProps<"tbody">) {
  return (
    <tbody
      data-slot="table-body"
      className={cn("[&_tr:last-child]:border-0", className)}
      {...props}
    />
  );
}

/** `<tfoot>` for totals. */
function TableFooter({ className, ...props }: React.ComponentProps<"tfoot">) {
  return (
    <tfoot
      data-slot="table-footer"
      className={cn(
        "border-t bg-white/[0.025] font-medium [&>tr]:last:border-b-0",
        className
      )}
      {...props}
    />
  );
}

/** `<tr>`. Set `data-state="selected"` to highlight a selected row. */
function TableRow({ className, ...props }: React.ComponentProps<"tr">) {
  return (
    <tr
      data-slot="table-row"
      className={cn(
        "border-b transition-colors duration-150 ease-out motion-reduce:transition-none",
        // Hover only applies to body rows, never to header or footer rows.
        "[tbody>&]:hover:bg-white/[0.025] data-[state=selected]:bg-primary/[0.06]",
        // Leading accent bar, drawn as an inset shadow so it never shifts layout.
        "[&>*:first-child]:shadow-[inset_2px_0_0_transparent] [&>*:first-child]:transition-shadow [&>*:first-child]:duration-200",
        "[tbody>&]:hover:[&>*:first-child]:shadow-[inset_2px_0_0_color-mix(in_oklab,var(--color-primary)_45%,transparent)]",
        "data-[state=selected]:[&>*:first-child]:shadow-[inset_2px_0_0_var(--color-primary)]",
        className
      )}
      {...props}
    />
  );
}

/** `<th>`. Pass `scope="col"` (or `"row"`) as usual. */
function TableHead({ className, ...props }: React.ComponentProps<"th">) {
  return (
    <th
      data-slot="table-head"
      className={cn(
        "h-10 px-3 text-left align-middle text-xs font-medium tracking-wide whitespace-nowrap text-muted-foreground",
        "[&:has([role=checkbox])]:w-10 [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
        className
      )}
      {...props}
    />
  );
}

/** `<td>`. */
function TableCell({ className, ...props }: React.ComponentProps<"td">) {
  return (
    <td
      data-slot="table-cell"
      className={cn(
        "px-3 py-2.5 align-middle whitespace-nowrap",
        "[&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
        className
      )}
      {...props}
    />
  );
}

/** `<caption>`, shown under the table. Add `sr-only` to keep it for screen readers only. */
function TableCaption({ className, ...props }: React.ComponentProps<"caption">) {
  return (
    <caption
      data-slot="table-caption"
      className={cn("mt-4 text-sm text-muted-foreground", className)}
      {...props}
    />
  );
}

export { Table, TableHeader, TableBody, TableFooter, TableHead, TableRow, TableCell, TableCaption };
