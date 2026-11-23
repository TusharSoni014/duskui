import { ComponentDocs, type DocConfig } from "@/components/docs/component-docs";
import { Code } from "@/components/docs/doc-primitives";

import NeonBorderDemo from "@/components/demos/neon-border/neon-border-demo";
import NeonBorderHoverDemo from "@/components/demos/neon-border/neon-border-hover";
import NeonBorderTwoToneDemo from "@/components/demos/neon-border/neon-border-two-tone";

const demo = (file: string) => `components/demos/neon-border/${file}`;

const config: DocConfig = {
  category: "Neon",
  title: "Neon Border",
  intro:
    "An animated neon border for any React element: a beam of light travels around the edge with a soft glow. Built with Motion and Tailwind CSS using a masked conic gradient, so it fits cards, pricing tables, pills and inputs at any size or aspect ratio.",
  tags: ["Wraps any content", "Travelling light beam", "Hover trigger", "Pauses off-screen", "prefers-reduced-motion"],
  hero: { Demo: NeonBorderDemo, file: demo("neon-border-demo.tsx"), minHeight: 320 },
  install: {
    registry: "neon-border",
    source: "components/dusk/neon/neon-border.tsx",
    deps: "motion",
    note: (
      <>
        The border sits outside your content, so give the content its own background (for example{" "}
        <Code>contentClassName=&quot;bg-card&quot;</Code>) to keep the glow from tinting it.
      </>
    ),
  },
  usage: {
    filename: "featured-plan.tsx",
    code: `import { NeonBorder } from "@/components/dusk/neon/neon-border"

export function FeaturedPlan() {
  return (
    <NeonBorder radius={20} contentClassName="bg-card p-6">
      <h3>Pro</h3>
      <p>Everything in Free, plus…</p>
    </NeonBorder>
  )
}`,
  },
  examples: [
    {
      id: "hover",
      title: "On hover",
      description: (
        <>
          With <Code>trigger=&quot;hover&quot;</Code> the beam only lights up while the pointer is over
          the element or keyboard focus is inside it — great for link cards.
        </>
      ),
      Demo: NeonBorderHoverDemo,
      file: demo("neon-border-hover.tsx"),
      minHeight: 200,
    },
    {
      id: "two-tone",
      title: "Two-tone & pill",
      description: (
        <>
          <Code>secondaryColor</Code> fades the beam&apos;s tail into a second color. Set a large{" "}
          <Code>radius</Code> for pills and badges, and tune <Code>thickness</Code>, <Code>glow</Code> and{" "}
          <Code>speed</Code>.
        </>
      ),
      Demo: NeonBorderTwoToneDemo,
      file: demo("neon-border-two-tone.tsx"),
      minHeight: 200,
    },
  ],
  api: {
    intro: <>Also accepts any <Code>&lt;div&gt;</Code> prop for the outer wrapper.</>,
    props: [
      { name: "color", type: "string", default: "var(--color-primary)", description: "Any CSS color for the beam and the dim resting tube." },
      { name: "secondaryColor", type: "string", description: "Color the beam's tail fades into." },
      { name: "speed", type: "number", default: "4", description: "Seconds per lap around the border." },
      { name: "thickness", type: "number", default: "2", description: "Border width in px." },
      { name: "radius", type: "number | string", default: "16", description: "Corner radius in px or any CSS length." },
      { name: "glow", type: "number", default: "1", description: "Bloom strength around the beam. 0 turns it off." },
      { name: "trigger", type: '"always" | "hover"', default: '"always"', description: "Run continuously, or only on hover / focus-within." },
      { name: "contentClassName", type: "string", description: "Classes for the inner content wrapper." },
    ],
  },
  accessibility: [
    "All border and glow layers are aria-hidden and pointer-events-none; your content keeps its own semantics and focus order.",
    "The hover trigger also responds to keyboard focus anywhere inside the wrapper.",
    "The beam moves smoothly with no flashing, and the animation pauses while the element is off-screen.",
    "With prefers-reduced-motion the beam stops and the whole border stays steadily lit.",
  ],
};

export function NeonBorderDocs() {
  return <ComponentDocs config={config} />;
}
