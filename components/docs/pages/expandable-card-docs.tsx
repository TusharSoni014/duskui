import { ComponentDocs, type DocConfig } from "@/components/docs/component-docs";
import { Code } from "@/components/docs/doc-primitives";

import ExpandableCardDemo from "@/components/demos/expandable-card/expandable-card-demo";
import ExpandableCardListDemo from "@/components/demos/expandable-card/expandable-card-list";

const demo = (file: string) => `components/demos/expandable-card/${file}`;

const config: DocConfig = {
  title: "Expandable Card",
  intro:
    "Expandable cards for React and Tailwind CSS: click a card and it grows into a large overlay panel, with the image, title and summary morphing into place through shared Motion layout animations. Built on Radix Dialog, so focus trapping, Escape, outside click and focus return work out of the box.",
  tags: ["Shared layoutId morph", "Radix Dialog", "Grid or list", "Data-driven", "prefers-reduced-motion"],
  hero: { Demo: ExpandableCardDemo, file: demo("expandable-card-demo.tsx"), minHeight: 520 },
  install: {
    registry: "expandable-card",
    source: "components/dusk/expandable-card/expandable-card.tsx",
    deps: "motion @radix-ui/react-dialog lucide-react",
  },
  usage: {
    filename: "projects.tsx",
    code: `import { ExpandableCard } from "@/components/dusk/expandable-card/expandable-card"

const items = [
  {
    id: "atlas",
    title: "Atlas",
    subtitle: "Case study",
    description: "A design system for a fleet of internal tools.",
    media: <img src="/atlas.jpg" alt="" />,
    content: <p>Longer story shown only in the expanded panel.</p>,
  },
]

export function Projects() {
  return <ExpandableCard items={items} />
}`,
  },
  examples: [
    {
      id: "list",
      title: "List layout",
      description: (
        <>
          <Code>layout=&quot;list&quot;</Code> shows compact rows with a thumbnail that grows into the
          panel&apos;s full-width artwork. Good for playlists, changelogs and team pages.
        </>
      ),
      Demo: ExpandableCardListDemo,
      file: demo("expandable-card-list.tsx"),
      minHeight: 400,
    },
  ],
  api: {
    intro: (
      <>
        Each item is <Code>{"{ id, title, subtitle?, description, media?, content?, action? }"}</Code>. The
        root also accepts any <Code>&lt;div&gt;</Code> attribute.
      </>
    ),
    props: [
      { name: "items", type: "ExpandableCardItem[]", description: "Cards to render. media, title, subtitle and description are shared between the card and the panel." },
      { name: "layout", type: '"grid" | "list"', default: '"grid"', description: "Media-first tiles in a responsive grid, or compact rows." },
      { name: "onActiveChange", type: "(id: string | null) => void", description: "Called with the expanded item's id, or null when the panel closes." },
      { name: "cardClassName", type: "string", description: "Classes for each card." },
      { name: "panelClassName", type: "string", description: "Classes for the expanded panel, e.g. a wider max-w." },
      { name: "item.content", type: "ReactNode", description: "Extra content that fades in only in the panel." },
      { name: "item.action", type: "ReactNode", description: "A button or link at the bottom of the panel." },
    ],
  },
  accessibility: [
    <>Each card is a real <Code>&lt;button&gt;</Code> with <Code>aria-haspopup=&quot;dialog&quot;</Code>.</>,
    "The panel is a Radix Dialog: focus moves inside and is trapped, the page behind is inert, and the title and summary are wired to aria-labelledby and aria-describedby.",
    "Escape, the close button and clicking the backdrop all close it, and focus returns to the exact card that opened it.",
    "With prefers-reduced-motion the layout morph is turned off and the panel simply fades in and out.",
    <>Give images in <Code>media</Code> an <Code>alt</Code> (or <Code>alt=&quot;&quot;</Code> when the title already describes them).</>,
  ],
};

export function ExpandableCardDocs() {
  return <ComponentDocs config={config} />;
}
