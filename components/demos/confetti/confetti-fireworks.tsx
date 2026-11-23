"use client";

import * as React from "react";
import { Sparkles } from "lucide-react";

import { confetti } from "@/components/dusk/confetti/confetti";
import { Button } from "@/components/ui/button";

export default function ConfettiFireworks() {
  const timer = React.useRef(0);
  const [running, setRunning] = React.useState(false);

  React.useEffect(() => () => window.clearInterval(timer.current), []);

  const launch = () => {
    window.clearInterval(timer.current);
    setRunning(true);
    let shots = 0;
    timer.current = window.setInterval(() => {
      // Full circle bursts that float down slowly, high on the screen.
      confetti({
        particleCount: 45,
        spread: 360,
        startVelocity: 18,
        gravity: 0.35,
        decay: 0.92,
        ticks: 160,
        shapes: ["circle", "star"],
        scalar: 0.8,
        origin: { x: 0.15 + Math.random() * 0.7, y: 0.15 + Math.random() * 0.3 },
      });
      shots += 1;
      if (shots >= 6) {
        window.clearInterval(timer.current);
        setRunning(false);
      }
    }, 320);
  };

  return (
    <div className="flex flex-col items-center gap-3 text-center">
      <Button variant="soft" size="lg" onClick={launch} aria-busy={running || undefined}>
        <Sparkles />
        Fireworks
      </Button>
      <p className="text-sm text-white/60">Six 360° bursts at random spots, fired from a click handler.</p>
    </div>
  );
}
