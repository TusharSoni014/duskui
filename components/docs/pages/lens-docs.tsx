import { ComponentDocs, type DocConfig } from "@/components/docs/component-docs";
import { Code } from "@/components/docs/doc-primitives";

import LensDemo from "@/components/demos/lens/lens-demo";
import LensFinePrint from "@/components/demos/lens/lens-fine-print";
import LensPattern from "@/components/demos/lens/lens-pattern";

const demo = (file: string) => `components/demos/lens/${file}`;

const config: DocConfig = {
  title: "Lens",
  intro:
    "A magnifying glass effect for React: a round lens follows the cursor over an image, illustration or any content and shows a zoomed view inside it. Works with the mouse, with press-and-hold on touch screens and with the keyboard, and never re-renders React while it moves.",
  tags: ["Any content, not only images", "Keyboard & touch", "Motion values", "Zoom & size props", "prefers-reduced-motion"],
  hero: { Demo: LensDemo, file: demo("lens-demo.tsx"), minHeight: 380 },
  install: {
    registry: "lens",
    source: "components/dusk/lens/lens.tsx",
    deps: "motion",
  },
  usage: {
    filename: "product-photo.tsx",
    code: `import Image from "next/image"
import { Lens } from "@/components/dusk/lens/lens"

export function ProductPhoto() {
  return (
    <Lens zoom={2.5} size={180} aria-label="Product photo magnifier">
      <Image src="/sneaker.jpg" alt="Sneaker, side view" width={800} height={600} />
    </Lens>
  )
}`,
  },
  examples: [
    {
      id: "fine-print",
      title: "Fine print",
      description: (
        <>
          The lens magnifies any markup, including text. Here a smaller <Code>size</Code> and a higher{" "}
          <Code>zoom</Code> make tiny terms readable.
        </>
      ),
      Demo: LensFinePrint,
      file: demo("lens-fine-print.tsx"),
      minHeight: 300,
    },
    {
      id: "pattern",
      title: "Zoom & ring style",
      description: (
        <>
          A 3.5× lens over a CSS gradient with a dot grid. Restyle the ring with <Code>lensClassName</Code>. For
          images, pass a higher-resolution copy as <Code>lensContent</Code> for a sharper view.
        </>
      ),
      Demo: LensPattern,
      file: demo("lens-pattern.tsx"),
      minHeight: 340,
    },
  ],
  api: {
    intro: (
      <>
        Put padding on the content rather than on <Code>Lens</Code>, so the magnified copy lines up exactly. Also
        accepts any div attribute; pass <Code>aria-label</Code> to describe what is being magnified.
      </>
    ),
    props: [
      { name: "children", type: "ReactNode", description: "The content to magnify." },
      { name: "zoom", type: "number", default: "2", description: "Magnification inside the lens (minimum 1)." },
      { name: "size", type: "number", default: "170", description: "Lens diameter in px." },
      { name: "lensContent", type: "ReactNode", description: "Optional sharper content for the lens, laid out like children." },
      { name: "keyboardStep", type: "number", default: "16", description: "Pixels per arrow-key press; ×4 with Shift." },
      { name: "holdDelay", type: "number", default: "220", description: "Milliseconds a finger must rest before the lens appears on touch." },
      { name: "lensClassName", type: "string", description: "Classes for the lens ring." },
    ],
  },
  accessibility: [
    "The area is focusable. Keyboard focus shows the lens in the centre; the arrow keys move it (Shift for bigger steps), Enter or Space brings it back and Escape hides it.",
    "On touch screens, press and hold to show the lens, then drag; a quick swipe still scrolls the page as usual.",
    "The magnified copy is aria-hidden and inert, so screen readers and the Tab key only meet the original content once.",
    "Give the area an aria-label that says what is being magnified, and keep alt text on the image itself.",
    "With prefers-reduced-motion the lens appears and disappears without fading or scaling; it still follows the pointer directly.",
  ],
};

export function LensDocs() {
  return <ComponentDocs config={config} />;
}
