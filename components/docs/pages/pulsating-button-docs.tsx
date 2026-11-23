import { ComponentDocs, type DocConfig } from "@/components/docs/component-docs";
import { Code } from "@/components/docs/doc-primitives";

import PulsatingButtonDemo from "@/components/demos/pulsating-button/pulsating-button-demo";
import PulsatingButtonColorsDemo from "@/components/demos/pulsating-button/pulsating-button-colors";
import PulsatingButtonLoadingDemo from "@/components/demos/pulsating-button/pulsating-button-loading";

const demo = (file: string) => `components/demos/pulsating-button/${file}`;

const config: DocConfig = {
  title: "Pulsating Button",
  intro:
    "A React pulsating button that sends out soft expanding rings to draw attention to a call to action. Built on the DuskUI Button with Motion and Tailwind CSS: the pulse pauses on hover and keyboard focus, stops off-screen, and every variant, size and the loading state keep working.",
  tags: ["Built on DuskUI Button", "Any pulse color", "Pauses on hover & focus", "No layout shift", "prefers-reduced-motion"],
  hero: { Demo: PulsatingButtonDemo, file: demo("pulsating-button-demo.tsx") },
  install: {
    registry: "pulsating-button",
    source: "components/dusk/pulsating-button/pulsating-button.tsx",
    deps: "motion",
    note: (
      <>
        Builds on the DuskUI <Code>Button</Code>; the CLI installs it automatically. Installing by hand?
        Add <Code>components/ui/button.tsx</Code> from the Button page first.
      </>
    ),
  },
  usage: {
    filename: "waitlist-cta.tsx",
    code: `import { PulsatingButton } from "@/components/dusk/pulsating-button/pulsating-button"

export function WaitlistCta() {
  return <PulsatingButton size="lg">Join the waitlist</PulsatingButton>
}`,
  },
  examples: [
    {
      id: "colors",
      title: "Colors, speed & spread",
      description: (
        <>
          <Code>pulseColor</Code> takes any CSS color, <Code>duration</Code> sets the seconds per ring and{" "}
          <Code>spread</Code> how far the rings travel. Works with every Button variant and size.
        </>
      ),
      Demo: PulsatingButtonColorsDemo,
      file: demo("pulsating-button-colors.tsx"),
      minHeight: 180,
    },
    {
      id: "loading",
      title: "Loading",
      description: (
        <>
          <Code>loading</Code> comes from the base Button: the label crossfades to a spinner without
          changing the width, and the rings fade out with it.
        </>
      ),
      Demo: PulsatingButtonLoadingDemo,
      file: demo("pulsating-button-loading.tsx"),
      minHeight: 160,
    },
  ],
  api: {
    intro: (
      <>
        Also accepts every DuskUI Button prop (<Code>variant</Code>, <Code>size</Code>,{" "}
        <Code>loading</Code>, <Code>loadingText</Code>, <Code>loaderIcon</Code>) except{" "}
        <Code>asChild</Code>.
      </>
    ),
    props: [
      { name: "pulseColor", type: "string", default: "var(--color-primary)", description: "Any CSS color for the rings." },
      { name: "duration", type: "number", default: "2.4", description: "Seconds for one ring to expand and fade. A second ring follows half a beat later." },
      { name: "spread", type: "number", default: "8", description: "How far the rings travel outwards, in px." },
      { name: "className", type: "string", description: "Merged with tailwind-merge, so overrides win." },
    ],
  },
  accessibility: [
    "Renders a native <button>, so Enter, Space and focus order work as usual, with the standard focus-visible ring.",
    "The pulse fades out on hover and on focus, so it never competes with the focus ring or distracts while the user is about to act.",
    "Rings are an outer box-shadow on an aria-hidden layer, so they take up no space and never reach screen readers.",
    "With prefers-reduced-motion the rings are replaced by a steady thin ring; the animation also stops whenever the button is off-screen.",
    "Pulses are slow fades (under one per second by default), well clear of photosensitivity limits.",
  ],
};

export function PulsatingButtonDocs() {
  return <ComponentDocs config={config} />;
}
