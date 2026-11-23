import { ComponentDocs, type DocConfig } from "@/components/docs/component-docs";
import { Code } from "@/components/docs/doc-primitives";

import AuroraBackgroundDemo from "@/components/demos/aurora-background/aurora-background-demo";
import AuroraBackgroundColors from "@/components/demos/aurora-background/aurora-background-colors";
import AuroraBackgroundSubtle from "@/components/demos/aurora-background/aurora-background-subtle";

const demo = (file: string) => `components/demos/aurora-background/${file}`;

const config: DocConfig = {
  title: "Aurora Background",
  intro:
    "An animated aurora background for React: soft, blurred bands of color that drift and sway like the northern lights. Built with Motion and Tailwind CSS, it animates only GPU-friendly transforms, pauses off-screen and holds a still frame for reduced motion.",
  tags: ["Background", "Gradient", "GPU transforms", "Pauses off-screen", "Reduced-motion safe"],
  hero: { Demo: AuroraBackgroundDemo, file: demo("aurora-background-demo.tsx"), minHeight: 360 },
  install: {
    registry: "aurora-background",
    source: "components/dusk/backgrounds/aurora-background.tsx",
    deps: "motion",
    note: (
      <>
        The aurora fills its nearest positioned parent, so give the parent <Code>relative</Code> and{" "}
        <Code>overflow-hidden</Code>, and put your content after it with <Code>relative</Code> so it sits on top.
      </>
    ),
  },
  usage: {
    filename: "hero.tsx",
    code: `import { AuroraBackground } from "@/components/dusk/backgrounds/aurora-background"

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <AuroraBackground />
      <div className="relative">{/* your content */}</div>
    </section>
  )
}`,
  },
  examples: [
    {
      id: "colors",
      title: "Custom palettes",
      description: (
        <>
          Pass any CSS colors to <Code>colors</Code>; each one becomes a band, up to six. Colors blend with a screen
          blend mode, so overlapping bands glow brighter.
        </>
      ),
      Demo: AuroraBackgroundColors,
      file: demo("aurora-background-colors.tsx"),
      minHeight: 300,
    },
    {
      id: "subtle",
      title: "Subtle backdrop",
      description: (
        <>
          Lower <Code>intensity</Code> and <Code>speed</Code> and raise <Code>blur</Code> for a quiet backdrop behind
          forms and dialogs.
        </>
      ),
      Demo: AuroraBackgroundSubtle,
      file: demo("aurora-background-subtle.tsx"),
      minHeight: 340,
    },
  ],
  api: {
    intro: (
      <>
        Any other <Code>div</Code> prop is passed to the root. Band positions are fixed per index, so the same palette
        always draws the same sky on the server and the client.
      </>
    ),
    props: [
      { name: "colors", type: "string[]", default: '["var(--color-primary)", "#22d3ee", "#818cf8", "#2dd4bf"]', description: "Band colors, any CSS color. One band per color, up to six." },
      { name: "intensity", type: "number", default: "0.6", description: "Overall brightness, from 0 to 1." },
      { name: "speed", type: "number", default: "1", description: "Speed multiplier for the drift." },
      { name: "blur", type: "number", default: "48", description: "Softness of the bands in px. 0 turns the blur filter off." },
      { name: "fade", type: "boolean", default: "true", description: "Fade the aurora out toward the bottom and sides." },
      { name: "className", type: "string", description: "Merged onto the absolutely positioned root." },
    ],
  },
  accessibility: [
    <>The aurora is decorative: it is <Code>aria-hidden</Code> and <Code>pointer-events-none</Code>, so it never reaches screen readers or blocks clicks.</>,
    "With prefers-reduced-motion the bands stay still in their resting positions; the colors remain.",
    "Animation pauses while the aurora is off-screen or the tab is hidden, saving battery.",
    "Bright palettes can reduce contrast; keep text on a card or lower the intensity.",
  ],
};

export function AuroraBackgroundDocs() {
  return <ComponentDocs config={config} />;
}
