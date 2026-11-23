import { ComponentDocs, type DocConfig } from "@/components/docs/component-docs";
import { Code } from "@/components/docs/doc-primitives";

import CollapsibleBasicDemo from "@/components/demos/collapsible/collapsible-basic";
import MotionCollapsibleDemo from "@/components/demos/collapsible/motion-collapsible-demo";
import ShowMoreDemo from "@/components/demos/collapsible/show-more-demo";
import ShowMoreListDemo from "@/components/demos/collapsible/show-more-list-demo";

const demo = (file: string) => `components/demos/collapsible/${file}`;
const block = (file: string) => `components/dusk/collapsible/${file}`;

const config: DocConfig = {
  title: "Collapsible",
  intro:
    "An animated React collapsible built on shadcn/ui and Radix: the drop-in Collapsible eases its height open and fades content in, plus a spring-physics Motion collapsible with a rotating chevron and show-more blocks that expand clamped text and long lists smoothly.",
  tags: ["Drop-in shadcn API", "Radix Collapsible", "Height animation", "Show more", "prefers-reduced-motion"],
  hero: { Demo: MotionCollapsibleDemo, file: demo("motion-collapsible-demo.tsx"), minHeight: 360 },
  install: {
    registry: "collapsible",
    source: "components/ui/collapsible.tsx",
    deps: "@radix-ui/react-collapsible",
    note: (
      <>
        Replaces <Code>components/ui/collapsible.tsx</Code> with the same exports. The height animation
        uses Radix&apos;s <Code>--radix-collapsible-content-height</Code> with the{" "}
        <Code>collapsible-down</Code> / <Code>collapsible-up</Code> keyframes from tw-animate-css, which
        shadcn projects already include.
      </>
    ),
  },
  usage: {
    filename: "details.tsx",
    code: `import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"

export function Details() {
  return (
    <Collapsible>
      <CollapsibleTrigger>Can I use this in my project?</CollapsibleTrigger>
      <CollapsibleContent>Yes. Free for personal and commercial use.</CollapsibleContent>
    </Collapsible>
  )
}`,
  },
  examples: [
    {
      id: "default",
      title: "Default",
      description: (
        <>
          A controlled Collapsible with a Button trigger (<Code>asChild</Code>). The extra rows grow in
          and fade as the panel opens, and close quicker than they open; nothing below them jumps.
        </>
      ),
      Demo: CollapsibleBasicDemo,
      file: demo("collapsible-basic.tsx"),
      minHeight: 300,
    },
  ],
  blocks: [
    {
      id: "motion-collapsible",
      title: "Motion Collapsible",
      registry: "motion-collapsible",
      source: block("motion-collapsible.tsx"),
      deps: "motion @radix-ui/react-collapsible lucide-react",
      description: (
        <>
          The panel eases its height open while the content fades in after it, and the chevron turns. Open
          panels get a slightly brighter outline. Closed content stays in the
          DOM as <Code>inert</Code>, so it&apos;s indexed by search engines but skipped by keyboard and screen
          readers.
        </>
      ),
      Demo: MotionCollapsibleDemo,
      file: demo("motion-collapsible-demo.tsx"),
      minHeight: 360,
      props: [
        { name: "open / defaultOpen / onOpenChange", type: "boolean", default: "false", description: "On MotionCollapsible: controlled or uncontrolled state." },
        { name: "bordered", type: "boolean", default: "true", description: "On MotionCollapsible: card outline that brightens while open." },
        { name: "disabled", type: "boolean", default: "false", description: "On MotionCollapsible: prevent toggling." },
        { name: "icon", type: "ReactNode | null", description: "On MotionCollapsibleTrigger: replaces the chevron (still rotates); null hides it." },
        { name: "className", type: "string", description: "On MotionCollapsibleContent: styles the inner padded wrapper." },
      ],
    },
    {
      id: "show-more",
      title: "Show More",
      registry: "show-more",
      source: block("show-more.tsx"),
      deps: "motion lucide-react",
      description: (
        <>
          <Code>ShowMore</Code> clamps long text to a preview that fades out at the bottom. The height springs
          to <Code>auto</Code> and the fade mask dissolves as it opens; the toggle hides itself when the
          content already fits. The full text is always in the DOM, so it stays indexable.
        </>
      ),
      Demo: ShowMoreDemo,
      file: demo("show-more-demo.tsx"),
      minHeight: 300,
      props: [
        { name: "collapsedHeight", type: "number", default: "120", description: "Height of the clamped preview, in px." },
        { name: "expanded / defaultExpanded / onExpandedChange", type: "boolean", default: "false", description: "Controlled or uncontrolled state." },
        { name: "moreLabel / lessLabel", type: "ReactNode", default: '"Show more" / "Show less"', description: "Button text. Both share one grid cell, so the button never resizes." },
        { name: "contentClassName", type: "string", description: "Classes for the content wrapper (typography, spacing)." },
      ],
    },
    {
      id: "show-more-list",
      title: "Show More List",
      registry: "show-more",
      source: block("show-more.tsx"),
      deps: "motion lucide-react",
      description: (
        <>
          <Code>ShowMoreList</Code> (same file) shows the first items of a list and reveals the rest with a
          staggered spring — each row grows in, fades and slides up, then folds away in reverse. It stays one
          semantic <Code>ul</Code>, and the button says how many items are hidden.
        </>
      ),
      Demo: ShowMoreListDemo,
      file: demo("show-more-list-demo.tsx"),
      minHeight: 360,
      props: [
        { name: "items / renderItem", type: "T[] / (item: T, index: number) => ReactNode", description: "The data and how to render one item inside its li." },
        { name: "getKey", type: "(item: T, index: number) => Key", description: "Stable key per item. Defaults to the index." },
        { name: "initialCount", type: "number", default: "3", description: "Items visible before expanding." },
        { name: "expanded / defaultExpanded / onExpandedChange", type: "boolean", default: "false", description: "Controlled or uncontrolled state." },
        { name: "moreLabel / lessLabel", type: "(hidden: number) => ReactNode / ReactNode", default: '"Show N more" / "Show less"', description: "Button text." },
        { name: "listClassName / itemClassName", type: "string", description: "Classes for the ul and every li." },
      ],
    },
  ],
  api: {
    intro: (
      <>
        Same parts as shadcn/ui: <Code>Collapsible</Code>, <Code>CollapsibleTrigger</Code> and{" "}
        <Code>CollapsibleContent</Code>, each forwarding its Radix Collapsible props.{" "}
        <Code>className</Code> on <Code>CollapsibleContent</Code> lands on the animated element, like shadcn.
      </>
    ),
    props: [
      { name: "open / defaultOpen / onOpenChange", type: "boolean", description: "On Collapsible: controlled or uncontrolled state." },
      { name: "disabled", type: "boolean", default: "false", description: "On Collapsible: prevent toggling." },
      { name: "asChild", type: "boolean", default: "false", description: "On CollapsibleTrigger: render your own Button." },
      { name: "forceMount", type: "true", description: "On CollapsibleContent: keep it mounted while closed (for your own animations)." },
    ],
  },
  accessibility: [
    "Built on Radix Collapsible: the trigger is a button with aria-expanded and aria-controls pointing at the content.",
    "The Motion block keeps closed content mounted but inert, so it can't be focused or read until opened.",
    "Show More buttons expose aria-expanded / aria-controls; ShowMoreList's label states how many items are hidden.",
    "Under prefers-reduced-motion panels open and close instantly, and list rows appear without sliding.",
  ],
};

export function CollapsibleDocs() {
  return <ComponentDocs config={config} />;
}
