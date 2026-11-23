import { ComponentDocs, type DocConfig } from "@/components/docs/component-docs";
import { Code } from "@/components/docs/doc-primitives";

import CyberButtonDemo from "@/components/demos/cyber-button/cyber-button-demo";
import CyberButtonGlitchDemo from "@/components/demos/cyber-button/cyber-button-glitch";
import CyberButtonCornersDemo from "@/components/demos/cyber-button/cyber-button-corners";
import CyberButtonLoadingDemo from "@/components/demos/cyber-button/cyber-button-loading";

const demo = (file: string) => `components/demos/cyber-button/${file}`;

const config: DocConfig = {
  category: "Hacker",
  title: "Cyber Button",
  intro:
    "A cyberpunk React button with angled clip-path corners and a hacker-style text scramble on hover: the label cycles through random characters, then resolves — or glitches with an RGB split. Built on the DuskUI Button with Tailwind CSS and Motion, so variants, sizes and the width-stable loading state all keep working.",
  tags: ["Built on DuskUI Button", "Text scramble or glitch", "clip-path corners", "Width-stable", "prefers-reduced-motion"],
  hero: { Demo: CyberButtonDemo, file: demo("cyber-button-demo.tsx") },
  install: {
    registry: "cyber-button",
    source: "components/dusk/hacker/cyber-button.tsx",
    deps: "motion",
    note: (
      <>
        Installs the DuskUI <Code>Button</Code> too. Like the base Button it accepts every native{" "}
        <Code>&lt;button&gt;</Code> prop, except <Code>asChild</Code>.
      </>
    ),
  },
  usage: {
    filename: "cta.tsx",
    code: `import { CyberButton } from "@/components/dusk/hacker/cyber-button"

export function Cta() {
  return <CyberButton size="lg">Jack in</CyberButton>
}`,
  },
  examples: [
    {
      id: "glitch",
      title: "Glitch effect",
      description: (
        <>
          <Code>effect=&quot;glitch&quot;</Code> splits the label into magenta and cyan slices instead of
          scrambling it. Use <Code>effect=&quot;none&quot;</Code> for just the shape.
        </>
      ),
      Demo: CyberButtonGlitchDemo,
      file: demo("cyber-button-glitch.tsx"),
      minHeight: 180,
    },
    {
      id: "corners",
      title: "Corners & cut size",
      description: (
        <>
          <Code>corners</Code> picks which corners are cut and <Code>cut</Code> sets the size in px. The{" "}
          <Code>outline</Code> variant draws its border along the diagonal cuts too.
        </>
      ),
      Demo: CyberButtonCornersDemo,
      file: demo("cyber-button-corners.tsx"),
      minHeight: 180,
    },
    {
      id: "loading",
      title: "Loading",
      description: (
        <>
          <Code>loading</Code> and <Code>loadingText</Code> come straight from the base Button — the width
          stays put and focus is kept. Effects are paused while loading.
        </>
      ),
      Demo: CyberButtonLoadingDemo,
      file: demo("cyber-button-loading.tsx"),
      minHeight: 180,
    },
  ],
  api: {
    intro: (
      <>
        Accepts every DuskUI Button prop (<Code>variant</Code>, <Code>size</Code>, <Code>loading</Code>,{" "}
        <Code>loadingText</Code>…) except <Code>asChild</Code>, plus:
      </>
    ),
    props: [
      { name: "effect", type: '"scramble" | "glitch" | "none"', default: '"scramble"', description: "Hover / keyboard-focus effect on the label." },
      { name: "cut", type: "number", default: "10", description: "Size of the angled corner cuts, in px." },
      { name: "corners", type: '"diagonal" | "reverse" | "all"', default: '"diagonal"', description: "Top-left + bottom-right, top-right + bottom-left, or all four." },
      { name: "duration", type: "number", default: "550", description: "Length of the scramble or glitch, in ms." },
      { name: "characters", type: "string", default: '"A–Z 0–9 #%&*+=/<>[]{}"', description: "Characters used while scrambling." },
    ],
  },
  accessibility: [
    "Screen readers always get the real label: the scrambling copy is aria-hidden and a visually hidden copy of the text names the button.",
    "The real text reserves the width, so scrambling never changes the button's size.",
    "clip-path would cut off a normal focus ring, so keyboard focus shows an inset outline instead; keyboard focus also plays the effect.",
    "Effects run at most once per second, repaint characters about 20 times a second without flashing, and are skipped under prefers-reduced-motion.",
    "Loading keeps focus via aria-disabled + aria-busy, inherited from the base Button.",
  ],
};

export function CyberButtonDocs() {
  return <ComponentDocs config={config} />;
}
