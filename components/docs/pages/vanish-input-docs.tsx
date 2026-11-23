import { ComponentDocs, type DocConfig } from "@/components/docs/component-docs";
import { Code } from "@/components/docs/doc-primitives";

import VanishInputDemo from "@/components/demos/vanish-input/vanish-input-demo";
import VanishInputSearch from "@/components/demos/vanish-input/vanish-input-search";
import VanishInputControlled from "@/components/demos/vanish-input/vanish-input-controlled";

const demo = (file: string) => `components/demos/vanish-input/${file}`;

const config: DocConfig = {
  title: "Vanish Input",
  intro:
    "An animated prompt and search input for React: the placeholder cycles through suggestions with a soft slide and blur, and when you press Enter your text dissolves into particles before the field clears. A great fit for AI chat boxes, search bars and hero prompts.",
  tags: ["Cycling placeholders", "Particle dissolve", "Enter to submit", "Controlled or uncontrolled", "Canvas", "Reduced-motion fade"],
  hero: { Demo: VanishInputDemo, file: demo("vanish-input-demo.tsx"), minHeight: 300 },
  install: {
    registry: "vanish-input",
    source: "components/dusk/vanish-input/vanish-input.tsx",
    deps: "motion lucide-react",
    note: (
      <>
        On submit the text is painted onto a canvas with the input&apos;s own font and color, sampled into particles, and
        blown away; the field clears at the same instant, so there&apos;s no flicker.
      </>
    ),
  },
  usage: {
    filename: "prompt.tsx",
    code: `"use client"

import { VanishInput } from "@/components/dusk/vanish-input/vanish-input"

export function Prompt() {
  return (
    <VanishInput
      placeholders={["Ask anything…", "Summarize my inbox…", "Plan a trip to Lisbon…"]}
      onSubmit={(value) => console.log(value)}
    />
  )
}`,
  },
  examples: [
    {
      id: "search",
      title: "Search",
      description: (
        <>
          Restyle the field with <Code>className</Code> and the wrapper with <Code>containerClassName</Code>.{" "}
          <Code>interval</Code> sets how long each placeholder stays.
        </>
      ),
      Demo: VanishInputSearch,
      file: demo("vanish-input-search.tsx"),
      minHeight: 220,
    },
    {
      id: "controlled",
      title: "Controlled",
      description: (
        <>
          Pass <Code>value</Code> and <Code>onValueChange</Code> to control the text, here to cap its length. After a
          submit, <Code>onValueChange</Code> is called with an empty string.
        </>
      ),
      Demo: VanishInputControlled,
      file: demo("vanish-input-controlled.tsx"),
      minHeight: 200,
    },
  ],
  api: {
    intro: (
      <>
        Any other <Code>input</Code> prop (<Code>name</Code>, <Code>maxLength</Code>, <Code>autoFocus</Code>…) is passed to
        the input. Empty or whitespace-only values are never submitted.
      </>
    ),
    props: [
      { name: "placeholders", type: "string[]", default: '["Ask anything…"]', description: "Suggestions that take turns as the placeholder." },
      { name: "interval", type: "number", default: "3000", description: "Milliseconds each placeholder stays." },
      { name: "onSubmit", type: "(value: string) => void", description: "Called with the trimmed text on Enter or the button." },
      { name: "value", type: "string", description: "Controlled value." },
      { name: "defaultValue", type: "string", default: '""', description: "Initial value when uncontrolled." },
      { name: "onValueChange", type: "(value: string) => void", description: "Called on every change, and with \"\" after a submit." },
      { name: "label", type: "string", default: "first placeholder", description: "Accessible name of the field." },
      { name: "submitLabel", type: "string", default: '"Submit"', description: "Accessible name of the submit button." },
      { name: "containerClassName", type: "string", description: "Classes for the outer form." },
      { name: "className", type: "string", description: "Classes for the input." },
    ],
  },
  accessibility: [
    <>The field has a stable accessible name (<Code>label</Code>); the cycling placeholder is decorative and hidden from screen readers.</>,
    "It's a real form: Enter submits, and the submit button has its own label and uses aria-disabled while the field is empty.",
    "Placeholders only cycle while the field is empty, visible on screen and the tab is in front.",
    "With prefers-reduced-motion placeholders crossfade without sliding, and submitted text fades out instead of scattering.",
  ],
};

export function VanishInputDocs() {
  return <ComponentDocs config={config} />;
}
