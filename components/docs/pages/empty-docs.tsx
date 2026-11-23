import { ComponentDocs, type DocConfig } from "@/components/docs/component-docs";
import { Code } from "@/components/docs/doc-primitives";

import EmptyBasicDemo from "@/components/demos/empty/empty-basic";
import EmptySearchDemo from "@/components/demos/empty/empty-search";
import AnimatedEmptyDemo from "@/components/demos/empty/animated-empty-demo";
import AnimatedEmptyCustomDemo from "@/components/demos/empty/animated-empty-custom-demo";

const demo = (file: string) => `components/demos/empty/${file}`;
const block = (file: string) => `components/dusk/empty/${file}`;

const config: DocConfig = {
  title: "Empty State",
  intro:
    "A React empty state component with shadcn/ui's Empty API — icon tile, title, description and actions on a quiet dashed surface — plus an animated empty state block with a floating illustration, drifting icons and a staggered entrance built with Motion.",
  tags: ["shadcn API", "Server Component friendly", "Motion block", "prefers-reduced-motion"],
  hero: { Demo: AnimatedEmptyDemo, file: demo("animated-empty-demo.tsx"), minHeight: 440 },
  install: {
    registry: "empty",
    source: "components/ui/empty.tsx",
    deps: "class-variance-authority",
    note: (
      <>
        Adds <Code>components/ui/empty.tsx</Code> with the same parts as shadcn&apos;s Empty, plus an{" "}
        <Code>outline</Code> prop. CSS only.
      </>
    ),
  },
  usage: {
    filename: "no-projects.tsx",
    code: `import { FolderPlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"

export function NoProjects() {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <FolderPlus />
        </EmptyMedia>
        <EmptyTitle>No projects yet</EmptyTitle>
        <EmptyDescription>Create your first project to get started.</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button>Create project</Button>
      </EmptyContent>
    </Empty>
  )
}`,
  },
  examples: [
    {
      id: "default",
      title: "Default",
      description: (
        <>
          <Code>EmptyMedia variant=&quot;icon&quot;</Code> puts a single icon in a small neutral tile. The
          surface has a quiet dashed outline.
        </>
      ),
      Demo: EmptyBasicDemo,
      file: demo("empty-basic.tsx"),
      minHeight: 340,
    },
    {
      id: "no-results",
      title: "No results",
      description: (
        <>
          Inside a card or panel, pass <Code>outline={"{false}"}</Code> to drop the border. Links in the
          description are underlined and brighten on hover.
        </>
      ),
      Demo: EmptySearchDemo,
      file: demo("empty-search.tsx"),
      minHeight: 380,
    },
  ],
  blocks: [
    {
      id: "animated-empty",
      title: "Animated Empty",
      registry: "animated-empty",
      source: block("animated-empty.tsx"),
      deps: "motion lucide-react class-variance-authority",
      description: (
        <>
          A floating tile holds your icon while up to three satellite icons drift slowly around it. The title, description and actions rise in one after another when
          the block scrolls into view. Pass any lucide icons; children become the action row.
        </>
      ),
      Demo: AnimatedEmptyDemo,
      file: demo("animated-empty-demo.tsx"),
      minHeight: 440,
      props: [
        { name: "title", type: "ReactNode", description: "The headline. Required." },
        { name: "description", type: "ReactNode", description: "Supporting text." },
        { name: "icon", type: "LucideIcon", default: "Inbox", description: "Icon in the floating tile." },
        { name: "satellites", type: "LucideIcon[]", default: "[Search, FileText, Sparkles]", description: "Up to three drifting icons. [] for none." },
        { name: "titleAs", type: '"h2" | "h3" | "h4" | "p"', default: '"h3"', description: "Heading level of the title, to fit your page outline." },
        { name: "children", type: "ReactNode", description: "Actions under the text, usually Buttons." },
        { name: "outline", type: "boolean", default: "true", description: "Dashed border (from Empty)." },
      ],
    },
    {
      id: "animated-empty-custom",
      title: "Custom illustration",
      registry: "animated-empty",
      source: block("animated-empty.tsx"),
      deps: "motion lucide-react class-variance-authority",
      description: (
        <>
          Swap the icons to fit the moment — a rocket with clouds and bolts for an empty deployments list —
          and set <Code>titleAs</Code> so the heading level matches where it sits.
        </>
      ),
      Demo: AnimatedEmptyCustomDemo,
      file: demo("animated-empty-custom-demo.tsx"),
      minHeight: 420,
    },
  ],
  api: {
    intro: (
      <>
        Same parts as shadcn/ui: <Code>Empty</Code>, <Code>EmptyHeader</Code>, <Code>EmptyMedia</Code>,{" "}
        <Code>EmptyTitle</Code>, <Code>EmptyDescription</Code> and <Code>EmptyContent</Code>. Each forwards
        the props of its element.
      </>
    ),
    props: [
      { name: "outline", type: "boolean", default: "true", description: "Empty. Dashed border. Turn off inside cards." },
      { name: "variant", type: '"default" | "icon"', default: '"default"', description: "EmptyMedia. icon wraps a single icon in a tile; default leaves your illustration as is." },
    ],
  },
  accessibility: [
    <><Code>EmptyTitle</Code> is a <Code>&lt;div&gt;</Code> like shadcn&apos;s; nest a heading inside when the empty state belongs in the page outline. Animated Empty renders one for you (<Code>titleAs</Code>).</>,
    "Illustrations and decorative icons are aria-hidden, so screen readers hear only the title, description and actions.",
    "When an empty state replaces results after a search or filter, put its text in a live region (role=\"status\") so the change is announced.",
    "Under prefers-reduced-motion the illustration stays still and the content fades in without moving.",
  ],
};

export function EmptyDocs() {
  return <ComponentDocs config={config} />;
}
