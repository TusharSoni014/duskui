import { ComponentDocs, type DocConfig } from "@/components/docs/component-docs";
import { Code } from "@/components/docs/doc-primitives";

import RippleDemo from "@/components/demos/ripple/ripple-demo";
import RippleClick from "@/components/demos/ripple/ripple-click";
import RippleAvatar from "@/components/demos/ripple/ripple-avatar";

const demo = (file: string) => `components/demos/ripple/${file}`;

const config: DocConfig = {
  title: "Ripple",
  intro:
    "An animated ripple background for React: concentric rings expand from the center in a seamless, staggered loop, like a radar ping or a drop in still water. Turn on interactive mode and every click or tap sends ripples out from the pointer. Crisp SVG rings, scaled on the compositor.",
  tags: ["Background", "Seamless loop", "Click to ripple", "SVG", "Pauses off-screen", "Reduced-motion safe"],
  hero: { Demo: RippleDemo, file: demo("ripple-demo.tsx"), minHeight: 400 },
  install: {
    registry: "ripple",
    source: "components/dusk/ripple/ripple.tsx",
    deps: "motion",
    note: (
      <>
        The rings fill and center on their nearest positioned parent, so give the parent <Code>relative</Code> and{" "}
        <Code>overflow-hidden</Code>, and put your content after it with <Code>relative</Code>.
      </>
    ),
  },
  usage: {
    filename: "nearby.tsx",
    code: `import { Ripple } from "@/components/dusk/ripple/ripple"

export function Nearby() {
  return (
    <div className="relative flex h-96 items-center justify-center overflow-hidden">
      <Ripple mainCircleSize={140} numCircles={6} />
      <div className="relative">{/* your content */}</div>
    </div>
  )
}`,
  },
  examples: [
    {
      id: "click",
      title: "Click to ripple",
      description: (
        <>
          <Code>interactive</Code> listens for presses on the parent element and spawns a burst of rings at the
          pointer. <Code>numCircles={"{0}"}</Code> turns the center loop off; <Code>clickSize</Code> sets how far
          each burst travels.
        </>
      ),
      Demo: RippleClick,
      file: demo("ripple-click.tsx"),
      minHeight: 340,
    },
    {
      id: "avatar",
      title: "Around an avatar",
      description: (
        <>
          A small <Code>mainCircleSize</Code>, fewer rings, a tighter <Code>circleGap</Code> and a shorter{" "}
          <Code>duration</Code> make a ringing-call indicator. Size the root with a class to center the rings on
          part of a card.
        </>
      ),
      Demo: RippleAvatar,
      file: demo("ripple-avatar.tsx"),
      minHeight: 380,
    },
  ],
  api: {
    intro: (
      <>
        Any other <Code>div</Code> prop is passed to the root. Rings are animated with the Web Animations API on
        transform and opacity only, and their strokes don&apos;t scale, so lines stay 1px at every size.
      </>
    ),
    props: [
      { name: "mainCircleSize", type: "number", default: "140", description: "Diameter in px of the innermost ring, where rings are born." },
      { name: "numCircles", type: "number", default: "4", description: "Rings in the loop; 0 turns the loop off." },
      { name: "circleGap", type: "number", default: "80", description: "Diameter difference in px between neighbouring rings." },
      { name: "color", type: "string", default: '"rgb(255 255 255)"', description: "Ring color. Any CSS color." },
      { name: "duration", type: "number", default: "8", description: "Seconds for one ring to travel from center to edge." },
      { name: "interactive", type: "boolean", default: "false", description: "Spawn ripples where the pointer presses inside the parent." },
      { name: "clickSize", type: "number", default: "280", description: "Final diameter in px of a pointer ripple." },
      { name: "className", type: "string", description: "Merged onto the absolutely positioned root." },
    ],
  },
  accessibility: [
    <>The ripple is decorative: it is <Code>aria-hidden</Code> and <Code>pointer-events-none</Code>. Interactive mode listens on the parent, so buttons and links on top keep working.</>,
    "With prefers-reduced-motion the rings stay in their resting positions and presses spawn nothing.",
    "The loop pauses while the ripple is off-screen or the tab is hidden.",
    "Pointer ripples are visual feedback only; don't rely on them to confirm an action.",
  ],
};

export function RippleDocs() {
  return <ComponentDocs config={config} />;
}
