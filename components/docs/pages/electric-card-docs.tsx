import { ComponentDocs, type DocConfig } from "@/components/docs/component-docs";
import { Code } from "@/components/docs/doc-primitives";

import ElectricCardDemo from "@/components/demos/electric-card/electric-card-demo";
import ElectricCardActiveDemo from "@/components/demos/electric-card/electric-card-active";
import ElectricCardChaosDemo from "@/components/demos/electric-card/electric-card-chaos";

const demo = (file: string) => `components/demos/electric-card/${file}`;

const config: DocConfig = {
  title: "Electric Card",
  intro:
    "A React card with an electric border effect: procedurally generated SVG lightning crackles around the edge on hover or keyboard focus. Built with Tailwind CSS and Motion, with tunable chaos, arc count, speed and color.",
  tags: ["Procedural SVG lightning", "Hover & focus-within", "No re-renders", "Any CSS color", "prefers-reduced-motion"],
  hero: { Demo: ElectricCardDemo, file: demo("electric-card-demo.tsx"), minHeight: 340 },
  install: {
    registry: "electric-card",
    source: "components/dusk/neon/electric-card.tsx",
    deps: "motion",
  },
  usage: {
    filename: "feature-card.tsx",
    code: `import { ElectricCard } from "@/components/dusk/neon/electric-card"

export function FeatureCard() {
  return (
    <ElectricCard color="#22d3ee" className="max-w-sm">
      <h3 className="font-semibold">Realtime sync</h3>
      <p className="text-sm text-white/60">Changes land everywhere in milliseconds.</p>
    </ElectricCard>
  )
}`,
  },
  examples: [
    {
      id: "active",
      title: "Always on",
      description: (
        <>
          Set <Code>active</Code> to keep the card charged without hover — useful for live or highlighted
          states. The lightning follows any <Code>radius</Code>.
        </>
      ),
      Demo: ElectricCardActiveDemo,
      file: demo("electric-card-active.tsx"),
      minHeight: 240,
    },
    {
      id: "chaos",
      title: "Calm to storm",
      description: (
        <>
          <Code>chaos</Code> sets how far bolts jump off the border, <Code>arcs</Code> how many crawl around
          it and <Code>speed</Code> how fast they travel.
        </>
      ),
      Demo: ElectricCardChaosDemo,
      file: demo("electric-card-chaos.tsx"),
      minHeight: 220,
    },
  ],
  api: {
    intro: <>Also accepts any <Code>&lt;div&gt;</Code> prop. Padding, width and background are regular classes.</>,
    props: [
      { name: "color", type: "string", default: "var(--color-primary)", description: "Any CSS color for the lightning." },
      { name: "chaos", type: "number", default: "4", description: "How far bolts jump off the border, in px." },
      { name: "arcs", type: "number", default: "1", description: "Number of bright arcs crawling around the border." },
      { name: "interval", type: "number", default: "110", description: "Milliseconds between new lightning shapes (min 60)." },
      { name: "speed", type: "number", default: "0.25", description: "Laps per second the arcs crawl." },
      { name: "active", type: "boolean", default: "false", description: "Keep the effect on instead of only on hover / focus." },
      { name: "radius", type: "number", default: "12", description: "Corner radius in px; the lightning follows it." },
    ],
  },
  accessibility: [
    "The lightning SVG is aria-hidden and pointer-events-none; the card's content keeps its own semantics.",
    "The effect starts when keyboard focus moves into the card, not only on hover.",
    "Bolts change shape but never blink on and off and the overall brightness stays constant, so there is no strobing.",
    "With prefers-reduced-motion the card shows a single still frame of lightning instead of the crackle.",
    "Paths are written directly to the DOM and the timer only runs while the card is active and on-screen.",
  ],
};

export function ElectricCardDocs() {
  return <ComponentDocs config={config} />;
}
