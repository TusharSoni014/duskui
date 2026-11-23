import { ComponentDocs, type DocConfig } from "@/components/docs/component-docs";
import { Code } from "@/components/docs/doc-primitives";

import NeonButtonDemo from "@/components/demos/neon-button/neon-button-demo";
import NeonButtonColorsDemo from "@/components/demos/neon-button/neon-button-colors";
import NeonButtonIntensityDemo from "@/components/demos/neon-button/neon-button-intensity";
import NeonButtonLoadingDemo from "@/components/demos/neon-button/neon-button-loading";

const demo = (file: string) => `components/demos/neon-button/${file}`;

const config: DocConfig = {
  category: "Neon",
  title: "Neon Button",
  intro:
    "A React button that glows like a neon tube, built on the DuskUI Button with Motion and Tailwind CSS. The glow brightens on hover and keyboard focus, can flicker on when it scrolls into view, and takes any CSS color — while loading states and every shadcn/ui Button prop keep working.",
  tags: ["Any CSS color", "Flicker-on effect", "Loading state", "Focus-visible glow", "prefers-reduced-motion"],
  hero: { Demo: NeonButtonDemo, file: demo("neon-button-demo.tsx") },
  install: {
    registry: "neon-button",
    source: "components/dusk/neon/neon-button.tsx",
    deps: "motion",
    note: (
      <>
        Builds on the DuskUI <Code>Button</Code>; the CLI installs it automatically. Installing by hand?
        Add <Code>components/ui/button.tsx</Code> from the Button page first.
      </>
    ),
  },
  usage: {
    filename: "hero-cta.tsx",
    code: `import { NeonButton } from "@/components/dusk/neon/neon-button"

export function HeroCta() {
  return (
    <NeonButton size="lg" color="#ff2bd6" flicker>
      Get early access
    </NeonButton>
  )
}`,
  },
  examples: [
    {
      id: "colors",
      title: "Colors",
      description: (
        <>
          Pass any CSS color to <Code>color</Code> — hex, <Code>oklch()</Code> or a theme variable. The
          border, text, glow and focus ring are all derived from it with <Code>color-mix()</Code>.
        </>
      ),
      Demo: NeonButtonColorsDemo,
      file: demo("neon-button-colors.tsx"),
      minHeight: 160,
    },
    {
      id: "intensity",
      title: "Intensity & solid",
      description: (
        <>
          <Code>intensity</Code> scales every glow layer. <Code>solid</Code> fills the tube for a
          higher-emphasis call to action.
        </>
      ),
      Demo: NeonButtonIntensityDemo,
      file: demo("neon-button-intensity.tsx"),
      minHeight: 160,
    },
    {
      id: "loading",
      title: "Loading",
      description: (
        <>
          <Code>loading</Code> and <Code>loadingText</Code> come straight from the base Button: the label
          crossfades to a spinner without changing the width, and the button stays focusable.
        </>
      ),
      Demo: NeonButtonLoadingDemo,
      file: demo("neon-button-loading.tsx"),
      minHeight: 160,
    },
  ],
  api: {
    intro: (
      <>
        Also accepts every DuskUI Button prop (<Code>size</Code>, <Code>loading</Code>,{" "}
        <Code>loadingText</Code>, <Code>loaderIcon</Code>) and Motion props such as{" "}
        <Code>whileTap</Code>. <Code>variant</Code> and <Code>asChild</Code> are not supported.
      </>
    ),
    props: [
      { name: "color", type: "string", default: "var(--color-primary)", description: "Any CSS color for the tube, text and glow." },
      { name: "intensity", type: "number", default: "1", description: "Glow strength multiplier. 0 removes the glow." },
      { name: "flicker", type: "boolean", default: "false", description: "Flicker on like a neon tube the first time it scrolls into view." },
      { name: "solid", type: "boolean", default: "false", description: "Filled tube with dark text instead of the outline style." },
      { name: "className", type: "string", description: "Merged with tailwind-merge, so overrides win." },
    ],
  },
  accessibility: [
    "Renders a native <button>, so Enter, Space and focus order work as usual.",
    "Keyboard focus shows the same bright glow as hover, plus a focus ring tinted to the neon color.",
    "Glow layers are aria-hidden and absolutely positioned, so they never shift layout or reach screen readers.",
    "The flicker-on effect has at most two soft dips per second (under the 3-flashes limit), only dims the glow, and is skipped entirely with prefers-reduced-motion.",
    "Text is a light tint of the chosen color for strong contrast on dark backgrounds; check contrast if you place it on light surfaces.",
  ],
};

export function NeonButtonDocs() {
  return <ComponentDocs config={config} />;
}
