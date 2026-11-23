import { ComponentDocs, type DocConfig } from "@/components/docs/component-docs";
import { Code } from "@/components/docs/doc-primitives";

import ToggleGroupBasicDemo from "@/components/demos/toggle-group/toggle-group-basic";
import ToggleGroupOutlineDemo from "@/components/demos/toggle-group/toggle-group-outline";
import ToggleDemo from "@/components/demos/toggle-group/toggle-demo";
import AnimatedToggleGroupDemo from "@/components/demos/toggle-group/animated-toggle-group-demo";
import AnimatedToggleGroupSizesDemo from "@/components/demos/toggle-group/animated-toggle-group-sizes-demo";

const demo = (file: string) => `components/demos/toggle-group/${file}`;
const block = (file: string) => `components/dusk/toggle-group/${file}`;

const config: DocConfig = {
  title: "Toggle Group",
  intro:
    "An animated React toggle group built on shadcn/ui and Radix: the drop-in Toggle and ToggleGroup add a tactile press and a mint active state — plus a Motion block where the active pill glides between options, for single and multiple selection.",
  tags: ["Drop-in shadcn API", "Radix Toggle Group", "Motion layoutId", "Single & multiple", "prefers-reduced-motion"],
  hero: { Demo: AnimatedToggleGroupDemo, file: demo("animated-toggle-group-demo.tsx"), minHeight: 240 },
  install: {
    registry: "toggle-group",
    source: "components/ui/toggle-group.tsx",
    deps: "@radix-ui/react-toggle-group @radix-ui/react-toggle class-variance-authority",
    note: (
      <>
        Also installs <Code>components/ui/toggle.tsx</Code> (the group reuses its <Code>toggleVariants</Code>).
        Both keep shadcn&apos;s parts, props and <Code>data-slot</Code> attributes and animate with CSS only.
      </>
    ),
  },
  usage: {
    filename: "formatting.tsx",
    code: `import { Bold, Italic, Underline } from "lucide-react"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

export function Formatting() {
  return (
    <ToggleGroup type="multiple" aria-label="Text formatting">
      <ToggleGroupItem value="bold" aria-label="Bold"><Bold /></ToggleGroupItem>
      <ToggleGroupItem value="italic" aria-label="Italic"><Italic /></ToggleGroupItem>
      <ToggleGroupItem value="underline" aria-label="Underline"><Underline /></ToggleGroupItem>
    </ToggleGroup>
  )
}`,
  },
  examples: [
    {
      id: "default",
      title: "Default",
      description: (
        <>
          <Code>type=&quot;multiple&quot;</Code> lets several items be on at once. Pressed icons light up mint.
          Arrow keys move between items; Space or Enter toggles.
        </>
      ),
      Demo: ToggleGroupBasicDemo,
      file: demo("toggle-group-basic.tsx"),
      minHeight: 160,
    },
    {
      id: "outline",
      title: "Outline, single & spacing",
      description: (
        <>
          <Code>variant=&quot;outline&quot;</Code> joins the items into one bordered bar;{" "}
          <Code>type=&quot;single&quot;</Code> keeps one value. Set <Code>spacing</Code> to separate them, and{" "}
          <Code>size</Code> for <Code>sm</Code> / <Code>lg</Code>.
        </>
      ),
      Demo: ToggleGroupOutlineDemo,
      file: demo("toggle-group-outline.tsx"),
      minHeight: 200,
    },
    {
      id: "toggle",
      title: "Toggle",
      description: (
        <>
          A single two-state button (<Code>components/ui/toggle.tsx</Code>) with <Code>pressed</Code> /{" "}
          <Code>onPressedChange</Code>, the same variants and sizes.
        </>
      ),
      Demo: ToggleDemo,
      file: demo("toggle-demo.tsx"),
      minHeight: 160,
    },
  ],
  blocks: [
    {
      id: "animated-toggle-group",
      title: "Animated Toggle Group",
      registry: "animated-toggle-group",
      source: block("animated-toggle-group.tsx"),
      deps: "motion @radix-ui/react-toggle-group",
      description: (
        <>
          Options sit on a recessed track. With <Code>type=&quot;single&quot;</Code> one glowing pill glides
          to the pressed item (a shared Motion <Code>layoutId</Code>); with <Code>type=&quot;multiple&quot;</Code>{" "}
          each pressed item gets its own pill that springs in and shrinks away. Typed like Radix:{" "}
          <Code>value</Code> is a string for single and a string array for multiple.
        </>
      ),
      Demo: AnimatedToggleGroupDemo,
      file: demo("animated-toggle-group-demo.tsx"),
      minHeight: 240,
      props: [
        { name: "type", type: '"single" | "multiple"', description: "One value or many. Required." },
        { name: "value / onValueChange", type: "string | string[] / (value) => void", description: "Controlled value; a string for single, an array for multiple." },
        { name: "defaultValue", type: "string | string[]", description: "Uncontrolled initial value." },
        { name: "size", type: '"sm" | "default" | "lg"', default: '"default"', description: "Item height and padding." },
        { name: "disabled / orientation / rovingFocus / loop", type: "Radix ToggleGroup props", description: "Forwarded to the Radix root." },
        { name: "AnimatedToggleGroupItem", type: "ToggleGroupItem props", description: "An item. Icon-only items need an aria-label." },
      ],
    },
    {
      id: "animated-toggle-group-sizes",
      title: "Animated Toggle Group — sizes",
      registry: "animated-toggle-group",
      source: block("animated-toggle-group.tsx"),
      deps: "motion @radix-ui/react-toggle-group",
      description: (
        <>
          <Code>size=&quot;sm&quot;</Code>, <Code>default</Code> and <Code>lg</Code> — handy as a chart range
          picker. Each group gets its own pill, so several can live on one page.
        </>
      ),
      Demo: AnimatedToggleGroupSizesDemo,
      file: demo("animated-toggle-group-sizes-demo.tsx"),
      minHeight: 220,
    },
  ],
  api: {
    intro: (
      <>
        Same parts as shadcn/ui: <Code>ToggleGroup</Code> and <Code>ToggleGroupItem</Code> (plus{" "}
        <Code>Toggle</Code> and <Code>toggleVariants</Code>), each forwarding its Radix props.
      </>
    ),
    props: [
      { name: "type", type: '"single" | "multiple"', description: "On ToggleGroup. Required." },
      { name: "value / onValueChange", type: "string | string[] / (value) => void", description: "Controlled value (string for single, array for multiple)." },
      { name: "variant", type: '"default" | "outline"', default: '"default"', description: "Ghost items or a bordered bar. Inherited by items." },
      { name: "size", type: '"sm" | "default" | "lg"', default: '"default"', description: "Item size. Inherited by items." },
      { name: "spacing", type: "number", default: "0", description: "Gap between items in spacing units; 0 joins them." },
      { name: "pressed / onPressedChange", type: "boolean / (pressed: boolean) => void", description: "On Toggle: controlled state." },
    ],
  },
  accessibility: [
    "Built on Radix Toggle Group: one Tab stop with roving focus, arrow keys between items, Space / Enter to toggle.",
    "Multiple groups expose aria-pressed on each button; single groups use radio semantics (role=\"radio\" + aria-checked).",
    "Name the group with aria-label and give icon-only items an aria-label of their own.",
    "The gliding pills are decorative (aria-hidden, pointer-events-none).",
    "Under prefers-reduced-motion the pills appear and move instantly.",
  ],
};

export function ToggleGroupDocs() {
  return <ComponentDocs config={config} />;
}
