import { ComponentDocs, type DocConfig } from "@/components/docs/component-docs";
import { Code } from "@/components/docs/doc-primitives";

import FileTreeBadges from "@/components/demos/file-tree/file-tree-badges";
import FileTreeControlled from "@/components/demos/file-tree/file-tree-controlled";
import FileTreeDemo from "@/components/demos/file-tree/file-tree-demo";

const demo = (file: string) => `components/demos/file-tree/${file}`;

const config: DocConfig = {
  title: "File Tree",
  intro:
    "An accessible file tree component for React and Tailwind CSS: folders and files with icons by extension, folders that spring open, a selection highlight that glides between rows and optional indent guides. Data-driven, controllable and fully keyboard navigable following the WAI-ARIA tree pattern.",
  tags: ["WAI-ARIA tree", "Arrow keys & type-ahead", "Icons by extension", "Gliding selection", "Controlled or uncontrolled"],
  hero: { Demo: FileTreeDemo, file: demo("file-tree-demo.tsx"), minHeight: 460 },
  install: {
    registry: "file-tree",
    source: "components/dusk/file-tree/file-tree.tsx",
    deps: "motion lucide-react",
  },
  usage: {
    filename: "explorer.tsx",
    code: `import { FileTree, type FileTreeItem } from "@/components/dusk/file-tree/file-tree"

const items: FileTreeItem[] = [
  {
    id: "app",
    name: "app",
    children: [
      { id: "app/page.tsx", name: "page.tsx" },
      { id: "app/layout.tsx", name: "layout.tsx" },
    ],
  },
  { id: "package.json", name: "package.json" },
]

export function Explorer() {
  return (
    <FileTree
      aria-label="Project files"
      items={items}
      defaultExpanded={["app"]}
      defaultSelected="app/page.tsx"
    />
  )
}`,
  },
  examples: [
    {
      id: "controlled",
      title: "Controlled expansion",
      description: (
        <>
          Pass <Code>expanded</Code> and <Code>onExpandedChange</Code> to drive folders from outside, e.g.
          expand / collapse all. <Code>selected</Code> and <Code>onSelectedChange</Code> work the same way.
        </>
      ),
      Demo: FileTreeControlled,
      file: demo("file-tree-controlled.tsx"),
      minHeight: 440,
    },
    {
      id: "badges",
      title: "Badges, custom icons & disabled",
      description: (
        <>
          Items take a trailing <Code>badge</Code> (here git status), an <Code>icon</Code> override and{" "}
          <Code>disabled</Code>. <Code>indentGuides={"{false}"}</Code> drops the guides; <Code>indent</Code>{" "}
          sets the step per level.
        </>
      ),
      Demo: FileTreeBadges,
      file: demo("file-tree-badges.tsx"),
      minHeight: 280,
    },
  ],
  api: {
    intro: (
      <>
        Also accepts any HTML attribute for the <Code>ul role=&quot;tree&quot;</Code>. Each{" "}
        <Code>FileTreeItem</Code> is <Code>{"{ id, name, children?, icon?, badge?, disabled? }"}</Code>; an
        item with a <Code>children</Code> array (even empty) is a folder. <Code>fileIcon(name)</Code> is
        exported if you need the same icons elsewhere.
      </>
    ),
    props: [
      { name: "items", type: "FileTreeItem[]", description: "The tree data." },
      { name: "expanded", type: "string[]", description: "Open folder ids (controlled)." },
      { name: "defaultExpanded", type: "string[]", default: "[]", description: "Open folder ids on first render." },
      { name: "onExpandedChange", type: "(expanded: string[]) => void", description: "Called when a folder opens or closes." },
      { name: "selected", type: "string | null", description: "Selected item id (controlled)." },
      { name: "defaultSelected", type: "string | null", default: "null", description: "Selected item id on first render." },
      { name: "onSelectedChange", type: "(id: string, item: FileTreeItem) => void", description: "Called when an item is selected by click, Enter or Space." },
      { name: "indentGuides", type: "boolean", default: "true", description: "Vertical guides per level; the selected item's branch is highlighted." },
      { name: "indent", type: "number", default: "16", description: "Indent per level in px." },
      { name: "aria-label", type: "string", default: '"Files"', description: "Accessible name of the tree." },
    ],
  },
  accessibility: [
    "Implements the WAI-ARIA tree pattern: role=\"tree\", nested role=\"group\" lists and role=\"treeitem\" with aria-expanded, aria-selected, aria-level, aria-posinset and aria-setsize.",
    "One tab stop (roving tabindex). ↑/↓ move, → opens a folder or enters it, ← closes it or jumps to the parent, Home/End jump to the ends, Enter/Space select (and toggle folders), * opens all sibling folders, and typing jumps to items by name.",
    "Collapsed branches are not rendered, so hidden items never receive focus or get announced.",
    "Icons, chevrons and guides are aria-hidden; the item name is the accessible label.",
    "With prefers-reduced-motion folders open instantly and the selection jumps instead of gliding.",
  ],
};

export function FileTreeDocs() {
  return <ComponentDocs config={config} />;
}
