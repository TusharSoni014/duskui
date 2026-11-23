import { ComponentDocs, type DocConfig } from "@/components/docs/component-docs";
import { Code } from "@/components/docs/doc-primitives";

import IceInputDemo from "@/components/demos/ice-input/ice-input-demo";
import IceInputColors from "@/components/demos/ice-input/ice-input-colors";
import IceInputInvalid from "@/components/demos/ice-input/ice-input-invalid";

const demo = (file: string) => `components/demos/ice-input/${file}`;

const config: DocConfig = {
  title: "Ice Input",
  intro:
    "A frosted-glass text input for React, built on the DuskUI Input with Motion and Tailwind CSS. On focus, frost spreads across the field from where you clicked and the border takes a cool tint, while it stays a native input that works with labels, autofill and forms.",
  tags: ["Built on Input", "Frost-spread focus", "Any frost color", "Invalid state", "prefers-reduced-motion"],
  hero: { Demo: IceInputDemo, file: demo("ice-input-demo.tsx"), minHeight: 320 },
  install: {
    registry: "ice-input",
    source: "components/dusk/glass/ice-input.tsx",
    deps: "motion",
    note: (
      <>
        Builds on the DuskUI <Code>Input</Code>; the CLI installs it automatically. Installing by hand?
        Add <Code>components/ui/input.tsx</Code> from the Input page first.
      </>
    ),
  },
  usage: {
    filename: "newsletter.tsx",
    code: `import { Mail } from "lucide-react"
import { IceInput } from "@/components/dusk/glass/ice-input"

export function Newsletter() {
  return <IceInput type="email" icon={<Mail />} placeholder="you@example.com" aria-label="Email" />
}`,
  },
  examples: [
    {
      id: "colors",
      title: "Colors",
      description: (
        <>
          <Code>color</Code> takes any CSS color — a hex, <Code>oklch()</Code> or a theme variable like{" "}
          <Code>var(--color-primary)</Code>. The frost, border and focus ring are all mixed from it.
        </>
      ),
      Demo: IceInputColors,
      file: demo("ice-input-colors.tsx"),
      minHeight: 260,
    },
    {
      id: "invalid",
      title: "Invalid",
      description: (
        <>
          Set <Code>aria-invalid</Code> and the tint switches to the destructive color. Link the message
          with <Code>aria-describedby</Code>.
        </>
      ),
      Demo: IceInputInvalid,
      file: demo("ice-input-invalid.tsx"),
      minHeight: 220,
    },
  ],
  api: {
    intro: (
      <>
        Also accepts every native <Code>&lt;input&gt;</Code> prop, which is passed to the underlying
        Input. <Code>className</Code> styles the input; <Code>wrapperClassName</Code> styles the glass.
      </>
    ),
    props: [
      { name: "color", type: "string", default: '"oklch(0.86 0.11 215)"', description: "Frost and focus color — any CSS color. Switches to destructive when aria-invalid." },
      { name: "icon", type: "ReactNode", description: "Decorative leading icon. Label the input itself." },
      { name: "wrapperClassName", type: "string", description: "Classes for the glass wrapper (width, radius…)." },
    ],
  },
  accessibility: [
    <>It&apos;s a native <Code>&lt;input&gt;</Code>: pair it with a <Code>&lt;label htmlFor&gt;</Code> or <Code>aria-label</Code>; autofill and password managers keep working.</>,
    "Focus is always visible: the border tints and a focus ring appears, and the frost covers the field from the left edge for keyboard focus.",
    "Icons and effect layers are aria-hidden. Browsers without backdrop-filter get an opaque field for contrast.",
    "With reduced motion the frost appears instantly instead of spreading. The effect is a clip-path, so the field never changes size.",
  ],
};

export function IceInputDocs() {
  return <ComponentDocs config={config} />;
}
