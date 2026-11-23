import { ComponentDocs, type DocConfig } from "@/components/docs/component-docs";
import { Code } from "@/components/docs/doc-primitives";

import TableBasicDemo from "@/components/demos/table/table-basic";
import DataTableDemo from "@/components/demos/table/data-table-demo";
import ExpandableTableDemo from "@/components/demos/table/expandable-table-demo";

const demo = (file: string) => `components/demos/table/${file}`;
const block = (file: string) => `components/dusk/table/${file}`;

const config: DocConfig = {
  title: "Table",
  intro:
    "The shadcn/ui Table with row hover polish, a lit selected state and tabular numbers — plus two animated React table blocks built with Motion: a self-contained data table with sorting, filtering, row selection and pagination whose rows glide when they reorder, and a table with expandable detail rows.",
  tags: ["Drop-in shadcn API", "Server Component friendly", "No table library", "aria-sort", "prefers-reduced-motion"],
  hero: { Demo: DataTableDemo, file: demo("data-table-demo.tsx"), minHeight: 460 },
  install: {
    registry: "table",
    source: "components/ui/table.tsx",
    deps: "",
    note: (
      <>
        Adds <Code>components/ui/table.tsx</Code> with the same parts as shadcn plus{" "}
        <Code>containerClassName</Code> for the scrolling wrapper. CSS only — no{" "}
        <Code>&quot;use client&quot;</Code> needed.
      </>
    ),
  },
  usage: {
    filename: "invoices.tsx",
    code: `import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export function Invoices() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead scope="col">Invoice</TableHead>
          <TableHead scope="col" className="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>INV-1042</TableCell>
          <TableCell className="text-right">$250.00</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  )
}`,
  },
  examples: [
    {
      id: "default",
      title: "Default",
      description: (
        <>
          Hover a row: its background lightens slightly. Header and footer rows stay still.
        </>
      ),
      Demo: TableBasicDemo,
      file: demo("table-basic.tsx"),
      minHeight: 360,
    },
  ],
  blocks: [
    {
      id: "data-table",
      title: "Data Table",
      registry: "data-table",
      source: block("data-table.tsx"),
      deps: "motion lucide-react @radix-ui/react-checkbox",
      description: (
        <>
          Sorting, filtering, selection and pagination in one self-contained component — no TanStack
          Table. Click a header to cycle ascending, descending and off; the arrow flips between them.
          Rows that stay on screen glide to their new place, new rows fade in, and short pages pad with
          blank rows so the table never changes height. Pass a stable <Code>getRowId</Code> so rows can
          animate.
        </>
      ),
      Demo: DataTableDemo,
      file: demo("data-table-demo.tsx"),
      minHeight: 460,
      props: [
        { name: "data", type: "T[]", description: "The rows. Required." },
        { name: "columns", type: "DataTableColumn<T>[]", description: "Column definitions: id, header, accessor, cell, sortable, filterable, filterValue, align, className. Required." },
        { name: "getRowId", type: "(row: T) => string", description: "A stable id per row, used for selection and animation. Required." },
        { name: "caption", type: "string", description: "Accessible name, rendered as a visually hidden caption. Required." },
        { name: "pageSize", type: "number", default: "5", description: "Rows per page. 0 shows every row." },
        { name: "selectable", type: "boolean", default: "false", description: "Show row checkboxes and a select-all checkbox for the page." },
        { name: "selectedIds / onSelectionChange", type: "string[] / (ids: string[]) => void", description: "Control the selection. Uncontrolled when left out." },
        { name: "filterable", type: "boolean", default: "true", description: "Show the filter input." },
        { name: "filterPlaceholder", type: "string", default: '"Filter…"', description: "Placeholder and label of the filter input." },
        { name: "defaultSort", type: "{ id: string; direction: \"asc\" | \"desc\" }", description: "The initial sort." },
        { name: "emptyMessage", type: "ReactNode", default: '"No results."', description: "Shown when nothing matches the filter." },
        { name: "toolbar", type: "ReactNode", description: "Extra controls on the right of the toolbar." },
      ],
    },
    {
      id: "expandable-table",
      title: "Expandable Rows",
      registry: "expandable-table",
      source: block("expandable-table.tsx"),
      deps: "motion lucide-react",
      description: (
        <>
          Rows that open to reveal a detail panel — logs, line items, metadata. The chevron turns, the
          panel springs open from zero height and its content fades up, and the open row stays lit. Set{" "}
          <Code>single</Code> for accordion behavior.
        </>
      ),
      Demo: ExpandableTableDemo,
      file: demo("expandable-table-demo.tsx"),
      minHeight: 360,
      props: [
        { name: "data / columns / getRowId", type: "T[] / ExpandableColumn<T>[] / (row: T) => string", description: "Rows, columns (id, header, cell, align, className) and a stable id per row. Required." },
        { name: "renderDetail", type: "(row: T) => ReactNode", description: "Content of the panel under an open row. Required." },
        { name: "caption", type: "string", description: "Accessible name, rendered as a visually hidden caption. Required." },
        { name: "single", type: "boolean", default: "false", description: "Only one row open at a time." },
        { name: "defaultExpanded", type: "string[]", default: "[]", description: "Row ids that start open." },
        { name: "getExpandLabel", type: "(row: T) => string", default: '() => "Show details"', description: "Accessible label for each row's toggle button." },
      ],
    },
  ],
  api: {
    intro: (
      <>
        Same parts as shadcn/ui, each a thin wrapper around the native element with a{" "}
        <Code>data-slot</Code> attribute: <Code>Table</Code>, <Code>TableHeader</Code>,{" "}
        <Code>TableBody</Code>, <Code>TableFooter</Code>, <Code>TableRow</Code>, <Code>TableHead</Code>,{" "}
        <Code>TableCell</Code> and <Code>TableCaption</Code>.
      </>
    ),
    props: [
      { name: "containerClassName", type: "string", description: "Table only. Classes for the horizontally scrolling wrapper, e.g. a border or max height." },
      { name: "data-state=\"selected\"", type: "attribute", description: "TableRow. Highlights the row and keeps its accent bar lit." },
    ],
  },
  accessibility: [
    <>Real table markup throughout: <Code>&lt;table&gt;</Code>, <Code>&lt;thead&gt;</Code>, <Code>&lt;th scope=&quot;col&quot;&gt;</Code> and a <Code>&lt;caption&gt;</Code> (visually hidden in the blocks) that names the table.</>,
    <>Sortable headers are buttons inside the <Code>&lt;th&gt;</Code>, and the header carries <Code>aria-sort</Code> (ascending, descending or none) so the current order is announced.</>,
    <>Every checkbox has a label (&quot;Select all rows on this page&quot;, &quot;Select row 3&quot;), and the selection and page counts are polite live regions.</>,
    <>Expand toggles are buttons with <Code>aria-expanded</Code> and <Code>aria-controls</Code> pointing at the open detail row.</>,
    "Under prefers-reduced-motion rows swap and panels open instantly, and the sort arrow flips without spinning.",
  ],
};

export function TableDocs() {
  return <ComponentDocs config={config} />;
}
