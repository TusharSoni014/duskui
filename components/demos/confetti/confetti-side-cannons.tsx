"use client";

import { Rocket } from "lucide-react";

import { confetti } from "@/components/dusk/confetti/confetti";
import { Button } from "@/components/ui/button";

export default function ConfettiSideCannons() {
  const fire = () => {
    const shared = { particleCount: 70, spread: 55, startVelocity: 30, ticks: 240 };
    confetti({ ...shared, angle: 60, origin: { x: 0, y: 0.85 } });
    confetti({ ...shared, angle: 120, origin: { x: 1, y: 0.85 } });
  };

  return (
    <div className="flex flex-col items-center gap-3 text-center">
      <Button variant="outline" size="lg" onClick={fire}>
        <Rocket />
        Ship it
      </Button>
      <p className="text-sm text-white/60">Two cannons from the bottom corners of the screen.</p>
    </div>
  );
}
