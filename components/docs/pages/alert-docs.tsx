import { ComponentDocs, type DocConfig } from "@/components/docs/component-docs";
import { Code } from "@/components/docs/doc-primitives";

import AlertBasicDemo from "@/components/demos/alert/alert-basic";
import AlertVariantsDemo from "@/components/demos/alert/alert-variants";
import DismissibleAlertDemo from "@/components/demos/alert/dismissible-alert-demo";
import BannerAlertDemo from "@/components/demos/alert/banner-alert-demo";

const demo = (file: string) => `components/demos/alert/${file}`;
const block = (file: string) => `components/dusk/alert/${file}`;

const config: DocConfig = {
  title: "Alert",
  intro:
    "The shadcn/ui Alert with tinted success, warning and info variants for dark UIs and a slot for actions — plus two animated React alert blocks built with Motion: a dismissible alert that collapses smoothly and can auto-dismiss with a progress line, and an announcement banner that slides in from the top of the page.",
  tags: ["Drop-in shadcn API", "Status variants", "Motion blocks", "prefers-reduced-motion"],
  hero: { Demo: DismissibleAlertDemo, file: demo("dismissible-alert-demo.tsx"), minHeight: 340 },
  install: {
    registry: "alert",
    source: "components/ui/alert.tsx",
    deps: "class-variance-authority",
    note: (
      <>
        Same exports as shadcn/ui (<Code>Alert</Code>, <Code>AlertTitle</Code>,{" "}
        <Code>AlertDescription</Code>) plus <Code>AlertAction</Code> and the <Code>success</Code>,{" "}
        <Code>warning</Code> and <Code>info</Code> variants. CSS only, so it works in Server Components.
      </>
    ),
  },
  usage: {
    filename: "build-warning.tsx",
    code: `import { TriangleAlert } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export function BuildWarning() {
  return (
    <Alert variant="warning">
      <TriangleAlert />
      <AlertTitle>You're at 90% of your build minutes</AlertTitle>
      <AlertDescription>Builds pause when you hit the limit.</AlertDescription>
    </Alert>
  )
}`,
  },
  examples: [
    {
      id: "default",
      title: "Default and destructive",
      description: (
        <>
          The shadcn/ui default and destructive variants. Alerts use <Code>role=&quot;alert&quot;</Code> like shadcn; pass{" "}
          <Code>role=&quot;status&quot;</Code> for messages that shouldn&apos;t interrupt a screen reader.
        </>
      ),
      Demo: AlertBasicDemo,
      file: demo("alert-basic.tsx"),
      minHeight: 260,
    },
    {
      id: "variants",
      title: "Status variants",
      description:
        "success, warning and info use translucent tints that read well on near-black surfaces. Links inside the description inherit the alert's color and are underlined.",
      Demo: AlertVariantsDemo,
      file: demo("alert-variants.tsx"),
      minHeight: 320,
    },
  ],
  blocks: [
    {
      id: "dismissible-alert",
      title: "Dismissible Alert",
      registry: "dismissible-alert",
      source: block("dismissible-alert.tsx"),
      deps: "motion lucide-react",
      description: (
        <>
          An Alert with a close button. On dismiss it fades out while its height collapses, so
          the content below slides up instead of jumping. Set <Code>autoDismiss</Code> (ms) and it closes
          itself, drawing a shrinking line along the bottom; the countdown pauses while the alert is
          hovered or focused and while the tab is hidden. Escape inside the alert dismisses it too.
        </>
      ),
      Demo: DismissibleAlertDemo,
      file: demo("dismissible-alert-demo.tsx"),
      minHeight: 340,
      props: [
        { name: "variant", type: '"default" | "destructive" | "success" | "warning" | "info"', default: '"default"', description: "Alert variant. destructive and warning use role=\"alert\", the rest role=\"status\"." },
        { name: "title", type: "ReactNode", description: "Alert title." },
        { name: "children", type: "ReactNode", description: "The description." },
        { name: "icon", type: "ReactNode | null", description: "Leading icon. Defaults to one per variant; null hides it." },
        { name: "actions", type: "ReactNode", description: "Buttons under the description." },
        { name: "open / defaultOpen / onOpenChange", type: "boolean / boolean / (open: boolean) => void", default: "— / true / —", description: "Controlled or uncontrolled visibility." },
        { name: "onExitComplete", type: "() => void", description: "Runs once the exit animation has finished." },
        { name: "autoDismiss", type: "number", description: "Close after this many ms, with a progress line." },
        { name: "dismissible", type: "boolean", default: "true", description: "Show the close button and allow Escape." },
        { name: "dismissLabel", type: "string", default: '"Dismiss"', description: "Accessible label of the close button." },
      ],
    },
    {
      id: "banner-alert",
      title: "Banner Alert",
      registry: "banner-alert",
      source: block("banner-alert.tsx"),
      deps: "motion lucide-react",
      description: (
        <>
          A full-width announcement bar for the top of a page. It slides down from above while its height
          grows, so the page eases down rather than jumping. Pass <Code>storageKey</Code> to remember the dismissal in localStorage; the stored value
          is read after hydration with <Code>useSyncExternalStore</Code>, so server and client HTML always
          match. For zero layout shift, render it inside a fixed or sticky header.
        </>
      ),
      Demo: BannerAlertDemo,
      file: demo("banner-alert-demo.tsx"),
      minHeight: 320,
      props: [
        { name: "children", type: "ReactNode", description: "The announcement text." },
        { name: "variant", type: '"default" | "info" | "success" | "warning" | "destructive"', default: '"default"', description: "Color scheme. default is a neutral card surface." },
        { name: "action", type: "ReactNode", description: "A call to action after the text, e.g. a link." },
        { name: "icon", type: "ReactNode | null", description: "Leading icon. Defaults to one per variant; null hides it." },
        { name: "open / defaultOpen / onOpenChange", type: "boolean / boolean / (open: boolean) => void", default: "— / true / —", description: "Controlled or uncontrolled visibility." },
        { name: "storageKey", type: "string", description: "Remember the dismissal under this localStorage key. Change it for a new announcement." },
        { name: "animateOnMount", type: "boolean", default: "true", description: "Slide in after mount instead of rendering open." },
        { name: "delay", type: "number", default: "0.2", description: "Seconds before sliding in." },
        { name: "dismissible", type: "boolean", default: "true", description: "Show the close button." },
        { name: "label", type: "string", default: '"Announcement"', description: "Accessible name of the region." },
      ],
    },
  ],
  api: {
    intro: (
      <>
        Same parts as shadcn/ui: <Code>Alert</Code>, <Code>AlertTitle</Code> and{" "}
        <Code>AlertDescription</Code>, plus <Code>AlertAction</Code>. Each forwards the props of a{" "}
        <Code>div</Code>.
      </>
    ),
    props: [
      { name: "variant", type: '"default" | "destructive" | "success" | "warning" | "info"', default: '"default"', description: "Color scheme (on Alert)." },
      { name: "role", type: "string", default: '"alert"', description: 'Override with "status" for non-urgent messages (on Alert).' },
      { name: "AlertAction", type: "div props", description: "Top-right slot for a close button or menu; the text makes room for it." },
      { name: "alertVariants", type: "cva", description: "The variant classes, exported for custom elements." },
    ],
  },
  accessibility: [
    <>Alerts render <Code>role=&quot;alert&quot;</Code>, which interrupts screen readers. Use <Code>role=&quot;status&quot;</Code> for confirmations and tips; Dismissible Alert picks the right one per variant.</>,
    "Put a leading icon inside the Alert; it is decorative, so the title must carry the meaning (don't rely on color alone).",
    "The Dismissible Alert close button is a real button with an accessible label, and Escape anywhere inside the alert dismisses it. Its auto-dismiss pauses on focus, so keyboard users get time to read and act.",
    "The Banner Alert is a labelled region, not an alert, so it never interrupts; its close button has an accessible label.",
    "Under prefers-reduced-motion the blocks skip scale and slide, and only fade and collapse.",
  ],
};

export function AlertDocs() {
  return <ComponentDocs config={config} />;
}
