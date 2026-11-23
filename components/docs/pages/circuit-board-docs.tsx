import { ComponentDocs, type DocConfig } from "@/components/docs/component-docs";
import { Code } from "@/components/docs/doc-primitives";

import CircuitBoardDemo from "@/components/demos/circuit-board/circuit-board-demo";
import CircuitBoardColors from "@/components/demos/circuit-board/circuit-board-colors";
import CircuitBoardDense from "@/components/demos/circuit-board/circuit-board-dense";

const demo = (file: string) => `components/demos/circuit-board/${file}`;

const config: DocConfig = {
  title: "Circuit Board",
  intro:
    "An animated circuit board background for React: 45°-routed PCB traces with solder pads and small pulses travelling along them. Built with SVG and Tailwind CSS, seeded so it renders the same every time, and paused off-screen.",
  tags: ["Background", "SVG", "Seeded layout", "Pauses off-screen", "Reduced-motion safe"],
  hero: { Demo: CircuitBoardDemo, file: demo("circuit-board-demo.tsx"), minHeight: 360 },
  install: {
    registry: "circuit-board",
    source: "components/dusk/techy/circuit-board.tsx",
    deps: "motion",
    note: (
      <>
        The board fills its nearest positioned parent, so give the parent <Code>relative</Code> and{" "}
        <Code>overflow-hidden</Code>, and put your content after it with <Code>relative</Code> so it sits
        on top.
      </>
    ),
  },
  usage: {
    filename: "hero.tsx",
    code: `import { CircuitBoard } from "@/components/dusk/techy/circuit-board"

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <CircuitBoard />
      <div className="relative">{/* your content */}</div>
    </section>
  )
}`,
  },
  examples: [
    {
      id: "colors",
      title: "Colors & seeds",
      description: (
        <>
          <Code>color</Code> takes any CSS color, including variables. Change <Code>seed</Code> to get a
          different, but stable, layout.
        </>
      ),
      Demo: CircuitBoardColors,
      file: demo("circuit-board-colors.tsx"),
      minHeight: 300,
    },
    {
      id: "dense",
      title: "Dense board",
      description: (
        <>
          Raise <Code>density</Code>, shrink <Code>cellSize</Code> and turn off <Code>fade</Code> for an
          edge-to-edge board. <Code>speed</Code> is in pixels per second.
        </>
      ),
      Demo: CircuitBoardDense,
      file: demo("circuit-board-dense.tsx"),
      minHeight: 340,
    },
  ],
  api: {
    intro: (
      <>
        Any other <Code>div</Code> prop is passed to the root. The layout is generated in fixed-size chunks,
        so resizing the container only adds or removes chunks instead of reshuffling the board.
      </>
    ),
    props: [
      { name: "color", type: "string", default: '"var(--color-primary)"', description: "Trace and pulse color. Any CSS color." },
      { name: "density", type: "number", default: "0.4", description: "How many traces to route, from 0 to 1." },
      { name: "speed", type: "number", default: "90", description: "Pulse speed in px per second." },
      { name: "cellSize", type: "number", default: "20", description: "Grid spacing between traces in px." },
      { name: "seed", type: "number", default: "1", description: "Layout seed; the same seed always draws the same board." },
      { name: "fade", type: "boolean", default: "true", description: "Fade the board out toward the edges." },
      { name: "className", type: "string", description: "Merged onto the absolutely positioned root." },
    ],
  },
  accessibility: [
    <>The board is decorative: it is <Code>aria-hidden</Code> and <Code>pointer-events-none</Code>, so it never reaches screen readers or blocks clicks.</>,
    "With prefers-reduced-motion, pulses are removed and the routes that carried them are drawn a little brighter instead.",
    "The SVG timeline pauses while the board is off-screen or the tab is hidden, saving battery.",
    "Keep foreground text on a solid or blurred surface, or rely on the default edge fade, to maintain contrast.",
  ],
};

export function CircuitBoardDocs() {
  return <ComponentDocs config={config} />;
}
