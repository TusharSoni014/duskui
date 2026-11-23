import { ComponentDocs, type DocConfig } from "@/components/docs/component-docs";
import { Code } from "@/components/docs/doc-primitives";

import PlasmaLoaderDemo from "@/components/demos/plasma-loader/plasma-loader-demo";
import PlasmaLoaderColorsDemo from "@/components/demos/plasma-loader/plasma-loader-colors";
import PlasmaLoaderInlineDemo from "@/components/demos/plasma-loader/plasma-loader-inline";

const demo = (file: string) => `components/demos/plasma-loader/${file}`;

const config: DocConfig = {
  title: "Plasma Loader",
  intro:
    "An animated React loading spinner with a plasma effect: glowing blobs orbit a ring and fuse together through an SVG gooey filter. Built with Motion and Tailwind CSS, sized with one prop, and accessible out of the box with a status role and screen-reader label.",
  tags: ["Gooey SVG filter", "Any size & color", 'role="status"', "Screen-reader label", "prefers-reduced-motion"],
  hero: { Demo: PlasmaLoaderDemo, file: demo("plasma-loader-demo.tsx") },
  install: {
    registry: "plasma-loader",
    source: "components/dusk/neon/plasma-loader.tsx",
    deps: "motion",
  },
  usage: {
    filename: "loading.tsx",
    code: `import { PlasmaLoader } from "@/components/dusk/neon/plasma-loader"

export default function Loading() {
  return (
    <div className="grid min-h-dvh place-items-center">
      <PlasmaLoader size={64} label="Loading dashboard" />
    </div>
  )
}`,
  },
  examples: [
    {
      id: "colors",
      title: "Colors & speed",
      description: (
        <>
          Mix two colors with <Code>color</Code> and <Code>secondaryColor</Code>, and change the orbit time
          with <Code>speed</Code>.
        </>
      ),
      Demo: PlasmaLoaderColorsDemo,
      file: demo("plasma-loader-colors.tsx"),
      minHeight: 180,
    },
    {
      id: "inline",
      title: "Inline status",
      description: (
        <>
          At small sizes it sits next to text, for example while an AI response streams. Give it a
          specific <Code>label</Code> for screen readers.
        </>
      ),
      Demo: PlasmaLoaderInlineDemo,
      file: demo("plasma-loader-inline.tsx"),
      minHeight: 200,
    },
  ],
  api: {
    intro: <>Also accepts any <Code>&lt;span&gt;</Code> prop for the status wrapper.</>,
    props: [
      { name: "size", type: "number", default: "48", description: "Width and height in px." },
      { name: "color", type: "string", default: "var(--color-primary)", description: "Main plasma color." },
      { name: "secondaryColor", type: "string", description: "Second color mixed into the plasma. Defaults to a whiter tint of color." },
      { name: "speed", type: "number", default: "1.6", description: "Seconds for the main blob to complete one orbit." },
      { name: "label", type: "string", default: '"Loading"', description: "Text announced to screen readers." },
    ],
  },
  accessibility: [
    <>The wrapper has <Code>role=&quot;status&quot;</Code> and a visually hidden label, so assistive tech announces what is loading.</>,
    "All visual layers are aria-hidden.",
    "The motion is a smooth orbit with no flashing.",
    "With prefers-reduced-motion the blobs stop orbiting and the plasma gently pulses instead, so it still reads as busy.",
    "Fixed width and height mean swapping it in and out never shifts layout.",
  ],
};

export function PlasmaLoaderDocs() {
  return <ComponentDocs config={config} />;
}
