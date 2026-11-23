import { Mic } from "lucide-react";
import { PulsatingButton } from "@/components/dusk/pulsating-button/pulsating-button";

export default function PulsatingButtonColorsDemo() {
  return (
    <>
      <PulsatingButton variant="destructive" pulseColor="#ef4444" duration={2} className="rounded-full">
        <span className="size-2 rounded-full bg-white" aria-hidden />
        Live
      </PulsatingButton>
      <PulsatingButton variant="secondary" pulseColor="#7dd3fc" spread={12} duration={3}>
        Wider, slower
      </PulsatingButton>
      <PulsatingButton size="icon-lg" pulseColor="#c4b5fd" className="rounded-full" aria-label="Start recording">
        <Mic />
      </PulsatingButton>
    </>
  );
}
