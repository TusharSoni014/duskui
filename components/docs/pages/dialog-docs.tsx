import { ComponentDocs, type DocConfig } from "@/components/docs/component-docs";
import { Code } from "@/components/docs/doc-primitives";

import DialogBasicDemo from "@/components/demos/dialog/dialog-basic";
import DialogScrollableDemo from "@/components/demos/dialog/dialog-scrollable";
import MorphingDialogDemo from "@/components/demos/dialog/morphing-dialog-demo";
import ConfirmDialogDemo from "@/components/demos/dialog/confirm-dialog-demo";
import DrawerDialogDemo from "@/components/demos/dialog/drawer-dialog-demo";

const demo = (file: string) => `components/demos/dialog/${file}`;
const block = (file: string) => `components/dusk/dialog/${file}`;

const config: DocConfig = {
  category: "Shadcn+",
  title: "Dialog",
  intro:
    "The shadcn/ui Dialog (modal) with a smoother open and close animation, blurred backdrop and scrollable content — plus three accessible React dialog blocks built with Motion and Radix: a card that morphs into a dialog, an async confirm dialog and a drag-to-dismiss bottom sheet drawer.",
  tags: ["Drop-in shadcn API", "Radix focus trap", "Motion blocks", "prefers-reduced-motion"],
  hero: { Demo: MorphingDialogDemo, file: demo("morphing-dialog-demo.tsx"), minHeight: 320 },
  install: {
    registry: "dialog",
    source: "components/ui/dialog.tsx",
    deps: "@radix-ui/react-dialog lucide-react",
    note: (
      <>
        Replaces <Code>components/ui/dialog.tsx</Code> with the same exports and props, so the Command
        palette and existing dialogs keep working. Animations are CSS (tw-animate-css, included with
        shadcn/ui), so the base needs no Motion.
      </>
    ),
  },
  usage: {
    filename: "edit-profile.tsx",
    code: `import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export function EditProfile() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Edit profile</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>Changes are visible to your team.</DialogDescription>
        </DialogHeader>
        {/* form */}
      </DialogContent>
    </Dialog>
  )
}`,
  },
  examples: [
    {
      id: "default",
      title: "Default",
      description:
        "Fades, scales and rises in on an expo-out curve, then exits faster than it entered so closing feels instant. Focus moves into the dialog and returns to the trigger.",
      Demo: DialogBasicDemo,
      file: demo("dialog-basic.tsx"),
      minHeight: 200,
    },
    {
      id: "scrollable",
      title: "Long content",
      description:
        "Content taller than the screen scrolls inside the dialog instead of spilling off the viewport, while the page behind stays locked.",
      Demo: DialogScrollableDemo,
      file: demo("dialog-scrollable.tsx"),
      minHeight: 200,
    },
  ],
  blocks: [
    {
      id: "morphing-dialog",
      title: "Morphing Dialog",
      registry: "morphing-dialog",
      source: block("morphing-dialog.tsx"),
      deps: "motion @radix-ui/react-dialog lucide-react",
      description: (
        <>
          A card that expands into a dialog. The surface, media, title and subtitle share a Motion{" "}
          <Code>layoutId</Code>, so each part flies to its new size and position; extra content fades
          in after the morph. Built on Radix Dialog, so focus trapping, Escape, outside click and
          focus return all work. Under reduced motion it simply fades.
        </>
      ),
      Demo: MorphingDialogDemo,
      file: demo("morphing-dialog-demo.tsx"),
      minHeight: 320,
      props: [
        { name: "open / onOpenChange", type: "boolean / (open: boolean) => void", description: "Controlled state (on MorphingDialog)." },
        { name: "defaultOpen", type: "boolean", default: "false", description: "Uncontrolled initial state." },
        { name: "MorphingDialogTrigger", type: "motion.button props", description: "The card. Put only inline content (spans) inside." },
        { name: "MorphingDialogContent", type: "motion.div props & { overlayClassName }", description: "The open dialog, portalled and centered." },
        { name: "MorphingDialogMedia / Title / Subtitle", type: "motion props", description: "Shared parts. Use them in both the trigger and the content." },
        { name: "MorphingDialogDescription", type: "motion.div props", description: "Content-only body that fades in; wired to aria-describedby." },
        { name: "MorphingDialogClose", type: "motion.button props", description: "Round close button; children replace the X icon." },
      ],
    },
    {
      id: "confirm-dialog",
      title: "Confirm Dialog",
      registry: "confirm-dialog",
      source: block("confirm-dialog.tsx"),
      deps: "motion lucide-react",
      description: (
        <>
          A confirmation dialog for risky actions. Return a promise from <Code>onConfirm</Code> and the
          confirm button shows the DuskUI Button <Code>loading</Code> state; Escape and outside clicks
          are blocked mid-request, it closes on success, and a failure shakes the dialog and shows the
          error inline. Optional type-to-confirm for destructive actions. Try both buttons.
        </>
      ),
      Demo: ConfirmDialogDemo,
      file: demo("confirm-dialog-demo.tsx"),
      minHeight: 200,
      props: [
        { name: "trigger", type: "ReactElement", description: "Element that opens the dialog. Omit when controlling open." },
        { name: "open / onOpenChange", type: "boolean / (open: boolean) => void", description: "Controlled state." },
        { name: "title", type: "ReactNode", description: "Dialog title. Required." },
        { name: "description", type: "ReactNode", description: "Supporting text." },
        { name: "onConfirm", type: "() => unknown | Promise<unknown>", description: "Runs on confirm. Throw to keep the dialog open with an error." },
        { name: "variant", type: '"default" | "destructive"', default: '"default"', description: "Destructive turns the icon and button red." },
        { name: "confirmText", type: "string", description: "Text the user must type before confirming." },
        { name: "confirmLabel / cancelLabel", type: "ReactNode", default: '"Confirm" / "Cancel"', description: "Button labels." },
        { name: "pendingLabel", type: "ReactNode", description: "Shown next to the spinner while confirming." },
        { name: "icon", type: "ReactNode | null", description: "Top icon. Defaults to a warning for destructive; null hides it." },
        { name: "errorMessage", type: "ReactNode", description: "Replaces the thrown error's message." },
      ],
    },
    {
      id: "drawer-dialog",
      title: "Drawer Dialog",
      registry: "drawer-dialog",
      source: block("drawer-dialog.tsx"),
      deps: "motion @radix-ui/react-dialog lucide-react",
      description: (
        <>
          A bottom sheet that slides up and can be dragged down by its handle or header to dismiss. A
          quick flick or a drag past <Code>closeThreshold</Code> closes it, anything less springs back,
          and the backdrop fades as you drag. It&apos;s still a Radix Dialog underneath, so Escape, the
          backdrop and the close button work too.
        </>
      ),
      Demo: DrawerDialogDemo,
      file: demo("drawer-dialog-demo.tsx"),
      minHeight: 200,
      props: [
        { name: "trigger", type: "ReactElement", description: "Element that opens the drawer." },
        { name: "open / onOpenChange", type: "boolean / (open: boolean) => void", description: "Controlled state." },
        { name: "title / description", type: "ReactNode", description: "Header text, wired to aria-labelledby / -describedby." },
        { name: "footer", type: "ReactNode", description: "Actions pinned under the scrollable body." },
        { name: "showCloseButton", type: "boolean", default: "true", description: "Render an X next to the title." },
        { name: "closeThreshold", type: "number", default: "0.3", description: "Fraction of the height to drag before it closes." },
      ],
    },
  ],
  api: {
    intro: (
      <>
        Same parts as shadcn/ui: <Code>Dialog</Code>, <Code>DialogTrigger</Code>,{" "}
        <Code>DialogContent</Code>, <Code>DialogHeader</Code>, <Code>DialogFooter</Code>,{" "}
        <Code>DialogTitle</Code>, <Code>DialogDescription</Code>, <Code>DialogClose</Code>,{" "}
        <Code>DialogOverlay</Code> and <Code>DialogPortal</Code>. Each forwards the Radix Dialog props.
      </>
    ),
    props: [
      { name: "open / onOpenChange", type: "boolean / (open: boolean) => void", description: "Controlled state (on Dialog)." },
      { name: "modal", type: "boolean", default: "true", description: "Trap focus and lock page scroll (on Dialog)." },
      { name: "showCloseButton", type: "boolean", default: "true", description: "Render the X button (on DialogContent)." },
      { name: "onOpenAutoFocus / onEscapeKeyDown / onInteractOutside", type: "(event) => void", description: "Radix hooks on DialogContent; call preventDefault() to override." },
    ],
  },
  accessibility: [
    "Built on Radix Dialog: focus is trapped inside, Escape closes, focus returns to the trigger and the page behind is hidden from screen readers.",
    <>Always render a <Code>DialogTitle</Code> (visually hidden with <Code>sr-only</Code> if needed) and a description or <Code>aria-describedby={"{undefined}"}</Code>.</>,
    <>Confirm Dialog uses <Code>role=&quot;alertdialog&quot;</Code>, focuses Cancel first and keeps both buttons focusable while pending.</>,
    "Under prefers-reduced-motion the base dialog only fades, the morph becomes a fade and the drawer fades instead of sliding.",
  ],
};

export function DialogDocs() {
  return <ComponentDocs config={config} />;
}
