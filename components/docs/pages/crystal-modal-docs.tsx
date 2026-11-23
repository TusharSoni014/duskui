import { ComponentDocs, type DocConfig } from "@/components/docs/component-docs";
import { Code } from "@/components/docs/doc-primitives";

import CrystalModalDemo from "@/components/demos/crystal-modal/crystal-modal-demo";
import CrystalModalForm from "@/components/demos/crystal-modal/crystal-modal-form";

const demo = (file: string) => `components/demos/crystal-modal/${file}`;

const config: DocConfig = {
  title: "Crystal Modal",
  intro:
    "A glassmorphism modal dialog for React built on Radix Dialog, Motion and Tailwind CSS. The pane scales up out of a blur while the page behind it frosts over — and focus trapping, Escape to close, scroll lock and ARIA all come from Radix.",
  tags: ["Radix Dialog", "Enter & exit animations", "Frosted overlay", "Focus trap", "prefers-reduced-motion"],
  hero: { Demo: CrystalModalDemo, file: demo("crystal-modal-demo.tsx"), minHeight: 260 },
  install: {
    registry: "crystal-modal",
    source: "components/dusk/glass/crystal-modal.tsx",
    deps: "motion @radix-ui/react-dialog lucide-react",
  },
  usage: {
    filename: "invite-dialog.tsx",
    code: `import {
  CrystalModal,
  CrystalModalContent,
  CrystalModalDescription,
  CrystalModalHeader,
  CrystalModalTitle,
  CrystalModalTrigger,
} from "@/components/dusk/glass/crystal-modal"
import { Button } from "@/components/ui/button"

export function InviteDialog() {
  return (
    <CrystalModal>
      <CrystalModalTrigger asChild>
        <Button>Invite</Button>
      </CrystalModalTrigger>
      <CrystalModalContent>
        <CrystalModalHeader>
          <CrystalModalTitle>Invite your team</CrystalModalTitle>
          <CrystalModalDescription>They'll get an email with a link.</CrystalModalDescription>
        </CrystalModalHeader>
      </CrystalModalContent>
    </CrystalModal>
  )
}`,
  },
  examples: [
    {
      id: "form",
      title: "Controlled form",
      description: (
        <>
          Control it with <Code>open</Code> and <Code>onOpenChange</Code> to close after an async save.
          The exit animation still plays. Fields here are Ice Inputs and the submit is a loading Frost
          Button.
        </>
      ),
      Demo: CrystalModalForm,
      file: demo("crystal-modal-form.tsx"),
      minHeight: 260,
    },
  ],
  api: {
    intro: (
      <>
        <Code>CrystalModal</Code> takes Radix Dialog Root props (<Code>open</Code>,{" "}
        <Code>defaultOpen</Code>, <Code>onOpenChange</Code>, <Code>modal</Code>). Trigger, Close, Title and
        Description are the Radix parts with styling. The props below are for{" "}
        <Code>CrystalModalContent</Code>, which also accepts Radix Content props such as{" "}
        <Code>onEscapeKeyDown</Code> and <Code>onOpenAutoFocus</Code>.
      </>
    ),
    props: [
      { name: "size", type: '"sm" | "md" | "lg" | "xl"', default: '"md"', description: "Max width of the pane." },
      { name: "showCloseButton", type: "boolean", default: "true", description: "Render the × button in the corner." },
      { name: "overlayClassName", type: "string", description: "Classes for the frosted overlay." },
      { name: "container", type: "HTMLElement | null", default: "document.body", description: "Portal container." },
    ],
  },
  accessibility: [
    "Built on Radix Dialog: focus is trapped inside and returned to the trigger on close, Escape closes, and the page behind is inert and scroll-locked.",
    <>Always include a <Code>CrystalModalTitle</Code> (it labels the dialog) and ideally a <Code>CrystalModalDescription</Code>.</>,
    "The close button has an accessible name and a focus-visible ring.",
    "Browsers without backdrop-filter get an opaque pane and a darker overlay, so contrast never depends on the blur.",
    "With reduced motion the pane only fades — no scale, slide or blur.",
  ],
};

export function CrystalModalDocs() {
  return <ComponentDocs config={config} />;
}
