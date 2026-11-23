import { ComponentDocs, type DocConfig } from "@/components/docs/component-docs";
import { Code } from "@/components/docs/doc-primitives";

import DotSpotlightDemo from "@/components/demos/dot-spotlight/dot-spotlight-demo";
import DotSpotlightCustom from "@/components/demos/dot-spotlight/dot-spotlight-custom";
import DotSpotlightFeatures from "@/components/demos/dot-spotlight/dot-spotlight-features";

const demo = (file: string) => `components/demos/dot-spotlight/${file}`;

const config: DocConfig = {
  title: "Dot Spotlight",
  intro:
    "A dot grid background with a cursor spotlight for React: a soft light follows the mouse and brightens the dots beneath it. Built with Motion values and a CSS mask, so it never re-renders, and it rests as a centered glow on touch screens.",
  tags: ["Background", "Dot grid", "Cursor spotlight", "Motion values", "Touch fallback"],
  hero: { Demo: DotSpotlightDemo, file: demo("dot-spotlight-demo.tsx"), minHeight: 360 },
  install: {
    registry: "dot-spotlight",
    source: "components/dusk/backgrounds/dot-spotlight.tsx",
    deps: "motion",
    note: (
      <>
        The pattern fills its nearest positioned parent, so give the parent <Code>relative</Code> and{" "}
        <Code>overflow-hidden</Code>, and put your content after it with <Code>relative</Code> so it sits on top. The
        cursor is tracked on the window, so content on top stays fully interactive.
      </>
    ),
  },
  usage: {
    filename: "hero.tsx",
    code: `import { DotSpotlight } from "@/components/dusk/backgrounds/dot-spotlight"

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <DotSpotlight />
      <div className="relative">{/* your content */}</div>
    </section>
  )
}`,
  },
  examples: [
    {
      id: "custom",
      title: "Grid & color",
      description: (
        <>
          <Code>gap</Code> and <Code>dotSize</Code> shape the grid, <Code>radius</Code> sizes the light, and{" "}
          <Code>glow={"{false}"}</Code> lights only the dots without the color wash.
        </>
      ),
      Demo: DotSpotlightCustom,
      file: demo("dot-spotlight-custom.tsx"),
      minHeight: 300,
    },
    {
      id: "features",
      title: "Behind a feature grid",
      description: (
        <>
          Turn off <Code>fade</Code> to run the pattern edge to edge behind cards; the light still follows the cursor
          through them.
        </>
      ),
      Demo: DotSpotlightFeatures,
      file: demo("dot-spotlight-features.tsx"),
      minHeight: 320,
    },
  ],
  api: {
    intro: (
      <>
        Any other <Code>div</Code> prop is passed to the root. The spotlight position is spring-smoothed and stored in
        percent of the container, so the server renders the centered resting state.
      </>
    ),
    props: [
      { name: "color", type: "string", default: '"var(--color-primary)"', description: "Color of the spotlight and lit dots." },
      { name: "dotColor", type: "string", default: '"rgb(255 255 255 / 0.14)"', description: "Color of the resting dots." },
      { name: "gap", type: "number", default: "20", description: "Distance between dots in px." },
      { name: "dotSize", type: "number", default: "1.25", description: "Dot radius in px." },
      { name: "radius", type: "number", default: "220", description: "Radius of the spotlight in px." },
      { name: "glow", type: "boolean", default: "true", description: "Paint a soft color wash under the spotlight." },
      { name: "fade", type: "boolean", default: "true", description: "Fade the pattern out toward the edges." },
      { name: "className", type: "string", description: "Merged onto the absolutely positioned root." },
    ],
  },
  accessibility: [
    <>The pattern is decorative: it is <Code>aria-hidden</Code> and <Code>pointer-events-none</Code>, so it never reaches screen readers or blocks clicks.</>,
    "On touch screens and with prefers-reduced-motion the light stays as a static glow in the center.",
    "Pointer tracking is skipped while the pattern is off-screen or the tab is hidden.",
    "The effect is pure decoration; never rely on it to reveal content.",
  ],
};

export function DotSpotlightDocs() {
  return <ComponentDocs config={config} />;
}
