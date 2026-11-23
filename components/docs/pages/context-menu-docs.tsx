import { ComponentDocs, type DocConfig } from "@/components/docs/component-docs";
import { Code } from "@/components/docs/doc-primitives";

import ContextMenuBasicDemo from "@/components/demos/context-menu/context-menu-basic";
import AnimatedContextMenuDemo from "@/components/demos/context-menu/animated-context-menu-demo";

const demo = (file: string) => `components/demos/context-menu/${file}`;
const block = (file: string) => `components/dusk/context-menu/${file}`;

const config: DocConfig = {
  title: "Context Menu",
  intro:
    "The shadcn/ui Context Menu with menus that grow out of the cursor, smooth highlights and popping check marks — plus an animated React right-click menu block built with Motion and Radix that springs open from the click point, staggers its items and glides a highlight between them.",
  tags: ["Drop-in shadcn API", "Right-click & long-press", "Sub-menus", "Checkbox & radio items", "Motion block"],
  hero: { Demo: AnimatedContextMenuDemo, file: demo("animated-context-menu-demo.tsx"), minHeight: 320 },
  install: {
    registry: "context-menu",
    source: "components/ui/context-menu.tsx",
    deps: "@radix-ui/react-context-menu lucide-react",
    note: (
      <>
        Same exports and props as the shadcn/ui Context Menu (including <Code>inset</Code> and{" "}
        <Code>variant=&quot;destructive&quot;</Code>), so it drops into existing code. Animations are CSS
        (tw-animate-css), so the base needs no Motion.
      </>
    ),
  },
  usage: {
    filename: "file-menu.tsx",
    code: `import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"

export function FileMenu() {
  return (
    <ContextMenu>
      <ContextMenuTrigger className="rounded-lg border p-8">Right-click me</ContextMenuTrigger>
      <ContextMenuContent className="w-52">
        <ContextMenuItem>
          Copy
          <ContextMenuShortcut>⌘C</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem>Rename</ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem variant="destructive">Delete</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  )
}`,
  },
  examples: [
    {
      id: "default",
      title: "Default",
      description: (
        <>
          Right-click (or long-press on touch) the area. The menu scales out of the exact point you
          clicked (Radix&apos;s transform origin) and closes faster than it opened. Includes shortcuts, a
          disabled item, a sub-menu whose chevron nudges open, checkbox and radio items whose
          indicators pop in, and a destructive item.
        </>
      ),
      Demo: ContextMenuBasicDemo,
      file: demo("context-menu-basic.tsx"),
      minHeight: 300,
    },
  ],
  blocks: [
    {
      id: "animated-context-menu",
      title: "Animated Context Menu",
      registry: "animated-context-menu",
      source: block("animated-context-menu.tsx"),
      deps: "motion @radix-ui/react-context-menu lucide-react",
      description: (
        <>
          Springs open from the cursor point while items cascade in. A highlight pill glides between
          items as you hover or arrow through them (a shared Motion <Code>layoutId</Code> per menu
          level), check marks draw themselves, radio dots spring in, separators draw across and
          sub-menus slide out the same way. Call <Code>event.preventDefault()</Code> in{" "}
          <Code>onSelect</Code> to keep the menu open while toggling.
        </>
      ),
      Demo: AnimatedContextMenuDemo,
      file: demo("animated-context-menu-demo.tsx"),
      minHeight: 320,
      props: [
        { name: "AnimatedContextMenu", type: "Radix Root props", description: "onOpenChange, modal, dir." },
        { name: "AnimatedContextMenuTrigger", type: "Radix Trigger props", description: "The right-click area. disabled turns the menu off." },
        { name: "AnimatedContextMenuContent", type: "Radix Content props & { stagger?: number }", description: "stagger is the delay between items in seconds (default 0.03)." },
        { name: "AnimatedContextMenuItem", type: "Radix Item props & { icon?, shortcut?, variant? }", description: 'An action. variant="destructive" tints it red.' },
        { name: "AnimatedContextMenuCheckboxItem", type: "Radix CheckboxItem props & { checked?, shortcut? }", description: "A toggle with a self-drawing check mark." },
        { name: "AnimatedContextMenuRadioGroup / RadioItem", type: "Radix props", description: "Single choice with a springy dot." },
        { name: "AnimatedContextMenuSub / SubTrigger / SubContent", type: "Radix props & { icon? } / { stagger? }", description: "A nested menu with its own gliding highlight." },
        { name: "AnimatedContextMenuLabel / Separator / Group", type: "Radix props", description: "Headings, dividers and groups that animate with the items." },
      ],
    },
  ],
  api: {
    intro: (
      <>
        Same parts as shadcn/ui: <Code>ContextMenu</Code>, <Code>Trigger</Code>, <Code>Content</Code>,{" "}
        <Code>Item</Code>, <Code>CheckboxItem</Code>, <Code>RadioGroup</Code>, <Code>RadioItem</Code>,{" "}
        <Code>Label</Code>, <Code>Separator</Code>, <Code>Shortcut</Code>, <Code>Group</Code>,{" "}
        <Code>Portal</Code>, <Code>Sub</Code>, <Code>SubTrigger</Code> and <Code>SubContent</Code> (all
        prefixed <Code>ContextMenu</Code>). Each forwards the Radix props.
      </>
    ),
    props: [
      { name: "onOpenChange / modal", type: "(open: boolean) => void / boolean", default: "— / true", description: "On ContextMenu. Radix Context Menu is uncontrolled." },
      { name: "disabled", type: "boolean", description: "Turn the menu off for this area (on ContextMenuTrigger)." },
      { name: "onSelect", type: "(event: Event) => void", description: "Fires on click, Enter or Space; preventDefault() keeps the menu open (on items)." },
      { name: "variant", type: '"default" | "destructive"', default: '"default"', description: "Red destructive item (on ContextMenuItem)." },
      { name: "inset", type: "boolean", description: "Indent to align with items that have an indicator (Item, Label, SubTrigger)." },
      { name: "checked / onCheckedChange", type: "boolean / (checked: boolean) => void", description: "On ContextMenuCheckboxItem." },
      { name: "value / onValueChange", type: "string / (value: string) => void", description: "On ContextMenuRadioGroup." },
    ],
  },
  accessibility: [
    <>Built on Radix Context Menu: <Code>role=&quot;menu&quot;</Code> with menuitem, menuitemcheckbox and menuitemradio roles, roving focus and typeahead.</>,
    <>Opens with right-click, long-press on touch, or the context-menu key / Shift+F10 — give the trigger <Code>tabIndex={"{0}"}</Code> (as the demos do) so keyboard users can focus it.</>,
    "Arrow keys move between items, Right/Left open and close sub-menus, Enter/Space select and Escape closes.",
    "In the Animated Context Menu the highlight follows keyboard focus as well as the pointer, and an open sub-menu keeps its trigger highlighted.",
    "Under prefers-reduced-motion menus only fade, the cascade is removed and the highlight jumps instead of gliding.",
  ],
};

export function ContextMenuDocs() {
  return <ComponentDocs config={config} />;
}
