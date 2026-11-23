import { ComponentDocs, type DocConfig } from "@/components/docs/component-docs";
import { Code } from "@/components/docs/doc-primitives";

import TimelineDemo from "@/components/demos/timeline/timeline-demo";
import TimelineRoadmapDemo from "@/components/demos/timeline/timeline-roadmap";

const demo = (file: string) => `components/demos/timeline/${file}`;

const config: DocConfig = {
  title: "Timeline",
  intro:
    "A scroll-animated vertical timeline for React and Tailwind CSS, perfect for changelogs, roadmaps and company history. A glowing progress line traces down the rail as you scroll, each dot lights up as the line reaches it, entries fade and slide in, and on wide layouts the dates stick beside their entry. Works on the page or inside any scroll container.",
  tags: ["Scroll-linked progress", "Sticky dates", "Scroll containers", "Container queries", "SEO-friendly", "prefers-reduced-motion"],
  hero: { Demo: TimelineDemo, file: demo("timeline-demo.tsx"), minHeight: 460 },
  install: {
    registry: "timeline",
    source: "components/dusk/timeline/timeline.tsx",
    deps: "motion",
  },
  usage: {
    filename: "changelog.tsx",
    code: `import { Timeline, TimelineItem } from "@/components/dusk/timeline/timeline"

export function Changelog() {
  return (
    <Timeline>
      <TimelineItem date="Nov 2026" dateTime="2026-11" title="v3.0 · Component library 3.0">
        A flat component list and 20 new components.
      </TimelineItem>
      <TimelineItem date="Sep 2026" dateTime="2026-09" title="v2.6 · Scroll-linked everything">
        New container prop for scroll areas.
      </TimelineItem>
    </Timeline>
  )
}`,
  },
  examples: [
    {
      id: "roadmap",
      title: "Roadmap with icons",
      description: (
        <>
          Pass an <Code>icon</Code> for each dot and recolor the line with <Code>lineClassName</Code>.{" "}
          <Code>anchor</Code> moves the line&apos;s tip (here 70% down the scroll area). In a narrow container the
          dates stack above each title; the layout switches with container queries, not the viewport.
        </>
      ),
      Demo: TimelineRoadmapDemo,
      file: demo("timeline-roadmap.tsx"),
      minHeight: 440,
    },
  ],
  api: {
    intro: (
      <>
        <Code>Timeline</Code> renders an <Code>ol</Code> and accepts its attributes; <Code>TimelineItem</Code> renders an{" "}
        <Code>li</Code>.
      </>
    ),
    props: [
      { name: "container", type: "RefObject<HTMLElement | null>", description: "Timeline: the scrolling element, when it lives in a scroll container." },
      { name: "anchor", type: "number", default: "0.5", description: "Timeline: where the line's tip sits, as a fraction of the viewport / container height. Dots light up as they cross it." },
      { name: "stickyTop", type: "string", default: '"5rem"', description: "Timeline: CSS length from the top where dates stick on wide layouts. Match your sticky header." },
      { name: "lineClassName", type: "string", description: "Timeline: classes for the progress line." },
      { name: "date", type: "ReactNode", description: "TimelineItem: date label, rendered in a <time>." },
      { name: "dateTime", type: "string", description: "TimelineItem: machine-readable date for the <time> element." },
      { name: "title", type: "ReactNode", description: "TimelineItem: entry heading." },
      { name: "titleAs", type: '"h2" | "h3" | "h4"', default: '"h3"', description: "TimelineItem: heading element." },
      { name: "icon", type: "ReactNode", description: "TimelineItem: icon inside the rail dot. Defaults to a small dot." },
      { name: "children", type: "ReactNode", description: "TimelineItem: entry body." },
    ],
  },
  accessibility: [
    "It is an ordered list of entries, each with a heading and a <time> element (use dateTime for a machine-readable date), so it reads well in screen readers and search results.",
    "Each date is rendered once; the wide and narrow layouts only move it with CSS grid.",
    "The server, no-JS visitors and the first paint show every entry. Only entries still below the fold are hidden before the first paint and then fade in.",
    "The rail and dots are aria-hidden decoration. The progress line is a scaleY transform driven by scroll Motion values, so scrolling never re-renders React.",
    "With prefers-reduced-motion the line is drawn in full and entries are simply visible; dots still change color as you scroll.",
  ],
};

export function TimelineDocs() {
  return <ComponentDocs config={config} />;
}
