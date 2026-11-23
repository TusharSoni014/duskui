import { Download, Send } from "lucide-react";
import { InteractiveHoverButton } from "@/components/dusk/interactive-hover-button/interactive-hover-button";

export default function InteractiveHoverButtonCustomDemo() {
  return (
    <>
      <InteractiveHoverButton color="#a78bfa" fillForeground="#0b0618" icon={<Download />} hoverLabel="v2.4.0">
        Download
      </InteractiveHoverButton>
      <InteractiveHoverButton color="#f472b6" fillForeground="#1a0510" icon={<Send />}>
        Send invite
      </InteractiveHoverButton>
      <InteractiveHoverButton color="#facc15" fillForeground="#1a1400" size="sm">
        Small
      </InteractiveHoverButton>
    </>
  );
}
