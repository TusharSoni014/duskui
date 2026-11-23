import { ComponentDocs, type DocConfig } from "@/components/docs/component-docs";
import { Code } from "@/components/docs/doc-primitives";

import HoverCardBasicDemo from "@/components/demos/hover-card/hover-card-basic";
import ProfileHoverCardDemo from "@/components/demos/hover-card/profile-hover-card-demo";
import LinkPreviewDemo from "@/components/demos/hover-card/link-preview-demo";

const demo = (file: string) => `components/demos/hover-card/${file}`;
const block = (file: string) => `components/dusk/hover-card/${file}`;

const config: DocConfig = {
  title: "Hover Card",
  intro:
    "The shadcn/ui Hover Card that grows out of its trigger with snappier delays and an optional arrow — plus two animated React hover card blocks built with Motion and Radix: a user profile preview that springs from the trigger, and a link preview that tilts up and follows the cursor.",
  tags: ["Drop-in shadcn API", "Radix positioning", "Motion blocks", "prefers-reduced-motion"],
  hero: { Demo: ProfileHoverCardDemo, file: demo("profile-hover-card-demo.tsx"), minHeight: 420 },
  install: {
    registry: "hover-card",
    source: "components/ui/hover-card.tsx",
    deps: "@radix-ui/react-hover-card",
    note: (
      <>
        Same exports as shadcn/ui (<Code>HoverCard</Code>, <Code>HoverCardTrigger</Code>,{" "}
        <Code>HoverCardContent</Code>) plus <Code>showArrow</Code>. It opens after 400ms and closes 200ms
        after the pointer leaves; pass <Code>openDelay</Code> / <Code>closeDelay</Code> to change that.
        Animations are CSS (tw-animate-css), so the base needs no Motion.
      </>
    ),
  },
  usage: {
    filename: "mention.tsx",
    code: `import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"

export function Mention() {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <a href="/u/duskui">@duskui</a>
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        Animated React components for shadcn/ui.
      </HoverCardContent>
    </HoverCard>
  )
}`,
  },
  examples: [
    {
      id: "default",
      title: "Default",
      description: (
        <>
          Scales and slides out of the trigger from Radix&apos;s transform origin, and closes quicker than
          it opened. <Code>showArrow</Code> draws a small arrow that blends into the border. Opens on hover
          and on keyboard focus of the trigger.
        </>
      ),
      Demo: HoverCardBasicDemo,
      file: demo("hover-card-basic.tsx"),
      minHeight: 260,
    },
  ],
  blocks: [
    {
      id: "profile-hover-card",
      title: "Profile Hover Card",
      registry: "profile-hover-card",
      source: block("profile-hover-card.tsx"),
      deps: "motion @radix-ui/react-hover-card lucide-react",
      description: (
        <>
          A user preview for @mentions and avatars. It springs out of the trigger, then the avatar pops and
          the name, bio, meta and stats rise in sequence. The avatar is a plain <Code>&lt;img&gt;</Code>{" "}
          layered over the user&apos;s initials, so a missing or broken image still looks intentional (hover
          @leopark). Put a Follow button in <Code>action</Code>.
        </>
      ),
      Demo: ProfileHoverCardDemo,
      file: demo("profile-hover-card-demo.tsx"),
      minHeight: 420,
      props: [
        { name: "user", type: "ProfileUser", description: "{ name, handle?, avatarUrl?, bio?, location?, joined?, verified?, stats?, cover? }. Required." },
        { name: "children", type: "ReactElement", description: "The trigger, usually a link to the profile. Required." },
        { name: "action", type: "ReactNode", description: "Top-right buttons, e.g. Follow." },
        { name: "open / defaultOpen / onOpenChange", type: "boolean / boolean / (open: boolean) => void", description: "Controlled or uncontrolled state." },
        { name: "openDelay / closeDelay", type: "number", default: "400 / 200", description: "Hover delays in ms." },
        { name: "side / align / sideOffset", type: "Radix content props", default: '"bottom" / "start" / 8', description: "Placement next to the trigger." },
      ],
    },
    {
      id: "link-preview",
      title: "Link Preview",
      registry: "link-preview",
      source: block("link-preview.tsx"),
      deps: "motion @radix-ui/react-hover-card lucide-react",
      description: (
        <>
          An inline link that previews its destination. The card tips up out of the link with a little
          perspective, then leans toward the cursor as it moves along the text. The image shimmers with the
          DuskUI Skeleton until it loads, then fades in; with no image (or a broken one) it shows a tinted
          panel with the site&apos;s initial. Pass Open Graph data you fetched on the server as{" "}
          <Code>preview</Code>.
        </>
      ),
      Demo: LinkPreviewDemo,
      file: demo("link-preview-demo.tsx"),
      minHeight: 360,
      props: [
        { name: "href", type: "string", description: "Link destination. Required." },
        { name: "children", type: "ReactNode", description: "The link text. Required." },
        { name: "preview", type: "{ title, description?, image?, siteName? }", description: "What the card shows. siteName defaults to the hostname. Required." },
        { name: "side", type: '"top" | "bottom"', default: '"top"', description: "Which side of the link the card opens on." },
        { name: "followCursor", type: "boolean", default: "true", description: "Lean toward the cursor along the link." },
        { name: "open / onOpenChange", type: "boolean / (open: boolean) => void", description: "Controlled state." },
        { name: "openDelay / closeDelay", type: "number", default: "300 / 200", description: "Hover delays in ms." },
        { name: "contentClassName", type: "string", description: "Classes for the card." },
      ],
    },
  ],
  api: {
    intro: (
      <>
        Same parts as shadcn/ui: <Code>HoverCard</Code>, <Code>HoverCardTrigger</Code> and{" "}
        <Code>HoverCardContent</Code>. Each forwards the Radix Hover Card props.
      </>
    ),
    props: [
      { name: "openDelay / closeDelay", type: "number", default: "400 / 200", description: "Hover delays in ms (on HoverCard)." },
      { name: "open / onOpenChange", type: "boolean / (open: boolean) => void", description: "Controlled state (on HoverCard)." },
      { name: "side / align / sideOffset", type: "Radix content props", default: '"bottom" / "center" / 6', description: "Placement (on HoverCardContent)." },
      { name: "showArrow", type: "boolean", default: "false", description: "Draw an arrow pointing at the trigger (on HoverCardContent)." },
    ],
  },
  accessibility: [
    "A hover card is a visual extra: screen readers don't announce it, so the trigger itself must make sense on its own (a real link with clear text).",
    "It also opens when the trigger gets keyboard focus and closes on Escape or blur, so keyboard users get the same preview.",
    "Don't put actions that exist only inside the card; the Follow button in the demo is a convenience, not the only way to follow.",
    "Under prefers-reduced-motion the cards only fade: no scale, tilt, stagger or cursor following.",
  ],
};

export function HoverCardDocs() {
  return <ComponentDocs config={config} />;
}
