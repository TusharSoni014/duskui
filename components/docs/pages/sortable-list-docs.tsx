import { ComponentDocs, type DocConfig } from "@/components/docs/component-docs";
import { Code } from "@/components/docs/doc-primitives";

import SortableListDemo from "@/components/demos/sortable-list/sortable-list-demo";
import SortableListPlaylistDemo from "@/components/demos/sortable-list/sortable-list-playlist";
import SortableListSimpleDemo from "@/components/demos/sortable-list/sortable-list-simple";

const demo = (file: string) => `components/demos/sortable-list/${file}`;

const config: DocConfig = {
  title: "Sortable List",
  intro:
    "A drag-and-drop sortable list for React built on Motion's Reorder and Tailwind CSS: grab a row by its handle, it lifts with a soft shadow while neighbours slide out of the way, and the new order comes back through onReorder. Keyboard users can pick up, move and drop rows with Space and the arrow keys, with every move announced to screen readers.",
  tags: ["Drag handle", "Layout springs", "Keyboard reordering", "Live announcements", "Touch-ready", "prefers-reduced-motion"],
  hero: { Demo: SortableListDemo, file: demo("sortable-list-demo.tsx"), minHeight: 420 },
  install: {
    registry: "sortable-list",
    source: "components/dusk/sortable-list/sortable-list.tsx",
    deps: "motion lucide-react",
  },
  usage: {
    filename: "todo-order.tsx",
    code: `"use client"

import * as React from "react"
import { SortableList } from "@/components/dusk/sortable-list/sortable-list"

export function TodoOrder() {
  const [todos, setTodos] = React.useState([
    { id: "1", title: "Write the spec" },
    { id: "2", title: "Review designs" },
    { id: "3", title: "Ship it" },
  ])

  return (
    <SortableList
      items={todos}
      onReorder={setTodos}
      getLabel={(todo) => todo.title}
      renderItem={(todo) => todo.title}
    />
  )
}`,
  },
  examples: [
    {
      id: "playlist",
      title: "Play queue",
      description: (
        <>
          Any content fits in <Code>renderItem</Code>; derived values such as the total duration stay in sync because the
          order lives in your state.
        </>
      ),
      Demo: SortableListPlaylistDemo,
      file: demo("sortable-list-playlist.tsx"),
      minHeight: 360,
    },
    {
      id: "strings",
      title: "Plain strings",
      description: (
        <>
          Strings and numbers are their own keys, so <Code>getKey</Code> is optional. Objects default to{" "}
          <Code>item.id</Code>.
        </>
      ),
      Demo: SortableListSimpleDemo,
      file: demo("sortable-list-simple.tsx"),
      minHeight: 380,
    },
  ],
  api: {
    intro: <>Also accepts any div attribute for the wrapper. Items must be stable references or have stable keys.</>,
    props: [
      { name: "items", type: "T[]", description: "The items, in order." },
      { name: "onReorder", type: "(items: T[]) => void", description: "Called with the new order while dragging and on every keyboard move." },
      { name: "renderItem", type: "(item: T, state: { index; active }) => ReactNode", description: "Row content. The drag handle is rendered for you." },
      { name: "getKey", type: "(item: T) => string", default: "item.id ?? String(item)", description: "Stable key per item." },
      { name: "getLabel", type: "(item: T) => string", description: "Name used in the handle's label and in announcements. Defaults to the key." },
      { name: "label", type: "string", default: '"Sortable list"', description: "Accessible name for the list." },
      { name: "itemClassName", type: "string", description: "Classes for every row." },
    ],
  },
  accessibility: [
    <>The list is a real <Code>ul</Code>; each handle is a button labelled “Reorder &lt;item&gt;” and described by the keyboard instructions.</>,
    "Focus a handle and press Space or Enter to pick the row up, Arrow Up / Arrow Down (or Home / End) to move it, Space or Enter to drop, and Escape to put it back where it started.",
    "While nothing is picked up, Arrow Up / Arrow Down hop between handles.",
    "Every pick-up, move, drop and cancel is announced through an assertive live region, including the new position out of the total.",
    "Focus stays on the moved row's handle; tabbing away while holding a row drops it in place.",
    "With prefers-reduced-motion, rows snap into place instead of springing.",
  ],
};

export function SortableListDocs() {
  return <ComponentDocs config={config} />;
}
