import { ComponentDocs, type DocConfig } from "@/components/docs/component-docs";
import { Code } from "@/components/docs/doc-primitives";

import FlickeringGridDemo from "@/components/demos/flickering-grid/flickering-grid-demo";
import FlickeringGridText from "@/components/demos/flickering-grid/flickering-grid-text";
import FlickeringGridColors from "@/components/demos/flickering-grid/flickering-grid-colors";

const demo = (file: string) => `components/demos/flickering-grid/${file}`;

const config: DocConfig = {
  title: "Flickering Grid",
  intro:
    "A flickering grid background for React: a canvas of tiny squares that twinkle on and off at random, like a server rack or a field of pixels. Seeded so every mount starts from the same pattern, it can also be masked to a word so the squares spell out text.",
  tags: ["Background", "Canvas", "Text mask", "Seeded pattern", "High-DPI", "Pauses off-screen", "Reduced-motion safe"],
  hero: { Demo: FlickeringGridDemo, file: demo("flickering-grid-demo.tsx"), minHeight: 340 },
  install: {
    registry: "flickering-grid",
    source: "components/dusk/flickering-grid/flickering-grid.tsx",
    deps: "motion",
    note: (
      <>
        The grid fills its nearest positioned parent, so give the parent <Code>relative</Code> and{" "}
        <Code>overflow-hidden</Code>. Fade the edges with a Tailwind <Code>mask-image</Code> class on the grid itself.
      </>
    ),
  },
  usage: {
    filename: "status.tsx",
    code: `import { FlickeringGrid } from "@/components/dusk/flickering-grid/flickering-grid"

export function Status() {
  return (
    <section className="relative overflow-hidden">
      <FlickeringGrid squareSize={4} gap={6} maxOpacity={0.3} />
      <div className="relative">{/* your content */}</div>
    </section>
  )
}`,
  },
  examples: [
    {
      id: "text",
      title: "Text mask",
      description: (
        <>
          Pass <Code>text</Code> and squares are only drawn inside the letters. The word is scaled to fit unless you
          set <Code>fontSize</Code>; <Code>fontWeight</Code> and <Code>fontFamily</Code> shape it. The canvas is
          hidden from assistive tech, so repeat the word in an <Code>sr-only</Code> element.
        </>
      ),
      Demo: FlickeringGridText,
      file: demo("flickering-grid-text.tsx"),
      minHeight: 280,
    },
    {
      id: "sizes",
      title: "Squares & color",
      description: (
        <>
          <Code>squareSize</Code> and <Code>gap</Code> set the pitch, <Code>maxOpacity</Code> the brightest square
          and <Code>flickerChance</Code> how often each square changes per second. <Code>seed</Code> picks a
          different, stable pattern.
        </>
      ),
      Demo: FlickeringGridColors,
      file: demo("flickering-grid-colors.tsx"),
      minHeight: 280,
    },
  ],
  api: {
    intro: (
      <>
        Any other <Code>div</Code> prop is passed to the root. Squares are drawn to a single <Code>{"<canvas>"}</Code>{" "}
        sized to the device pixel ratio and redrawn on resize.
      </>
    ),
    props: [
      { name: "squareSize", type: "number", default: "4", description: "Side of each square in px." },
      { name: "gap", type: "number", default: "6", description: "Space between squares in px." },
      { name: "flickerChance", type: "number", default: "0.15", description: "Chance per square per second of changing brightness; 0 holds it still." },
      { name: "color", type: "string", default: '"rgb(255 255 255)"', description: "Square color. Any CSS color, including theme variables." },
      { name: "maxOpacity", type: "number", default: "0.15", description: "Opacity of the brightest square, 0–1." },
      { name: "seed", type: "number", default: "1", description: "Seed for a different, but stable, pattern." },
      { name: "text", type: "string", description: "Only draw squares inside this text." },
      { name: "fontSize", type: "number", default: "fit", description: "Mask text size in px; fits the container when omitted." },
      { name: "fontWeight", type: "number | string", default: "700", description: "Mask text weight." },
      { name: "fontFamily", type: "string", default: "inherited", description: "Mask text font family." },
      { name: "className", type: "string", description: "Merged onto the absolutely positioned root." },
    ],
  },
  accessibility: [
    <>The grid is decorative: it is <Code>aria-hidden</Code> and <Code>pointer-events-none</Code>. With <Code>text</Code>, render the same words in real (or <Code>sr-only</Code>) text.</>,
    "With prefers-reduced-motion one still frame of the pattern is drawn and nothing flickers.",
    "Drawing stops while the grid is off-screen or the tab is hidden.",
    "Flicker is gentle and random rather than a strobe; keep flickerChance modest and maxOpacity low behind body copy.",
  ],
};

export function FlickeringGridDocs() {
  return <ComponentDocs config={config} />;
}
