import { ComponentDocs, type DocConfig } from "@/components/docs/component-docs";
import { Code } from "@/components/docs/doc-primitives";

import RainbowButtonDemo from "@/components/demos/rainbow-button/rainbow-button-demo";
import RainbowButtonColorsDemo from "@/components/demos/rainbow-button/rainbow-button-colors";
import RainbowButtonLoadingDemo from "@/components/demos/rainbow-button/rainbow-button-loading";

const demo = (file: string) => `components/demos/rainbow-button/${file}`;

const config: DocConfig = {
  title: "Rainbow Button",
  intro:
    "A React rainbow button with a slowly scrolling gradient border, built on the DuskUI Button with Motion and Tailwind CSS. Pick a dark-filled or outline style, pass your own colors, and keep the width-stable loading state and every shadcn/ui Button prop.",
  tags: ["Built on DuskUI Button", "Animated gradient border", "Custom colors", "Loading state", "prefers-reduced-motion"],
  hero: { Demo: RainbowButtonDemo, file: demo("rainbow-button-demo.tsx") },
  install: {
    registry: "rainbow-button",
    source: "components/dusk/rainbow-button/rainbow-button.tsx",
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
    code: `import { RainbowButton } from "@/components/dusk/rainbow-button/rainbow-button"

export function HeroCta() {
  return <RainbowButton size="lg">Get started</RainbowButton>
}`,
  },
  examples: [
    {
      id: "colors",
      title: "Colors & shape",
      description: (
        <>
          Pass any list of CSS colors to <Code>colors</Code> — the loop is seamless. <Code>duration</Code>{" "}
          sets the seconds per cycle, <Code>borderWidth</Code> the line, and <Code>className</Code> can make
          it a pill.
        </>
      ),
      Demo: RainbowButtonColorsDemo,
      file: demo("rainbow-button-colors.tsx"),
      minHeight: 160,
    },
    {
      id: "loading",
      title: "Loading",
      description: (
        <>
          The border is drawn on the button itself, so it keeps moving while{" "}
          <Code>loading</Code> crossfades the label to a spinner without changing the width.
        </>
      ),
      Demo: RainbowButtonLoadingDemo,
      file: demo("rainbow-button-loading.tsx"),
      minHeight: 160,
    },
  ],
  api: {
    intro: (
      <>
        Also accepts every DuskUI Button prop (<Code>size</Code>, <Code>loading</Code>,{" "}
        <Code>loadingText</Code>, <Code>loaderIcon</Code>) and Motion props such as <Code>whileTap</Code>.{" "}
        <Code>asChild</Code> is not supported.
      </>
    ),
    props: [
      { name: "variant", type: '"default" | "outline"', default: '"default"', description: "Dark fill, or a see-through fill with a subtle hover background." },
      { name: "colors", type: "string[]", default: "5-color rainbow", description: "Gradient colors in order; the last blends back into the first." },
      { name: "duration", type: "number", default: "6", description: "Seconds for the gradient to scroll one full cycle." },
      { name: "borderWidth", type: "number", default: "1", description: "Border width in px." },
      { name: "className", type: "string", description: "Merged with tailwind-merge, so overrides such as rounded-full win." },
    ],
  },
  accessibility: [
    "Renders a native <button>, so Enter, Space and focus order work as usual, with the standard DuskUI focus-visible ring.",
    "Keyboard focus shows the standard focus ring.",
    "The border is a pseudo-element, so they never reach screen readers or shift layout.",
    "Loading keeps the button focusable (aria-busy + aria-disabled) instead of disabling it.",
    "With prefers-reduced-motion the gradient stays still; it also pauses whenever the button is off-screen.",
  ],
};

export function RainbowButtonDocs() {
  return <ComponentDocs config={config} />;
}
