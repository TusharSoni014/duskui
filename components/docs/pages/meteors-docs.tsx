import { ComponentDocs, type DocConfig } from "@/components/docs/component-docs";
import { Code } from "@/components/docs/doc-primitives";

import MeteorsDemo from "@/components/demos/meteors/meteors-demo";
import MeteorsAngles from "@/components/demos/meteors/meteors-angles";
import MeteorsCard from "@/components/demos/meteors/meteors-card";

const demo = (file: string) => `components/demos/meteors/${file}`;

const config: DocConfig = {
  title: "Meteors",
  intro:
    "An animated meteor shower background for React: shooting stars with glowing heads and fading tails streak across the container at staggered intervals. Seeded so server and client render the same sky, compositor-animated, and paused off-screen.",
  tags: ["Background", "Shooting stars", "Seeded layout", "Pauses off-screen", "Reduced-motion safe"],
  hero: { Demo: MeteorsDemo, file: demo("meteors-demo.tsx"), minHeight: 360 },
  install: {
    registry: "meteors",
    source: "components/dusk/backgrounds/meteors.tsx",
    deps: "motion",
    note: (
      <>
        The sky fills its nearest positioned parent, so give the parent <Code>relative</Code> and{" "}
        <Code>overflow-hidden</Code>, and put your content after it with <Code>relative</Code> so it sits on top.
      </>
    ),
  },
  usage: {
    filename: "hero.tsx",
    code: `import { Meteors } from "@/components/dusk/backgrounds/meteors"

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <Meteors />
      <div className="relative">{/* your content */}</div>
    </section>
  )
}`,
  },
  examples: [
    {
      id: "angles",
      title: "Angle & color",
      description: (
        <>
          <Code>angle</Code> is the direction of travel in degrees (0 is right, 90 is straight down). Paths are fitted
          to the container, so every meteor crosses it at any angle. <Code>tailLength</Code> sets the average tail.
        </>
      ),
      Demo: MeteorsAngles,
      file: demo("meteors-angles.tsx"),
      minHeight: 300,
    },
    {
      id: "card",
      title: "Inside a card",
      description: (
        <>
          Fewer meteors, fewer <Code>stars</Code> and a slower <Code>speed</Code> suit small surfaces like a pricing
          card.
        </>
      ),
      Demo: MeteorsCard,
      file: demo("meteors-card.tsx"),
      minHeight: 380,
    },
  ],
  api: {
    intro: (
      <>
        Any other <Code>div</Code> prop is passed to the root. Meteors are animated with the Web Animations API on
        transform and opacity only, so they run on the compositor.
      </>
    ),
    props: [
      { name: "count", type: "number", default: "12", description: "Number of meteors." },
      { name: "angle", type: "number", default: "135", description: "Direction of travel in degrees: 0 is right, 90 is down." },
      { name: "color", type: "string", default: '"var(--color-primary)"', description: "Tail and glow color. Any CSS color." },
      { name: "speed", type: "number", default: "1", description: "Speed multiplier; also shortens the pause between passes." },
      { name: "tailLength", type: "number", default: "120", description: "Average tail length in px." },
      { name: "stars", type: "number", default: "30", description: "Faint still stars scattered behind the meteors." },
      { name: "seed", type: "number", default: "1", description: "Seed for a different, but stable, sky." },
      { name: "className", type: "string", description: "Merged onto the absolutely positioned root." },
    ],
  },
  accessibility: [
    <>The sky is decorative: it is <Code>aria-hidden</Code> and <Code>pointer-events-none</Code>, so it never reaches screen readers or blocks clicks.</>,
    "With prefers-reduced-motion a few meteors are shown frozen mid-flight instead of moving.",
    "Animations pause while the sky is off-screen or the tab is hidden.",
    "Meteors cross the foreground; keep text on a card or use fewer, slower meteors behind long copy.",
  ],
};

export function MeteorsDocs() {
  return <ComponentDocs config={config} />;
}
