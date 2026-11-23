import { ComponentDocs, type DocConfig } from "@/components/docs/component-docs";
import { Code } from "@/components/docs/doc-primitives";

import AlertDialogBasicDemo from "@/components/demos/alert-dialog/alert-dialog-basic";
import AlertDialogMediaDemo from "@/components/demos/alert-dialog/alert-dialog-media";
import DestructiveAlertDialogDemo from "@/components/demos/alert-dialog/destructive-alert-dialog-demo";
import SessionTimeoutDialogDemo from "@/components/demos/alert-dialog/session-timeout-dialog-demo";

const demo = (file: string) => `components/demos/alert-dialog/${file}`;
const block = (file: string) => `components/dusk/alert-dialog/${file}`;

const config: DocConfig = {
  title: "Alert Dialog",
  intro:
    "The shadcn/ui Alert Dialog with the DuskUI open and close animation, an icon slot and a compact size — plus two accessible React alert dialog blocks built with Motion and Radix: a destructive confirmation with type-to-confirm and async loading, and a session-timeout warning with a live countdown ring.",
  tags: ["Drop-in shadcn API", "role=alertdialog", "Motion blocks", "prefers-reduced-motion"],
  hero: { Demo: DestructiveAlertDialogDemo, file: demo("destructive-alert-dialog-demo.tsx"), minHeight: 220 },
  install: {
    registry: "alert-dialog",
    source: "components/ui/alert-dialog.tsx",
    deps: "@radix-ui/react-alert-dialog class-variance-authority",
    note: (
      <>
        Full shadcn/ui API plus <Code>AlertDialogMedia</Code>, <Code>size=&quot;sm&quot;</Code> on the
        content and <Code>variant</Code> / <Code>size</Code> on the action and cancel buttons. It styles
        those buttons with the DuskUI Button&apos;s <Code>buttonVariants</Code>. Animations are CSS
        (tw-animate-css), so the base needs no Motion.
      </>
    ),
  },
  usage: {
    filename: "discard-draft.tsx",
    code: `import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export function DiscardDraft() {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline">Discard draft</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Discard this draft?</AlertDialogTitle>
          <AlertDialogDescription>You can't get it back.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Keep editing</AlertDialogCancel>
          <AlertDialogAction variant="destructive">Discard</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}`,
  },
  examples: [
    {
      id: "default",
      title: "Default",
      description: (
        <>
          Fades, scales and rises in, then exits faster than it entered. Unlike Dialog, clicking the
          backdrop does nothing and focus starts on Cancel: the user has to answer. Give{" "}
          <Code>AlertDialogAction</Code> a <Code>variant</Code> to make it destructive.
        </>
      ),
      Demo: AlertDialogBasicDemo,
      file: demo("alert-dialog-basic.tsx"),
      minHeight: 200,
    },
    {
      id: "media",
      title: "Compact with icon",
      description: (
        <>
          <Code>size=&quot;sm&quot;</Code> narrows the dialog, centers the header and splits the footer into
          two equal buttons. <Code>AlertDialogMedia</Code> adds a tinted icon badge above the title.
        </>
      ),
      Demo: AlertDialogMediaDemo,
      file: demo("alert-dialog-media.tsx"),
      minHeight: 200,
    },
  ],
  blocks: [
    {
      id: "destructive-alert-dialog",
      title: "Destructive Alert Dialog",
      registry: "destructive-alert-dialog",
      source: block("destructive-alert-dialog.tsx"),
      deps: "motion lucide-react",
      description: (
        <>
          For deleting things that can&apos;t come back. The red icon sends out a slow pulse,{" "}
          <Code>consequences</Code> lists what will be lost, and with <Code>confirmText</Code> each
          character lights up as it matches. Return a promise from <Code>onConfirm</Code> and the button
          shows the DuskUI Button <Code>loading</Code> state; Escape and Cancel are blocked mid-request,
          and a failure shakes the dialog and shows the error inline. Unlike the Dialog&apos;s Confirm
          Dialog, it uses Alert Dialog semantics, so clicking outside never closes it. Try both buttons.
        </>
      ),
      Demo: DestructiveAlertDialogDemo,
      file: demo("destructive-alert-dialog-demo.tsx"),
      minHeight: 220,
      props: [
        { name: "trigger", type: "ReactElement", description: "Element that opens the dialog. Omit when controlling open." },
        { name: "open / onOpenChange", type: "boolean / (open: boolean) => void", description: "Controlled state." },
        { name: "title", type: "ReactNode", description: "Dialog title. Required." },
        { name: "description", type: "ReactNode", description: "Supporting text. A screen-reader-only fallback is used when omitted." },
        { name: "consequences", type: "ReactNode[]", description: "What will be lost, shown as a list that staggers in." },
        { name: "onConfirm", type: "() => unknown | Promise<unknown>", description: "Runs on confirm. Throw to keep the dialog open with an error." },
        { name: "confirmText", type: "string", description: "Text the user must type before confirming. Focus starts in that field." },
        { name: "confirmLabel / cancelLabel", type: "ReactNode", default: '"Delete" / "Cancel"', description: "Button labels." },
        { name: "pendingLabel", type: "ReactNode", description: "Shown next to the spinner while confirming." },
        { name: "icon", type: "ReactNode", default: "<Trash2 />", description: "Icon inside the pulsing badge." },
        { name: "errorMessage", type: "ReactNode", description: "Replaces the thrown error's message." },
      ],
    },
    {
      id: "session-timeout-dialog",
      title: "Session Timeout Dialog",
      registry: "session-timeout-dialog",
      source: block("session-timeout-dialog.tsx"),
      deps: "motion",
      description: (
        <>
          &ldquo;Are you still there?&rdquo; Open it from your idle timer: a ring drains around the
          seconds left and turns red for the last ten, then <Code>onSignOut(&quot;timeout&quot;)</Code>{" "}
          runs. Focus lands on <em>Stay signed in</em>, and Escape also counts as staying. The countdown
          uses wall-clock time, so it stays correct after the tab has been in the background.
        </>
      ),
      Demo: SessionTimeoutDialogDemo,
      file: demo("session-timeout-dialog-demo.tsx"),
      minHeight: 200,
      props: [
        { name: "open / onOpenChange", type: "boolean / (open: boolean) => void", description: "Controlled state. Required." },
        { name: "seconds", type: "number", default: "60", description: "Seconds the user has to respond." },
        { name: "onStay", type: "() => void", description: "The user stayed (button or Escape). Refresh the session." },
        { name: "onSignOut", type: '(reason: "manual" | "timeout") => void', description: "The user left or time ran out." },
        { name: "title", type: "ReactNode", default: '"Are you still there?"', description: "Dialog title." },
        { name: "description", type: "ReactNode | (secondsLeft: number) => ReactNode", description: "Text under the title; a function receives the seconds left." },
        { name: "stayLabel / signOutLabel", type: "ReactNode", default: '"Stay signed in" / "Sign out"', description: "Button labels." },
      ],
    },
  ],
  api: {
    intro: (
      <>
        Same parts as shadcn/ui: <Code>AlertDialog</Code>, <Code>AlertDialogTrigger</Code>,{" "}
        <Code>AlertDialogContent</Code>, <Code>AlertDialogHeader</Code>, <Code>AlertDialogFooter</Code>,{" "}
        <Code>AlertDialogTitle</Code>, <Code>AlertDialogDescription</Code>, <Code>AlertDialogAction</Code>,{" "}
        <Code>AlertDialogCancel</Code>, <Code>AlertDialogOverlay</Code> and <Code>AlertDialogPortal</Code>,
        plus <Code>AlertDialogMedia</Code>. Each forwards the Radix Alert Dialog props.
      </>
    ),
    props: [
      { name: "open / onOpenChange", type: "boolean / (open: boolean) => void", description: "Controlled state (on AlertDialog)." },
      { name: "size", type: '"default" | "sm"', default: '"default"', description: "sm is narrower, centered, with equal-width footer buttons (on AlertDialogContent)." },
      { name: "variant / size", type: "Button variant / size", default: '"default" / "outline"', description: "Button style of AlertDialogAction / AlertDialogCancel." },
      { name: "onOpenAutoFocus / onEscapeKeyDown", type: "(event) => void", description: "Radix hooks on AlertDialogContent; call preventDefault() to override." },
    ],
  },
  accessibility: [
    <>Built on Radix Alert Dialog: <Code>role=&quot;alertdialog&quot;</Code>, focus is trapped, the page behind is hidden from screen readers and focus returns to the trigger.</>,
    "Clicking outside never closes it, and focus starts on Cancel, the safe choice. Escape still closes it, except while a block's async action is running.",
    <>Always render an <Code>AlertDialogTitle</Code> and an <Code>AlertDialogDescription</Code>; they become the dialog&apos;s accessible name and description.</>,
    "The Destructive Alert Dialog keeps both buttons focusable while pending (aria-disabled + aria-busy) and reads the confirm text once instead of letter by letter.",
    "The Session Timeout Dialog announces the time left when it opens and once more at ten seconds, not on every tick.",
    "Under prefers-reduced-motion the dialog only fades, the pulse and shake are skipped, and the countdown digits swap without sliding.",
  ],
};

export function AlertDialogDocs() {
  return <ComponentDocs config={config} />;
}
