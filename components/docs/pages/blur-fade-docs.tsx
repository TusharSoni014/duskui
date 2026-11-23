import { ComponentDocs, type DocConfig } from "@/components/docs/component-docs";
import { Code } from "@/components/docs/doc-primitives";

import BlurFadeDemo from "@/components/demos/blur-fade/blur-fade-demo";
import BlurFadeDirections from "@/components/demos/blur-fade/blur-fade-directions";
import BlurFadeList from "@/components/demos/blur-fade/blur-fade-list";
import BlurFadeScroll from "@/components/demos/blur-fade/blur-fade-scroll";

const demo = (file: string) => `components/demos/blur-fade/${file}`;

const config: DocConfig = {
  title: "Blur Fade",
  intro:
    "A blur fade-in animation for React and Tailwind CSS: content eases in from a soft blur and a small offset as it scrolls into view, with a group helper that staggers lists and grids. The server renders everything visible, so it stays SEO-friendly and never flashes content that is already on screen.",
  tags: ["Scroll-triggered", "Stagger groups", "SSR-safe, no flash", "Four directions", "prefers-reduced-motion"],
  hero: { Demo: BlurFadeDemo, file: demo("blur-fade-demo.tsx"), minHeight: 320 },
  install: {
    registry: "blur-fade",
    source: "components/dusk/blur-fade/blur-fade.tsx",
    deps: "motion",
  },
  usage: {
    filename: "features.tsx",
    code: `import { BlurFade, BlurFadeGroup } from "@/components/dusk/blur-fade/blur-fade"

export function Features() {
  return (
    <section>
      <BlurFade as="h2" className="text-3xl font-semibold">
        Built for speed
      </BlurFade>
      <BlurFadeGroup as="ul" stagger={0.08} className="grid gap-4 sm:grid-cols-3">
        <FeatureCard title="Edge rendering" />
        <FeatureCard title="Instant previews" />
        <FeatureCard title="Zero config" />
      </BlurFadeGroup>
    </section>
  )
}`,
  },
  examples: [
    {
      id: "directions",
      title: "Directions",
      description: (
        <>
          <Code>direction</Code> is where the content travels to: <Code>up</Code> rises into place,{" "}
          <Code>none</Code> only fades and un-blurs. Tune the distance with <Code>offset</Code> and the
          softness with <Code>blur</Code>.
        </>
      ),
      Demo: BlurFadeDirections,
      file: demo("blur-fade-directions.tsx"),
      minHeight: 200,
    },
    {
      id: "scroll",
      title: "Scroll gallery",
      description: (
        <>
          Each tile animates as it enters its scroll container. With <Code>once={"{false}"}</Code> tiles hide
          again when they leave and replay on the way back.
        </>
      ),
      Demo: BlurFadeScroll,
      file: demo("blur-fade-scroll.tsx"),
      minHeight: 460,
    },
    {
      id: "group",
      title: "Staggered group",
      description: (
        <>
          <Code>BlurFadeGroup</Code> watches the viewport once for all its children and offsets each by{" "}
          <Code>stagger</Code> seconds. With <Code>as=&quot;ul&quot;</Code> every child is wrapped in an{" "}
          <Code>li</Code>; style the wrappers with <Code>itemClassName</Code>.
        </>
      ),
      Demo: BlurFadeList,
      file: demo("blur-fade-list.tsx"),
      minHeight: 320,
    },
  ],
  api: {
    intro: (
      <>
        <Code>BlurFade</Code> also accepts any HTML attribute for the rendered element.{" "}
        <Code>BlurFadeGroup</Code> takes <Code>direction</Code>, <Code>offset</Code>, <Code>blur</Code>,{" "}
        <Code>duration</Code>, <Code>trigger</Code>, <Code>inViewMargin</Code>, <Code>amount</Code> and{" "}
        <Code>once</Code> for all its children, plus the props marked “Group”.
      </>
    ),
    props: [
      { name: "as", type: '"div" | "span" | "section" | "article" | "li" | "p" | …', default: '"div"', description: "Element to render. Group: \"div\" | \"ul\" | \"ol\" | \"section\"." },
      { name: "direction", type: '"up" | "down" | "left" | "right" | "none"', default: '"up"', description: "Where the content travels to as it appears." },
      { name: "offset", type: "number", default: "8", description: "Travel distance in px." },
      { name: "blur", type: "number", default: "6", description: "Starting blur in px." },
      { name: "delay", type: "number", default: "0", description: "Seconds before the entrance (group: before the first child)." },
      { name: "duration", type: "number", default: "0.5", description: "Seconds the entrance takes." },
      { name: "trigger", type: '"inView" | "mount"', default: '"inView"', description: "Play when scrolled into view, or as soon as it mounts." },
      { name: "inViewMargin", type: "string", default: '"-40px"', description: "IntersectionObserver root margin. Negative values wait until the element is further inside." },
      { name: "amount", type: "number", default: "0", description: "Share of the element (0–1) that must be visible to start." },
      { name: "once", type: "boolean", default: "true", description: "Play only the first time; false hides on leave and replays on every entry." },
      { name: "stagger", type: "number", default: "0.08", description: "Group: seconds between consecutive children." },
      { name: "itemAs", type: "BlurFade as", default: '"li" in lists, else "div"', description: "Group: element wrapped around each child." },
      { name: "itemClassName", type: "string", description: "Group: class name for every item wrapper." },
    ],
  },
  accessibility: [
    "Content is rendered visible in the server HTML, so crawlers, no-JS visitors and assistive technology always get it.",
    "While hydrating, anything already on screen keeps its painted state; only content below the fold (or mounted later on the client) is hidden, before it is ever seen.",
    "Only opacity, transform and filter change, so layout never shifts. The blur and transform are removed afterwards and never trap position: fixed children.",
    "With prefers-reduced-motion the content appears immediately.",
    <>Use <Code>as</Code> to keep correct semantics, e.g. <Code>as=&quot;ul&quot;</Code> on a group renders a real list.</>,
  ],
};

export function BlurFadeDocs() {
  return <ComponentDocs config={config} />;
}
