"use client";

import * as React from "react";

import { Kanban, type KanbanColumnData, type KanbanMove } from "@/components/dusk/kanban/kanban";

const initial: KanbanColumnData[] = [
  {
    id: "todo",
    title: "To do",
    cards: [
      { id: "a", title: "Buy oat milk" },
      { id: "b", title: "Book dentist" },
      { id: "c", title: "Renew passport" },
    ],
  },
  { id: "doing", title: "Doing", cards: [{ id: "d", title: "Plan weekend trip" }] },
  { id: "review", title: "Waiting on", cards: [] },
];

export default function KanbanSimpleDemo() {
  const [columns, setColumns] = React.useState(initial);
  const [last, setLast] = React.useState<KanbanMove | null>(null);

  const titleOf = (id: string) => columns.find((c) => c.id === id)?.title;

  return (
    <div className="flex w-full max-w-[56rem] flex-col gap-3">
      <Kanban
        columns={columns}
        onChange={(next, move) => {
          setColumns(next);
          setLast(move);
        }}
        label="Personal tasks"
        columnClassName="w-60"
      />
      <p className="min-h-5 font-mono text-xs text-muted-foreground" aria-hidden>
        {last
          ? `onChange → ${last.cardId}: ${titleOf(last.from.columnId)}[${last.from.index}] → ${titleOf(last.to.columnId)}[${last.to.index}]`
          : "Drag a card, or focus one and press Alt + →"}
      </p>
    </div>
  );
}
