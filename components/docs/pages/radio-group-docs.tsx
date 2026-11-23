import { ComponentDocs, type DocConfig } from "@/components/docs/component-docs";
import { Code } from "@/components/docs/doc-primitives";

import RadioGroupBasicDemo from "@/components/demos/radio-group/radio-group-basic";
import RadioGroupDescriptionDemo from "@/components/demos/radio-group/radio-group-description";
import RadioGroupStatesDemo from "@/components/demos/radio-group/radio-group-states";
import RadioCardsDemo from "@/components/demos/radio-group/radio-cards-demo";
import RadioCardsGridDemo from "@/components/demos/radio-group/radio-cards-grid-demo";

const demo = (file: string) => `components/demos/radio-group/${file}`;
const block = (file: string) => `components/dusk/radio-group/${file}`;

const config: DocConfig = {
  title: "Radio Group",
  intro:
    "An animated React radio group built on shadcn/ui and Radix: the drop-in RadioGroup springs its dot in and glows mint when checked — plus Radio Cards, selectable plan and pricing cards whose outline glides to the chosen card with Motion.",
  tags: ["Drop-in shadcn API", "Radix Radio Group", "CSS spring", "Motion layoutId", "prefers-reduced-motion"],
  hero: { Demo: RadioCardsDemo, file: demo("radio-cards-demo.tsx"), minHeight: 360 },
  install: {
    registry: "radio-group",
    source: "components/ui/radio-group.tsx",
    deps: "@radix-ui/react-radio-group",
    note: (
      <>
        Replaces <Code>components/ui/radio-group.tsx</Code> with the same parts and <Code>data-slot</Code>{" "}
        attributes. The spring is a CSS <Code>linear()</Code> curve, so there is no JavaScript per frame.
      </>
    ),
  },
  usage: {
    filename: "density.tsx",
    code: `import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export function Density() {
  return (
    <RadioGroup defaultValue="comfortable" aria-label="Density">
      <div className="flex items-center gap-3">
        <RadioGroupItem value="comfortable" id="comfortable" />
        <label htmlFor="comfortable">Comfortable</label>
      </div>
      <div className="flex items-center gap-3">
        <RadioGroupItem value="compact" id="compact" />
        <label htmlFor="compact">Compact</label>
      </div>
    </RadioGroup>
  )
}`,
  },
  examples: [
    {
      id: "default",
      title: "Default",
      description: "Pick an option to watch the dot spring in while the previous one shrinks away. Arrow keys move the selection.",
      Demo: RadioGroupBasicDemo,
      file: demo("radio-group-basic.tsx"),
      minHeight: 200,
    },
    {
      id: "with-description",
      title: "With descriptions",
      description: (
        <>
          Wrap the group in a <Code>fieldset</Code> with a <Code>legend</Code>, and link each hint with{" "}
          <Code>aria-describedby</Code>. <Code>name</Code> submits the value with a form.
        </>
      ),
      Demo: RadioGroupDescriptionDemo,
      file: demo("radio-group-description.tsx"),
      minHeight: 240,
    },
    {
      id: "states",
      title: "Horizontal, disabled & invalid",
      description: (
        <>
          Lay items out in a row with <Code>orientation=&quot;horizontal&quot;</Code> (Left / Right arrows),
          disable single items, and mark errors with <Code>aria-invalid</Code>.
        </>
      ),
      Demo: RadioGroupStatesDemo,
      file: demo("radio-group-states.tsx"),
      minHeight: 160,
    },
  ],
  blocks: [
    {
      id: "radio-cards",
      title: "Radio Cards",
      registry: "radio-cards",
      source: block("radio-cards.tsx"),
      deps: "motion @radix-ui/react-radio-group",
      description: (
        <>
          Selectable cards for plans, pricing tiers or shipping speeds. A glowing mint outline glides from
          card to card via a shared Motion <Code>layoutId</Code>, the chosen card&apos;s icon lifts and its
          price lights up. The whole card is the click target, and it is still a Radix radio group, so
          arrow keys and forms work.
        </>
      ),
      Demo: RadioCardsDemo,
      file: demo("radio-cards-demo.tsx"),
      minHeight: 360,
      props: [
        { name: "value / onValueChange", type: "string / (value: string) => void", description: "Controlled selection (on RadioCards)." },
        { name: "defaultValue", type: "string", description: "Uncontrolled initial selection." },
        { name: "name / required / disabled / orientation", type: "Radix RadioGroup props", description: "Forwarded to the Radix root." },
        { name: "className", type: "string", description: "On RadioCards: it is a CSS grid, e.g. grid-cols-3." },
        { name: "RadioCard › title", type: "ReactNode", description: "Card title; names the radio." },
        { name: "RadioCard › description", type: "ReactNode", description: "Secondary text; describes the radio." },
        { name: "RadioCard › icon / aside", type: "ReactNode", description: "Leading icon and right-aligned content such as a price." },
        { name: "RadioCard › children", type: "ReactNode", description: "Extra content under the description (features, badges)." },
        { name: "RadioCard › containerClassName", type: "string", description: "Classes for the card. `className` styles the radio." },
      ],
    },
    {
      id: "radio-cards-grid",
      title: "Radio Cards — grid",
      registry: "radio-cards",
      source: block("radio-cards.tsx"),
      deps: "motion @radix-ui/react-radio-group",
      description: (
        <>
          The same block in a three-column grid (<Code>className=&quot;sm:grid-cols-3&quot;</Code>). The outline
          travels across the row, and the cards stack on small screens.
        </>
      ),
      Demo: RadioCardsGridDemo,
      file: demo("radio-cards-grid-demo.tsx"),
      minHeight: 220,
    },
  ],
  api: {
    intro: (
      <>
        Same parts as shadcn/ui: <Code>RadioGroup</Code> and <Code>RadioGroupItem</Code>, each forwarding its
        Radix Radio Group props.
      </>
    ),
    props: [
      { name: "value / onValueChange", type: "string / (value: string) => void", description: "Controlled selection (on RadioGroup)." },
      { name: "defaultValue", type: "string", description: "Uncontrolled initial selection." },
      { name: "name / required", type: "string / boolean", description: "Form integration on RadioGroup." },
      { name: "orientation", type: '"horizontal" | "vertical"', description: "Which arrow keys move the selection." },
      { name: "loop", type: "boolean", default: "true", description: "Wrap around at the ends." },
      { name: "value / disabled", type: "string / boolean", description: "On RadioGroupItem." },
    ],
  },
  accessibility: [
    "Built on Radix Radio Group: a radiogroup with radio items, roving focus (one Tab stop) and arrow keys that move the selection.",
    "Give the group a name with aria-label, aria-labelledby or a fieldset legend, and pair each item with a <label htmlFor>.",
    "Radio Cards name each radio by its title (aria-labelledby) and describe it with the description (aria-describedby); the card is a <label>, so clicking anywhere selects.",
    "The gliding outline is decorative (aria-hidden); the checked state is conveyed by aria-checked.",
    "Under prefers-reduced-motion the dot appears instantly and the outline jumps instead of gliding.",
  ],
};

export function RadioGroupDocs() {
  return <ComponentDocs config={config} />;
}
