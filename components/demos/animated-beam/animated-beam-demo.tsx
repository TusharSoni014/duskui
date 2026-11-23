"use client";

import * as React from "react";
import { Cloud, Database, GitBranch, Mail, MessageSquare, Webhook, Zap } from "lucide-react";

import { AnimatedBeam } from "@/components/dusk/animated-beam/animated-beam";
import { cn } from "@/lib/utils";

function Node({
  ref,
  label,
  className,
  children,
}: {
  ref: React.Ref<HTMLDivElement>;
  label: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      ref={ref}
      title={label}
      className={cn(
        "relative z-10 flex size-12 items-center justify-center rounded-full border border-white/10 bg-card text-white/80 [&_svg]:size-5",
        className
      )}
    >
      {children}
      <span className="sr-only">{label}</span>
    </div>
  );
}

export default function AnimatedBeamDemo() {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const hubRef = React.useRef<HTMLDivElement>(null);
  const r1 = React.useRef<HTMLDivElement>(null);
  const r2 = React.useRef<HTMLDivElement>(null);
  const r3 = React.useRef<HTMLDivElement>(null);
  const r4 = React.useRef<HTMLDivElement>(null);
  const r5 = React.useRef<HTMLDivElement>(null);
  const r6 = React.useRef<HTMLDivElement>(null);

  return (
    <div
      ref={containerRef}
      className="relative flex h-80 w-full max-w-lg items-center justify-between overflow-hidden px-6 sm:px-10"
    >
      <div className="flex flex-col gap-8">
        <Node ref={r1} label="Email"><Mail /></Node>
        <Node ref={r2} label="Webhooks"><Webhook /></Node>
        <Node ref={r3} label="Git"><GitBranch /></Node>
      </div>

      <Node
        ref={hubRef}
        label="Automation hub"
        className="size-16 border-white/20 text-foreground [&_svg]:size-7"
      >
        <Zap />
      </Node>

      <div className="flex flex-col gap-8">
        <Node ref={r4} label="Chat"><MessageSquare /></Node>
        <Node ref={r5} label="Cloud storage"><Cloud /></Node>
        <Node ref={r6} label="Database"><Database /></Node>
      </div>

      <AnimatedBeam containerRef={containerRef} fromRef={r1} toRef={hubRef} curvature={-30} delay={0} />
      <AnimatedBeam containerRef={containerRef} fromRef={r2} toRef={hubRef} delay={0.4} />
      <AnimatedBeam containerRef={containerRef} fromRef={r3} toRef={hubRef} curvature={30} delay={0.8} />
      <AnimatedBeam containerRef={containerRef} fromRef={r4} toRef={hubRef} curvature={30} delay={0.2} />
      <AnimatedBeam containerRef={containerRef} fromRef={r5} toRef={hubRef} delay={0.6} />
      <AnimatedBeam containerRef={containerRef} fromRef={r6} toRef={hubRef} curvature={-30} delay={1} />
    </div>
  );
}
