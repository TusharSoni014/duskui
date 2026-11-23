import { ComponentDocs, type DocConfig } from "@/components/docs/component-docs";
import { Code } from "@/components/docs/doc-primitives";

import ProgressiveBlurCard from "@/components/demos/progressive-blur/progressive-blur-card";
import ProgressiveBlurDemo from "@/components/demos/progressive-blur/progressive-blur-demo";
import ProgressiveBlurGallery from "@/components/demos/progressive-blur/progressive-blur-gallery";
import ProgressiveBlurIntensity from "@/components/demos/progressive-blur/progressive-blur-intensity";

const demo = (file: string) => `components/demos/progressive-blur/${file}`;

const config: DocConfig = {
  title: "Progressive Blur",
  intro:
    "A progressive blur effect for React and Tailwind CSS: stacked backdrop-filter bands with overlapping gradient masks fade scrolling content into a smooth blur at any edge, like the toolbars in iOS and macOS. Pure CSS with no JavaScript, so it works in Server Components and costs nothing at runtime.",
  tags: ["Pure CSS", "Server Component", "Any edge", "Smooth multi-layer ramp", "pointer-events: none"],
  hero: { Demo: ProgressiveBlurDemo, file: demo("progressive-blur-demo.tsx"), minHeight: 460 },
  install: {
    registry: "progressive-blur",
    source: "components/dusk/progressive-blur/progressive-blur.tsx",
    deps: "",
  },
  usage: {
    filename: "feed.tsx",
    code: `import { ProgressiveBlur } from "@/components/dusk/progressive-blur/progressive-blur"

export function Feed() {
  return (
    // The wrapper doesn't scroll, so the blur stays pinned to its edge.
    <div className="relative h-96 overflow-hidden rounded-xl">
      <div className="h-full overflow-y-auto">{/* long content */}</div>
      <ProgressiveBlur position="bottom" height={96} blurIntensity={12} />
    </div>
  )
}`,
  },
  examples: [
    {
      id: "gallery",
      title: "Horizontal gallery",
      description: (
        <>
          Use <Code>left</Code> and <Code>right</Code> for sideways scrollers. On side edges{" "}
          <Code>height</Code> is the depth of the band, i.e. its width.
        </>
      ),
      Demo: ProgressiveBlurGallery,
      file: demo("progressive-blur-gallery.tsx"),
      minHeight: 280,
    },
    {
      id: "intensity",
      title: "Intensity & height",
      description: (
        <>
          <Code>blurIntensity</Code> is the blur in px at the very edge; each band inward halves it.{" "}
          <Code>height</Code> accepts px or any CSS length, and <Code>layers</Code> trades smoothness for GPU work.
        </>
      ),
      Demo: ProgressiveBlurIntensity,
      file: demo("progressive-blur-intensity.tsx"),
      minHeight: 300,
    },
    {
      id: "caption",
      title: "Caption card",
      description: (
        <>
          A strong blur plus a <Code>tint</Code> makes a legible caption area over busy imagery without a hard
          scrim edge.
        </>
      ),
      Demo: ProgressiveBlurCard,
      file: demo("progressive-blur-card.tsx"),
      minHeight: 400,
    },
  ],
  api: {
    intro: <>Also accepts any HTML attribute for the overlay. Place it inside a positioned parent.</>,
    props: [
      { name: "position", type: '"top" | "bottom" | "left" | "right" | "both"', default: '"bottom"', description: "Edge the blur builds toward. both = top and bottom." },
      { name: "blurIntensity", type: "number", default: "12", description: "Blur in px at the edge; each band inward halves it." },
      { name: "height", type: "number | string", default: '"30%"', description: "Depth of the band from the edge, in px or any CSS length." },
      { name: "layers", type: "number", default: "6", description: "Number of stacked bands (min 2)." },
      { name: "tint", type: "string", description: "Optional color that fades in toward the edge, e.g. var(--background)." },
      { name: "className", type: "string", description: "Classes for the overlay (e.g. z-index or rounded corners)." },
    ],
  },
  accessibility: [
    "The overlay is aria-hidden and pointer-events: none, so content underneath stays clickable, selectable and scrollable.",
    "Nothing animates; the effect is static CSS and unaffected by motion preferences.",
    "Keep important text out of the blurred band, or add padding to the scroll container so it can scroll clear of it.",
    "Without backdrop-filter support only the optional tint is drawn and content stays fully readable.",
  ],
};

export function ProgressiveBlurDocs() {
  return <ComponentDocs config={config} />;
}
