import { ComponentDocs, type DocConfig } from "@/components/docs/component-docs";
import { Code } from "@/components/docs/doc-primitives";

import ToastBasicDemo from "@/components/demos/toast/toast-basic";
import ToastPromiseDemo from "@/components/demos/toast/toast-promise";
import AnimatedToastDemo from "@/components/demos/toast/animated-toast-demo";
import UndoToastDemo from "@/components/demos/toast/undo-toast-demo";

const demo = (file: string) => `components/demos/toast/${file}`;
const block = (file: string) => `components/dusk/toast/${file}`;

const config: DocConfig = {
  title: "Toast",
  intro:
    "The shadcn/ui Sonner Toaster restyled for dark interfaces, with tinted status icons and on-brand rich colors — plus two animated React toast notification blocks built with Motion: a custom toast whose icon morphs from loading to success or error with a progress line and promise helpers, and an undo toast for optimistic deletes.",
  tags: ["Sonner", "Drop-in shadcn API", "Promise toasts", "Motion blocks"],
  hero: { Demo: AnimatedToastDemo, file: demo("animated-toast-demo.tsx"), minHeight: 200 },
  install: {
    registry: "toast",
    source: "components/ui/sonner.tsx",
    deps: "sonner lucide-react",
    note: (
      <>
        Replaces <Code>components/ui/sonner.tsx</Code>; the <Code>Toaster</Code> export and all Sonner
        props still work, and your <Code>toastOptions.classNames</Code> are merged with ours. It defaults
        to the dark theme and no longer needs <Code>next-themes</Code>. Mount{" "}
        <Code>&lt;Toaster /&gt;</Code> once (e.g. in your root layout), then call <Code>toast()</Code>{" "}
        from <Code>sonner</Code> anywhere.
      </>
    ),
  },
  usage: {
    filename: "app/layout.tsx",
    code: `import { Toaster } from "@/components/ui/sonner"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body>
        {children}
        <Toaster position="bottom-right" />
      </body>
    </html>
  )
}

// anywhere in a client component
import { toast } from "sonner"

toast.success("Changes saved", { description: "Your team can see them now." })`,
  },
  examples: [
    {
      id: "default",
      title: "Types",
      description: (
        <>
          <Code>toast()</Code>, <Code>toast.success</Code>, <Code>.info</Code>, <Code>.warning</Code> and{" "}
          <Code>.error</Code> on the popover surface with a layered shadow, tinted icons and a mint action
          button. Hover the stack to expand it and pause the timers; swipe to dismiss.
        </>
      ),
      Demo: ToastBasicDemo,
      file: demo("toast-basic.tsx"),
      minHeight: 200,
    },
    {
      id: "promise",
      title: "Promise",
      description: (
        <>
          Sonner&apos;s <Code>toast.promise</Code> shows a spinner until the promise settles, then the
          success or error message. Pass <Code>richColors</Code> to the Toaster for tinted success and
          error toasts in the DuskUI palette.
        </>
      ),
      Demo: ToastPromiseDemo,
      file: demo("toast-promise.tsx"),
      minHeight: 160,
    },
  ],
  blocks: [
    {
      id: "animated-toast",
      title: "Animated Toast",
      registry: "animated-toast",
      source: block("animated-toast.tsx"),
      deps: "motion sonner lucide-react",
      description: (
        <>
          A custom toast rendered with <Code>toast.custom</Code>. Update it by id and the icon changes: the
          spinner fades out and the check or cross draws itself in. A thin line
          shows the time left, driven by the same motion value as the timer, so they never drift; it
          pauses on hover, focus and hidden tabs. <Code>animatedToast.promise</Code> keeps the spinner up
          for at least <Code>minLoading</Code> ms so fast requests don&apos;t flash, and when you pass a
          function it adds a Retry button that re-runs it in the same toast. Try &ldquo;Sync&rdquo;.
        </>
      ),
      Demo: AnimatedToastDemo,
      file: demo("animated-toast-demo.tsx"),
      minHeight: 200,
      props: [
        { name: "animatedToast(title, options?)", type: "=> id", description: "Neutral toast. Also .success, .error, .info, .warning and .loading." },
        { name: "animatedToast.promise(task, messages, options?)", type: "=> { id, unwrap }", description: "task is a promise or a function returning one (enables Retry). Messages are text or { title, description }, or functions of the result / error." },
        { name: "options.id", type: "string | number", description: "Reuse an id to update a toast in place." },
        { name: "options.description", type: "ReactNode", description: "Second line." },
        { name: "options.duration", type: "number", default: "5000", description: "Lifetime in ms once settled. Infinity keeps it open." },
        { name: "options.action", type: "{ label, onClick }", description: "A button under the text. Call event.preventDefault() to keep the toast open." },
        { name: "options.dismissible", type: "boolean", default: "true", description: "Show the close button and allow swiping." },
        { name: "options.onAutoClose / onDismiss", type: "() => void", description: "Timer ran out / the user closed it." },
        { name: "minLoading", type: "number", default: "600", description: "Promise only: minimum spinner time in ms." },
        { name: "retryLabel", type: "ReactNode | false", default: '"Retry"', description: "Promise only: label of the retry button; false hides it." },
        { name: "AnimatedToast / ToastSurface / ToastStatusIcon / useToastCountdown", type: "exports", description: "The building blocks, for your own custom toasts." },
      ],
    },
    {
      id: "undo-toast",
      title: "Undo Toast",
      registry: "undo-toast",
      source: block("undo-toast.tsx"),
      deps: "motion sonner lucide-react",
      description: (
        <>
          The optimistic-delete pattern: remove the item right away, call <Code>undoToast()</Code>, and
          only make it permanent in <Code>onCommit</Code>. A ring drains around the seconds left; Undo (or
          ⌘Z / Ctrl+Z) calls <Code>onUndo</Code> and the toast turns into a &ldquo;Restored&rdquo;
          confirmation. <Code>onUndo</Code> and <Code>onCommit</Code> are guaranteed to run at most once,
          and never both. Archive a few emails, then undo one.
        </>
      ),
      Demo: UndoToastDemo,
      file: demo("undo-toast-demo.tsx"),
      minHeight: 300,
      props: [
        { name: "title", type: "ReactNode", description: "What happened, e.g. \"Email archived\". Required." },
        { name: "description", type: "ReactNode", description: "Second line, e.g. the item's name." },
        { name: "onUndo", type: "() => void", description: "Restore the item. Required." },
        { name: "onCommit", type: "() => void", description: "Runs when time runs out or the toast is closed without undoing." },
        { name: "duration", type: "number", default: "6000", description: "How long the user has to undo, in ms." },
        { name: "undoLabel", type: "ReactNode", default: '"Undo"', description: "Button label." },
        { name: "undoneTitle", type: "ReactNode", default: '"Restored"', description: "Title shown after undoing." },
        { name: "shortcut", type: "boolean", default: "true", description: "Undo with ⌘Z / Ctrl+Z (ignored in text fields)." },
        { name: "id / position / className", type: "Sonner options", description: "Passed through to toast.custom." },
      ],
    },
  ],
  api: {
    intro: (
      <>
        <Code>Toaster</Code> accepts every Sonner <Code>ToasterProps</Code>. Fire toasts with the{" "}
        <Code>toast</Code> function from <Code>sonner</Code>.
      </>
    ),
    props: [
      { name: "theme", type: '"light" | "dark" | "system"', default: '"dark"', description: "Sonner theme. DuskUI is styled for dark." },
      { name: "position", type: '"top-left" | "top-center" | "top-right" | "bottom-left" | "bottom-center" | "bottom-right"', default: '"bottom-right"', description: "Where toasts stack." },
      { name: "richColors", type: "boolean", default: "false", description: "Tinted success, info, warning and error toasts in the DuskUI palette." },
      { name: "toastOptions", type: "ToastOptions", description: "Defaults for every toast; classNames are merged with the DuskUI ones." },
      { name: "icons", type: "ToastIcons", description: "Override any of the status, loading or close icons." },
      { name: "expand / visibleToasts / duration / closeButton", type: "Sonner props", description: "Stacking, count, default lifetime and close button." },
    ],
  },
  accessibility: [
    "Sonner renders toasts in a labelled, polite live region, so new toasts are announced without stealing focus. Alt+T moves focus to the toasts.",
    "Timers pause while the stack is hovered or focused and while the tab is hidden, giving everyone time to read and act. The blocks follow the same rules with their own timers.",
    "Close, Retry and Undo are real buttons with accessible labels, reachable by keyboard. Undo Toast also supports ⌘Z / Ctrl+Z.",
    "Don't put the only path to something important in a toast; it disappears. Use an Alert or Alert Dialog for that.",
    "Sonner turns off its own animations under prefers-reduced-motion; the blocks skip scale and rotate and keep simple fades.",
  ],
};

export function ToastDocs() {
  return <ComponentDocs config={config} />;
}
