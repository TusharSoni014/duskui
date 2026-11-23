import { ComponentDocs, type DocConfig } from "@/components/docs/component-docs";
import { Code } from "@/components/docs/doc-primitives";

import BreadcrumbBasicDemo from "@/components/demos/breadcrumb/breadcrumb-basic";
import BreadcrumbCustomDemo from "@/components/demos/breadcrumb/breadcrumb-custom";
import CollapsibleBreadcrumbDemo from "@/components/demos/breadcrumb/collapsible-breadcrumb-demo";
import CollapsibleBreadcrumbMaxDemo from "@/components/demos/breadcrumb/collapsible-breadcrumb-max";

const demo = (file: string) => `components/demos/breadcrumb/${file}`;
const block = (file: string) => `components/dusk/breadcrumb/${file}`;

const config: DocConfig = {
  title: "Breadcrumb",
  intro:
    "Animated React breadcrumbs for shadcn/ui and Tailwind CSS: the drop-in Breadcrumb adds growing hover underlines and an accessible current page — plus a Motion block that folds middle items into an animated “…” menu whenever the trail doesn't fit, without wrapping or layout shift.",
  tags: ["Drop-in shadcn API", "Responsive collapse", "Radix Dropdown Menu", "aria-current", "Server Component friendly"],
  hero: { Demo: CollapsibleBreadcrumbDemo, file: demo("collapsible-breadcrumb-demo.tsx"), minHeight: 220 },
  install: {
    registry: "breadcrumb",
    source: "components/ui/breadcrumb.tsx",
    deps: "@radix-ui/react-slot lucide-react",
    note: (
      <>
        Replaces <Code>components/ui/breadcrumb.tsx</Code> with the same parts and <Code>data-slot</Code>{" "}
        attributes. The base Breadcrumb is CSS only, so it renders in Server Components.
      </>
    ),
  },
  usage: {
    filename: "page-breadcrumb.tsx",
    code: `import Link from "next/link"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

export function PageBreadcrumb() {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/">Home</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Settings</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  )
}`,
  },
  examples: [
    {
      id: "default",
      title: "Default",
      description:
        "Links brighten on hover; the current page is bright and marked with aria-current.",
      Demo: BreadcrumbBasicDemo,
      file: demo("breadcrumb-basic.tsx"),
      minHeight: 140,
    },
    {
      id: "custom",
      title: "Icons, separator & ellipsis",
      description: (
        <>
          Pass any separator as children of <Code>BreadcrumbSeparator</Code>, put icons inside links (they
          size themselves) and use <Code>BreadcrumbEllipsis</Code> for a static collapsed trail.
        </>
      ),
      Demo: BreadcrumbCustomDemo,
      file: demo("breadcrumb-custom.tsx"),
      minHeight: 140,
    },
  ],
  blocks: [
    {
      id: "collapsible-breadcrumb",
      title: "Collapsible Breadcrumb",
      registry: "collapsible-breadcrumb",
      source: block("collapsible-breadcrumb.tsx"),
      deps: "motion @radix-ui/react-dropdown-menu lucide-react",
      description: (
        <>
          Give it the trail as <Code>items</Code>. It never wraps: when the trail is wider than its container,
          middle items slide out one by one into a “…” button, which opens an animated menu of the hidden
          pages. Widths are measured off-screen before paint, so there&apos;s no flash, and it re-fits on
          resize — drag the slider to try it.
        </>
      ),
      Demo: CollapsibleBreadcrumbDemo,
      file: demo("collapsible-breadcrumb-demo.tsx"),
      minHeight: 220,
      props: [
        { name: "items", type: "{ label: string; href?: string; icon?: ReactNode }[]", description: "The trail, root first. The last item is the current page." },
        { name: "maxItems", type: "number", description: "Always collapse when there are more items than this." },
        { name: "itemsBeforeCollapse", type: "number", default: "1", description: "Items always shown before the “…”." },
        { name: "itemsAfterCollapse", type: "number", default: "1", description: "Items always shown after the “…” (including the current page)." },
        { name: "separator", type: "ReactNode", default: "<ChevronRight />", description: "Custom separator." },
        { name: "linkAs", type: "ElementType", default: '"a"', description: "Link component, e.g. Next.js Link." },
      ],
    },
    {
      id: "max-items",
      title: "Collapsible Breadcrumb — maxItems",
      registry: "collapsible-breadcrumb",
      source: block("collapsible-breadcrumb.tsx"),
      deps: "motion @radix-ui/react-dropdown-menu lucide-react",
      description: (
        <>
          <Code>maxItems</Code> collapses long trails even when they&apos;d fit — here to three slots with a
          slanted slash <Code>separator</Code>.
        </>
      ),
      Demo: CollapsibleBreadcrumbMaxDemo,
      file: demo("collapsible-breadcrumb-max.tsx"),
      minHeight: 160,
    },
  ],
  api: {
    intro: (
      <>
        Same parts as shadcn/ui: <Code>Breadcrumb</Code>, <Code>BreadcrumbList</Code>, <Code>BreadcrumbItem</Code>,{" "}
        <Code>BreadcrumbLink</Code>, <Code>BreadcrumbPage</Code>, <Code>BreadcrumbSeparator</Code> and{" "}
        <Code>BreadcrumbEllipsis</Code>, each accepting its element&apos;s props.
      </>
    ),
    props: [
      { name: "asChild", type: "boolean", default: "false", description: "On BreadcrumbLink: render your router's Link instead of an <a>." },
      { name: "children", type: "ReactNode", default: "<ChevronRight />", description: "On BreadcrumbSeparator: a custom separator." },
    ],
  },
  accessibility: [
    "Breadcrumb renders a nav landmark labelled “breadcrumb” containing an ordered list, as the WAI-ARIA breadcrumb pattern recommends.",
    "The current page carries aria-current=\"page\" (without the misleading role=\"link\" of the original).",
    "Separators are presentational and hidden from screen readers.",
    "The “…” trigger is named “Show 3 more pages” and opens a Radix menu with arrow-key navigation, typeahead and Escape; focus returns to the trigger on close.",
    "The off-screen copy used for measuring is aria-hidden and inert, so links are never announced or focused twice.",
    "Under prefers-reduced-motion items and the menu only fade.",
  ],
};

export function BreadcrumbDocs() {
  return <ComponentDocs config={config} />;
}
