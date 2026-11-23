import { ComponentDocs, type DocConfig } from "@/components/docs/component-docs";
import { Code } from "@/components/docs/doc-primitives";

import ShinyTextDemo from "@/components/demos/shiny-text/shiny-text-demo";
import ShinyTextColorsDemo from "@/components/demos/shiny-text/shiny-text-colors";
import ShinyTextLoadingDemo from "@/components/demos/shiny-text/shiny-text-loading";
import ShinyTextHoverDemo from "@/components/demos/shiny-text/shiny-text-hover";

const demo = (file: string) => `components/demos/shiny-text/${file}`;

const config: DocConfig = {
  title: "Shiny Text",
  intro:
    "A shimmering text effect for React and Tailwind CSS: a band of light sweeps across the letters using a gradient clipped to the text. Pick the colors, speed, angle and direction, render any heading level with the as prop, and keep the text real and selectable for SEO.",
  tags: ["SEO-friendly real text", "background-clip: text", "Heading levels via as", "Loop or hover", "prefers-reduced-motion"],
  hero: { Demo: ShinyTextDemo, file: demo("shiny-text-demo.tsx") },
  install: {
    registry: "shiny-text",
    source: "components/dusk/text/shiny-text.tsx",
    deps: "motion",
  },
  usage: {
    filename: "announcement.tsx",
    code: `import { ShinyText } from "@/components/dusk/text/shiny-text"

export function Announcement() {
  return (
    <ShinyText as="h2" className="text-4xl font-bold">
      Now in public beta
    </ShinyText>
  )
}`,
  },
  examples: [
    {
      id: "colors",
      title: "Colors, speed & direction",
      description: (
        <>
          <Code>color</Code> is the base text color and <Code>shineColor</Code> the band. <Code>spread</Code> sets the
          band width, <Code>angle</Code> its slant, <Code>direction</Code> the sweep direction, and{" "}
          <Code>duration</Code> / <Code>repeatDelay</Code> the rhythm.
        </>
      ),
      Demo: ShinyTextColorsDemo,
      file: demo("shiny-text-colors.tsx"),
      minHeight: 240,
    },
    {
      id: "loading",
      title: "Loading text",
      description: (
        <>
          A fast, narrow sweep makes a calm loading label. Pass <Code>role=&quot;status&quot;</Code> so the message is
          announced.
        </>
      ),
      Demo: ShinyTextLoadingDemo,
      file: demo("shiny-text-loading.tsx"),
      minHeight: 160,
    },
    {
      id: "hover",
      title: "Sweep on hover",
      description: (
        <>
          <Code>trigger=&quot;hover&quot;</Code> plays a single sweep each time the pointer enters, good for links and
          announcement pills.
        </>
      ),
      Demo: ShinyTextHoverDemo,
      file: demo("shiny-text-hover.tsx"),
      minHeight: 160,
    },
  ],
  api: {
    intro: <>Also accepts any HTML attribute for the rendered element.</>,
    props: [
      { name: "as", type: '"span" | "p" | "div" | "strong" | "em" | "h1" … "h6"', default: '"span"', description: "Element to render. Use a heading level for titles." },
      { name: "color", type: "string", default: "foreground at 55%", description: "Base text color (any CSS color)." },
      { name: "shineColor", type: "string", default: "var(--color-foreground)", description: "Color of the light band." },
      { name: "duration", type: "number", default: "1.8", description: "Seconds for one sweep." },
      { name: "repeatDelay", type: "number", default: "2.5", description: "Seconds between sweeps in loop mode." },
      { name: "spread", type: "number", default: "0.35", description: "Band width as a fraction of the text width (0.1–1)." },
      { name: "angle", type: "number", default: "110", description: "Band angle in degrees." },
      { name: "direction", type: '"ltr" | "rtl"', default: '"ltr"', description: "Sweep direction." },
      { name: "trigger", type: '"loop" | "hover"', default: '"loop"', description: "Sweep continuously or once per hover." },
    ],
  },
  accessibility: [
    "The text is a single real element with no duplicated copies, so it is selectable, translatable and indexed like any heading.",
    <>Use <Code>as</Code> to keep the correct heading level in the document outline.</>,
    "Selected text switches to a solid color so it stays legible, and forced-colors (high contrast) modes fall back to the system text color.",
    "The shine moves outside React, and only the background position animates.",
    "With prefers-reduced-motion the text is static in its base color. Pick a base color with enough contrast on its own.",
  ],
};

export function ShinyTextDocs() {
  return <ComponentDocs config={config} />;
}
