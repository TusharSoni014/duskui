import { ComponentDocs, type DocConfig } from "@/components/docs/component-docs";
import { Code } from "@/components/docs/doc-primitives";

import DeviceMockupDemo from "@/components/demos/device-mockup/device-mockup-demo";
import DeviceMockupSafariDemo from "@/components/demos/device-mockup/device-mockup-safari";
import DeviceMockupPhonesDemo from "@/components/demos/device-mockup/device-mockup-phones";

const demo = (file: string) => `components/demos/device-mockup/${file}`;

const config: DocConfig = {
  title: "Device Mockup",
  intro:
    "Browser and iPhone mockups for React and Tailwind CSS, drawn entirely in CSS and inline SVG with no images. Wrap a screenshot or live components in a Safari window or a phone with a dynamic island; frames scale with container queries and can tilt slightly toward the cursor.",
  tags: ["Pure CSS & SVG", "Safari + iPhone frames", "Container-query scaling", "Optional 3D tilt", "prefers-reduced-motion"],
  hero: { Demo: DeviceMockupDemo, file: demo("device-mockup-demo.tsx"), minHeight: 440 },
  install: {
    registry: "device-mockup",
    source: "components/dusk/device-mockup/device-mockup.tsx",
    deps: "motion lucide-react",
  },
  usage: {
    filename: "product-shot.tsx",
    code: `import { PhoneMockup, SafariMockup } from "@/components/dusk/device-mockup/device-mockup"

export function ProductShot() {
  return (
    <>
      <SafariMockup url="acme.com" src="/screenshot.png" alt="Acme dashboard" tilt />
      <PhoneMockup className="max-w-[260px]">
        <MobileScreen />
      </PhoneMockup>
    </>
  )
}`,
  },
  examples: [
    {
      id: "safari",
      title: "Safari window with tilt",
      description: (
        <>
          <Code>tilt</Code> rotates the window a few degrees toward a mouse cursor (pass a number for the max
          angle). The toolbar drops its navigation buttons when the window is narrow.
        </>
      ),
      Demo: DeviceMockupSafariDemo,
      file: demo("device-mockup-safari.tsx"),
      minHeight: 380,
    },
    {
      id: "phones",
      title: "Phone finishes",
      description: (
        <>
          <Code>graphite</Code>, <Code>silver</Code> and <Code>mint</Code> (a muted sage) frames. Every dimension is a share
          of the frame&apos;s width, so the island, bezel and status bar stay in proportion at any size. Use{" "}
          <Code>statusBarClassName</Code> to darken the status bar over light screens.
        </>
      ),
      Demo: DeviceMockupPhonesDemo,
      file: demo("device-mockup-phones.tsx"),
      minHeight: 420,
    },
  ],
  api: {
    intro: <>Both components accept any <Code>&lt;div&gt;</Code> attribute. Set the size with <Code>className</Code> (e.g. <Code>max-w-xl</Code>).</>,
    props: [
      { name: "children", type: "ReactNode", description: "What appears on the screen: components, a video or an image." },
      { name: "src / alt", type: "string", description: "Shortcut for a screenshot. Ignored when children are passed." },
      { name: "tilt", type: "boolean | number", default: "false", description: "Tilt toward the cursor on hover (mouse only). true = 4°, or a max angle in degrees." },
      { name: "screenClassName", type: "string", description: "Classes for the screen area." },
      { name: "url", type: "string", default: '"duskui.com"', description: "SafariMockup: text in the address bar." },
      { name: "ratio", type: "number", default: "16 / 10", description: "SafariMockup: screen aspect ratio." },
      { name: "color", type: '"graphite" | "silver" | "mint"', default: '"graphite"', description: "PhoneMockup: frame finish." },
      { name: "statusBar", type: "boolean", default: "true", description: "PhoneMockup: show time, signal and battery over the screen." },
      { name: "time", type: "string", default: '"9:41"', description: "PhoneMockup: time in the status bar." },
      { name: "statusBarClassName", type: "string", description: "PhoneMockup: classes for the status bar, e.g. text-black." },
    ],
  },
  accessibility: [
    <>All frame chrome (toolbar, island, status bar, buttons) is <Code>aria-hidden</Code>; only your screen content is exposed.</>,
    <>Describe screenshots with <Code>alt</Code>, or pass <Code>alt=&quot;&quot;</Code> when they are decorative.</>,
    "The tilt reacts to a mouse only, never touch, and is disabled with prefers-reduced-motion.",
    "Pointer tracking uses motion values, so moving the cursor never re-renders React.",
  ],
};

export function DeviceMockupDocs() {
  return <ComponentDocs config={config} />;
}
