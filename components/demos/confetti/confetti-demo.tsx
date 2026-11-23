"use client";

import { PartyPopper } from "lucide-react";

import { ConfettiButton } from "@/components/dusk/confetti/confetti";

export default function ConfettiDemo() {
  return (
    <div className="flex flex-col items-center gap-3 text-center">
      <ConfettiButton size="lg">
        <PartyPopper />
        Celebrate
      </ConfettiButton>
      <p className="text-sm text-white/60">The burst starts from the button itself.</p>
    </div>
  );
}
