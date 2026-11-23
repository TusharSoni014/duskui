import { ComponentDocs, type DocConfig } from "@/components/docs/component-docs";
import { Code } from "@/components/docs/doc-primitives";

import SkeletonBasicDemo from "@/components/demos/skeleton/skeleton-basic";
import SkeletonAnimationsDemo from "@/components/demos/skeleton/skeleton-animations";
import SkeletonPresetsDemo from "@/components/demos/skeleton/skeleton-presets-demo";
import ContentLoaderDemo from "@/components/demos/skeleton/content-loader-demo";

const demo = (file: string) => `components/demos/skeleton/${file}`;
const block = (file: string) => `components/dusk/skeleton/${file}`;

const config: DocConfig = {
  title: "Skeleton",
  intro:
    "The shadcn/ui Skeleton with a soft shimmer sweep tuned for dark UIs and a static fallback for reduced motion — plus React skeleton loader blocks: ready-made text, avatar, card and table placeholders with a wave-like shimmer, and a content loader that crossfades from skeleton to content while animating its height.",
  tags: ["Drop-in shadcn API", "Server Component", "CSS shimmer", "prefers-reduced-motion"],
  hero: { Demo: ContentLoaderDemo, file: demo("content-loader-demo.tsx"), minHeight: 380 },
  install: {
    registry: "skeleton",
    source: "components/ui/skeleton.tsx",
    deps: "",
    note: (
      <>
        Replaces <Code>components/ui/skeleton.tsx</Code> with the same <Code>Skeleton</Code> export, so the
        Sidebar&apos;s menu skeleton and your existing placeholders keep working. The shimmer is pure CSS
        (tw-animate-css keyframes, included with shadcn/ui): no JavaScript, works in Server Components and
        renders the same on server and client.
      </>
    ),
  },
  usage: {
    filename: "profile-skeleton.tsx",
    code: `import { Skeleton } from "@/components/ui/skeleton"

export function ProfileSkeleton() {
  return (
    <div className="flex items-center gap-4" role="status">
      <span className="sr-only">Loading profile</span>
      <Skeleton className="size-12 rounded-full" />
      <div className="grid gap-2">
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-4 w-32" />
      </div>
    </div>
  )
}`,
  },
  examples: [
    {
      id: "default",
      title: "Default",
      description:
        "Size and shape each block with classes, exactly like shadcn/ui. A faint light sweeps across every block instead of the whole thing pulsing.",
      Demo: SkeletonBasicDemo,
      file: demo("skeleton-basic.tsx"),
      minHeight: 160,
    },
    {
      id: "animations",
      title: "Animation",
      description: (
        <>
          <Code>animation</Code> picks <Code>&quot;shimmer&quot;</Code> (default), shadcn&apos;s{" "}
          <Code>&quot;pulse&quot;</Code>, or <Code>&quot;none&quot;</Code>. With prefers-reduced-motion,
          all three are static.
        </>
      ),
      Demo: SkeletonAnimationsDemo,
      file: demo("skeleton-animations.tsx"),
      minHeight: 240,
    },
  ],
  blocks: [
    {
      id: "skeleton-presets",
      title: "Skeleton Presets",
      registry: "skeleton-presets",
      source: block("skeleton-presets.tsx"),
      deps: "",
      description: (
        <>
          <Code>SkeletonText</Code>, <Code>SkeletonAvatarRow</Code>, <Code>SkeletonCard</Code> and{" "}
          <Code>SkeletonTable</Code>: common layouts in one line. Line widths follow a fixed rhythm (never
          random, so hydration is safe) and each block&apos;s shimmer starts a beat after the previous one,
          so the light rolls through the layout as a wave. Server Components, no Motion needed.
        </>
      ),
      Demo: SkeletonPresetsDemo,
      file: demo("skeleton-presets-demo.tsx"),
      minHeight: 520,
      props: [
        { name: "label", type: "string", description: "All presets. Announce it as a polite role=\"status\" region. Hidden from screen readers when omitted." },
        { name: "lines", type: "number", default: "3 (Text) / 2 (Card)", description: "SkeletonText, SkeletonCard: number of text lines." },
        { name: "lastLineClassName / lineClassName", type: "string", default: '"w-3/5"', description: "SkeletonText: width of the last line / classes for every line." },
        { name: "avatarClassName / square / action", type: "string / boolean / boolean", default: '"size-10" / false / false', description: "SkeletonAvatarRow: avatar size, rounded-square avatar, trailing button." },
        { name: "media / footer", type: "boolean", default: "true", description: "SkeletonCard: image area and footer row." },
        { name: "rows / columns / header", type: "number / number / boolean", default: "5 / 4 / true", description: "SkeletonTable: body rows, columns and header row." },
      ],
    },
    {
      id: "content-loader",
      title: "Content Loader",
      registry: "content-loader",
      source: block("content-loader.tsx"),
      deps: "motion",
      description: (
        <>
          Swaps a skeleton for the real content. The two crossfade with a soft blur while the wrapper&apos;s
          height springs from one to the other, so whatever sits below glides instead of jumping. With{" "}
          <Code>stagger</Code>, the content&apos;s children rise in one after another. The region is{" "}
          <Code>aria-busy</Code> while loading and announces <Code>loadingLabel</Code>. Press Reload.
        </>
      ),
      Demo: ContentLoaderDemo,
      file: demo("content-loader-demo.tsx"),
      minHeight: 380,
      props: [
        { name: "loading", type: "boolean", description: "Show the skeleton instead of the children. Required." },
        { name: "skeleton", type: "ReactNode", description: "The placeholder, shaped like the content. Required." },
        { name: "children", type: "ReactNode", description: "The loaded content." },
        { name: "stagger", type: "boolean", default: "false", description: "Fade the children in one after another." },
        { name: "contentClassName", type: "string", description: "Classes for the element wrapping the children, e.g. \"grid gap-4\"." },
        { name: "loadingLabel / loadedLabel", type: "string", default: '"Loading" / ""', description: "Screen-reader announcements." },
      ],
    },
  ],
  api: {
    intro: (
      <>
        <Code>Skeleton</Code> renders a <Code>div</Code> and forwards all its props. Size and shape it with
        classes.
      </>
    ),
    props: [
      { name: "animation", type: '"shimmer" | "pulse" | "none"', default: '"shimmer"', description: "The loading effect. Static under reduced motion." },
      { name: "className", type: "string", description: "Size and shape, e.g. h-4 w-48 or size-10 rounded-full." },
    ],
  },
  accessibility: [
    <>Skeleton blocks are decorative. Mark the region you are loading with <Code>aria-busy</Code> or a <Code>role=&quot;status&quot;</Code> with a visually hidden label (Content Loader and the presets&apos; <Code>label</Code> do this for you).</>,
    "Shape placeholders like the real content so the page doesn't shift when it arrives; Content Loader animates any remaining height difference.",
    "Under prefers-reduced-motion the shimmer and pulse stop entirely, and Content Loader snaps its height and only fades.",
  ],
};

export function SkeletonDocs() {
  return <ComponentDocs config={config} />;
}
