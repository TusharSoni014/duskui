import { ComponentDocs, type DocConfig } from "@/components/docs/component-docs";
import { Code } from "@/components/docs/doc-primitives";

import WavyBackgroundDemo from "@/components/demos/wavy-background/wavy-background-demo";
import WavyBackgroundColors from "@/components/demos/wavy-background/wavy-background-colors";
import WavyBackgroundLines from "@/components/demos/wavy-background/wavy-background-lines";

const demo = (file: string) => `components/demos/wavy-background/${file}`;

const config: DocConfig = {
  title: "Wavy Background",
  intro:
    "An animated wavy background for React: layered, flowing waves in your own colors, drawn on a canvas from built-in seeded noise and softened with a blur. No dependencies for the noise, deterministic on every mount, and paused when nobody can see it.",
  tags: ["Background", "Canvas", "Built-in noise", "Custom palette", "High-DPI", "Pauses off-screen", "Reduced-motion safe"],
  hero: { Demo: WavyBackgroundDemo, file: demo("wavy-background-demo.tsx"), minHeight: 400 },
  install: {
    registry: "wavy-background",
    source: "components/dusk/wavy-background/wavy-background.tsx",
    deps: "motion",
    note: (
      <>
        The waves fill their nearest positioned parent, so give the parent <Code>relative</Code> and{" "}
        <Code>overflow-hidden</Code>, and put your content after it with <Code>relative</Code>.
      </>
    ),
  },
  usage: {
    filename: "hero.tsx",
    code: `import { WavyBackground } from "@/components/dusk/wavy-background/wavy-background"

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <WavyBackground colors={["#34d399", "#22d3ee", "#818cf8"]} />
      <div className="relative">{/* your content */}</div>
    </section>
  )
}`,
  },
  examples: [
    {
      id: "colors",
      title: "Palette & blur",
      description: (
        <>
          One wave is drawn per entry in <Code>colors</Code>, back to front. A wider <Code>waveWidth</Code> with a
          bigger <Code>blur</Code> melts them into a glow; <Code>seed</Code> picks a different set of waves.
        </>
      ),
      Demo: WavyBackgroundColors,
      file: demo("wavy-background-colors.tsx"),
      minHeight: 340,
    },
    {
      id: "lines",
      title: "Crisp lines",
      description: (
        <>
          <Code>blur={"{0}"}</Code> and a thin <Code>waveWidth</Code> turn the waves into flowing strands.{" "}
          <Code>amplitude</Code> sets how far they swing, as a fraction of the height.
        </>
      ),
      Demo: WavyBackgroundLines,
      file: demo("wavy-background-lines.tsx"),
      minHeight: 300,
    },
  ],
  api: {
    intro: (
      <>
        Any other <Code>div</Code> prop is passed to the root. The blur is a CSS filter on the canvas, which overhangs
        the sides so waves don&apos;t fade at the edges.
      </>
    ),
    props: [
      { name: "colors", type: "string[]", default: "mint, sky, indigo", description: "One wave per color, back to front. Any CSS colors." },
      { name: "waveWidth", type: "number", default: "32", description: "Thickness of each wave in px." },
      { name: "blur", type: "number", default: "16", description: "Softness in px; 0 keeps the waves crisp." },
      { name: "speed", type: "number", default: "0.7", description: "Flow speed multiplier; 0 holds the waves still." },
      { name: "waveOpacity", type: "number", default: "0.25", description: "Opacity of each wave, 0–1." },
      { name: "amplitude", type: "number", default: "0.2", description: "Vertical swing as a fraction of the container height." },
      { name: "seed", type: "number", default: "1", description: "Seed for a different, but stable, set of waves." },
      { name: "className", type: "string", description: "Merged onto the absolutely positioned root." },
    ],
  },
  accessibility: [
    <>The waves are decorative: the root is <Code>aria-hidden</Code> and <Code>pointer-events-none</Code>.</>,
    "With prefers-reduced-motion a single still frame is drawn.",
    "Drawing stops while the waves are off-screen or the tab is hidden.",
    "Waves run behind the middle of the container; lower waveOpacity or add a text shadow if copy sits on top of bright colors.",
  ],
};

export function WavyBackgroundDocs() {
  return <ComponentDocs config={config} />;
}
