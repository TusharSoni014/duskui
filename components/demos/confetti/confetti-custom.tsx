"use client";

import { Star } from "lucide-react";

import { ConfettiButton } from "@/components/dusk/confetti/confetti";

export default function ConfettiCustom() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <ConfettiButton
        variant="outline"
        options={{ shapes: ["star"], colors: ["#e3c58f", "#f1e2c2", "#e4e4e7"], scalar: 1.3, particleCount: 50 }}
      >
        <Star />
        Gold stars
      </ConfettiButton>
      <ConfettiButton
        variant="secondary"
        options={{ shapes: ["ribbon"], colors: ["#c4b5d9", "#9db4cf", "#d4d4d8"], spread: 100, gravity: 0.3, drift: 0.6 }}
      >
        Ribbons in the wind
      </ConfettiButton>
      <ConfettiButton
        variant="ghost"
        options={{ angle: 270, spread: 120, startVelocity: 10, gravity: 0.8, particleCount: 40 }}
      >
        Drop it
      </ConfettiButton>
    </div>
  );
}
