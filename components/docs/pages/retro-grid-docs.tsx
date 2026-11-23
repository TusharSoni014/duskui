import { ComponentDocs, type DocConfig } from "@/components/docs/component-docs";
import { Code } from "@/components/docs/doc-primitives";

import RetroGridDemo from "@/components/demos/retro-grid/retro-grid-demo";
import RetroGridSynthwave from "@/components/demos/retro-grid/retro-grid-synthwave";
import RetroGridAngles from "@/components/demos/retro-grid/retro-grid-angles";

const demo = (file: string) => `components/demos/retro-grid/${file}`;

const config: DocConfig = {
  title: "Retro Grid",
  intro:
    "An animated synthwave retro grid background for React and Tailwind CSS: a faint perspective floor that scrolls toward the viewer and vanishes into a soft horizon, with an optional striped setting sun. Pure CSS gradients and one 3D transform, with no canvas and no per-frame JavaScript.",
  tags: ["Background", "Synthwave", "CSS 3D transform", "Striped sun", "Pauses off-screen", "Reduced-motion safe"],
  hero: { Demo: RetroGridDemo, file: demo("retro-grid-demo.tsx"), minHeight: 400 },
  install: {
    registry: "retro-grid",
    source: "components/dusk/retro-grid/retro-grid.tsx",
    deps: "motion",
    note: (
      <>
        The grid fills its nearest positioned parent, so give the parent <Code>relative</Code> and{" "}
        <Code>overflow-hidden</Code>, and put your content after it with <Code>relative</Code> so it sits on top.
      </>
    ),
  },
  usage: {
    filename: "hero.tsx",
    code: `import { RetroGrid } from "@/components/dusk/retro-grid/retro-grid"

export function Hero() {
  return (
    <section className="relative h-[480px] overflow-hidden">
      <RetroGrid />
      <div className="relative">{/* your content */}</div>
    </section>
  )
}`,
  },
  examples: [
    {
      id: "synthwave",
      title: "With a sun",
      description: (
        <>
          Turn on <Code>sun</Code> for the striped sun, set <Code>color</Code> for the grid and{" "}
          <Code>sunColors</Code> for the top and bottom of the sun. <Code>horizon</Code> moves the horizon line.
        </>
      ),
      Demo: RetroGridSynthwave,
      file: demo("retro-grid-synthwave.tsx"),
      minHeight: 400,
    },
    {
      id: "angles",
      title: "Angle, cells & horizon",
      description: (
        <>
          <Code>angle</Code> is the tilt of the floor: low angles look down on the grid, high angles skim across it.
          The perspective is solved for each angle, so the floor always vanishes exactly on the horizon.
        </>
      ),
      Demo: RetroGridAngles,
      file: demo("retro-grid-angles.tsx"),
      minHeight: 300,
    },
  ],
  api: {
    intro: (
      <>
        Any other <Code>div</Code> prop is passed to the root. Only the floor moves, with a Web Animations API
        transform, so it runs on the compositor.
      </>
    ),
    props: [
      { name: "angle", type: "number", default: "65", description: "Tilt of the floor in degrees, clamped to 20–75." },
      { name: "cellSize", type: "number", default: "56", description: "Tile size in px at the bottom edge." },
      { name: "color", type: "string", default: '"rgb(255 255 255)"', description: "Grid line and horizon color. Any CSS color." },
      { name: "speed", type: "number", default: "1", description: "Scroll speed multiplier; 0 holds the floor still." },
      { name: "sun", type: "boolean", default: "false", description: "Show the striped sun on the horizon." },
      { name: "sunColors", type: "[string, string]", default: "shades of color", description: "Top and bottom colors of the sun gradient." },
      { name: "horizon", type: "number", default: "0.5", description: "Horizon height as a fraction of the container from the top, 0.2–0.8." },
      { name: "lineWidth", type: "number", default: "1", description: "Grid line thickness in px." },
      { name: "className", type: "string", description: "Merged onto the absolutely positioned root." },
    ],
  },
  accessibility: [
    <>The grid is decorative: it is <Code>aria-hidden</Code> and <Code>pointer-events-none</Code>, so it never reaches screen readers or blocks clicks.</>,
    "With prefers-reduced-motion the floor holds still; the scene looks the same, it just doesn't scroll.",
    "Scrolling pauses while the grid is off-screen or the tab is hidden.",
    "The horizon is bright; keep text above it or below on the darker floor rather than on the horizon line.",
  ],
};

export function RetroGridDocs() {
  return <ComponentDocs config={config} />;
}
