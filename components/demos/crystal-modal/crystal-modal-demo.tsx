import { Check, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { FrostButton } from "@/components/dusk/glass/frost-button";
import {
  CrystalModal,
  CrystalModalClose,
  CrystalModalContent,
  CrystalModalDescription,
  CrystalModalFooter,
  CrystalModalHeader,
  CrystalModalTitle,
  CrystalModalTrigger,
} from "@/components/dusk/glass/crystal-modal";
import { GlassBackdrop } from "@/components/demos/glass-card/glass-backdrop";

const perks = ["Unlimited projects", "Every animated block", "Figma kit & priority support"];

export default function CrystalModalDemo() {
  return (
    <>
      <GlassBackdrop />
      <CrystalModal>
        <CrystalModalTrigger asChild>
          <FrostButton size="lg" tone="primary" className="rounded-full">
            <Sparkles />
            Upgrade to Pro
          </FrostButton>
        </CrystalModalTrigger>
        <CrystalModalContent>
          <CrystalModalHeader>
            <CrystalModalTitle>Upgrade to Dusk Pro</CrystalModalTitle>
            <CrystalModalDescription>
              Everything in Free, plus the tools teams use to ship polished interfaces faster.
            </CrystalModalDescription>
          </CrystalModalHeader>
          <ul className="space-y-2.5 rounded-xl bg-white/5 p-4 text-sm">
            {perks.map((perk) => (
              <li key={perk} className="flex items-center gap-2.5">
                <Check className="size-4 text-primary" aria-hidden />
                {perk}
              </li>
            ))}
          </ul>
          <CrystalModalFooter>
            <CrystalModalClose asChild>
              <Button variant="ghost" className="text-white/80 hover:text-white">
                Maybe later
              </Button>
            </CrystalModalClose>
            <CrystalModalClose asChild>
              <FrostButton tone="primary">Upgrade · $12/mo</FrostButton>
            </CrystalModalClose>
          </CrystalModalFooter>
        </CrystalModalContent>
      </CrystalModal>
    </>
  );
}
