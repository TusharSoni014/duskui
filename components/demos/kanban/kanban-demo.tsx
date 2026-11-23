"use client";

import * as React from "react";

import { Kanban, type KanbanColumnData } from "@/components/dusk/kanban/kanban";
import { cn } from "@/lib/utils";

type Task = {
  id: string;
  title: string;
  tag: "Design" | "Eng" | "Docs";
  owner: string;
  priority: "low" | "med" | "high";
};

const initial: KanbanColumnData<Task>[] = [
  {
    id: "backlog",
    title: "Backlog",
    cards: [
      { id: "t1", title: "Command menu fuzzy search", tag: "Eng", owner: "MV", priority: "med" },
      { id: "t2", title: "Empty-state illustrations", tag: "Design", owner: "AK", priority: "low" },
      { id: "t3", title: "Migration guide for v3", tag: "Docs", owner: "JR", priority: "med" },
    ],
  },
  {
    id: "progress",
    title: "In progress",
    cards: [
      { id: "t4", title: "Kanban keyboard support", tag: "Eng", owner: "SL", priority: "high" },
      { id: "t5", title: "Dark palette contrast pass", tag: "Design", owner: "AK", priority: "high" },
    ],
  },
  {
    id: "done",
    title: "Done",
    cards: [{ id: "t6", title: "Release notes 2.4", tag: "Docs", owner: "JR", priority: "low" }],
  },
];

const tagStyles: Record<Task["tag"], string> = {
  Design: "border text-muted-foreground",
  Eng: "border text-muted-foreground",
  Docs: "border text-muted-foreground",
};

const priorityStyles: Record<Task["priority"], string> = {
  low: "bg-muted-foreground/50",
  med: "bg-amber-400",
  high: "bg-rose-400",
};

export default function KanbanDemo() {
  const [columns, setColumns] = React.useState(initial);

  return (
    <Kanban
      columns={columns}
      onChange={setColumns}
      label="Sprint board"
      className="max-w-[56rem]"
      renderCard={(task) => (
        <div className="space-y-3">
          <p className="leading-snug font-medium">{task.title}</p>
          <div className="flex items-center gap-2">
            <span className={cn("rounded-md px-1.5 py-0.5 text-xs", tagStyles[task.tag])}>{task.tag}</span>
            <span aria-hidden className={cn("size-2 rounded-full", priorityStyles[task.priority])} />
            <span className="sr-only">{task.priority} priority</span>
            <span className="ml-auto grid size-6 place-items-center rounded-full bg-muted text-[10px] font-semibold text-muted-foreground">
              {task.owner}
            </span>
          </div>
        </div>
      )}
    />
  );
}
