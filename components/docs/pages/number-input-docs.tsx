import { ComponentDocs, type DocConfig } from "@/components/docs/component-docs";
import { Code } from "@/components/docs/doc-primitives";

import NumberInputDemo from "@/components/demos/number-input/number-input-demo";
import NumberInputFormatDemo from "@/components/demos/number-input/number-input-format";
import NumberInputFormDemo from "@/components/demos/number-input/number-input-form";

const demo = (file: string) => `components/demos/number-input/${file}`;

const config: DocConfig = {
  title: "Number Input",
  intro:
    "An accessible React number input with − / + stepper buttons and digits that roll like an odometer when the value changes: min, max and step, press-and-hold to repeat, Arrow / PageUp / PageDown keys, optional mouse wheel and Intl.NumberFormat for currency, percent and units — a real input with spinbutton semantics, built with Tailwind CSS and Motion.",
  tags: ["Rolling digits", "Press & hold", "Keyboard & wheel", "Intl formatting", "Spinbutton a11y", "Form-ready"],
  hero: { Demo: NumberInputDemo, file: demo("number-input-demo.tsx"), minHeight: 220 },
  install: {
    registry: "number-input",
    source: "components/dusk/number-input/number-input.tsx",
    deps: "motion lucide-react",
  },
  usage: {
    filename: "quantity.tsx",
    code: `"use client"

import * as React from "react"
import { NumberInput } from "@/components/dusk/number-input/number-input"

export function Quantity() {
  const [quantity, setQuantity] = React.useState<number | null>(1)
  return (
    <NumberInput
      aria-label="Quantity"
      value={quantity}
      onValueChange={setQuantity}
      min={1}
      max={99}
    />
  )
}`,
  },
  examples: [
    {
      id: "formatting",
      title: "Currency, percent & units",
      description: (
        <>
          Pass any <Code>Intl.NumberFormat</Code> options with <Code>formatOptions</Code> and a{" "}
          <Code>locale</Code>. Typing is parsed back in that locale — try <Code>3,75</Code> in the German field. Values
          are rounded to what the field can display, so the number you get matches what you see.
        </>
      ),
      Demo: NumberInputFormatDemo,
      file: demo("number-input-format.tsx"),
      minHeight: 320,
    },
    {
      id: "form",
      title: "In a form",
      description: (
        <>
          With <Code>name</Code>, the raw number is submitted through a hidden input — not the formatted text. Typed
          values commit on blur or Enter, synchronously, so a submitting form sees them.
        </>
      ),
      Demo: NumberInputFormDemo,
      file: demo("number-input-form.tsx"),
      minHeight: 280,
    },
  ],
  api: {
    intro: (
      <>
        Other props (<Code>placeholder</Code>, <Code>aria-*</Code>, <Code>onFocus</Code>…) go to the inner{" "}
        <Code>&lt;input&gt;</Code>. <Code>className</Code> styles the outer field (it defaults to <Code>w-36</Code>).
      </>
    ),
    props: [
      { name: "value / onValueChange", type: "number | null / (v: number | null) => void", description: "Controlled value; null is empty." },
      { name: "defaultValue", type: "number | null", default: "null", description: "Uncontrolled initial value." },
      { name: "min / max", type: "number", description: "Limits. Values are clamped, and hitting a limit nudges the field." },
      { name: "step", type: "number", default: "1", description: "Amount for the buttons and Arrow keys." },
      { name: "largeStep", type: "number", default: "step × 10", description: "Amount for PageUp / PageDown and Shift + Arrow." },
      { name: "locale", type: "string", default: '"en-US"', description: "Locale for formatting and parsing." },
      { name: "formatOptions", type: "Intl.NumberFormatOptions", description: "Currency, percent, unit, fraction digits…" },
      { name: "allowWheel", type: "boolean", default: "false", description: "Step with the mouse wheel while focused." },
      { name: "size", type: '"sm" | "default" | "lg"', default: '"default"', description: "Height and button size." },
      { name: "name", type: "string", description: "Submits the raw number with a hidden input." },
      { name: "decrementLabel / incrementLabel", type: "string", default: '"Decrease" / "Increase"', description: "Button labels for assistive tech." },
      { name: "inputClassName", type: "string", description: "Classes for the inner input." },
    ],
  },
  accessibility: [
    <>A real <Code>&lt;input inputMode=&quot;decimal&quot;&gt;</Code> with <Code>role=&quot;spinbutton&quot;</Code>, <Code>aria-valuenow</Code>, <Code>aria-valuemin</Code>, <Code>aria-valuemax</Code> and the formatted value in <Code>aria-valuetext</Code>.</>,
    "Keyboard: Arrow Up / Down step, Shift + Arrow and PageUp / PageDown take large steps, Home / End jump to min / max, Enter commits typing and Escape reverts it.",
    <>The − / + buttons are labelled, point to the input with <Code>aria-controls</Code>, and are left out of the Tab order (the input already handles the keys), as in the WAI-ARIA spinbutton pattern.</>,
    "The rolling digits are a visual layer; the real text stays in the input, so selection, copy and screen readers work as usual.",
    "Under prefers-reduced-motion the digits cross-fade and the limit nudge is skipped.",
  ],
};

export function NumberInputDocs() {
  return <ComponentDocs config={config} />;
}
