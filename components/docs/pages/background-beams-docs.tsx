import { ComponentDocs, type DocConfig } from "@/components/docs/component-docs";
import { Code } from "@/components/docs/doc-primitives";

import BackgroundBeamsDemo from "@/components/demos/background-beams/background-beams-demo";
import BackgroundBeamsCustom from "@/components/demos/background-beams/background-beams-custom";
import BackgroundBeamsCta from "@/components/demos/background-beams/background-beams-cta";

const demo = (file: string) => `components/demos/background-beams/${file}`;

const config: DocConfig = {
  title: "Background Beams",
  intro:
    "An animated background beams effect for React: thin streaks of light racing along a fan of curved SVG paths, each with a soft tail and a bright head. Seeded so it renders identically on server and client, paused off-screen, and frozen for reduced motion.",
  tags: ["Background", "SVG", "Seeded layout", "Pauses off-screen", "Reduced-motion safe"],
  hero: { Demo: BackgroundBeamsDemo, file: demo("background-beams-demo.tsx"), minHeight: 360 },
  install: {
    registry: "background-beams",
    source: "components/dusk/backgrounds/background-beams.tsx",
    deps: "motion",
    note: (
      <>
        The beams fill their nearest positioned parent, so give the parent <Code>relative</Code> and{" "}
        <Code>overflow-hidden</Code>, and put your content after them with <Code>relative</Code> so it sits on top.
      </>
    ),
  },
  usage: {
    filename: "hero.tsx",
    code: `import { BackgroundBeams } from "@/components/dusk/backgrounds/background-beams"

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <BackgroundBeams />
      <div className="relative">{/* your content */}</div>
    </section>
  )
}`,
  },
  examples: [
    {
      id: "custom",
      title: "Color, count & speed",
      description: (
        <>
          <Code>color</Code> takes any CSS color. <Code>count</Code> sets how many paths fan out, <Code>speed</Code>{" "}
          scales how fast beams travel, and <Code>seed</Code> picks a different but stable layout.
        </>
      ),
      Demo: BackgroundBeamsCustom,
      file: demo("background-beams-custom.tsx"),
      minHeight: 300,
    },
    {
      id: "cta",
      title: "Call to action",
      description: (
        <>
          Set <Code>pathOpacity</Code> to <Code>0</Code> to hide the guide paths and show only moving light, and add a
          gradient scrim on the text side.
        </>
      ),
      Demo: BackgroundBeamsCta,
      file: demo("background-beams-cta.tsx"),
      minHeight: 340,
    },
  ],
  api: {
    intro: (
      <>
        Any other <Code>div</Code> prop is passed to the root. The SVG stretches to the container with non-scaling
        strokes, so lines stay crisp at any aspect ratio.
      </>
    ),
    props: [
      { name: "color", type: "string", default: '"var(--color-primary)"', description: "Beam color. Any CSS color." },
      { name: "count", type: "number", default: "10", description: "Number of curved paths." },
      { name: "speed", type: "number", default: "1", description: "Speed multiplier for the beams." },
      { name: "pathOpacity", type: "number", default: "0.05", description: "Opacity of the faint guide paths, 0 hides them." },
      { name: "seed", type: "number", default: "1", description: "Layout seed; the same seed always draws the same beams." },
      { name: "fade", type: "boolean", default: "true", description: "Fade the beams out toward the edges." },
      { name: "className", type: "string", description: "Merged onto the absolutely positioned root." },
    ],
  },
  accessibility: [
    <>The beams are decorative: they are <Code>aria-hidden</Code> and <Code>pointer-events-none</Code>, so they never reach screen readers or block clicks.</>,
    "With prefers-reduced-motion the timeline is frozen on a still frame with a few beams mid-flight.",
    "The SVG timeline pauses while the beams are off-screen or the tab is hidden.",
    "Keep foreground text on a scrim or card where beams cross it, to maintain contrast.",
  ],
};

export function BackgroundBeamsDocs() {
  return <ComponentDocs config={config} />;
}
