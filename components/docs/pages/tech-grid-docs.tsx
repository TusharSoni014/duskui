import { ComponentDocs, type DocConfig } from "@/components/docs/component-docs";
import { Code } from "@/components/docs/doc-primitives";

import TechGridDemo from "@/components/demos/tech-grid/tech-grid-demo";
import TechGridPerspective from "@/components/demos/tech-grid/tech-grid-perspective";
import TechGridCustom from "@/components/demos/tech-grid/tech-grid-custom";

const demo = (file: string) => `components/demos/tech-grid/${file}`;

const config: DocConfig = {
  title: "Tech Grid",
  intro:
    "An animated tech grid background for React and Tailwind CSS: a quiet blueprint grid with a faint scan line sweeping past, or a retro perspective floor that scrolls slowly toward the viewer. Built with Motion and pure CSS, no canvas.",
  tags: ["Background", "Blueprint grid", "Perspective", "Pauses off-screen", "Reduced-motion safe"],
  hero: { Demo: TechGridDemo, file: demo("tech-grid-demo.tsx"), minHeight: 360 },
  install: {
    registry: "tech-grid",
    source: "components/dusk/techy/tech-grid.tsx",
    deps: "motion",
    note: (
      <>
        The grid fills its nearest positioned parent. It is <Code>pointer-events-none</Code>, so it never blocks
        the content on top.
      </>
    ),
  },
  usage: {
    filename: "hero.tsx",
    code: `import { TechGrid } from "@/components/dusk/techy/tech-grid"

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <TechGrid />
      <div className="relative">{/* your content */}</div>
    </section>
  )
}`,
  },
  examples: [
    {
      id: "perspective",
      title: "Perspective floor",
      description: (
        <>
          <Code>variant=&quot;perspective&quot;</Code> tilts the grid into a receding floor that scrolls
          toward you, with a faint scan line moving down it. The horizon scales with the container.
        </>
      ),
      Demo: TechGridPerspective,
      file: demo("tech-grid-perspective.tsx"),
      minHeight: 360,
    },
    {
      id: "custom",
      title: "Customizing",
      description: (
        <>
          Change <Code>color</Code>, <Code>cellSize</Code> and <Code>speed</Code>, or switch off the{" "}
          <Code>scanLine</Code>.
        </>
      ),
      Demo: TechGridCustom,
      file: demo("tech-grid-custom.tsx"),
      minHeight: 300,
    },
  ],
  api: {
    intro: <>Any other <Code>div</Code> prop is passed to the root.</>,
    props: [
      { name: "variant", type: '"flat" | "perspective"', default: '"flat"', description: "Blueprint grid or receding floor." },
      { name: "color", type: "string", default: '"rgb(255 255 255)"', description: "Line and scan color, mixed down to a faint tint. Any CSS color." },
      { name: "cellSize", type: "number", default: "40", description: "Size of one grid cell in px." },
      { name: "speed", type: "number", default: "1", description: "Speed multiplier for the floor and the scan line." },
      { name: "scanLine", type: "boolean", default: "true", description: "Sweep a faint scan line across the grid." },
      { name: "fade", type: "boolean", default: "true", description: "Fade the flat grid out toward the edges." },
      { name: "className", type: "string", description: "Merged onto the absolutely positioned root." },
    ],
  },
  accessibility: [
    <>Decorative only: the root is <Code>aria-hidden</Code> and <Code>pointer-events-none</Code>, so nothing is blocked.</>,
    "With prefers-reduced-motion the floor stops and the scan line is removed.",
    "Animations pause while the grid is off-screen or the tab is hidden, and stop on unmount.",
  ],
};

export function TechGridDocs() {
  return <ComponentDocs config={config} />;
}
