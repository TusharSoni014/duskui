"use client";

import { Badge } from "@/components/ui/badge";
import { ExpandableTable, type ExpandableColumn } from "@/components/dusk/table/expandable-table";

type Deployment = {
  id: string;
  branch: string;
  commit: string;
  status: "Ready" | "Building" | "Error";
  duration: string;
  steps: { name: string; time: string; ok: boolean }[];
};

const deployments: Deployment[] = [
  {
    id: "dpl_8f2a",
    branch: "main",
    commit: "Add calendar month transitions",
    status: "Ready",
    duration: "42s",
    steps: [
      { name: "Install dependencies", time: "12s", ok: true },
      { name: "Build", time: "24s", ok: true },
      { name: "Deploy to edge", time: "6s", ok: true },
    ],
  },
  {
    id: "dpl_7c91",
    branch: "feat/data-table",
    commit: "Animate rows on sort",
    status: "Building",
    duration: "18s",
    steps: [
      { name: "Install dependencies", time: "11s", ok: true },
      { name: "Build", time: "7s…", ok: true },
    ],
  },
  {
    id: "dpl_6b40",
    branch: "fix/kbd-hydration",
    commit: "Defer platform label until mount",
    status: "Error",
    duration: "31s",
    steps: [
      { name: "Install dependencies", time: "13s", ok: true },
      { name: "Type check", time: "18s", ok: false },
    ],
  },
];

const tone = { Ready: "success", Building: "info", Error: "destructive" } as const;

const columns: ExpandableColumn<Deployment>[] = [
  {
    id: "commit",
    header: "Commit",
    cell: (d) => (
      <div className="flex flex-col">
        <span className="font-medium">{d.commit}</span>
        <span className="font-mono text-xs text-muted-foreground">{d.branch}</span>
      </div>
    ),
  },
  { id: "status", header: "Status", cell: (d) => <Badge variant={tone[d.status]} dot>{d.status}</Badge> },
  { id: "duration", header: "Duration", cell: (d) => d.duration, align: "right" },
];

export default function ExpandableTableDemo() {
  return (
    <ExpandableTable
      className="max-w-2xl"
      caption="Recent deployments"
      data={deployments}
      columns={columns}
      getRowId={(d) => d.id}
      defaultExpanded={["dpl_6b40"]}
      getExpandLabel={(d) => `Show build steps for ${d.commit}`}
      renderDetail={(d) => (
        <ol className="grid gap-1.5 font-mono text-xs">
          {d.steps.map((step) => (
            <li key={step.name} className="flex items-center gap-2">
              <span
                aria-hidden
                className={step.ok ? "size-1.5 rounded-full bg-primary" : "size-1.5 rounded-full bg-destructive"}
              />
              <span className={step.ok ? "text-foreground/80" : "text-destructive"}>
                {step.name}
                <span className="sr-only">{step.ok ? " (passed)" : " (failed)"}</span>
              </span>
              <span className="ml-auto text-muted-foreground">{step.time}</span>
            </li>
          ))}
        </ol>
      )}
    />
  );
}
