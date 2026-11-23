import { ComponentDocs, type DocConfig } from "@/components/docs/component-docs";
import { Code } from "@/components/docs/doc-primitives";

import BinaryRainDemo from "@/components/demos/binary-rain/binary-rain-demo";
import BinaryRainCustom from "@/components/demos/binary-rain/binary-rain-custom";
import BinaryRainLogin from "@/components/demos/binary-rain/binary-rain-login";

const demo = (file: string) => `components/demos/binary-rain/${file}`;

const config: DocConfig = {
  category: "Techy",
  title: "Binary Rain",
  intro:
    "A binary rain background for React: columns of falling 0s and 1s with bright heads, fading trails and flickering glyphs, drawn on a high-DPI canvas. A fast, accessible take on the classic hacker effect for heroes, login screens and 404 pages.",
  tags: ["Background", "Canvas", "High-DPI", "Pauses off-screen", "Reduced-motion safe"],
  hero: { Demo: BinaryRainDemo, file: demo("binary-rain-demo.tsx"), minHeight: 360 },
  install: {
    registry: "binary-rain",
    source: "components/dusk/techy/binary-rain.tsx",
    deps: "motion",
    note: (
      <>
        The rain fills its nearest positioned parent. A radial gradient of{" "}
        <Code>var(--color-background)</Code> behind your text keeps it readable.
      </>
    ),
  },
  usage: {
    filename: "not-found.tsx",
    code: `import { BinaryRain } from "@/components/dusk/techy/binary-rain"

export default function NotFound() {
  return (
    <main className="relative grid min-h-svh place-items-center overflow-hidden">
      <BinaryRain />
      <h1 className="relative text-4xl font-bold">404</h1>
    </main>
  )
}`,
  },
  examples: [
    {
      id: "custom",
      title: "Colors, sizes & characters",
      description: (
        <>
          Tune <Code>fontSize</Code>, <Code>speed</Code> and <Code>density</Code>, or rain any glyphs with{" "}
          <Code>characters</Code> — hex, katakana, emoji.
        </>
      ),
      Demo: BinaryRainCustom,
      file: demo("binary-rain-custom.tsx"),
      minHeight: 300,
    },
    {
      id: "login",
      title: "Behind a form",
      description: (
        <>
          Keep it calm behind interactive UI: a low <Code>density</Code>, a slower <Code>speed</Code> and some
          opacity. The form stays fully clickable.
        </>
      ),
      Demo: BinaryRainLogin,
      file: demo("binary-rain-login.tsx"),
      minHeight: 440,
    },
  ],
  api: {
    intro: <>Any other <Code>div</Code> prop is passed to the root.</>,
    props: [
      { name: "color", type: "string", default: '"var(--color-primary)"', description: "Glyph color. Any CSS color, including variables and oklch()." },
      { name: "fontSize", type: "number", default: "14", description: "Glyph size in px; also the column width." },
      { name: "speed", type: "number", default: "1", description: "Fall speed multiplier." },
      { name: "density", type: "number", default: "0.6", description: "Share of columns raining at once, from 0 to 1." },
      { name: "characters", type: "string", default: '"01"', description: "The glyphs to rain." },
      { name: "className", type: "string", description: "Merged onto the absolutely positioned root." },
    ],
  },
  accessibility: [
    <>Decorative only: the root is <Code>aria-hidden</Code> and <Code>pointer-events-none</Code>, so the glyphs are never read out.</>,
    "With prefers-reduced-motion a single still frame is drawn instead of the animation.",
    "The loop stops while off-screen or in a hidden tab and is cancelled on unmount; glyphs are pre-rendered once so each frame is cheap.",
    "Rapidly flickering content can be distracting — keep density low behind long-form text.",
  ],
};

export function BinaryRainDocs() {
  return <ComponentDocs config={config} />;
}
