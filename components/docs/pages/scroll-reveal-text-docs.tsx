import { ComponentDocs, type DocConfig } from "@/components/docs/component-docs";
import { Code } from "@/components/docs/doc-primitives";

import ScrollRevealTextDemo from "@/components/demos/scroll-reveal-text/scroll-reveal-text-demo";
import ScrollRevealTextQuoteDemo from "@/components/demos/scroll-reveal-text/scroll-reveal-text-quote";

const demo = (file: string) => `components/demos/scroll-reveal-text/${file}`;

const config: DocConfig = {
  title: "Scroll Reveal Text",
  intro:
    "A scroll-driven text reveal for React and Tailwind CSS: a paragraph whose words light up one by one as it scrolls through the viewport. Each word's opacity is a Motion value tied to scroll progress, so it never re-renders React, and the text stays real, selectable and SEO-friendly.",
  tags: ["Scroll-linked", "SEO-friendly real text", "No re-renders", "Scroll containers", "prefers-reduced-motion"],
  hero: { Demo: ScrollRevealTextDemo, file: demo("scroll-reveal-text-demo.tsx"), minHeight: 400 },
  install: {
    registry: "scroll-reveal-text",
    source: "components/dusk/text/scroll-reveal-text.tsx",
    deps: "motion",
  },
  usage: {
    filename: "manifesto.tsx",
    code: `import { ScrollRevealText } from "@/components/dusk/text/scroll-reveal-text"

export function Manifesto() {
  return (
    <ScrollRevealText className="text-3xl font-semibold">
      We build tools for people who do their best work after dark.
    </ScrollRevealText>
  )
}`,
  },
  examples: [
    {
      id: "quote",
      title: "Quote with custom timing",
      description: (
        <>
          <Code>offset</Code> takes Motion <Code>useScroll</Code> offsets to control where the reveal starts and
          ends. <Code>baseOpacity</Code> sets how faint unread words are and <Code>wordClassName</Code> styles them.
          Inside a scroll container, pass its ref as <Code>container</Code>.
        </>
      ),
      Demo: ScrollRevealTextQuoteDemo,
      file: demo("scroll-reveal-text-quote.tsx"),
      minHeight: 400,
    },
  ],
  api: {
    intro: <>Also accepts any HTML attribute for the rendered element.</>,
    props: [
      { name: "children", type: "string", description: "The text to reveal. Plain text only; it is split into words." },
      { name: "as", type: '"p" | "div" | "blockquote" | "span" | "h1" … "h6"', default: '"p"', description: "Element to render." },
      { name: "baseOpacity", type: "number", default: "0.18", description: "Opacity of words not reached yet (0–1)." },
      { name: "offset", type: "UseScrollOptions[\"offset\"]", default: '["start 0.85", "end 0.5"]', description: "When the reveal starts and ends: starts when the top is 85% down the viewport, ends when the bottom reaches the middle." },
      { name: "container", type: "RefObject<HTMLElement | null>", description: "The scrolling element, when the text is inside a scroll container instead of the page." },
      { name: "wordClassName", type: "string", description: "Classes for each word." },
    ],
  },
  accessibility: [
    "The words are the real text, split into inline spans with the original spacing, so there is no duplicated or hidden copy and selection, translation and search work normally.",
    "The server, no-JS visitors and the first client render show the paragraph fully revealed; the reveal is armed just before the first paint.",
    "Only opacity changes, and never below baseOpacity, so text is never fully invisible.",
    "Scroll progress drives Motion values directly, with no React state per frame.",
    "With prefers-reduced-motion every word is fully visible and scrolling changes nothing.",
  ],
};

export function ScrollRevealTextDocs() {
  return <ComponentDocs config={config} />;
}
