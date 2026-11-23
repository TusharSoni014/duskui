import { ComponentDocs, type DocConfig } from "@/components/docs/component-docs";
import { Code } from "@/components/docs/doc-primitives";

import KanbanDemo from "@/components/demos/kanban/kanban-demo";
import KanbanSimpleDemo from "@/components/demos/kanban/kanban-simple";

const demo = (file: string) => `components/demos/kanban/${file}`;

const config: DocConfig = {
  title: "Kanban Board",
  intro:
    "A drag-and-drop kanban board for React with Tailwind CSS and Motion — no dnd library. Drag cards between columns or reorder them: a dashed slot opens where the card will land, neighbours slide out of the way, column counts tick over and the card glides into place on drop. Keyboard users move cards with Alt + arrow keys or a per-card menu, and the board stays fully controlled through columns and onChange.",
  tags: ["No dnd library", "Drop slot", "Layout springs", "Touch long-press", "Keyboard moves", "Controlled state", "Live announcements"],
  hero: { Demo: KanbanDemo, file: demo("kanban-demo.tsx"), minHeight: 420 },
  install: {
    registry: "kanban",
    source: "components/dusk/kanban/kanban.tsx",
    deps: "motion lucide-react @radix-ui/react-dropdown-menu",
    note: <>Uses the DuskUI Dropdown Menu for the per-card move menu.</>,
  },
  usage: {
    filename: "board.tsx",
    code: `"use client"

import * as React from "react"
import { Kanban, type KanbanColumnData } from "@/components/dusk/kanban/kanban"

const initial: KanbanColumnData[] = [
  { id: "todo", title: "To do", cards: [{ id: "1", title: "Write the brief" }] },
  { id: "doing", title: "Doing", cards: [] },
  { id: "done", title: "Done", cards: [] },
]

export function Board() {
  const [columns, setColumns] = React.useState(initial)
  return <Kanban columns={columns} onChange={setColumns} />
}`,
  },
  examples: [
    {
      id: "simple",
      title: "Plain cards & the move payload",
      description: (
        <>
          Without <Code>renderCard</Code> cards show their title. The second argument of <Code>onChange</Code> describes
          the move, ready to send to your API; <Code>moveKanbanCard(columns, move)</Code> applies one to any columns array.
          Empty columns still accept drops.
        </>
      ),
      Demo: KanbanSimpleDemo,
      file: demo("kanban-simple.tsx"),
      minHeight: 340,
    },
  ],
  api: {
    intro: (
      <>
        Cards need a unique <Code>id</Code> and a <Code>title</Code>; any other fields pass through to{" "}
        <Code>renderCard</Code>. Also accepts any div attribute.
      </>
    ),
    props: [
      { name: "columns", type: "{ id; title; cards: C[] }[]", description: "The board, in column order." },
      { name: "onChange", type: "(columns, move: KanbanMove) => void", description: "Called after a drop or keyboard move with the new columns and { cardId, from, to }." },
      { name: "renderCard", type: "(card: C) => ReactNode", default: "card.title", description: "Card content. Also used for the drag preview." },
      { name: "getCardLabel", type: "(card: C) => string", default: "card.title", description: "Name used in announcements and the move menu." },
      { name: "label", type: "string", default: '"Kanban board"', description: "Accessible name of the board region." },
      { name: "columnClassName", type: "string", description: "Classes for each column (e.g. a different width)." },
    ],
  },
  accessibility: [
    <>The board is a labelled region; each column is a <Code>section</Code> named by its heading with a list of cards, and counts are read as “3 cards”.</>,
    "Cards are focusable. Arrow keys move focus between cards and columns; Alt + Arrow Up / Down reorders a card and Alt + Arrow Left / Right moves it to the neighbouring column.",
    <>Each card also has a “Move &lt;card&gt;” menu button listing Move up, Move down and every other column — no drag or shortcut required.</>,
    "Focus follows the card after every keyboard move, and each move, pick-up, drop or cancel is announced through a live region.",
    "Press Escape mid-drag to cancel and send the card back. On touch, press and hold a card briefly to pick it up; a quick swipe still scrolls the page.",
    "With prefers-reduced-motion, cards snap into place instead of gliding and the drag preview doesn't tilt.",
  ],
};

export function KanbanDocs() {
  return <ComponentDocs config={config} />;
}
