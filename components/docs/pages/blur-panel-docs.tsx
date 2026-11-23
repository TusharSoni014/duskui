import { ComponentDocs, type DocConfig } from "@/components/docs/component-docs";
import { Code } from "@/components/docs/doc-primitives";

import BlurPanelDemo from "@/components/demos/blur-panel/blur-panel-demo";
import BlurPanelToolbar from "@/components/demos/blur-panel/blur-panel-toolbar";
import BlurPanelIntensity from "@/components/demos/blur-panel/blur-panel-intensity";

const demo = (file: string) => `components/demos/blur-panel/${file}`;

const config: DocConfig = {
  title: "Blur Panel",
  intro:
    "A React backdrop-blur panel for sticky headers, floating toolbars and sidebars. Built with Motion's useScroll and Tailwind CSS, its blur, saturation and tint fade in as the page scrolls — without re-rendering — and it falls back to a solid fill where backdrop-filter isn't available.",
  tags: ["Scroll-linked blur", "Sticky header", "Intensity presets", "No re-renders", "Any landmark element"],
  hero: { Demo: BlurPanelDemo, file: demo("blur-panel-demo.tsx"), minHeight: 400 },
  install: {
    registry: "blur-panel",
    source: "components/dusk/glass/blur-panel.tsx",
    deps: "motion",
    note: (
      <>
        The panel doesn&apos;t position itself — add <Code>sticky top-0</Code>,{" "}
        <Code>fixed</Code> or whatever your layout needs through <Code>className</Code>.
      </>
    ),
  },
  usage: {
    filename: "site-header.tsx",
    code: `import { BlurPanel } from "@/components/dusk/glass/blur-panel"

export function SiteHeader() {
  return (
    <BlurPanel as="header" className="sticky top-0 z-40 flex h-16 items-center px-6">
      <Logo />
      <Nav />
    </BlurPanel>
  )
}`,
  },
  examples: [
    {
      id: "toolbar",
      title: "Floating toolbar",
      description: (
        <>
          Set <Code>scrollRange={"{false}"}</Code> for a panel that is always frosted, and{" "}
          <Code>edge=&quot;none&quot;</Code> when the shape is rounded. Here a strong, pill-shaped toolbar
          floats over a scrolling photo grid.
        </>
      ),
      Demo: BlurPanelToolbar,
      file: demo("blur-panel-toolbar.tsx"),
      minHeight: 400,
    },
    {
      id: "intensity",
      title: "Intensity",
      description: (
        <>
          <Code>intensity</Code> takes a preset — <Code>subtle</Code>, <Code>medium</Code>,{" "}
          <Code>strong</Code> — or a number from 0 to 1. It scales blur (up to 24px), saturation and tint
          together so the panel stays balanced.
        </>
      ),
      Demo: BlurPanelIntensity,
      file: demo("blur-panel-intensity.tsx"),
      minHeight: 280,
    },
  ],
  api: {
    intro: (
      <>
        Also accepts every <Code>&lt;div&gt;</Code> prop. Pass <Code>container</Code> when the panel lives
        inside its own scroll area instead of the page.
      </>
    ),
    props: [
      { name: "as", type: '"div" | "header" | "nav" | "aside" | "footer" | "section"', default: '"div"', description: "Element to render — pick the right landmark." },
      { name: "intensity", type: '"subtle" | "medium" | "strong" | number', default: '"medium"', description: "How frosted the panel gets. Numbers go from 0 to 1." },
      { name: "scrollRange", type: "[number, number] | false", default: "[0, 80]", description: "Scroll distance in px over which the glass fades in. false = always frosted." },
      { name: "container", type: "RefObject<HTMLElement | null>", description: "Scroll container to watch. Defaults to the page." },
      { name: "edge", type: '"top" | "right" | "bottom" | "left" | "none"', default: '"bottom"', description: "Side that gets a hairline as the panel frosts." },
    ],
  },
  accessibility: [
    <>Render it as a landmark with <Code>as=&quot;header&quot;</Code>, <Code>&quot;nav&quot;</Code> or <Code>&quot;aside&quot;</Code>, and give navs an <Code>aria-label</Code>.</>,
    "The tint scales with the blur, and browsers without backdrop-filter get a near-opaque fill, so content under the panel never makes its text unreadable.",
    "Nothing moves: only blur, tint and a hairline fade with scroll, so it's comfortable with reduced motion. Scroll is read through motion values and never re-renders React.",
    "If you put the panel inside its own scroll area, make that area focusable (tabIndex={0}) with a label so keyboard users can scroll it.",
  ],
};

export function BlurPanelDocs() {
  return <ComponentDocs config={config} />;
}
