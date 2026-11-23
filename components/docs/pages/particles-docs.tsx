import { ComponentDocs, type DocConfig } from "@/components/docs/component-docs";
import { Code } from "@/components/docs/doc-primitives";

import ParticlesDemo from "@/components/demos/particles/particles-demo";
import ParticlesAttract from "@/components/demos/particles/particles-attract";
import ParticlesStarfield from "@/components/demos/particles/particles-starfield";

const demo = (file: string) => `components/demos/particles/${file}`;

const config: DocConfig = {
  title: "Particles",
  intro:
    "An interactive particles background for React: a drifting canvas field that parts around the cursor or gathers toward it, with optional constellation lines between neighbours. Sharp on high-DPI screens, resizes with its container and pauses off-screen.",
  tags: ["Background", "Canvas", "Cursor interaction", "Pauses off-screen", "Reduced-motion safe"],
  hero: { Demo: ParticlesDemo, file: demo("particles-demo.tsx"), minHeight: 360 },
  install: {
    registry: "particles",
    source: "components/dusk/backgrounds/particles.tsx",
    deps: "motion",
    note: (
      <>
        The canvas fills its nearest positioned parent, so give the parent <Code>relative</Code> and{" "}
        <Code>overflow-hidden</Code>, and put your content after it with <Code>relative</Code> so it sits on top. The
        pointer is tracked on the window, so content on top stays fully clickable.
      </>
    ),
  },
  usage: {
    filename: "hero.tsx",
    code: `import { Particles } from "@/components/dusk/backgrounds/particles"

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <Particles connect />
      <div className="relative">{/* your content */}</div>
    </section>
  )
}`,
  },
  examples: [
    {
      id: "attract",
      title: "Attract",
      description: (
        <>
          <Code>interaction=&quot;attract&quot;</Code> pulls particles toward the cursor. <Code>radius</Code> and{" "}
          <Code>strength</Code> set its reach and pull, and a low <Code>ease</Code> makes particles trail behind.
        </>
      ),
      Demo: ParticlesAttract,
      file: demo("particles-attract.tsx"),
      minHeight: 320,
    },
    {
      id: "starfield",
      title: "Starfield",
      description: (
        <>
          Many tiny particles, a slow <Code>speed</Code> and <Code>interaction=&quot;none&quot;</Code> make a calm,
          twinkling starfield.
        </>
      ),
      Demo: ParticlesStarfield,
      file: demo("particles-starfield.tsx"),
      minHeight: 320,
    },
  ],
  api: {
    intro: (
      <>
        Any other <Code>div</Code> prop is passed to the root. Positions are stored relative to the container, so
        resizing never reshuffles the field. Connecting lines compare every pair, so keep <Code>quantity</Code> under a
        couple of hundred when <Code>connect</Code> is on.
      </>
    ),
    props: [
      { name: "quantity", type: "number", default: "80", description: "Number of particles." },
      { name: "color", type: "string", default: '"var(--color-primary)"', description: "Particle and line color. Any CSS color." },
      { name: "size", type: "number", default: "1.4", description: "Average particle radius in px." },
      { name: "ease", type: "number", default: "0.08", description: "How quickly particles react and settle, from 0 to 1." },
      { name: "interaction", type: '"repel" | "attract" | "none"', default: '"repel"', description: "What the cursor does to nearby particles." },
      { name: "radius", type: "number", default: "120", description: "Reach of the cursor in px." },
      { name: "strength", type: "number", default: "1", description: "Strength of the push or pull." },
      { name: "connect", type: "boolean", default: "false", description: "Draw lines between nearby particles." },
      { name: "connectDistance", type: "number", default: "110", description: "Maximum length of a connecting line in px." },
      { name: "speed", type: "number", default: "1", description: "Drift speed multiplier; 0 holds particles in place." },
      { name: "seed", type: "number", default: "1", description: "Layout seed; the same seed always scatters the same field." },
      { name: "className", type: "string", description: "Merged onto the absolutely positioned root." },
    ],
  },
  accessibility: [
    <>The canvas is decorative: it is <Code>aria-hidden</Code> and <Code>pointer-events-none</Code>, so it never reaches screen readers or blocks clicks.</>,
    "With prefers-reduced-motion a single still frame is drawn and the cursor interaction is turned off.",
    "The animation loop stops while the canvas is off-screen or the tab is hidden.",
    "Keep foreground text on a card or away from dense areas to maintain contrast.",
  ],
};

export function ParticlesDocs() {
  return <ComponentDocs config={config} />;
}
