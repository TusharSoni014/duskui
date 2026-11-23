import { ComponentDocs, type DocConfig } from "@/components/docs/component-docs";
import { Code } from "@/components/docs/doc-primitives";

import CustomCursorDemo from "@/components/demos/custom-cursor/custom-cursor-demo";
import CustomCursorLabels from "@/components/demos/custom-cursor/custom-cursor-labels";
import CustomCursorPage from "@/components/demos/custom-cursor/custom-cursor-page";
import CustomCursorSprings from "@/components/demos/custom-cursor/custom-cursor-springs";

const demo = (file: string) => `components/demos/custom-cursor/${file}`;

const config: DocConfig = {
  title: "Custom Cursor",
  intro:
    "A custom cursor component for React and Tailwind CSS: a dot that sits on the pointer and a ring that trails it on a spring, growing over links and buttons and showing short labels like “View” or “Play”. Scoped to a container or the whole page, and it falls back to the native cursor on touch screens and with reduced motion.",
  tags: ["Spring trailing ring", "Hover labels", "Container or page scope", "Zero re-renders on move", "Touch & reduced-motion fallback"],
  hero: { Demo: CustomCursorDemo, file: demo("custom-cursor-demo.tsx"), minHeight: 380 },
  install: {
    registry: "custom-cursor",
    source: "components/dusk/custom-cursor/custom-cursor.tsx",
    deps: "motion",
  },
  usage: {
    filename: "showcase.tsx",
    code: `import { CustomCursor } from "@/components/dusk/custom-cursor/custom-cursor"

export function Showcase() {
  return (
    <CustomCursor className="grid gap-4 overflow-hidden rounded-xl p-6 sm:grid-cols-3">
      <a href="/work/aurora" data-cursor-label="View">Aurora</a>
      <a href="/work/tide" data-cursor-label="View">Tide</a>
      <div data-cursor="hover">Anything can enlarge the ring</div>
    </CustomCursor>
  )
}`,
  },
  examples: [
    {
      id: "labels",
      title: "Hover labels",
      description: (
        <>
          Add <Code>data-cursor-label</Code> to any element and the ring fills with mint and shows the text.
          Keep labels to a word or two; size the bubble with <Code>labelSize</Code>.
        </>
      ),
      Demo: CustomCursorLabels,
      file: demo("custom-cursor-labels.tsx"),
      minHeight: 280,
    },
    {
      id: "springs",
      title: "Spring feel",
      description: (
        <>
          <Code>spring</Code> sets how the ring follows: stiff and damped for a snappy cursor, soft and heavy
          for a floaty one. <Code>data-cursor=&quot;hover&quot;</Code> enlarges the ring over non-interactive
          elements too.
        </>
      ),
      Demo: CustomCursorSprings,
      file: demo("custom-cursor-springs.tsx"),
      minHeight: 300,
    },
    {
      id: "page",
      title: "Page scope",
      description: (
        <>
          Render <Code>{"<CustomCursor scope=\"page\" />"}</Code> once (for example in a layout) to draw the
          cursor across the whole document. It is portaled to <Code>body</Code>; text fields and{" "}
          <Code>data-cursor=&quot;native&quot;</Code> keep the native cursor.
        </>
      ),
      Demo: CustomCursorPage,
      file: demo("custom-cursor-page.tsx"),
      minHeight: 260,
    },
  ],
  api: {
    intro: (
      <>
        In container scope it renders a <Code>div</Code> that accepts any HTML attribute. Data attributes on
        descendants: <Code>data-cursor=&quot;hover&quot;</Code>, <Code>data-cursor-label=&quot;…&quot;</Code>,{" "}
        <Code>data-cursor=&quot;native&quot;</Code>.
      </>
    ),
    props: [
      { name: "scope", type: '"container" | "page"', default: '"container"', description: "Draw only inside this element (wrapping children), or across the whole page." },
      { name: "ringSize", type: "number", default: "32", description: "Ring diameter in px." },
      { name: "hoverSize", type: "number", default: "56", description: "Ring diameter over links, buttons and [data-cursor=\"hover\"]." },
      { name: "labelSize", type: "number", default: "76", description: "Ring diameter when showing a data-cursor-label." },
      { name: "dotSize", type: "number", default: "6", description: "Dot diameter in px." },
      { name: "spring", type: "SpringOptions", default: "{ stiffness: 380, damping: 32, mass: 0.6 }", description: "Spring for the trailing ring. The dot uses a much stiffer one." },
      { name: "hoverSelector", type: "string", description: "Extra CSS selector for elements that enlarge the ring." },
      { name: "className", type: "string", description: "Classes for the container (container scope only)." },
    ],
  },
  accessibility: [
    "The drawn dot and ring are aria-hidden and pointer-events: none; clicks, focus and hover states of your content are untouched.",
    "The native cursor is hidden only inside the scoped area, and only once the custom cursor is active; text inputs keep their caret.",
    "Touch screens, pens and coarse pointers keep the native cursor and render nothing extra.",
    "With prefers-reduced-motion the component is disabled entirely and the native cursor stays.",
    "Pointer tracking uses motion values, so moving the mouse never re-renders React.",
  ],
};

export function CustomCursorDocs() {
  return <ComponentDocs config={config} />;
}
