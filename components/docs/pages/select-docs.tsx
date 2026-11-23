import { ComponentDocs, type DocConfig } from "@/components/docs/component-docs";
import { Code } from "@/components/docs/doc-primitives";

import SelectBasicDemo from "@/components/demos/select/select-basic";
import SelectScrollableDemo from "@/components/demos/select/select-scrollable";
import SelectStatesDemo from "@/components/demos/select/select-states";
import AnimatedSelectDemo from "@/components/demos/select/animated-select-demo";

const demo = (file: string) => `components/demos/select/${file}`;
const block = (file: string) => `components/dusk/select/${file}`;

const config: DocConfig = {
  title: "Select",
  intro:
    "An animated React select built on shadcn/ui and Radix Select: the drop-in Select grows out of its trigger, flips its chevron and fades in the check mark — plus a Motion block with a list that scales open, cascading options and a highlight that glides between items.",
  tags: ["Drop-in shadcn API", "Radix Select", "Motion layoutId", "Keyboard & typeahead", "prefers-reduced-motion"],
  hero: { Demo: AnimatedSelectDemo, file: demo("animated-select-demo.tsx"), minHeight: 380 },
  install: {
    registry: "select",
    source: "components/ui/select.tsx",
    deps: "@radix-ui/react-select lucide-react",
    note: (
      <>
        Replaces <Code>components/ui/select.tsx</Code> with the same parts and <Code>data-slot</Code>{" "}
        attributes, so existing selects keep working. The base Select animates with CSS only (tw-animate-css).
      </>
    ),
  },
  usage: {
    filename: "theme-select.tsx",
    code: `import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function ThemeSelect() {
  return (
    <Select defaultValue="system" name="theme">
      <SelectTrigger className="w-44" aria-label="Theme">
        <SelectValue placeholder="Theme" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="light">Light</SelectItem>
        <SelectItem value="dark">Dark</SelectItem>
        <SelectItem value="system">System</SelectItem>
      </SelectContent>
    </Select>
  )
}`,
  },
  examples: [
    {
      id: "default",
      title: "Default",
      description: (
        <>
          A labelled select with a group heading and a disabled option. In the default{" "}
          <Code>item-aligned</Code> mode the selected option lines up with the trigger, like a native select.
        </>
      ),
      Demo: SelectBasicDemo,
      file: demo("select-basic.tsx"),
      minHeight: 260,
    },
    {
      id: "scrollable",
      title: "Groups & scrolling",
      description: (
        <>
          <Code>position=&quot;popper&quot;</Code> drops the list below the trigger at its width and slides it
          in from the side it opens on. Long lists scroll, with scroll buttons at the edges, and{" "}
          <Code>name</Code> submits the value with a form.
        </>
      ),
      Demo: SelectScrollableDemo,
      file: demo("select-scrollable.tsx"),
      minHeight: 360,
    },
    {
      id: "states",
      title: "Sizes & states",
      description: (
        <>
          <Code>size=&quot;sm&quot;</Code> on the trigger for dense UIs, <Code>aria-invalid</Code> for errors
          (link the message with <Code>aria-describedby</Code>) and <Code>disabled</Code>.
        </>
      ),
      Demo: SelectStatesDemo,
      file: demo("select-states.tsx"),
      minHeight: 260,
    },
  ],
  blocks: [
    {
      id: "animated-select",
      title: "Animated Select",
      registry: "animated-select",
      source: block("animated-select.tsx"),
      deps: "motion @radix-ui/react-select lucide-react",
      description: (
        <>
          The list scales out of the trigger and options cascade in quickly. A highlight pill glides between
          options as you hover or arrow through them (a shared Motion <Code>layoutId</Code>), the selected
          option&apos;s check mark fades in, and the active option&apos;s icon brightens. Options can carry an{" "}
          <Code>icon</Code> (shown in the trigger too) and a <Code>description</Code>. Same composition as
          the shadcn Select.
        </>
      ),
      Demo: AnimatedSelectDemo,
      file: demo("animated-select-demo.tsx"),
      minHeight: 380,
      props: [
        { name: "value / onValueChange", type: "string / (value: string) => void", description: "Controlled selection (on AnimatedSelect)." },
        { name: "defaultValue", type: "string", description: "Uncontrolled initial selection." },
        { name: "open / onOpenChange", type: "boolean / (open: boolean) => void", description: "Controlled open state." },
        { name: "name / required / disabled", type: "Radix Select props", description: "Forwarded to the Radix root; `name` submits with forms." },
        { name: "AnimatedSelectTrigger", type: "SelectTrigger props", description: "The trigger button. Put AnimatedSelectValue inside." },
        { name: "AnimatedSelectContent › stagger", type: "number", default: "0.015", description: "Delay between options as they cascade in, in seconds." },
        { name: "AnimatedSelectContent › side / align / sideOffset", type: "Radix props", default: '"bottom" / "start" / 6', description: "Placement next to the trigger." },
        { name: "AnimatedSelectItem › icon", type: "ReactNode", description: "Leading icon; also shown in the trigger when selected." },
        { name: "AnimatedSelectItem › description", type: "ReactNode", description: "Secondary text on the right (list only)." },
        { name: "AnimatedSelectGroup / Label / Separator", type: "—", description: "Group options under a heading; the separator draws in." },
      ],
    },
  ],
  api: {
    intro: (
      <>
        Same parts as shadcn/ui — <Code>Select</Code>, <Code>SelectGroup</Code>, <Code>SelectValue</Code>,{" "}
        <Code>SelectTrigger</Code>, <Code>SelectContent</Code>, <Code>SelectLabel</Code>,{" "}
        <Code>SelectItem</Code>, <Code>SelectSeparator</Code>, <Code>SelectScrollUpButton</Code> and{" "}
        <Code>SelectScrollDownButton</Code> — each forwarding its Radix Select props.
      </>
    ),
    props: [
      { name: "value / onValueChange", type: "string / (value: string) => void", description: "Controlled selection (on Select)." },
      { name: "defaultValue", type: "string", description: "Uncontrolled initial selection." },
      { name: "name / required / disabled", type: "string / boolean / boolean", description: "Form integration on Select. A hidden native select submits the value." },
      { name: "size", type: '"sm" | "default"', default: '"default"', description: "On SelectTrigger: 32px or 36px tall." },
      { name: "position", type: '"item-aligned" | "popper"', default: '"item-aligned"', description: "On SelectContent: align the selected item over the trigger, or drop below it." },
      { name: "placeholder", type: "ReactNode", description: "On SelectValue: shown until something is selected." },
      { name: "disabled", type: "boolean", description: "On SelectItem: skip it in keyboard navigation and typeahead." },
    ],
  },
  accessibility: [
    "Built on Radix Select: the trigger is a combobox button, the list a listbox of options with aria-selected; arrow keys, Home, End, Enter, Space, Escape and typeahead all work.",
    "Label the trigger with a <label htmlFor> pointing at its id, or aria-label. Mark errors with aria-invalid and link the message with aria-describedby.",
    "A hidden native select mirrors the value, so forms, autofill and form reset work.",
    "The gliding highlight is decorative (aria-hidden); the active option is still conveyed by focus and data-highlighted.",
    "Under prefers-reduced-motion the list only fades, options appear without movement and the highlight jumps.",
  ],
};

export function SelectDocs() {
  return <ComponentDocs config={config} />;
}
