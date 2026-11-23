import { ComponentDocs, type DocConfig } from "@/components/docs/component-docs";
import { Code } from "@/components/docs/doc-primitives";

import MatrixRainDemo from "@/components/demos/matrix-rain/matrix-rain-demo";
import MatrixRainCustomDemo from "@/components/demos/matrix-rain/matrix-rain-custom";
import MatrixRainPausedDemo from "@/components/demos/matrix-rain/matrix-rain-paused";

const demo = (file: string) => `components/demos/matrix-rain/${file}`;

const config: DocConfig = {
  title: "Matrix Rain",
  intro:
    "The classic Matrix digital rain as a React component: falling katakana and digits drawn on a high-DPI <canvas>, with configurable color, font size, speed, trail fade and characters. Drop it into any container as an animated hacker background — it fills its parent and pauses itself when off-screen.",
  tags: ["Canvas 2D", "devicePixelRatio aware", "Fills its parent", "Pauses off-screen", "prefers-reduced-motion"],
  hero: { Demo: MatrixRainDemo, file: demo("matrix-rain-demo.tsx"), minHeight: 400 },
  install: {
    registry: "matrix-rain",
    source: "components/dusk/hacker/matrix-rain.tsx",
    deps: "motion",
    note: (
      <>
        The rain is <Code>absolute inset-0</Code>, so give its container <Code>relative</Code> (and a
        height). The canvas is transparent: the trails fade to whatever background is behind it.
      </>
    ),
  },
  usage: {
    filename: "hero.tsx",
    code: `import { MatrixRain } from "@/components/dusk/hacker/matrix-rain"

export function Hero() {
  return (
    <section className="relative h-[480px] bg-black">
      <MatrixRain />
      <h1 className="relative">Wake up, Neo</h1>
    </section>
  )
}`,
  },
  examples: [
    {
      id: "custom",
      title: "Colors, size & characters",
      description: (
        <>
          Any CSS <Code>color</Code> (theme variables too), a bright <Code>headColor</Code>, smaller or
          larger <Code>fontSize</Code>, <Code>speed</Code>, <Code>fade</Code> for trail length and custom{" "}
          <Code>characters</Code> — like binary.
        </>
      ),
      Demo: MatrixRainCustomDemo,
      file: demo("matrix-rain-custom.tsx"),
      minHeight: 400,
    },
    {
      id: "paused",
      title: "Pause & mask",
      description: (
        <>
          <Code>paused</Code> freezes the current frame without restarting. Style the layer with{" "}
          <Code>className</Code> — here a mask fades it out toward the bottom.
        </>
      ),
      Demo: MatrixRainPausedDemo,
      file: demo("matrix-rain-paused.tsx"),
      minHeight: 360,
    },
  ],
  api: {
    intro: <>Also accepts any <Code>&lt;div&gt;</Code> prop for the wrapping layer.</>,
    props: [
      { name: "color", type: "string", default: '"var(--color-primary)"', description: "Glyph color. Any CSS color, including theme variables." },
      { name: "headColor", type: "string", default: '"#eafff6"', description: "Color of the leading glyph of each stream." },
      { name: "fontSize", type: "number", default: "16", description: "Glyph size in px; also the column width." },
      { name: "speed", type: "number", default: "1", description: "Speed multiplier." },
      { name: "fade", type: "number", default: "0.08", description: "Trail fade per tick, 0–1. Lower means longer trails." },
      { name: "density", type: "number", default: "0.4", description: "How busy the rain is, 0–1." },
      { name: "characters", type: "string", default: "katakana + 0–9", description: "Characters to rain." },
      { name: "paused", type: "boolean", default: "false", description: "Freeze the current frame." },
    ],
  },
  accessibility: [
    "The canvas is purely decorative: aria-hidden and pointer-events-none, so content on top stays clickable and readable.",
    "Animation stops while the rain is off-screen or the tab is hidden, and the animation frame is cancelled on unmount.",
    "With prefers-reduced-motion a single still frame is drawn instead of the animation.",
    "Glyphs move but never flash; keep enough contrast for text placed on top (e.g. a dark gradient behind headings).",
    "Rendering uses a fixed 30 ticks per second, so it looks the same on 60 Hz and 120 Hz screens and never re-renders React.",
  ],
};

export function MatrixRainDocs() {
  return <ComponentDocs config={config} />;
}
