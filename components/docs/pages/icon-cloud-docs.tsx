import { ComponentDocs, type DocConfig } from "@/components/docs/component-docs";
import { Code } from "@/components/docs/doc-primitives";

import IconCloudDemo from "@/components/demos/icon-cloud/icon-cloud-demo";
import IconCloudColors from "@/components/demos/icon-cloud/icon-cloud-colors";
import IconCloudHero from "@/components/demos/icon-cloud/icon-cloud-hero";

const demo = (file: string) => `components/demos/icon-cloud/${file}`;

const config: DocConfig = {
  title: "Icon Cloud",
  intro:
    "A 3D icon cloud for React: icons or logos spread evenly over a rotating sphere, with the nearest ones larger and brighter. Hover to steer it, drag to fling it, and pass any React node or image URL. Ideal for tech stacks, integrations and partner walls.",
  tags: ["3D sphere", "React nodes or images", "Hover to steer", "Drag with momentum", "Screen-reader list", "Pauses off-screen"],
  hero: { Demo: IconCloudDemo, file: demo("icon-cloud-demo.tsx"), minHeight: 460 },
  install: {
    registry: "icon-cloud",
    source: "components/dusk/icon-cloud/icon-cloud.tsx",
    deps: "motion",
    note: (
      <>
        The cloud is square and fills its parent up to <Code>max-w-[400px]</Code>. Icons are laid out on a Fibonacci
        sphere, so the same items always land in the same places, on the server and in the browser.
      </>
    ),
  },
  usage: {
    filename: "stack.tsx",
    code: `import { Database, Github, Server } from "lucide-react"
import { IconCloud } from "@/components/dusk/icon-cloud/icon-cloud"

export function Stack() {
  return (
    <IconCloud
      label="Our stack"
      items={[
        { label: "GitHub", icon: <Github /> },
        { label: "Postgres", icon: <Database /> },
        { label: "Node.js", icon: <Server /> },
        { label: "Acme", src: "/logos/acme.svg" },
      ]}
    />
  )
}`,
  },
  examples: [
    {
      id: "colors",
      title: "Colorful icons, drag only",
      description: (
        <>
          Style each icon however you like. <Code>steerOnHover=&#123;false&#125;</Code> keeps a steady drift until it&apos;s
          dragged, and a larger <Code>maxScale</Code> exaggerates the depth.
        </>
      ),
      Demo: IconCloudColors,
      file: demo("icon-cloud-colors.tsx"),
      minHeight: 400,
    },
    {
      id: "links",
      title: "Links",
      description: (
        <>
          Give items an <Code>href</Code> to make them links. While anything inside has keyboard focus the sphere
          stops, so tabbing through never chases a moving target.
        </>
      ),
      Demo: IconCloudHero,
      file: demo("icon-cloud-hero.tsx"),
      minHeight: 360,
    },
  ],
  api: {
    intro: (
      <>
        Any other <Code>div</Code> prop is passed to the root. Rotation runs in a single animation frame loop that writes
        styles directly, so React never re-renders while it spins.
      </>
    ),
    props: [
      { name: "items", type: "IconCloudItem[]", description: "{ label, icon } or { label, src }, plus an optional href." },
      { name: "iconSize", type: "number", default: "40", description: "Width and height of each icon slot in px." },
      { name: "speed", type: "number", default: "0.35", description: "Idle spin in radians per second." },
      { name: "steerOnHover", type: "boolean", default: "true", description: "Spin toward the cursor while a mouse hovers." },
      { name: "draggable", type: "boolean", default: "true", description: "Spin by dragging, with momentum on release." },
      { name: "maxScale", type: "number", default: "1.1", description: "Scale of the nearest icons; the farthest are half of it." },
      { name: "label", type: "string", default: '"Icons"', description: "Accessible name of the list." },
      { name: "itemClassName", type: "string", description: "Classes for each icon slot." },
    ],
  },
  accessibility: [
    <>The icons render as a real <Code>&lt;ul&gt;</Code> with each item&apos;s <Code>label</Code> as text, so screen readers get a plain list.</>,
    "Icons with an href are links; focusing one pauses the rotation.",
    "With prefers-reduced-motion the sphere holds still and hover steering is off; dragging still turns it, without momentum.",
    "The animation stops while the cloud is off-screen or the tab is hidden.",
  ],
};

export function IconCloudDocs() {
  return <ComponentDocs config={config} />;
}
