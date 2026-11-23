import { ComponentDocs, type DocConfig } from "@/components/docs/component-docs";
import { Code } from "@/components/docs/doc-primitives";

import AnimatedListDemo from "@/components/demos/animated-list/animated-list-demo";
import AnimatedListManualDemo from "@/components/demos/animated-list/animated-list-manual";
import AnimatedListActivityDemo from "@/components/demos/animated-list/animated-list-activity";

const demo = (file: string) => `components/demos/animated-list/${file}`;

const config: DocConfig = {
  title: "Animated List",
  intro:
    "An animated notification list for React and Tailwind CSS: new items spring in at the top while older ones glide down with Motion layout animations, and anything past the limit fades out. Great for notification feeds, activity logs and live landing-page demos, with polite screen reader announcements built in.",
  tags: ["Layout animations", "AnimatePresence popLayout", "Max visible items", "Auto stream hook", "Live region", "prefers-reduced-motion"],
  hero: { Demo: AnimatedListDemo, file: demo("animated-list-demo.tsx"), minHeight: 420 },
  install: {
    registry: "animated-list",
    source: "components/dusk/animated-list/animated-list.tsx",
    deps: "motion",
  },
  usage: {
    filename: "notifications.tsx",
    code: `import { AnimatedList } from "@/components/dusk/animated-list/animated-list"

type Notification = { id: string; title: string }

export function Notifications({ items }: { items: Notification[] }) {
  // Newest first. Every child needs a stable key.
  return (
    <AnimatedList max={5} announcePrefix="New notification:">
      {items.map((n) => (
        <div key={n.id} className="rounded-xl border p-3">
          {n.title}
        </div>
      ))}
    </AnimatedList>
  )
}`,
  },
  examples: [
    {
      id: "manual",
      title: "Add items yourself",
      description: (
        <>
          Prepend to your own state and the list animates. Here a paused <Code>useListStream</Code> acts as a queue:
          its <Code>push</Code> adds the next item. Changing <Code>max</Code> animates items in or out.
        </>
      ),
      Demo: AnimatedListManualDemo,
      file: demo("animated-list-manual.tsx"),
      minHeight: 380,
    },
    {
      id: "activity",
      title: "Activity feed",
      description: (
        <>
          Render an ordered list with <Code>as=&quot;ol&quot;</Code> and restyle the gap through{" "}
          <Code>className</Code>. The stream pauses while the feed is off-screen.
        </>
      ),
      Demo: AnimatedListActivityDemo,
      file: demo("animated-list-activity.tsx"),
      minHeight: 280,
    },
  ],
  api: {
    intro: (
      <>
        <Code>AnimatedList</Code> also accepts any <Code>ul</Code> / <Code>ol</Code> attribute. The file also exports{" "}
        <Code>useListStream(source, {"{ interval, limit, initial, paused, loop }"})</Code>, which returns{" "}
        <Code>{"{ items, push }"}</Code> with items as <Code>{"{ id, item }"}</Code>, newest first, for demos and
        landing pages.
      </>
    ),
    props: [
      { name: "children", type: "ReactNode", description: "Keyed elements, newest first. Each is wrapped in an <li>." },
      { name: "max", type: "number", default: "5", description: "How many items are visible. Older ones animate out." },
      { name: "as", type: '"ul" | "ol"', default: '"ul"', description: "List element to render." },
      { name: "announce", type: "boolean", default: "true", description: "Read new items out through a polite live region." },
      { name: "announcePrefix", type: "string", default: '""', description: 'Text read before each new item, e.g. "New notification:".' },
      { name: "itemClassName", type: "string", description: "Classes for each <li> wrapper." },
    ],
  },
  accessibility: [
    "It renders a real list (ul or ol with li), so screen readers report the item count.",
    "New items are announced once, by their text, through a separate polite live region. The list itself is not live, so reordering and items leaving are silent.",
    "Items present on the first render are not announced or animated, so the server and client render the same markup.",
    "Exiting items are popped out of the layout immediately and nothing measures text, so the list never jumps. Give its wrapper a fixed height for zero page shift.",
    "Auto-updating content should be pausable (WCAG 2.2.2): the demo uses useListStream's paused option with a button and pauses off-screen.",
    "With prefers-reduced-motion items only fade; there is no sliding, scaling or layout motion.",
  ],
};

export function AnimatedListDocs() {
  return <ComponentDocs config={config} />;
}
