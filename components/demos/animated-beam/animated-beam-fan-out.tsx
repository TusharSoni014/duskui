"use client";

import * as React from "react";
import { Bell, CreditCard, Package, User } from "lucide-react";

import { AnimatedBeam } from "@/components/dusk/animated-beam/animated-beam";

function Service({ ref, label, children }: { ref: React.Ref<HTMLDivElement>; label: string; children: React.ReactNode }) {
  return (
    <div
      ref={ref}
      className="relative z-10 flex flex-col items-center gap-2 rounded-xl border border-white/10 bg-card px-3 py-2.5 text-xs text-white/70 [&_svg]:size-5 [&_svg]:text-white/80"
    >
      {children}
      {label}
    </div>
  );
}

const beam = {
  duration: 2,
  repeatDelay: 1.2,
  pulseLength: 0.35,
};

export default function AnimatedBeamFanOut() {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const userRef = React.useRef<HTMLDivElement>(null);
  const a = React.useRef<HTMLDivElement>(null);
  const b = React.useRef<HTMLDivElement>(null);
  const c = React.useRef<HTMLDivElement>(null);

  return (
    <div ref={containerRef} className="relative flex h-72 w-full max-w-md flex-col items-center justify-between py-6">
      <div
        ref={userRef}
        className="relative z-10 flex items-center gap-2 rounded-full border border-white/10 bg-card px-4 py-2 text-sm text-white/80"
      >
        <User className="size-4" aria-hidden />
        Checkout
      </div>
      <div className="flex w-full justify-around">
        <Service ref={a} label="Billing"><CreditCard aria-hidden /></Service>
        <Service ref={b} label="Fulfilment"><Package aria-hidden /></Service>
        <Service ref={c} label="Notifications"><Bell aria-hidden /></Service>
      </div>

      <AnimatedBeam containerRef={containerRef} fromRef={userRef} toRef={a} curvature={40} {...beam} />
      <AnimatedBeam containerRef={containerRef} fromRef={userRef} toRef={b} delay={0.25} {...beam} />
      <AnimatedBeam containerRef={containerRef} fromRef={userRef} toRef={c} curvature={-40} delay={0.5} {...beam} />
    </div>
  );
}
