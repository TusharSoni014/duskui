"use client";

import * as React from "react";
import { Laptop, Server } from "lucide-react";

import { AnimatedBeam } from "@/components/dusk/animated-beam/animated-beam";

export default function AnimatedBeamBidirectional() {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const clientRef = React.useRef<HTMLDivElement>(null);
  const serverRef = React.useRef<HTMLDivElement>(null);

  return (
    <div ref={containerRef} className="relative flex h-56 w-full max-w-md items-center justify-between px-8">
      <div ref={clientRef} className="relative z-10 flex flex-col items-center gap-2">
        <span className="flex size-14 items-center justify-center rounded-2xl border border-white/10 bg-card text-white/80">
          <Laptop className="size-6" aria-hidden />
        </span>
        <span className="text-xs text-white/60">Client</span>
      </div>
      <div ref={serverRef} className="relative z-10 flex flex-col items-center gap-2">
        <span className="flex size-14 items-center justify-center rounded-2xl border border-white/10 bg-card text-white/80">
          <Server className="size-6" aria-hidden />
        </span>
        <span className="text-xs text-white/60">Server</span>
      </div>

      {/* Request goes over the top, response comes back underneath. */}
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={clientRef}
        toRef={serverRef}
        fromOffset={{ y: -12 }}
        toOffset={{ y: -12 }}
        curvature={-50}
        duration={2.4}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={clientRef}
        toRef={serverRef}
        fromOffset={{ y: -12 }}
        toOffset={{ y: -12 }}
        curvature={50}
        duration={2.4}
        delay={1.2}
        reverse
        gradientStartColor="#f472b6"
        gradientStopColor="#a78bfa"
      />
    </div>
  );
}
