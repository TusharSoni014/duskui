import { ComponentDocs, type DocConfig } from "@/components/docs/component-docs";
import { Code } from "@/components/docs/doc-primitives";

import MarqueeDemo from "@/components/demos/marquee/marquee-demo";
import MarqueeTestimonialsDemo from "@/components/demos/marquee/marquee-testimonials";
import MarqueeVerticalDemo from "@/components/demos/marquee/marquee-vertical";

const demo = (file: string) => `components/demos/marquee/${file}`;

const config: DocConfig = {
  title: "Marquee",
  intro:
    "An infinite scrolling marquee for React and Tailwind CSS: a seamless, transform-only loop for logo clouds, testimonials and tags, in any direction, horizontal or vertical. It measures its content, clones just enough copies to fill the space, eases to a stop on hover and becomes a static scrollable row for reduced-motion users.",
  tags: ["Seamless loop", "Horizontal & vertical", "Pause on hover & focus", "Fade edges", "No re-renders", "prefers-reduced-motion"],
  hero: { Demo: MarqueeDemo, file: demo("marquee-demo.tsx"), minHeight: 200 },
  install: {
    registry: "marquee",
    source: "components/dusk/marquee/marquee.tsx",
    deps: "motion",
  },
  usage: {
    filename: "logo-cloud.tsx",
    code: `import { Marquee } from "@/components/dusk/marquee/marquee"

const logos = ["Nebula", "Quanta", "Lumen", "Vertex", "Stratus"]

export function LogoCloud() {
  return (
    <Marquee speed={40} gap={32} aria-label="Customers" role="region">
      {logos.map((name) => (
        <span key={name} className="text-lg font-semibold text-white/60">
          {name}
        </span>
      ))}
    </Marquee>
  )
}`,
  },
  examples: [
    {
      id: "testimonials",
      title: "Testimonials with a pause button",
      description: (
        <>
          Any content works, including cards. <Code>fade</Code> takes a width in px for the edge mask, and{" "}
          <Code>paused</Code> lets you wire your own play/pause control, which moving content longer than five
          seconds should offer.
        </>
      ),
      Demo: MarqueeTestimonialsDemo,
      file: demo("marquee-testimonials.tsx"),
      minHeight: 280,
    },
    {
      id: "vertical",
      title: "Vertical columns",
      description: (
        <>
          <Code>direction=&quot;up&quot;</Code> or <Code>&quot;down&quot;</Code> scrolls vertically. Give the marquee a
          height; alternate directions and speeds for a parallax wall.
        </>
      ),
      Demo: MarqueeVerticalDemo,
      file: demo("marquee-vertical.tsx"),
      minHeight: 340,
    },
  ],
  api: {
    intro: <>Also accepts any HTML attribute for the root <Code>div</Code>.</>,
    props: [
      { name: "children", type: "ReactNode", description: "The items. Rendered once, then cloned as needed to fill the loop." },
      { name: "direction", type: '"left" | "right" | "up" | "down"', default: '"left"', description: "Travel direction. up / down make a vertical marquee (set a height)." },
      { name: "speed", type: "number", default: "40", description: "Pixels per second." },
      { name: "gap", type: "number", default: "16", description: "Space between items and between copies, in px." },
      { name: "pauseOnHover", type: "boolean", default: "true", description: "Ease to a stop while hovered or while focus is inside." },
      { name: "paused", type: "boolean", default: "false", description: "Stop the marquee, e.g. from your own pause button." },
      { name: "fade", type: "boolean | number", default: "true", description: "Mask the edges. true = 64px, or a width in px." },
      { name: "groupClassName", type: "string", description: "Classes for each copy of the content (the flex row/column)." },
    ],
  },
  accessibility: [
    "Only the first copy is exposed. The clones are aria-hidden and inert, so screen readers read each item once and Tab never lands on a duplicate link.",
    "It eases to a stop on hover and whenever focus moves inside, so links and buttons in it are easy to reach. Use paused to add a visible pause control (WCAG 2.2.2).",
    "With prefers-reduced-motion it renders a single static copy in a natively scrollable row (or column), with no mask hiding the ends.",
    "Movement is one transform on the track, driven by a Motion value, and it stops while the marquee is off-screen.",
    "Give it a label (aria-label plus role=\"region\", or wrap it in a labelled section) when the content needs context.",
  ],
};

export function MarqueeDocs() {
  return <ComponentDocs config={config} />;
}
