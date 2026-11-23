import { ComponentDocs, type DocConfig } from "@/components/docs/component-docs";
import { Code } from "@/components/docs/doc-primitives";

import BentoGridDemo from "@/components/demos/bento-grid/bento-grid-demo";
import BentoGridFourColumnsDemo from "@/components/demos/bento-grid/bento-grid-four-columns";

const demo = (file: string) => `components/demos/bento-grid/${file}`;

const config: DocConfig = {
  title: "Bento Grid",
  intro:
    "A responsive bento grid for React and Tailwind CSS, made for feature sections and landing pages. Cards span columns and rows, and on hover or keyboard focus the background visual scales and brightens, a glow follows the cursor and the content lifts to reveal a call to action. Each linked card is a single, focusable link.",
  tags: ["Responsive spans", "Hover reveal CTA", "Cursor glow", "Whole-card links", "Next.js Link support", "prefers-reduced-motion"],
  hero: { Demo: BentoGridDemo, file: demo("bento-grid-demo.tsx"), minHeight: 720 },
  install: {
    registry: "bento-grid",
    source: "components/dusk/bento-grid/bento-grid.tsx",
    deps: "motion lucide-react",
  },
  usage: {
    filename: "features.tsx",
    code: `import Link from "next/link"
import { Globe, Rocket } from "lucide-react"
import { BentoCard, BentoGrid } from "@/components/dusk/bento-grid/bento-grid"

export function Features() {
  return (
    <BentoGrid columns={3}>
      <BentoCard
        colSpan={2}
        href="/docs/deploy"
        linkAs={Link}
        icon={<Rocket />}
        title="Deploy in one command"
        description="Push to main and you're live everywhere."
        cta="Read the guide"
        background={<div className="absolute inset-0 bg-linear-to-br from-primary/30 to-transparent" />}
      />
      <BentoCard
        rowSpan={2}
        href="/docs/edge"
        linkAs={Link}
        icon={<Globe />}
        title="Global edge"
        description="Served from the closest region."
      />
    </BentoGrid>
  )
}`,
  },
  examples: [
    {
      id: "four-columns",
      title: "Four columns, static cards",
      description: (
        <>
          <Code>columns</Code> sets the column count on large screens (tablets get two, phones one). Cards without{" "}
          <Code>href</Code> are plain containers: they keep the glow and the background zoom but show no call to
          action. Change the row height with an <Code>auto-rows-*</Code> class.
        </>
      ),
      Demo: BentoGridFourColumnsDemo,
      file: demo("bento-grid-four-columns.tsx"),
      minHeight: 640,
    },
  ],
  api: {
    intro: (
      <>
        <Code>BentoGrid</Code> takes <Code>columns</Code> (<Code>2 | 3 | 4</Code>, default <Code>3</Code>) plus any{" "}
        <Code>div</Code> attribute. <Code>BentoCard</Code> takes the props below plus any HTML attribute.
      </>
    ),
    props: [
      { name: "title", type: "ReactNode", description: "Card heading." },
      { name: "description", type: "ReactNode", description: "Text under the title." },
      { name: "icon", type: "ReactNode", description: "Small icon above the title." },
      { name: "background", type: "ReactNode", description: "Decorative visual behind the content; it scales and brightens on hover. Rendered aria-hidden." },
      { name: "href", type: "string", description: "Makes the whole card one link." },
      { name: "linkAs", type: "ElementType", default: '"a"', description: "Link component for href, e.g. Next.js Link." },
      { name: "cta", type: "ReactNode", default: '"Learn more"', description: "Call to action revealed on hover / focus. Links only; pass null to hide it." },
      { name: "colSpan", type: "1 | 2 | 3 | 4", default: "1", description: "Columns to span from sm up, clamped to the grid's columns." },
      { name: "rowSpan", type: "1 | 2 | 3", default: "1", description: "Rows to span from sm up." },
      { name: "glowColor", type: "string", default: "var(--color-primary)", description: "Color of the cursor glow." },
      { name: "titleAs", type: '"h2" | "h3" | "h4"', default: '"h3"', description: "Heading element for the title." },
    ],
  },
  accessibility: [
    "A card with href is a single link: one Tab stop whose accessible name is its title, description and call to action. It has a visible focus ring, and focus triggers the same reveal as hover.",
    <>Pick the right heading level with <Code>titleAs</Code> so the cards fit your page outline.</>,
    "The background visual and the glow are aria-hidden decoration.",
    "On touch screens (no hover) the call to action is always visible, so nothing is hidden behind a hover.",
    "With prefers-reduced-motion nothing slides or zooms; the call to action and the brighter background only fade in.",
    "The reveal is CSS transform and opacity and the glow uses Motion values, so hovering never re-renders React.",
  ],
};

export function BentoGridDocs() {
  return <ComponentDocs config={config} />;
}
