import { ComponentDocs, type DocConfig } from "@/components/docs/component-docs";
import { Code } from "@/components/docs/doc-primitives";

import ButtonGroupBasicDemo from "@/components/demos/button-group/button-group-basic";
import ButtonGroupOrientationDemo from "@/components/demos/button-group/button-group-orientation";
import ButtonGroupInputDemo from "@/components/demos/button-group/button-group-input";
import SplitButtonDemo from "@/components/demos/button-group/split-button-demo";
import AnimatedButtonGroupDemo from "@/components/demos/button-group/animated-button-group-demo";

const demo = (file: string) => `components/demos/button-group/${file}`;
const block = (file: string) => `components/dusk/button-group/${file}`;

const config: DocConfig = {
  title: "Button Group",
  intro:
    "A React button group built on shadcn/ui: join buttons, inputs and select triggers into one control with shared borders, horizontal or vertical — plus Motion blocks for a split button that rolls to the action you pick and a segmented button group with a sliding active indicator.",
  tags: ["Drop-in shadcn API", "Server Component friendly", "Horizontal & vertical", "Split button", "Motion blocks"],
  hero: { Demo: AnimatedButtonGroupDemo, file: demo("animated-button-group-demo.tsx"), minHeight: 220 },
  install: {
    registry: "button-group",
    source: "components/ui/button-group.tsx",
    deps: "@radix-ui/react-slot class-variance-authority",
    note: (
      <>
        CSS only — no <Code>&quot;use client&quot;</Code> needed. Works with any button, but is tuned for the DuskUI
        Button: joined segments sink by a pixel instead of scaling, so seams never split.
      </>
    ),
  },
  usage: {
    filename: "pager.tsx",
    code: `import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"

export function Pager() {
  return (
    <ButtonGroup aria-label="Pagination">
      <Button variant="outline">Previous</Button>
      <Button variant="outline">Next</Button>
    </ButtonGroup>
  )
}`,
  },
  examples: [
    {
      id: "nested",
      title: "Nested groups",
      description: (
        <>
          A <Code>ButtonGroup</Code> of <Code>ButtonGroup</Code>s becomes a toolbar with gaps between sets.{" "}
          <Code>ButtonGroupText</Code> adds a non-interactive segment.
        </>
      ),
      Demo: ButtonGroupBasicDemo,
      file: demo("button-group-basic.tsx"),
      minHeight: 160,
    },
    {
      id: "orientation",
      title: "Orientation & separators",
      description: (
        <>
          <Code>orientation=&quot;vertical&quot;</Code> stacks the buttons. Filled variants have no border, so put a{" "}
          <Code>ButtonGroupSeparator</Code> between them.
        </>
      ),
      Demo: ButtonGroupOrientationDemo,
      file: demo("button-group-orientation.tsx"),
      minHeight: 180,
    },
    {
      id: "input",
      title: "With input & select",
      description: "Inputs stretch to fill the group, and select triggers join seamlessly.",
      Demo: ButtonGroupInputDemo,
      file: demo("button-group-input.tsx"),
      minHeight: 160,
    },
  ],
  blocks: [
    {
      id: "animated-button-group",
      title: "Animated Button Group",
      registry: "animated-button-group",
      source: block("animated-button-group.tsx"),
      deps: "motion",
      description:
        "Joined outline buttons where a quiet indicator slides to the selected segment. It's a radio group under the hood: one Tab stop, arrow keys and Home / End move the selection, and the value can be submitted with a form.",
      Demo: AnimatedButtonGroupDemo,
      file: demo("animated-button-group-demo.tsx"),
      minHeight: 220,
      props: [
        {
          name: "options",
          type: "{ value; label?; icon?; aria-label?; disabled? }[]",
          description: "Segments. Icon-only segments need an aria-label.",
        },
        { name: "value / onValueChange", type: "string / (v: string) => void", description: "Controlled value." },
        { name: "defaultValue", type: "string", description: "Uncontrolled initial value. Defaults to the first option." },
        { name: "size", type: '"sm" | "default" | "lg"', default: '"default"', description: "Button size." },
        { name: "orientation", type: '"horizontal" | "vertical"', default: '"horizontal"', description: "Layout and arrow-key axis." },
        { name: "name", type: "string", description: "Submit the value with a hidden input." },
      ],
    },
    {
      id: "split-button",
      title: "Split Button",
      registry: "split-button",
      source: block("split-button.tsx"),
      deps: "motion lucide-react",
      description:
        "A primary action joined to a menu of alternatives. Picking another option makes it the main action: its label rolls in while the button springs to the new width, and the chevron flips while the menu is open.",
      Demo: SplitButtonDemo,
      file: demo("split-button-demo.tsx"),
      minHeight: 200,
      props: [
        {
          name: "actions",
          type: "{ value; label; description?; icon?; disabled? }[]",
          description: "The menu options. The selected one runs from the main button.",
        },
        { name: "value / onValueChange", type: "string / (v: string) => void", description: "The selected action (controlled)." },
        { name: "onAction", type: "(value: string) => void", description: "Main button click, with the selected action." },
        { name: "variant", type: '"default" | "secondary" | "outline"', default: '"default"', description: "Button style." },
        { name: "loading", type: "boolean", default: "false", description: "Spinner on the main button." },
        { name: "menuLabel", type: "string", default: '"More options"', description: "Accessible name of the chevron button." },
      ],
    },
  ],
  api: {
    intro: "Each part accepts the props of the element it renders.",
    props: [
      { name: "ButtonGroup orientation", type: '"horizontal" | "vertical"', default: '"horizontal"', description: "Direction the segments join in." },
      { name: "ButtonGroupText asChild", type: "boolean", default: "false", description: "Render your own element, e.g. a <label>." },
      { name: "ButtonGroupSeparator orientation", type: '"vertical" | "horizontal"', default: '"vertical"', description: "Use horizontal inside vertical groups." },
    ],
  },
  accessibility: [
    <><Code>ButtonGroup</Code> renders <Code>role=&quot;group&quot;</Code> — give it an <Code>aria-label</Code> that names the set.</>,
    "Focused segments rise above their neighbours, so focus rings are never clipped.",
    <>The Animated Button Group is a <Code>radiogroup</Code> with roving tabindex and arrow-key selection.</>,
    "The Split Button menu is a Radix Dropdown Menu with radio items, so it has full keyboard support and announces the checked option.",
    "Indicators and label rolls respect prefers-reduced-motion.",
  ],
};

export function ButtonGroupDocs() {
  return <ComponentDocs config={config} />;
}
