import { ComponentDocs, type DocConfig } from "@/components/docs/component-docs";
import { Code } from "@/components/docs/doc-primitives";

import OrbitingCirclesDemo from "@/components/demos/orbiting-circles/orbiting-circles-demo";
import OrbitingCirclesHover from "@/components/demos/orbiting-circles/orbiting-circles-hover";
import OrbitingCirclesSolar from "@/components/demos/orbiting-circles/orbiting-circles-solar";

const demo = (file: string) => `components/demos/orbiting-circles/${file}`;

const config: DocConfig = {
  title: "Orbiting Circles",
  intro:
    "Orbiting icons for React and Tailwind CSS: any children travel around a shared centre on a circular path, spaced evenly and always upright. Stack several rings with different radii, speeds and directions for integration showcases, tech-stack heroes and team clouds.",
  tags: ["Multiple rings", "Icons stay upright", "Pause on hover & focus", "Pauses off-screen", "prefers-reduced-motion"],
  hero: { Demo: OrbitingCirclesDemo, file: demo("orbiting-circles-demo.tsx"), minHeight: 440 },
  install: {
    registry: "orbiting-circles",
    source: "components/dusk/orbiting-circles/orbiting-circles.tsx",
    deps: "motion",
  },
  usage: {
    filename: "stack.tsx",
    code: `import { Cloud, Database, Globe } from "lucide-react"
import { OrbitingCircles } from "@/components/dusk/orbiting-circles/orbiting-circles"

export function Stack() {
  return (
    <div className="relative flex h-96 items-center justify-center">
      <span className="relative z-10 text-xl font-semibold">Dusk</span>
      <OrbitingCircles radius={90}>
        <Globe />
        <Database />
        <Cloud />
      </OrbitingCircles>
      <OrbitingCircles radius={150} duration={30} reverse>
        {/* … */}
      </OrbitingCircles>
    </div>
  )
}`,
  },
  examples: [
    {
      id: "pause-on-hover",
      title: "Pause on hover",
      description: (
        <>
          With <Code>pauseOnHover</Code> the ring stops while the pointer is over an item or an item has keyboard
          focus, so the buttons are easy to hit. Style the ring with <Code>pathClassName</Code>.
        </>
      ),
      Demo: OrbitingCirclesHover,
      file: demo("orbiting-circles-hover.tsx"),
      minHeight: 340,
    },
    {
      id: "solar-system",
      title: "Speeds & start angles",
      description: (
        <>
          One item per ring with its own <Code>radius</Code>, <Code>duration</Code>, <Code>iconSize</Code> and{" "}
          <Code>startAngle</Code>. Purely decorative rings can take <Code>aria-hidden</Code>.
        </>
      ),
      Demo: OrbitingCirclesSolar,
      file: demo("orbiting-circles-solar.tsx"),
      minHeight: 400,
    },
  ],
  api: {
    intro: (
      <>
        Each <Code>OrbitingCircles</Code> fills its nearest positioned parent and centres itself; put the centre
        content in that parent with <Code>relative z-10</Code>. Also accepts any div attribute.
      </>
    ),
    props: [
      { name: "children", type: "ReactNode", description: "Items to orbit, spaced evenly around the ring." },
      { name: "radius", type: "number", default: "120", description: "Orbit radius in px." },
      { name: "duration", type: "number", default: "20", description: "Seconds per lap." },
      { name: "reverse", type: "boolean", default: "false", description: "Orbit counter-clockwise." },
      { name: "startAngle", type: "number", default: "-90", description: "Angle of the first item in degrees (0 = right, -90 = top)." },
      { name: "path", type: "boolean", default: "true", description: "Draw the orbit ring." },
      { name: "iconSize", type: "number", default: "40", description: "Width and height of each item slot in px." },
      { name: "pauseOnHover", type: "boolean", default: "false", description: "Stop while an item is hovered or focused." },
      { name: "pathClassName", type: "string", description: "Classes for the orbit ring." },
      { name: "itemClassName", type: "string", description: "Classes for each item slot." },
    ],
  },
  accessibility: [
    "Items are rendered once, in source order, so screen readers and the Tab key meet them in a predictable sequence regardless of where they are on the ring.",
    "pauseOnHover also pauses on keyboard focus, so a focused link never moves away from its focus ring.",
    "The ring is aria-hidden. Give icon-only items an accessible name, or mark a purely decorative orbit aria-hidden.",
    "One motion value drives every item, so React never re-renders while it spins, and the animation pauses off-screen and in hidden tabs.",
    "With prefers-reduced-motion the items rest, evenly spaced, at their start angles.",
  ],
};

export function OrbitingCirclesDocs() {
  return <ComponentDocs config={config} />;
}
