import { ComponentDocs, type DocConfig } from "@/components/docs/component-docs";
import { Code } from "@/components/docs/doc-primitives";

import ComboboxDemo from "@/components/demos/combobox/combobox-demo";
import ComboboxIconsDemo from "@/components/demos/combobox/combobox-icons-demo";
import MultiComboboxDemo from "@/components/demos/combobox/multi-combobox-demo";

const demo = (file: string) => `components/demos/combobox/${file}`;
const block = (file: string) => `components/dusk/combobox/${file}`;

const config: DocConfig = {
  title: "Combobox",
  intro:
    "An animated React combobox — a searchable select and an autocomplete multi-select built on shadcn/ui's Popover + Command recipe (Radix and cmdk) with Motion: the panel springs open, results filter with layout animations and highlighted matches, and selections become removable animated chips.",
  tags: ["shadcn Popover + Command", "cmdk", "Motion layout", "Multi-select chips", "Keyboard accessible"],
  hero: { Demo: ComboboxDemo, file: demo("combobox-demo.tsx"), minHeight: 420 },
  install: {
    registry: "combobox",
    source: block("combobox.tsx"),
    deps: "motion cmdk @radix-ui/react-popover lucide-react",
    note: (
      <>
        shadcn/ui has no Combobox primitive — it is a recipe composed from <Code>Popover</Code> and{" "}
        <Code>Command</Code>. DuskUI ships it as a ready-made component that installs the DuskUI Button and
        Popover with it. Filtering is done in the component (cmdk&apos;s <Code>shouldFilter</Code> is off) so
        results can animate.
      </>
    ),
  },
  usage: {
    filename: "framework-picker.tsx",
    code: `"use client"

import * as React from "react"
import { Combobox } from "@/components/dusk/combobox/combobox"

const frameworks = [
  { value: "next", label: "Next.js" },
  { value: "remix", label: "Remix" },
  { value: "astro", label: "Astro" },
]

export function FrameworkPicker() {
  const [value, setValue] = React.useState("")
  return (
    <Combobox
      aria-label="Framework"
      options={frameworks}
      value={value}
      onValueChange={setValue}
      placeholder="Select a framework…"
    />
  )
}`,
  },
  examples: [
    {
      id: "default",
      title: "Default",
      description: (
        <>
          The panel springs out of the trigger and options cascade in. As you type, matches that start with
          the query move to the top and every option slides to its new place, the list height eases to fit,
          matched text lights up and a highlight pill glides with the arrow keys. When nothing matches, an
          empty state pops in. The trigger crossfades to the new label.
        </>
      ),
      Demo: ComboboxDemo,
      file: demo("combobox-demo.tsx"),
      minHeight: 420,
    },
    {
      id: "icons",
      title: "Icons & descriptions",
      description: (
        <>
          Options can carry an <Code>icon</Code> (shown in the trigger too), a <Code>description</Code> and
          extra search <Code>keywords</Code> — try “golang”. <Code>allowDeselect={"{false}"}</Code> keeps a
          value selected.
        </>
      ),
      Demo: ComboboxIconsDemo,
      file: demo("combobox-icons-demo.tsx"),
      minHeight: 400,
    },
  ],
  blocks: [
    {
      id: "multi-combobox",
      title: "Multi-select Combobox",
      registry: "multi-combobox",
      source: block("multi-combobox.tsx"),
      deps: "motion cmdk @radix-ui/react-popover lucide-react",
      description: (
        <>
          Type right in the field to filter, pick as many as you like and each becomes a chip that pops in.
          Chips slide over to make room and shrink away when removed with their ✕ or Backspace. Options
          show checkboxes that draw themselves, <Code>max</Code> caps the selection with a counter, and
          every change is announced to screen readers.
        </>
      ),
      Demo: MultiComboboxDemo,
      file: demo("multi-combobox-demo.tsx"),
      minHeight: 440,
      props: [
        { name: "options", type: "{ value, label, icon?, keywords?, disabled? }[]", description: "The choices." },
        { name: "value / onValueChange", type: "string[] / (value: string[]) => void", description: "Controlled selection." },
        { name: "defaultValue", type: "string[]", default: "[]", description: "Uncontrolled initial selection." },
        { name: "max", type: "number", description: "Stop adding at this many; shows a counter and Clear button." },
        { name: "placeholder", type: "string", default: '"Search…"', description: "Shown while nothing is selected." },
        { name: "emptyMessage", type: "ReactNode", default: '"No results found."', description: "Shown when nothing matches." },
        { name: "name", type: "string", description: "Submits each value with its own hidden input." },
        { name: "aria-label", type: "string", default: '"Options"', description: "Names the input and list." },
        { name: "disabled", type: "boolean", default: "false", description: "Disable the whole field." },
        { name: "className / contentClassName", type: "string", description: "Classes for the field and the panel." },
      ],
    },
  ],
  api: {
    intro: (
      <>
        <Code>Combobox</Code> props. Anything else (<Code>id</Code>, <Code>aria-label</Code>,{" "}
        <Code>className</Code>, <Code>disabled</Code>…) is forwarded to the trigger Button.
      </>
    ),
    props: [
      { name: "options", type: "{ value, label, description?, icon?, keywords?, disabled? }[]", description: "The choices. `label` is searched; `keywords` add extra matches." },
      { name: "value / onValueChange", type: "string / (value: string) => void", description: "Controlled selection; \"\" when cleared." },
      { name: "defaultValue", type: "string", default: '""', description: "Uncontrolled initial selection." },
      { name: "placeholder / searchPlaceholder", type: "string", description: "Trigger text when empty, and the search input placeholder." },
      { name: "emptyMessage", type: "ReactNode", default: '"No results found."', description: "Shown when nothing matches." },
      { name: "allowDeselect", type: "boolean", default: "true", description: "Picking the selected option again clears it." },
      { name: "name", type: "string", description: "Submits the value with a hidden input." },
      { name: "contentClassName", type: "string", description: "Classes for the panel. Other props go to the trigger Button." },
    ],
  },
  accessibility: [
    "The Combobox trigger is a button with role=\"combobox\", aria-expanded and aria-haspopup=\"listbox\"; name it with a <label htmlFor> or aria-label.",
    "Inside, cmdk wires the search input (role=\"combobox\", aria-activedescendant) to the listbox, so Up, Down, Home, End and Enter work without leaving the input.",
    "Radix Popover returns focus to the trigger on close and closes on Escape or an outside click.",
    "The multi-select keeps focus in its input, marks the list aria-multiselectable and options aria-checked, gives every chip a labelled remove button, and announces additions and removals in a polite live region.",
    "Match highlighting uses <mark>; the gliding highlight pill is decorative (aria-hidden).",
    "Under prefers-reduced-motion the panel and chips only fade, the list stops sliding and the highlight jumps.",
  ],
};

export function ComboboxDocs() {
  return <ComponentDocs config={config} />;
}
