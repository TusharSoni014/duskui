import { ComponentDocs, type DocConfig } from "@/components/docs/component-docs";
import { Code } from "@/components/docs/doc-primitives";

import MovingBorderDemo from "@/components/demos/moving-border/moving-border-demo";
import MovingBorderCardDemo from "@/components/demos/moving-border/moving-border-card";
import MovingBorderColorsDemo from "@/components/demos/moving-border/moving-border-colors";

const demo = (file: string) => `components/demos/moving-border/${file}`;

const config: DocConfig = {
  title: "Moving Border",
  intro:
    "A React moving border: a soft beam that travels along the rounded edge of any element, at constant speed around straight sides and corners alike. Use the MovingBorder wrapper for cards and badges, or the ready-made MovingBorderButton built on the DuskUI Button. Made with Motion and Tailwind CSS.",
  tags: ["Wrapper + button", "Follows rounded corners", "Pauses off-screen", "No layout shift", "prefers-reduced-motion"],
  hero: { Demo: MovingBorderDemo, file: demo("moving-border-demo.tsx") },
  install: {
    registry: "moving-border",
    source: "components/dusk/moving-border/moving-border.tsx",
    deps: "motion",
    note: (
      <>
        <Code>MovingBorderButton</Code> builds on the DuskUI <Code>Button</Code>; the CLI installs it
        automatically. Installing by hand? Add <Code>components/ui/button.tsx</Code> from the Button page
        first.
      </>
    ),
  },
  usage: {
    filename: "book-demo.tsx",
    code: `import { MovingBorder, MovingBorderButton } from "@/components/dusk/moving-border/moving-border"

export function BookDemo() {
  return (
    <>
      <MovingBorderButton size="lg">Book a demo</MovingBorderButton>
      <MovingBorder radius={20} contentClassName="p-6">
        Any content
      </MovingBorder>
    </>
  )
}`,
  },
  examples: [
    {
      id: "card",
      title: "Card wrapper",
      description: (
        <>
          Wrap any block in <Code>MovingBorder</Code>. The content wrapper paints its own background, so
          the beam only shows through the <Code>borderWidth</Code> gap. A bigger <Code>beamSize</Code>{" "}
          gives a longer streak.
        </>
      ),
      Demo: MovingBorderCardDemo,
      file: demo("moving-border-card.tsx"),
      minHeight: 280,
    },
    {
      id: "colors-speed",
      title: "Color, speed & direction",
      description: (
        <>
          <Code>color</Code> takes any CSS color, <Code>speed</Code> is the seconds per lap and{" "}
          <Code>reverse</Code> runs it counter-clockwise.
        </>
      ),
      Demo: MovingBorderColorsDemo,
      file: demo("moving-border-colors.tsx"),
      minHeight: 180,
    },
  ],
  api: {
    intro: (
      <>
        <Code>MovingBorder</Code> also accepts every <Code>&lt;div&gt;</Code> prop.{" "}
        <Code>MovingBorderButton</Code> accepts the same beam props plus every DuskUI Button prop (except{" "}
        <Code>asChild</Code>); its <Code>className</Code> goes to the button and{" "}
        <Code>containerClassName</Code> to the border wrapper. It defaults to a pill with{" "}
        <Code>radius</Code> 9999, <Code>speed</Code> 3 and <Code>beamSize</Code> 56.
      </>
    ),
    props: [
      { name: "color", type: "string", default: "var(--color-primary)", description: "Any CSS color for the travelling light." },
      { name: "speed", type: "number", default: "6 (button: 5)", description: "Seconds for one lap around the border." },
      { name: "radius", type: "number", default: "12 (button: 9999)", description: "Corner radius in px. Large values give a pill." },
      { name: "borderWidth", type: "number", default: "1", description: "Border width in px: how much of the light shows around the content." },
      { name: "beamSize", type: "number", default: "64 (button: 48)", description: "Diameter of the beam in px." },
      { name: "reverse", type: "boolean", default: "false", description: "Run the beam counter-clockwise." },
      { name: "contentClassName", type: "string", description: "Classes for the inner content wrapper (padding, background)." },
      { name: "containerClassName", type: "string", description: "MovingBorderButton only: classes for the outer border wrapper." },
    ],
  },
  accessibility: [
    "The beam and track are aria-hidden and absolutely positioned, so they never reach screen readers or change the content's size.",
    "MovingBorderButton renders a native <button>; because the wrapper clips the beam, it draws the focus-visible ring on the wrapper so keyboard focus stays clearly visible.",
    "With prefers-reduced-motion the beam is hidden and the whole edge is lit steadily instead; the animation also pauses whenever the element is off-screen.",
    "The beam is positioned with Motion values, so it never re-renders React and is cleaned up on unmount.",
  ],
};

export function MovingBorderDocs() {
  return <ComponentDocs config={config} />;
}
