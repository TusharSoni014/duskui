import { ComponentDocs, type DocConfig } from "@/components/docs/component-docs";
import { Code } from "@/components/docs/doc-primitives";

import AvatarBasicDemo from "@/components/demos/avatar/avatar-basic";
import AvatarGroupDemo from "@/components/demos/avatar/avatar-group-demo";
import StatusAvatarDemo from "@/components/demos/avatar/status-avatar-demo";

const demo = (file: string) => `components/demos/avatar/${file}`;
const block = (file: string) => `components/dusk/avatar/${file}`;

const config: DocConfig = {
  title: "Avatar",
  intro:
    "The shadcn/ui Avatar with a soft image fade-in, a hairline edge and an on-theme initials fallback — plus two animated React avatar blocks built with Motion and Radix: an overlapping avatar group that fans out on hover with a +N overflow chip, and a status avatar with a pulsing online, away or busy indicator.",
  tags: ["Drop-in shadcn API", "Radix Avatar", "Motion blocks", "prefers-reduced-motion"],
  hero: { Demo: AvatarGroupDemo, file: demo("avatar-group-demo.tsx"), minHeight: 260 },
  install: {
    registry: "avatar",
    source: "components/ui/avatar.tsx",
    deps: "@radix-ui/react-avatar",
    note: (
      <>
        Replaces <Code>components/ui/avatar.tsx</Code> with the same exports and props. The fade-in is
        CSS (tw-animate-css, included with shadcn/ui), so the base needs no Motion.
      </>
    ),
  },
  usage: {
    filename: "user-avatar.tsx",
    code: `import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function UserAvatar() {
  return (
    <Avatar>
      <AvatarImage src="https://i.pravatar.cc/150?img=47" alt="Maya Chen" />
      <AvatarFallback>MC</AvatarFallback>
    </Avatar>
  )
}`,
  },
  examples: [
    {
      id: "default",
      title: "Default",
      description: (
        <>
          Radix renders the image only once it has loaded, so it fades and settles in over the
          fallback instead of popping. A broken URL keeps the initials. Resize with <Code>size-*</Code>{" "}
          and change the shape with <Code>rounded-*</Code> on both the avatar and the fallback.
        </>
      ),
      Demo: AvatarBasicDemo,
      file: demo("avatar-basic.tsx"),
      minHeight: 180,
    },
  ],
  blocks: [
    {
      id: "avatar-group",
      title: "Avatar Group",
      registry: "avatar-group",
      source: block("avatar-group.tsx"),
      deps: "motion @radix-ui/react-avatar",
      description: (
        <>
          An overlapping stack that fans out symmetrically when you hover it. The avatar under the
          pointer lifts above its neighbours and shows a name tag, and anything past <Code>max</Code>{" "}
          collapses into a “+N” chip. It only moves with transforms, so nothing around it shifts.
        </>
      ),
      Demo: AvatarGroupDemo,
      file: demo("avatar-group-demo.tsx"),
      minHeight: 260,
      props: [
        { name: "items", type: "{ name: string; src?: string; fallback?: ReactNode }[]", description: "The people. name is used for the label, the name tag and the initials." },
        { name: "max", type: "number", default: "4", description: "Avatars shown before the rest collapse into +N." },
        { name: "size", type: '"sm" | "default" | "lg"', default: '"default"', description: "Avatar size and overlap." },
        { name: "spread", type: "number", description: "Extra pixels between avatars on hover. Defaults per size; 0 disables." },
        { name: "showNames", type: "boolean", default: "true", description: "Show a name tag above the hovered avatar." },
        { name: "label", type: "string", default: '"People"', description: "Accessible name for the list." },
      ],
    },
    {
      id: "status-avatar",
      title: "Status Avatar",
      registry: "status-avatar",
      source: block("status-avatar.tsx"),
      deps: "motion @radix-ui/react-avatar",
      description: (
        <>
          An avatar with a presence dot and a matching ring. Changing the status scales the new dot in
          and crossfades the ring; set <Code>pulse</Code> for a faint ring on live statuses (online, busy). Click the button to
          cycle through the statuses.
        </>
      ),
      Demo: StatusAvatarDemo,
      file: demo("status-avatar-demo.tsx"),
      minHeight: 240,
      props: [
        { name: "name", type: "string", description: "Full name, for the label and the initials. Required." },
        { name: "src", type: "string", description: "Image URL. Falls back to initials." },
        { name: "status", type: '"online" | "away" | "busy" | "offline"', default: '"online"', description: "Presence state; sets the dot and ring color." },
        { name: "size", type: '"sm" | "default" | "lg"', default: '"default"', description: "Avatar and dot size." },
        { name: "showRing", type: "boolean", default: "true", description: "Draw a ring in the status color." },
        { name: "pulse", type: "boolean", default: "false", description: "Add a faint pulse ring to the dot for online and busy." },
        { name: "fallback", type: "ReactNode", description: "Replaces the initials." },
      ],
    },
  ],
  api: {
    intro: (
      <>
        Same parts as shadcn/ui: <Code>Avatar</Code>, <Code>AvatarImage</Code> and{" "}
        <Code>AvatarFallback</Code>. Each forwards the Radix Avatar props.
      </>
    ),
    props: [
      { name: "className", type: "string", description: "Size and shape, e.g. size-12 rounded-lg (on Avatar)." },
      { name: "src / alt", type: "string", description: "Image source and alternative text (on AvatarImage)." },
      { name: "onLoadingStatusChange", type: '(status: "idle" | "loading" | "loaded" | "error") => void', description: "Called as the image loads (on AvatarImage)." },
      { name: "delayMs", type: "number", description: "Wait before showing the fallback, to avoid a flash on fast connections (on AvatarFallback)." },
    ],
  },
  accessibility: [
    <>Always give <Code>AvatarImage</Code> an <Code>alt</Code>; when only initials show, add an <Code>aria-label</Code> or nearby text with the person&apos;s name.</>,
    <>Avatar Group is a labelled list; each avatar is <Code>role=&quot;img&quot;</Code> with the person&apos;s name, and the overflow chip reads “N more”.</>,
    <>Status Avatar is labelled “Name (Status)”, so the presence state is never conveyed by color alone.</>,
    "Under prefers-reduced-motion the image only fades, the group spreads instantly and the status pulse stops.",
  ],
};

export function AvatarDocs() {
  return <ComponentDocs config={config} />;
}
