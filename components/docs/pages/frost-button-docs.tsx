import { ComponentDocs, type DocConfig } from "@/components/docs/component-docs";
import { Code } from "@/components/docs/doc-primitives";

import FrostButtonDemo from "@/components/demos/frost-button/frost-button-demo";
import FrostButtonLoading from "@/components/demos/frost-button/frost-button-loading";
import FrostButtonEffects from "@/components/demos/frost-button/frost-button-effects";

const demo = (file: string) => `components/demos/frost-button/${file}`;

const config: DocConfig = {
  title: "Frost Button",
  intro:
    "A frosted-glass button for React, built on the DuskUI Button with Motion and Tailwind CSS. A soft ripple spreads from where you press, an optional faint light sweep runs on hover and focus, and loading states, sizes and every shadcn/ui Button prop keep working.",
  tags: ["Built on Button", "Press ripple", "Light sweep", "Loading state", "prefers-reduced-motion"],
  hero: { Demo: FrostButtonDemo, file: demo("frost-button-demo.tsx"), minHeight: 260 },
  install: {
    registry: "frost-button",
    source: "components/dusk/glass/frost-button.tsx",
    deps: "motion",
    note: (
      <>
        Builds on the DuskUI <Code>Button</Code>; the CLI installs it automatically. Installing by hand?
        Add <Code>components/ui/button.tsx</Code> from the Button page first.
      </>
    ),
  },
  usage: {
    filename: "hero-actions.tsx",
    code: `import { FrostButton } from "@/components/dusk/glass/frost-button"

export function HeroActions() {
  return (
    <FrostButton size="lg" tone="primary" className="rounded-full">
      Start building
    </FrostButton>
  )
}`,
  },
  examples: [
    {
      id: "loading",
      title: "Loading",
      description: (
        <>
          <Code>loading</Code> and <Code>loadingText</Code> come straight from the base Button: the
          content crossfades to a spinner without changing width, and the button stays focusable.
        </>
      ),
      Demo: FrostButtonLoading,
      file: demo("frost-button-loading.tsx"),
      minHeight: 220,
    },
    {
      id: "effects",
      title: "Effects & icon buttons",
      description: (
        <>
          Choose the interaction with <Code>effect</Code>: <Code>sweep</Code>, <Code>ripple</Code>,{" "}
          <Code>both</Code> or <Code>none</Code>. Icon sizes work too — give them an{" "}
          <Code>aria-label</Code>.
        </>
      ),
      Demo: FrostButtonEffects,
      file: demo("frost-button-effects.tsx"),
      minHeight: 260,
    },
  ],
  api: {
    intro: (
      <>
        Accepts every DuskUI <Code>Button</Code> prop except <Code>variant</Code> — including{" "}
        <Code>size</Code>, <Code>loading</Code>, <Code>loadingText</Code> and <Code>asChild</Code>{" "}
        (effects are skipped with <Code>asChild</Code>, since Slot needs a single child).
      </>
    ),
    props: [
      { name: "tone", type: '"clear" | "dark" | "primary"', default: '"clear"', description: "White frost, smoked glass or a primary-tinted pane." },
      { name: "effect", type: '"sweep" | "ripple" | "both" | "none"', default: '"ripple"', description: "Ripple on press, light sweep on hover/focus, both or neither." },
      { name: "loading", type: "boolean", default: "false", description: "Spinner without a width change; clicks are blocked but focus is kept." },
    ],
  },
  accessibility: [
    "It's the DuskUI Button underneath: a native <button> with focus-visible ring, aria-busy and aria-disabled while loading.",
    "Keyboard presses (Enter / Space) get the ripple from the center, and keyboard focus triggers the light sweep when it is on.",
    "White text gets a soft text-shadow, and browsers without backdrop-filter get an opaque fill, so the label stays readable on any background.",
    "With reduced motion the sweep is skipped and the ripple becomes a soft flash.",
  ],
};

export function FrostButtonDocs() {
  return <ComponentDocs config={config} />;
}
