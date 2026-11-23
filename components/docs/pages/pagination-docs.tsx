import { ComponentDocs, type DocConfig } from "@/components/docs/component-docs";
import { Code } from "@/components/docs/doc-primitives";

import PaginationBasicDemo from "@/components/demos/pagination/pagination-basic";
import AnimatedPaginationDemo from "@/components/demos/pagination/animated-pagination-demo";
import AnimatedPaginationCompactDemo from "@/components/demos/pagination/animated-pagination-compact";
import AnimatedPaginationFewDemo from "@/components/demos/pagination/animated-pagination-few";

const demo = (file: string) => `components/demos/pagination/${file}`;
const block = (file: string) => `components/dusk/pagination/${file}`;

const config: DocConfig = {
  title: "Pagination",
  intro:
    "Animated React pagination for shadcn/ui and Tailwind CSS: the drop-in Pagination adds a glowing current page, asChild links and focus-safe disabled states — plus a Motion block whose active indicator glides between pages, whose numbers roll as the range shifts, and whose smart ellipsis keeps the bar a constant width.",
  tags: ["Drop-in shadcn API", "Motion layoutId", "Smart ellipsis range", "aria-current", "prefers-reduced-motion"],
  hero: { Demo: AnimatedPaginationDemo, file: demo("animated-pagination-demo.tsx"), minHeight: 200 },
  install: {
    registry: "pagination",
    source: "components/ui/pagination.tsx",
    deps: "@radix-ui/react-slot lucide-react",
    note: (
      <>
        Replaces <Code>components/ui/pagination.tsx</Code> with the same parts and <Code>data-slot</Code>{" "}
        attributes. It styles links with <Code>buttonVariants</Code> from the DuskUI Button, which the
        registry installs for you.
      </>
    ),
  },
  usage: {
    filename: "results-pagination.tsx",
    code: `import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

export function ResultsPagination() {
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious href="?page=1" />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="?page=1">1</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="?page=2" isActive>2</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>
        <PaginationItem>
          <PaginationNext href="?page=3" />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}`,
  },
  examples: [
    {
      id: "default",
      title: "Default",
      description: (
        <>
          The shadcn composition with a soft mint current page and chevrons that nudge on hover. Here{" "}
          <Code>asChild</Code> renders buttons for local state, and <Code>aria-disabled</Code> dims
          Previous / Next at the ends without stealing keyboard focus.
        </>
      ),
      Demo: PaginationBasicDemo,
      file: demo("pagination-basic.tsx"),
      minHeight: 160,
    },
  ],
  blocks: [
    {
      id: "animated-pagination",
      title: "Animated Pagination",
      registry: "animated-pagination",
      source: block("animated-pagination.tsx"),
      deps: "motion lucide-react",
      description: (
        <>
          Pass <Code>totalPages</Code> and a controlled <Code>page</Code> (or <Code>defaultPage</Code>).
          The indicator glides to the current page via a shared Motion <Code>layoutId</Code>, and numbers
          roll up or down as the window of pages shifts. The range always has the same number of slots, so
          the bar never changes width. Focus follows the page you pick.
        </>
      ),
      Demo: AnimatedPaginationDemo,
      file: demo("animated-pagination-demo.tsx"),
      minHeight: 200,
      props: [
        { name: "totalPages", type: "number", description: "Number of pages." },
        { name: "page / onPageChange", type: "number / (page: number) => void", description: "Controlled current page (1-based)." },
        { name: "defaultPage", type: "number", default: "1", description: "Uncontrolled initial page." },
        { name: "siblingCount", type: "number", default: "1", description: "Pages shown on each side of the current one." },
        { name: "boundaryCount", type: "number", default: "1", description: "Pages always shown at the start and end." },
        { name: "showControls", type: "boolean", default: "true", description: "Show the Previous / Next buttons." },
        { name: "labels", type: "{ previous, next } | null", default: '"Previous" / "Next"', description: "Button text (hidden below sm). null for icon-only." },
        { name: "getPageHref", type: "(page: number) => string", description: "Render real links instead of buttons (good for SEO)." },
        { name: "linkAs", type: "ElementType", default: '"a"', description: "Link component used with getPageHref, e.g. Next.js Link." },
      ],
    },
    {
      id: "compact",
      title: "Animated Pagination — compact & wide",
      registry: "animated-pagination",
      source: block("animated-pagination.tsx"),
      deps: "motion lucide-react",
      description: (
        <>
          <Code>labels={"{null}"}</Code> gives icon-only arrows. <Code>siblingCount={"{0}"}</Code> makes a
          tight bar for mobile; raise <Code>siblingCount</Code> and <Code>boundaryCount</Code> for wide
          layouts. The helper <Code>getPaginationItems</Code> is exported if you want the range for your
          own markup.
        </>
      ),
      Demo: AnimatedPaginationCompactDemo,
      file: demo("animated-pagination-compact.tsx"),
      minHeight: 200,
    },
    {
      id: "few-pages",
      title: "Animated Pagination — few pages",
      registry: "animated-pagination",
      source: block("animated-pagination.tsx"),
      deps: "motion lucide-react",
      description: (
        <>
          With few pages every number is shown and the indicator simply glides between them. Rename the
          controls with <Code>labels</Code> — e.g. Newer / Older for a blog.
        </>
      ),
      Demo: AnimatedPaginationFewDemo,
      file: demo("animated-pagination-few.tsx"),
      minHeight: 160,
    },
  ],
  api: {
    intro: (
      <>
        Same parts as shadcn/ui: <Code>Pagination</Code> (a <Code>nav</Code>), <Code>PaginationContent</Code>,{" "}
        <Code>PaginationItem</Code>, <Code>PaginationLink</Code>, <Code>PaginationPrevious</Code>,{" "}
        <Code>PaginationNext</Code> and <Code>PaginationEllipsis</Code>. The additions are below.
      </>
    ),
    props: [
      { name: "isActive", type: "boolean", default: "false", description: "On PaginationLink: sets aria-current=\"page\" and the mint active style." },
      { name: "asChild", type: "boolean", default: "false", description: "On PaginationLink / Previous / Next: render your Link or a <button>. An empty child gets the default chevron and label." },
      { name: "size", type: "Button size", default: '"icon"', description: "On PaginationLink: any DuskUI Button size." },
      { name: "aria-disabled", type: "boolean", description: "Dims the link and blocks pointer clicks while keeping it focusable." },
    ],
  },
  accessibility: [
    "Pagination renders a nav landmark labelled “pagination”; rename it with aria-label when a page has several.",
    "The current page carries aria-current=\"page\"; the gliding indicator is decorative and aria-hidden.",
    "Previous / Next use aria-disabled at the ends, so keyboard focus isn't dropped when you reach the first or last page.",
    "Animated Pagination gives every number an accessible name (“Go to page 7”) and moves focus to the newly selected page, since the slot you clicked may now show another number.",
    "The ellipsis is announced as “More pages” rather than being silently skipped.",
    "Under prefers-reduced-motion the indicator jumps and numbers crossfade without sliding.",
  ],
};

export function PaginationDocs() {
  return <ComponentDocs config={config} />;
}
