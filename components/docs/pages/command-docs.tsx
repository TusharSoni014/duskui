import { ComponentDocs, type DocConfig } from "@/components/docs/component-docs";
import { Code } from "@/components/docs/doc-primitives";

import CommandBasicDemo from "@/components/demos/command/command-basic";
import CommandDialogDemo from "@/components/demos/command/command-dialog-demo";
import CommandPaletteDemo from "@/components/demos/command/command-palette-demo";

const demo = (file: string) => `components/demos/command/${file}`;
const block = (file: string) => `components/dusk/command/${file}`;

const config: DocConfig = {
  title: "Command",
  intro:
    "The shadcn/ui Command menu (cmdk) with a result list that eases its height as you type, a clear selected row and keycap shortcuts — plus an animated React ⌘K command palette block built with Motion, with a gliding highlight, recent items and nested pages.",
  tags: ["Drop-in shadcn API", "cmdk filtering", "⌘K palette", "Nested pages", "Motion block"],
  hero: { Demo: CommandPaletteDemo, file: demo("command-palette-demo.tsx"), minHeight: 300 },
  install: {
    registry: "command",
    source: "components/ui/command.tsx",
    deps: "cmdk lucide-react",
    note: (
      <>
        Replaces <Code>components/ui/command.tsx</Code> with the same exports and props, including{" "}
        <Code>CommandDialog</Code>&apos;s <Code>title</Code>, <Code>description</Code>,{" "}
        <Code>className</Code> and <Code>showCloseButton</Code>. It uses the DuskUI{" "}
        <Code>Dialog</Code>, which the CLI installs for you. Animations are CSS, so the base needs no Motion.
      </>
    ),
  },
  usage: {
    filename: "search-menu.tsx",
    code: `import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from "@/components/ui/command"

export function SearchMenu() {
  return (
    <Command className="rounded-xl border">
      <CommandInput placeholder="Type a command or search…" />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Suggestions">
          <CommandItem onSelect={() => console.log("calendar")}>Calendar</CommandItem>
          <CommandItem>
            Settings
            <CommandShortcut>⌘S</CommandShortcut>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  )
}`,
  },
  examples: [
    {
      id: "default",
      title: "Default",
      description: (
        <>
          An inline menu. Type to filter: the list eases to its new height instead of jumping, the
          selected row gets a neutral highlight and its icon brightens, and shortcuts render as small
          keycaps. Disabled items are skipped by the arrow keys.
        </>
      ),
      Demo: CommandBasicDemo,
      file: demo("command-basic.tsx"),
      minHeight: 400,
    },
    {
      id: "dialog",
      title: "Dialog",
      description: (
        <>
          <Code>CommandDialog</Code> wraps the menu in the DuskUI Dialog and positions it near the top
          of the screen like a real palette. Its accessible title and description are visually hidden
          but announced. Bind a shortcut yourself with a <Code>keydown</Code> listener.
        </>
      ),
      Demo: CommandDialogDemo,
      file: demo("command-dialog-demo.tsx"),
      minHeight: 200,
    },
  ],
  blocks: [
    {
      id: "command-palette",
      title: "Command Palette",
      registry: "command-palette",
      source: block("command-palette.tsx"),
      deps: "motion cmdk @radix-ui/react-dialog lucide-react",
      description: (
        <>
          A data-driven ⌘K palette. It fades in from the top, a highlight glides between items as you
          arrow or hover (a shared Motion <Code>layoutId</Code>), and actions you run surface under
          Recent. Items with a <Code>page</Code> open a nested page: the list slides in from the side
          you&apos;re travelling, a breadcrumb shows where you are and the panel eases to the new
          height. Backspace on an empty search or Escape steps back. This demo uses ⌘J so it
          doesn&apos;t clash with the site search.
        </>
      ),
      Demo: CommandPaletteDemo,
      file: demo("command-palette-demo.tsx"),
      minHeight: 300,
      props: [
        { name: "groups", type: "CommandPaletteGroup[]", description: "Groups on the home page: { heading, items }." },
        { name: "pages", type: "CommandPalettePage[]", default: "[]", description: "Nested pages: { id, title, placeholder?, groups }." },
        { name: "items[]", type: "{ id, label, icon?, description?, shortcut?, keywords?, disabled?, page?, onSelect?, keepOpen? }", description: "page opens a nested page; otherwise onSelect runs and the palette closes unless keepOpen." },
        { name: "open / defaultOpen / onOpenChange", type: "boolean / boolean / (open: boolean) => void", description: "Open state." },
        { name: "trigger", type: "ReactElement", description: "Element that opens the palette, usually a Button." },
        { name: "hotkey", type: "string | null", default: '"k"', description: "Key that toggles the palette with ⌘ / Ctrl. null disables it." },
        { name: "defaultRecent / recentLimit", type: "string[] / number", default: "[] / 3", description: "Initial recent item ids and how many to keep. 0 hides Recent." },
        { name: "placeholder / emptyMessage", type: "string / ReactNode", description: "Search placeholder and the no-results message." },
        { name: "title / description", type: "string", description: "Accessible (visually hidden) dialog title and description." },
      ],
    },
  ],
  api: {
    intro: (
      <>
        Same parts as shadcn/ui: <Code>Command</Code>, <Code>CommandDialog</Code>,{" "}
        <Code>CommandInput</Code>, <Code>CommandList</Code>, <Code>CommandEmpty</Code>,{" "}
        <Code>CommandGroup</Code>, <Code>CommandItem</Code>, <Code>CommandSeparator</Code> and{" "}
        <Code>CommandShortcut</Code>. Each forwards the cmdk props.
      </>
    ),
    props: [
      { name: "value / onValueChange", type: "string / (value: string) => void", description: "Controlled selected item (on Command)." },
      { name: "filter / shouldFilter / loop", type: "(value, search, keywords) => number / boolean / boolean", description: "Custom scoring, turn filtering off for async results, wrap arrow keys (on Command)." },
      { name: "value / onValueChange", type: "string / (search: string) => void", description: "Controlled search text (on CommandInput)." },
      { name: "onSelect / value / keywords / disabled", type: "(value) => void / string / string[] / boolean", description: "On CommandItem. keywords add search terms." },
      { name: "heading", type: "ReactNode", description: "Group title (on CommandGroup)." },
      { name: "title / description / showCloseButton", type: "string / string / boolean", default: '"Command Palette" / … / true', description: "On CommandDialog, plus all Dialog props." },
    ],
  },
  accessibility: [
    <>cmdk renders a <Code>combobox</Code> input that controls a <Code>listbox</Code>; the selected option is exposed with <Code>aria-selected</Code> and <Code>aria-activedescendant</Code>, so focus stays in the input.</>,
    "Arrow keys (and Ctrl+N/P, Ctrl+J/K) move the selection, Home/End jump, Enter runs the item. Disabled items are skipped.",
    "CommandDialog and the Command Palette are Radix Dialogs: focus is trapped, Escape closes (in the palette it first steps back out of nested pages) and focus returns to the trigger.",
    "The palette's breadcrumb is a labelled nav with aria-current on the current page and a real Back button.",
    "Under prefers-reduced-motion the list height and highlight change instantly, pages don't slide and the palette only fades.",
  ],
};

export function CommandDocs() {
  return <ComponentDocs config={config} />;
}
