import { ComponentDocs, type DocConfig } from "@/components/docs/component-docs";
import { Code } from "@/components/docs/doc-primitives";

import NavigationMenuBasicDemo from "@/components/demos/navigation-menu/navigation-menu-basic";
import NavigationMenuNoViewportDemo from "@/components/demos/navigation-menu/navigation-menu-no-viewport";
import MegaMenuDemo from "@/components/demos/navigation-menu/mega-menu-demo";

const demo = (file: string) => `components/demos/navigation-menu/${file}`;
const block = (file: string) => `components/dusk/navigation-menu/${file}`;

const config: DocConfig = {
  title: "Navigation Menu",
  intro:
    "The shadcn/ui Navigation Menu with a viewport that morphs its size between panels, direction-aware panel slides and a gliding indicator — plus an animated React mega menu block built with Motion and Radix for site headers, with a hover highlight that glides between items.",
  tags: ["Drop-in shadcn API", "Morphing viewport", "Direction-aware", "Radix hover intent", "Motion block"],
  hero: { Demo: MegaMenuDemo, file: demo("mega-menu-demo.tsx"), minHeight: 440 },
  install: {
    registry: "navigation-menu",
    source: "components/ui/navigation-menu.tsx",
    deps: "@radix-ui/react-navigation-menu class-variance-authority lucide-react",
    note: (
      <>
        Same exports and props as the shadcn/ui Navigation Menu, including{" "}
        <Code>navigationMenuTriggerStyle</Code> and <Code>viewport={"{false}"}</Code>. Animations are CSS
        (tw-animate-css), so the base needs no Motion.
      </>
    ),
  },
  usage: {
    filename: "site-nav.tsx",
    code: `import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"

export function SiteNav() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Products</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-1 p-1">
              <li>
                <NavigationMenuLink href="/analytics">Analytics</NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink href="/docs" className={navigationMenuTriggerStyle()}>
            Docs
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}`,
  },
  examples: [
    {
      id: "default",
      title: "Default",
      description: (
        <>
          Hover or focus a trigger. Panels share one viewport that eases its width and height to fit
          each panel, the incoming panel shifts in from the side you&apos;re moving toward while the old
          one leaves the other way (Radix&apos;s <Code>data-motion</Code>), and the indicator arrow glides
          under the open trigger.
        </>
      ),
      Demo: NavigationMenuBasicDemo,
      file: demo("navigation-menu-basic.tsx"),
      minHeight: 340,
    },
    {
      id: "without-viewport",
      title: "Without a viewport",
      description: (
        <>
          With <Code>viewport={"{false}"}</Code> each panel drops down under its own trigger as a small
          popover that scales in from the top. Set <Code>active</Code> on a link to mark the current page.
        </>
      ),
      Demo: NavigationMenuNoViewportDemo,
      file: demo("navigation-menu-no-viewport.tsx"),
      minHeight: 260,
    },
  ],
  blocks: [
    {
      id: "mega-menu",
      title: "Mega Menu",
      registry: "mega-menu",
      source: block("mega-menu.tsx"),
      deps: "motion @radix-ui/react-navigation-menu lucide-react",
      description: (
        <>
          A data-driven header menu. A highlight glides between bar items as you hover (a shared Motion{" "}
          <Code>layoutId</Code>), the viewport fades open and then morphs its width and height
          between panels, panels slide in the direction of travel, links stagger in and an arrow tracks
          the open item. Panels can have a featured card and any number of link columns; items without
          a panel are plain links. Pass <Code>linkAs={"{Link}"}</Code> to use Next.js links.
        </>
      ),
      Demo: MegaMenuDemo,
      file: demo("mega-menu-demo.tsx"),
      minHeight: 440,
      props: [
        { name: "items", type: "MegaMenuItem[]", description: "Bar items: { label, href?, featured?, columns? }." },
        { name: "featured", type: "{ eyebrow?, title, description?, href }", description: "Highlighted card on the left of a panel." },
        { name: "columns", type: "{ heading?, links: { title, href, description?, icon?, badge? }[] }[]", description: "Link columns in a panel." },
        { name: "linkAs", type: "ElementType", default: '"a"', description: "Link component, e.g. Next.js Link. Must forward ref and props." },
        { name: "value / defaultValue / onValueChange", type: "string / string / (value: string) => void", description: "The open item's label (empty when closed)." },
        { name: "delayDuration", type: "number", default: "120", description: "Hover delay before a panel opens, in ms." },
      ],
    },
  ],
  api: {
    intro: (
      <>
        Same parts as shadcn/ui: <Code>NavigationMenu</Code>, <Code>List</Code>, <Code>Item</Code>,{" "}
        <Code>Trigger</Code>, <Code>Content</Code>, <Code>Link</Code>, <Code>Viewport</Code> and{" "}
        <Code>Indicator</Code> (all prefixed <Code>NavigationMenu</Code>), plus{" "}
        <Code>navigationMenuTriggerStyle()</Code>. Each forwards the Radix props.
      </>
    ),
    props: [
      { name: "viewport", type: "boolean", default: "true", description: "Render panels in a shared, morphing viewport (on NavigationMenu)." },
      { name: "value / defaultValue / onValueChange", type: "string / string / (value: string) => void", description: "Controlled open item (on NavigationMenu)." },
      { name: "delayDuration / skipDelayDuration", type: "number / number", default: "200 / 300", description: "Hover intent timing in ms (on NavigationMenu)." },
      { name: "orientation", type: '"horizontal" | "vertical"', default: '"horizontal"', description: "Layout and arrow-key direction (on NavigationMenu)." },
      { name: "active", type: "boolean", description: "Marks the current page with aria-current (on NavigationMenuLink)." },
      { name: "onSelect", type: "(event: Event) => void", description: "Fires when a link is chosen; the menu closes (on NavigationMenuLink)." },
    ],
  },
  accessibility: [
    "Built on Radix Navigation Menu: triggers are buttons with aria-expanded and aria-controls, panels are linked back with aria-labelledby, and the active link gets aria-current=\"page\".",
    "Tab moves through triggers and into the open panel; arrow keys move between triggers; Enter, Space or ArrowDown opens a panel and Escape closes it, returning focus to its trigger.",
    "Hover intent delays avoid panels flickering open as the pointer passes over the bar.",
    "The mega menu's highlight follows keyboard focus as well as the pointer.",
    "Under prefers-reduced-motion panels fade instead of sliding and the viewport changes size instantly.",
  ],
};

export function NavigationMenuDocs() {
  return <ComponentDocs config={config} />;
}
