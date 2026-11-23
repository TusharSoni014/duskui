import { ComponentDocs, type DocConfig } from "@/components/docs/component-docs";
import { Code } from "@/components/docs/doc-primitives";

import InteractiveHoverButtonDemo from "@/components/demos/interactive-hover-button/interactive-hover-button-demo";
import InteractiveHoverButtonCustomDemo from "@/components/demos/interactive-hover-button/interactive-hover-button-custom";
import InteractiveHoverButtonLoadingDemo from "@/components/demos/interactive-hover-button/interactive-hover-button-loading";

const demo = (file: string) => `components/demos/interactive-hover-button/${file}`;

const config: DocConfig = {
  title: "Interactive Hover Button",
  intro:
    "A React pill button with an interactive hover effect: a small dot grows to fill the button while the label slides away and an arrow with a new label slides in. Built on the DuskUI Button with Tailwind CSS, it animates only transform and opacity, and keyboard focus triggers the same state as hover.",
  tags: ["Built on DuskUI Button", "Transform & opacity only", "Keyboard focus state", "Width-stable", "prefers-reduced-motion"],
  hero: { Demo: InteractiveHoverButtonDemo, file: demo("interactive-hover-button-demo.tsx") },
  install: {
    registry: "interactive-hover-button",
    source: "components/dusk/interactive-hover-button/interactive-hover-button.tsx",
    deps: "lucide-react",
    note: (
      <>
        Builds on the DuskUI <Code>Button</Code>; the CLI installs it automatically. Installing by hand?
        Add <Code>components/ui/button.tsx</Code> from the Button page first.
      </>
    ),
  },
  usage: {
    filename: "cta.tsx",
    code: `import { InteractiveHoverButton } from "@/components/dusk/interactive-hover-button/interactive-hover-button"

export function Cta() {
  return <InteractiveHoverButton size="lg">Get started</InteractiveHoverButton>
}`,
  },
  examples: [
    {
      id: "custom",
      title: "Color, icon & hover label",
      description: (
        <>
          <Code>color</Code> sets the dot and fill, <Code>fillForeground</Code> the text on top of it.{" "}
          <Code>icon</Code> replaces the arrow and <Code>hoverLabel</Code> shows different text on hover.
        </>
      ),
      Demo: InteractiveHoverButtonCustomDemo,
      file: demo("interactive-hover-button-custom.tsx"),
      minHeight: 160,
    },
    {
      id: "loading",
      title: "Loading",
      description: (
        <>
          <Code>loading</Code> comes from the base Button: the content crossfades to a spinner without
          changing the width, and the button stays focusable.
        </>
      ),
      Demo: InteractiveHoverButtonLoadingDemo,
      file: demo("interactive-hover-button-loading.tsx"),
      minHeight: 160,
    },
  ],
  api: {
    intro: (
      <>
        Also accepts every DuskUI Button prop (<Code>size</Code>, <Code>loading</Code>,{" "}
        <Code>loadingText</Code>) except <Code>variant</Code> and <Code>asChild</Code>.
      </>
    ),
    props: [
      { name: "color", type: "string", default: "var(--color-primary)", description: "Any CSS color for the dot and the fill." },
      { name: "fillForeground", type: "string", default: "var(--color-primary-foreground)", description: "Text color on top of the fill." },
      { name: "hoverLabel", type: "ReactNode", default: "children", description: "Label shown in the hover state." },
      { name: "icon", type: "ReactNode", default: "<ArrowRight />", description: "Icon that slides in with the hover label." },
      { name: "className", type: "string", description: "Merged with tailwind-merge, so overrides win." },
    ],
  },
  accessibility: [
    "Renders a native <button>; keyboard focus (focus-visible) shows the same filled state as hover, plus the standard focus ring.",
    "The hover label is aria-hidden, so screen readers announce the main label once.",
    "Both labels share one grid cell, so the button is always as wide as the wider label and never shifts layout.",
    "With prefers-reduced-motion nothing slides: the labels crossfade and the fill appears instantly.",
    "Only transform and opacity animate, so the effect stays smooth and never triggers layout.",
  ],
};

export function InteractiveHoverButtonDocs() {
  return <ComponentDocs config={config} />;
}
