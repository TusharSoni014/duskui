import { ComponentDocs, type DocConfig } from "@/components/docs/component-docs";
import { Code } from "@/components/docs/doc-primitives";

import ShineBorderDemo from "@/components/demos/shine-border/shine-border-demo";
import ShineBorderColorsDemo from "@/components/demos/shine-border/shine-border-colors";
import ShineBorderWidthDemo from "@/components/demos/shine-border/shine-border-width";

const demo = (file: string) => `components/demos/shine-border/${file}`;

const config: DocConfig = {
  title: "Shine Border",
  intro:
    "A React shine border: a thin outline with a soft, multi-color sheen gliding around any card, badge or panel. Built with Motion and Tailwind CSS, it follows the real rounded shape at any aspect ratio, pauses off-screen and stays still for prefers-reduced-motion.",
  tags: ["Multi-color sheen", "Any aspect ratio", "Pauses off-screen", "No layout shift", "prefers-reduced-motion"],
  hero: { Demo: ShineBorderDemo, file: demo("shine-border-demo.tsx"), minHeight: 280 },
  install: {
    registry: "shine-border",
    source: "components/dusk/shine-border/shine-border.tsx",
    deps: "motion",
  },
  usage: {
    filename: "promo-card.tsx",
    code: `import { ShineBorder } from "@/components/dusk/shine-border/shine-border"

export function PromoCard() {
  return (
    <ShineBorder color={["#a78bfa", "#22d3ee"]} contentClassName="p-6">
      <h3 className="font-semibold">Upgrade to Pro</h3>
      <p className="text-sm text-white/60">Unlock every animated block.</p>
    </ShineBorder>
  )
}`,
  },
  examples: [
    {
      id: "colors",
      title: "Colors",
      description: (
        <>
          <Code>color</Code> takes one CSS color or an array. Multiple colors blend from the core of the
          sheen outwards; a second sheen runs half a lap behind with the colors reversed.
        </>
      ),
      Demo: ShineBorderColorsDemo,
      file: demo("shine-border-colors.tsx"),
      minHeight: 200,
    },
    {
      id: "width-speed",
      title: "Width, speed & shape",
      description: (
        <>
          <Code>borderWidth</Code> sets the line thickness, <Code>duration</Code> the seconds per lap and{" "}
          <Code>radius</Code> the corner radius — a large radius gives a pill.
        </>
      ),
      Demo: ShineBorderWidthDemo,
      file: demo("shine-border-width.tsx"),
      minHeight: 200,
    },
  ],
  api: {
    intro: (
      <>
        Also accepts every <Code>&lt;div&gt;</Code> prop. The content wrapper paints{" "}
        <Code>bg-card</Code> by default; override it with <Code>contentClassName</Code>.
      </>
    ),
    props: [
      { name: "color", type: "string | string[]", default: "var(--color-primary)", description: "One CSS color, or several that blend from the sheen's core outwards." },
      { name: "borderWidth", type: "number", default: "1", description: "Border width in px." },
      { name: "duration", type: "number", default: "8", description: "Seconds for the sheen to travel once around the border." },
      { name: "radius", type: "number", default: "12", description: "Corner radius in px." },
      { name: "contentClassName", type: "string", description: "Classes for the inner content wrapper (padding, background)." },
      { name: "className", type: "string", description: "Classes for the outer wrapper, merged with tailwind-merge." },
    ],
  },
  accessibility: [
    "The border layers are aria-hidden and absolutely positioned, so they never reach screen readers or change the size of the content.",
    "Content is rendered as-is: links, buttons and headings inside keep their own semantics and focus styles.",
    "With prefers-reduced-motion the sheen is parked in one place instead of moving; it also pauses whenever the element is off-screen.",
    "Animation runs on Motion values, so it never re-renders React and is cleaned up on unmount.",
  ],
};

export function ShineBorderDocs() {
  return <ComponentDocs config={config} />;
}
