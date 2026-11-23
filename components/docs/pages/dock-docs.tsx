import { ComponentDocs, type DocConfig } from "@/components/docs/component-docs";
import { Code } from "@/components/docs/doc-primitives";

import DockDemo from "@/components/demos/dock/dock-demo";
import DockVerticalDemo from "@/components/demos/dock/dock-vertical";
import DockLinksDemo from "@/components/demos/dock/dock-links";

const demo = (file: string) => `components/demos/dock/${file}`;

const config: DocConfig = {
  title: "Dock",
  intro:
    "A macOS-style dock for React built with Motion and Tailwind CSS: icons magnify smoothly as the cursor approaches, labels fade in on hover and focus, and an active dot glides between apps. Pointer tracking runs on motion values and springs, so it never re-renders — and it works horizontally or vertically.",
  tags: ["macOS magnification", "No re-renders", "Keyboard magnify", "Vertical option", "Static on touch", "prefers-reduced-motion"],
  hero: { Demo: DockDemo, file: demo("dock-demo.tsx"), minHeight: 300 },
  install: {
    registry: "dock",
    source: "components/dusk/dock/dock.tsx",
    deps: "motion @radix-ui/react-slot",
    note: (
      <>
        The dock doesn&apos;t position itself — wrap it in e.g. <Code>fixed inset-x-0 bottom-4 flex justify-center</Code>.
        Its bar keeps a fixed height; icons grow out of it, so nothing around it shifts.
      </>
    ),
  },
  usage: {
    filename: "app-dock.tsx",
    code: `import { Folder, Mail, Settings } from "lucide-react"
import { Dock, DockItem, DockSeparator } from "@/components/dusk/dock/dock"

export function AppDock() {
  return (
    <div className="fixed inset-x-0 bottom-4 flex justify-center">
      <Dock aria-label="Applications">
        <DockItem label="Finder" active>
          <Folder />
        </DockItem>
        <DockItem label="Mail" href="/mail">
          <Mail />
        </DockItem>
        <DockSeparator />
        <DockItem label="Settings">
          <Settings />
        </DockItem>
      </Dock>
    </div>
  )
}`,
  },
  examples: [
    {
      id: "vertical",
      title: "Vertical",
      description: (
        <>
          <Code>position=&quot;left&quot;</Code> (or <Code>right</Code>) stands the dock up: icons grow to the
          side, labels open the other way and Up / Down arrows move between items. Tune{" "}
          <Code>iconSize</Code> and <Code>magnification</Code> to fit a sidebar.
        </>
      ),
      Demo: DockVerticalDemo,
      file: demo("dock-vertical.tsx"),
      minHeight: 360,
    },
    {
      id: "links",
      title: "Links at the top",
      description: (
        <>
          Give items an <Code>href</Code> to render links (the active one gets aria-current=&quot;page&quot;),
          or use <Code>asChild</Code> with your router&apos;s Link. <Code>position=&quot;top&quot;</Code>{" "}
          grows icons downward; a smaller <Code>distance</Code> makes the swell tighter.
        </>
      ),
      Demo: DockLinksDemo,
      file: demo("dock-links.tsx"),
      minHeight: 220,
    },
  ],
  api: {
    intro: (
      <>
        <Code>Dock</Code> renders a <Code>nav</Code> with a list; <Code>DockItem</Code> renders a button, a link
        (<Code>href</Code>) or your element (<Code>asChild</Code>) and accepts its props;{" "}
        <Code>DockSeparator</Code> draws a divider.
      </>
    ),
    props: [
      { name: "position", type: '"bottom" | "top" | "left" | "right"', default: '"bottom"', description: "On Dock: the edge it sits on. Icons grow away from it; left / right are vertical." },
      { name: "iconSize", type: "number", default: "44", description: "On Dock: resting icon size in px." },
      { name: "magnification", type: "number", default: "72", description: "On Dock: size of the icon under the cursor in px." },
      { name: "distance", type: "number", default: "140", description: "On Dock: how far from the cursor icons start to grow, in px." },
      { name: "disableMagnification", type: "boolean", default: "false", description: "On Dock: keep icons static." },
      { name: "aria-label", type: "string", default: '"Dock"', description: "On Dock: names the navigation landmark." },
      { name: "label", type: "string", description: "On DockItem: accessible name, shown as the hover / focus label." },
      { name: "active", type: "boolean", default: "false", description: "On DockItem: shows the gliding dot and sets aria-current." },
      { name: "href / asChild", type: "string / boolean", description: "On DockItem: render a link or your own element." },
    ],
  },
  accessibility: [
    "The dock is a nav landmark containing a list; every item is a real button or link named by its label, so screen readers never depend on the icon.",
    "Tab reaches each item, and arrow keys (Left / Right, or Up / Down when vertical) plus Home / End move between them.",
    "Keyboard focus magnifies the focused icon and its neighbours and shows its label, just like hovering.",
    "Active items carry aria-current (\"page\" for links); the active dot and the floating label are decorative and aria-hidden.",
    "Magnification only follows a mouse — touch screens get a static, tappable dock — and it's off entirely under prefers-reduced-motion.",
  ],
};

export function DockDocs() {
  return <ComponentDocs config={config} />;
}
