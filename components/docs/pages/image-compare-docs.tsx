import { ComponentDocs, type DocConfig } from "@/components/docs/component-docs";
import { Code } from "@/components/docs/doc-primitives";

import ImageCompareDemo from "@/components/demos/image-compare/image-compare-demo";
import ImageCompareVerticalDemo from "@/components/demos/image-compare/image-compare-vertical";
import ImageCompareHoverDemo from "@/components/demos/image-compare/image-compare-hover";

const demo = (file: string) => `components/demos/image-compare/${file}`;

const config: DocConfig = {
  title: "Image Compare",
  intro:
    "A before/after image comparison slider for React and Tailwind CSS: drag the divider with mouse, pen or touch, follow the cursor in hover mode, or step it with the keyboard to reveal one layer over another through a clip-path. Works horizontally or vertically with any two children — photos, SVGs, or whole components — and never re-renders while dragging.",
  tags: ["Drag, touch & hover", "Horizontal / vertical", "Any two layers", "Slider a11y", "No re-renders", "prefers-reduced-motion"],
  hero: { Demo: ImageCompareDemo, file: demo("image-compare-demo.tsx"), minHeight: 380 },
  install: {
    registry: "image-compare",
    source: "components/dusk/image-compare/image-compare.tsx",
    deps: "motion lucide-react",
  },
  usage: {
    filename: "photo-edit.tsx",
    code: `import { ImageCompare } from "@/components/dusk/image-compare/image-compare"

export function PhotoEdit() {
  return (
    <ImageCompare
      className="aspect-video max-w-2xl"
      beforeLabel="Original"
      afterLabel="Edited"
      before={<img src="/original.jpg" alt="Original photo" />}
      after={<img src="/edited.jpg" alt="Color-graded photo" />}
    />
  )
}`,
  },
  examples: [
    {
      id: "vertical",
      title: "Vertical",
      description: (
        <>
          <Code>orientation=&quot;vertical&quot;</Code> moves the divider top to bottom. Size the frame with any aspect-ratio
          class; both layers stretch to fill it.
        </>
      ),
      Demo: ImageCompareVerticalDemo,
      file: demo("image-compare-vertical.tsx"),
      minHeight: 460,
    },
    {
      id: "hover",
      title: "Hover to compare",
      description: (
        <>
          With <Code>mode=&quot;hover&quot;</Code> the divider follows the mouse without pressing. Touch screens still
          drag. The layers here are live components, not images.
        </>
      ),
      Demo: ImageCompareHoverDemo,
      file: demo("image-compare-hover.tsx"),
      minHeight: 340,
    },
  ],
  api: {
    intro: <>Also accepts any div attribute. Give it a size with <Code>className</Code> (it defaults to <Code>aspect-[16/10] w-full</Code>).</>,
    props: [
      { name: "before", type: "ReactNode", description: "Layer shown on the left (or top). Stretched to fill; images get object-cover." },
      { name: "after", type: "ReactNode", description: "Layer shown on the right (or bottom)." },
      { name: "beforeLabel / afterLabel", type: "ReactNode", description: "Corner badges. Strings also name the layers in the slider's value text." },
      { name: "orientation", type: '"horizontal" | "vertical"', default: '"horizontal"', description: "Direction the divider travels." },
      { name: "mode", type: '"drag" | "hover"', default: '"drag"', description: "Press-and-drag, or follow the mouse. Touch always drags." },
      { name: "position", type: "number", description: "Controlled position in percent: how much of the before layer is visible." },
      { name: "defaultPosition", type: "number", default: "50", description: "Starting position when uncontrolled." },
      { name: "onPositionChange", type: "(position: number) => void", description: "Called as the divider moves." },
      { name: "step", type: "number", default: "2", description: "Percent per arrow key. Page Up / Page Down move 10." },
      { name: "label", type: "string", default: '"Comparison slider"', description: "Accessible name of the slider." },
    ],
  },
  accessibility: [
    <>The handle is a focusable <Code>role=&quot;slider&quot;</Code> with <Code>aria-valuenow</Code>, <Code>aria-orientation</Code> and value text such as “40% before, 60% after”.</>,
    "Arrow keys move the divider by step, Page Up / Page Down by 10%, Home and End jump to either edge.",
    "Pressing anywhere on the frame jumps the divider there and focuses the handle, so keyboard and pointer stay in sync.",
    <>Horizontal sliders keep vertical page scrolling on touch (<Code>touch-action: pan-y</Code>), vertical ones keep horizontal scrolling.</>,
    "Give images meaningful alt text — both layers stay in the accessibility tree.",
    "With prefers-reduced-motion, clicks and keyboard jumps snap instead of gliding.",
  ],
};

export function ImageCompareDocs() {
  return <ComponentDocs config={config} />;
}
