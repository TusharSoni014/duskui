import { ComponentDocs, type DocConfig } from "@/components/docs/component-docs";
import { Code } from "@/components/docs/doc-primitives";

import ScrollAreaBasicDemo from "@/components/demos/scroll-area/scroll-area-basic";
import ScrollAreaHorizontalDemo from "@/components/demos/scroll-area/scroll-area-horizontal";
import FadeScrollAreaDemo from "@/components/demos/scroll-area/fade-scroll-area-demo";
import ScrollProgressDemo from "@/components/demos/scroll-area/scroll-progress-demo";

const demo = (file: string) => `components/demos/scroll-area/${file}`;
const block = (file: string) => `components/dusk/scroll-area/${file}`;

const config: DocConfig = {
  title: "Scroll Area",
  intro:
    "The shadcn/ui Scroll Area with slim custom scrollbars that fade in on hover and out when idle — plus two React scroll blocks: edge fade masks that appear only when there's more content, and a Motion-powered scroll progress bar with a back-to-top button.",
  tags: ["Drop-in shadcn API", "Native scrolling", "Fading scrollbars", "Edge fade masks", "Motion block"],
  hero: { Demo: FadeScrollAreaDemo, file: demo("fade-scroll-area-demo.tsx"), minHeight: 400 },
  install: {
    registry: "scroll-area",
    source: "components/ui/scroll-area.tsx",
    deps: "@radix-ui/react-scroll-area",
    note: (
      <>
        Same exports and props as the shadcn/ui Scroll Area (<Code>ScrollArea</Code> and{" "}
        <Code>ScrollBar</Code>), plus optional <Code>viewportRef</Code> and{" "}
        <Code>viewportClassName</Code> to reach the scrolling element. CSS only, no Motion.
      </>
    ),
  },
  usage: {
    filename: "release-list.tsx",
    code: `import { ScrollArea } from "@/components/ui/scroll-area"

export function ReleaseList({ releases }: { releases: string[] }) {
  return (
    <ScrollArea className="h-72 w-48 rounded-md border">
      <div className="p-4">
        {releases.map((release) => (
          <div key={release} className="py-2 text-sm">{release}</div>
        ))}
      </div>
    </ScrollArea>
  )
}`,
  },
  examples: [
    {
      id: "default",
      title: "Default",
      description: (
        <>
          Hover the list: the scrollbar fades in, brightens when you hover it, turns mint while you
          drag the thumb, and fades out shortly after the pointer leaves. Wheel, touch and keyboard
          scrolling stay native. Pass <Code>type=&quot;scroll&quot;</Code> to show it only while
          scrolling, or <Code>type=&quot;always&quot;</Code>.
        </>
      ),
      Demo: ScrollAreaBasicDemo,
      file: demo("scroll-area-basic.tsx"),
      minHeight: 340,
    },
    {
      id: "horizontal",
      title: "Horizontal",
      description: (
        <>
          Add <Code>{"<ScrollBar orientation=\"horizontal\" />"}</Code> and give the content{" "}
          <Code>w-max</Code> to scroll sideways.
        </>
      ),
      Demo: ScrollAreaHorizontalDemo,
      file: demo("scroll-area-horizontal.tsx"),
      minHeight: 260,
    },
  ],
  blocks: [
    {
      id: "fade-scroll-area",
      title: "Fade Scroll Area",
      registry: "fade-scroll-area",
      source: block("fade-scroll-area.tsx"),
      deps: "@radix-ui/react-scroll-area",
      description: (
        <>
          Edges fade out only when there&apos;s more to see in that direction: scroll down and the top
          begins to fade, reach the end and the bottom fade disappears; if everything fits there&apos;s
          no fade at all. The fades are a CSS mask, so they work over any background, and they grow
          with the scroll distance instead of popping. Works vertically or horizontally, updates in a
          requestAnimationFrame and never re-renders React.
        </>
      ),
      Demo: FadeScrollAreaDemo,
      file: demo("fade-scroll-area-demo.tsx"),
      minHeight: 400,
      props: [
        { name: "orientation", type: '"vertical" | "horizontal"', default: '"vertical"', description: "Scroll direction. Horizontal adds a horizontal scrollbar and side fades." },
        { name: "fadeSize", type: "number", default: "40", description: "Length of each edge fade in px." },
        { name: "…ScrollArea props", type: "ScrollArea props", description: "className, type, scrollHideDelay, viewportRef, viewportClassName…" },
      ],
    },
    {
      id: "scroll-progress",
      title: "Scroll Progress",
      registry: "scroll-progress",
      source: block("scroll-progress.tsx"),
      deps: "motion @radix-ui/react-scroll-area lucide-react",
      description: (
        <>
          A reading-progress bar along the top fills as you scroll, spring-smoothed with Motion&apos;s{" "}
          <Code>useScroll</Code> + <Code>useSpring</Code> on the viewport. Past{" "}
          <Code>backToTop</Code>, a button rises in whose ring traces the same progress and scrolls back
          to the top. Scrolling never re-renders React.
        </>
      ),
      Demo: ScrollProgressDemo,
      file: demo("scroll-progress-demo.tsx"),
      minHeight: 380,
      props: [
        { name: "backToTop", type: "number | false", default: "0.2", description: "Show the back-to-top button after this fraction of the content. false hides it." },
        { name: "barClassName", type: "string", description: "Classes for the progress bar, e.g. a different color." },
        { name: "…ScrollArea props", type: "ScrollArea props", description: "className sizes the wrapper; the rest go to the ScrollArea." },
      ],
    },
  ],
  api: {
    intro: (
      <>
        <Code>ScrollArea</Code> wraps Radix&apos;s Root, Viewport, a vertical <Code>ScrollBar</Code> and
        Corner. Add more <Code>ScrollBar</Code>s as children.
      </>
    ),
    props: [
      { name: "type", type: '"auto" | "always" | "scroll" | "hover"', default: '"hover"', description: "When scrollbars are shown (on ScrollArea)." },
      { name: "scrollHideDelay", type: "number", default: "600", description: "ms before scrollbars fade out (on ScrollArea)." },
      { name: "viewportRef", type: "Ref<HTMLDivElement>", description: "Ref to the scrolling element (on ScrollArea)." },
      { name: "viewportClassName", type: "string", description: "Classes for the scrolling element (on ScrollArea)." },
      { name: "orientation", type: '"vertical" | "horizontal"', default: '"vertical"', description: "On ScrollBar." },
    ],
  },
  accessibility: [
    "Scrolling stays native: wheel, trackpad, touch, keyboard (arrows, Page Up/Down, Space) and screen-reader navigation all work as usual.",
    "The viewport shows a focus ring when it's focused for keyboard scrolling.",
    "Custom scrollbars are decorative mirrors of the native scroll position; the thumb has a 44px hit area for pointer users.",
    "Scroll Progress's back-to-top button is a labelled button, and the progress bar is hidden from assistive tech.",
    "Under prefers-reduced-motion scrollbars appear without fading, the progress bar tracks exactly and back-to-top jumps instantly.",
  ],
};

export function ScrollAreaDocs() {
  return <ComponentDocs config={config} />;
}
