import { ComponentDocs, type DocConfig } from "@/components/docs/component-docs";
import { Code } from "@/components/docs/doc-primitives";

import CheckboxBasicDemo from "@/components/demos/checkbox/checkbox-basic";
import CheckboxIndeterminateDemo from "@/components/demos/checkbox/checkbox-indeterminate";
import TaskCheckboxDemo from "@/components/demos/checkbox/task-checkbox-demo";
import CheckboxCardDemo from "@/components/demos/checkbox/checkbox-card-demo";

const demo = (file: string) => `components/demos/checkbox/${file}`;
const block = (file: string) => `components/dusk/checkbox/${file}`;

const config: DocConfig = {
  title: "Checkbox",
  intro:
    "An animated React checkbox built on shadcn/ui and Radix: the drop-in Checkbox draws its check mark with an SVG stroke and supports indeterminate — plus Motion blocks for a to-do item that strikes its label through with a little burst, and selectable checkbox cards that trace a glowing outline.",
  tags: ["Drop-in shadcn API", "Radix Checkbox", "SVG pathLength", "Indeterminate", "prefers-reduced-motion"],
  hero: { Demo: TaskCheckboxDemo, file: demo("task-checkbox-demo.tsx"), minHeight: 280 },
  install: {
    registry: "checkbox",
    source: "components/ui/checkbox.tsx",
    deps: "@radix-ui/react-checkbox",
    note: (
      <>
        Replaces <Code>components/ui/checkbox.tsx</Code> with the same API. The check animation is pure
        CSS (stroke-dashoffset on a <Code>pathLength</Code> path), so uncontrolled checkboxes and form
        resets keep working.
      </>
    ),
  },
  usage: {
    filename: "terms.tsx",
    code: `import { Checkbox } from "@/components/ui/checkbox"

export function Terms() {
  return (
    <div className="flex items-center gap-2">
      <Checkbox id="terms" />
      <label htmlFor="terms">Accept terms and conditions</label>
    </div>
  )
}`,
  },
  examples: [
    {
      id: "default",
      title: "Default",
      description: (
        <>
          The check draws itself when ticked and erases faster when cleared. Link hints with{" "}
          <Code>aria-describedby</Code>.
        </>
      ),
      Demo: CheckboxBasicDemo,
      file: demo("checkbox-basic.tsx"),
      minHeight: 220,
    },
    {
      id: "indeterminate",
      title: "Indeterminate",
      description: (
        <>
          Pass <Code>checked=&quot;indeterminate&quot;</Code> for a partial selection; a dash draws in
          instead of the check. A classic “select all” for lists and tables.
        </>
      ),
      Demo: CheckboxIndeterminateDemo,
      file: demo("checkbox-indeterminate.tsx"),
      minHeight: 260,
    },
  ],
  blocks: [
    {
      id: "task-checkbox",
      title: "Task Checkbox",
      registry: "task-checkbox",
      source: block("task-checkbox.tsx"),
      deps: "motion",
      description: (
        <>
          A to-do row. Checking it draws the check, strikes the label through from left to right — across
          every wrapped line, one after another — dims the text and pops a ring and particle burst around
          the box. The whole label is the click target.
        </>
      ),
      Demo: TaskCheckboxDemo,
      file: demo("task-checkbox-demo.tsx"),
      minHeight: 280,
      props: [
        { name: "label", type: "ReactNode", description: "The task text. Required." },
        { name: "description", type: "ReactNode", description: "Secondary line, linked with aria-describedby." },
        { name: "checked / onCheckedChange", type: 'boolean | "indeterminate"', description: "Controlled state." },
        { name: "defaultChecked", type: 'boolean | "indeterminate"', default: "false", description: "Uncontrolled initial state." },
        { name: "celebrate", type: "boolean", default: "true", description: "Ring + particle burst when checked." },
        { name: "containerClassName", type: "string", description: "Classes for the row; className styles the checkbox." },
      ],
    },
    {
      id: "checkbox-card",
      title: "Checkbox Card",
      registry: "checkbox-card",
      source: block("checkbox-card.tsx"),
      deps: "motion",
      description: (
        <>
          A selectable card for plans, add-ons and multi-select options. Selecting it traces a mint
          outline around the card (an SVG rect drawn with <Code>pathLength</Code>), tints the surface,
          lifts the icon and draws the check. The card is announced as one checkbox named by its title.
        </>
      ),
      Demo: CheckboxCardDemo,
      file: demo("checkbox-card-demo.tsx"),
      minHeight: 360,
      props: [
        { name: "title", type: "ReactNode", description: "Card title; becomes the checkbox's accessible name." },
        { name: "description", type: "ReactNode", description: "Supporting text, linked with aria-describedby." },
        { name: "icon", type: "ReactNode", description: "Leading icon element." },
        { name: "children", type: "ReactNode", description: "Extra content under the description (price, badges)." },
        { name: "checked / defaultChecked / onCheckedChange", type: 'boolean | "indeterminate"', description: "Same as Checkbox." },
        { name: "name / value / required / disabled", type: "Checkbox props", description: "Forwarded to the checkbox for forms." },
        { name: "containerClassName", type: "string", description: "Classes for the card; className styles the checkbox." },
      ],
    },
  ],
  api: {
    intro: (
      <>
        <Code>Checkbox</Code> forwards every Radix Checkbox prop, exactly like shadcn/ui. Style states with{" "}
        <Code>data-[state=checked]</Code>, <Code>data-[state=indeterminate]</Code> and{" "}
        <Code>aria-invalid</Code>.
      </>
    ),
    props: [
      { name: "checked", type: 'boolean | "indeterminate"', description: "Controlled state." },
      { name: "defaultChecked", type: 'boolean | "indeterminate"', default: "false", description: "Uncontrolled initial state." },
      { name: "onCheckedChange", type: '(checked: boolean | "indeterminate") => void', description: "Called when the user toggles it." },
      { name: "name / value / required", type: "string / string / boolean", description: "Form submission, via a hidden input inside forms." },
      { name: "disabled", type: "boolean", default: "false", description: "Dims the checkbox and blocks interaction." },
    ],
  },
  accessibility: [
    "Built on Radix Checkbox: a button with role=\"checkbox\" and aria-checked (including \"mixed\" for indeterminate), toggled with Space.",
    <>Label every checkbox with <Code>&lt;label htmlFor&gt;</Code>; Task Checkbox and Checkbox Card wire labels and descriptions for you.</>,
    "The animated mark, outline and particles are aria-hidden and never intercept clicks.",
    "Under prefers-reduced-motion the mark appears instantly, the strike-through doesn't animate and the burst is skipped.",
  ],
};

export function CheckboxDocs() {
  return <ComponentDocs config={config} />;
}
