import { ComponentDocs, type DocConfig } from "@/components/docs/component-docs";
import { Code } from "@/components/docs/doc-primitives";

import LampDemo from "@/components/demos/lamp/lamp-demo";
import LampColors from "@/components/demos/lamp/lamp-colors";

const demo = (file: string) => `components/demos/lamp/${file}`;

const config: DocConfig = {
  title: "Lamp",
  intro:
    "A lamp light effect for React and Tailwind CSS: a thin bar hangs over your section and two soft cones of light widen into place as it scrolls into view, lighting the heading below. Built from conic gradients and compositor-only transforms, in any color.",
  tags: ["Section", "Scroll reveal", "Conic gradients", "Wraps content", "Reduced-motion safe"],
  hero: { Demo: LampDemo, file: demo("lamp-demo.tsx"), minHeight: 400 },
  install: {
    registry: "lamp",
    source: "components/dusk/lamp/lamp.tsx",
    deps: "motion",
    note: (
      <>
        Unlike the other backgrounds, <Code>Lamp</Code> wraps its content: children render below the bar, and the
        section gets <Code>bg-background</Code> so the dark housing above the bar blends in. Override it with a class.
      </>
    ),
  },
  usage: {
    filename: "section.tsx",
    code: `import { Lamp } from "@/components/dusk/lamp/lamp"

export function Section() {
  return (
    <Lamp className="min-h-[32rem]">
      <h2 className="text-5xl font-semibold">Build in the light</h2>
    </Lamp>
  )
}`,
  },
  examples: [
    {
      id: "colors",
      title: "Color & spread",
      description: (
        <>
          <Code>color</Code> tints the bar, cones and haze. <Code>spread</Code> is how far each half of the cone
          opens from straight down, and <Code>offset</Code> moves the bar (and the content below it) up or down.
        </>
      ),
      Demo: LampColors,
      file: demo("lamp-colors.tsx"),
      minHeight: 320,
    },
  ],
  api: {
    intro: (
      <>
        Any other <Code>div</Code> prop is passed to the root. Content starts{" "}
        <Code>offset + 3.5rem</Code> from the top; change it with a <Code>pt-*</Code> class.
      </>
    ),
    props: [
      { name: "color", type: "string", default: '"#cbd5e1"', description: "Light color. Any CSS color." },
      { name: "offset", type: "number", default: "112", description: "Distance in px from the top to the lamp bar." },
      { name: "spread", type: "number", default: "58", description: "Half-angle of the light cone in degrees, 20–80." },
      { name: "once", type: "boolean", default: "true", description: "Reveal only the first time the lamp enters the viewport." },
      { name: "children", type: "ReactNode", description: "Content lit by the lamp, usually a heading." },
      { name: "className", type: "string", description: "Merged onto the root section." },
    ],
  },
  accessibility: [
    <>The light is a decorative layer (<Code>aria-hidden</Code>, <Code>pointer-events-none</Code>); your children stay normal, readable, focusable content.</>,
    "With prefers-reduced-motion the light fades in without widening.",
    "Use a real heading element for the lit text so the section keeps its place in the document outline.",
    "The haze brightens the area right under the bar; check contrast for small text placed there.",
  ],
};

export function LampDocs() {
  return <ComponentDocs config={config} />;
}
