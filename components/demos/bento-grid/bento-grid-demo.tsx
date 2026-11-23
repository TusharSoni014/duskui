"use client";

// Client module so `linkAs={Link}` (a component) can be passed as a prop.
import Link from "next/link";
import { BarChart3, GitPullRequest, Globe, Lock, Rocket } from "lucide-react";

import { BentoCard, BentoGrid } from "@/components/dusk/bento-grid/bento-grid";

function TerminalVisual() {
  const lines = ["$ dusk deploy --prod", "✓ Built in 2.1s", "✓ Uploaded 48 files", "✓ Live on 32 regions"];
  return (
    <div className="absolute inset-0">
      <div className="absolute top-6 right-6 left-6 rounded-lg border border-white/10 bg-black/50 p-4 font-mono text-xs leading-6 text-white/60 sm:left-auto sm:w-72">
        {lines.map((line, i) => (
          <p key={line} className={i === 0 ? "text-white/80" : "text-white/50"}>
            {line}
          </p>
        ))}
      </div>
    </div>
  );
}

function GlobeVisual() {
  return (
    <div className="absolute inset-0 flex items-start justify-center pt-10">
      <div className="relative size-56 rounded-full border border-white/10">
        <div className="absolute inset-6 rounded-full border border-white/10" />
        <div className="absolute inset-y-0 left-1/2 w-px bg-white/10" />
        <div className="absolute inset-x-0 top-1/2 h-px bg-white/10" />
        <div className="absolute inset-x-6 inset-y-0 rounded-[50%] border border-white/10" />
        {[
          [30, 40],
          [62, 28],
          [48, 66],
          [74, 58],
        ].map(([left, top]) => (
          <span
            key={`${left}-${top}`}
            className="absolute size-1.5 rounded-full bg-white/60"
            style={{ left: `${left}%`, top: `${top}%` }}
          />
        ))}
      </div>
    </div>
  );
}

function ChartVisual() {
  const bars = [40, 65, 45, 80, 60, 95, 70];
  return (
    <div className="absolute inset-x-6 top-6 flex h-28 items-end gap-2">
      {bars.map((h, i) => (
        <div
          key={i}
          className="flex-1 rounded-t bg-white/10"
          style={{ height: `${h}%` }}
        />
      ))}
    </div>
  );
}

function PreviewVisual() {
  const previews = [
    { branch: "fix/checkout-tax", url: "checkout-tax.preview.app" },
    { branch: "feat/saved-carts", url: "saved-carts.preview.app" },
  ];
  return (
    <div className="absolute top-6 right-6 left-6 grid gap-2 sm:left-auto sm:w-80">
      {previews.map((preview) => (
        <div
          key={preview.branch}
          className="flex items-center justify-between gap-3 rounded-md border border-white/10 bg-black/40 px-3 py-2 text-xs"
        >
          <span className="font-mono text-white/70">{preview.branch}</span>
          <span className="truncate text-white/55">{preview.url}</span>
        </div>
      ))}
    </div>
  );
}

export default function BentoGridDemo() {
  return (
    <BentoGrid className="max-w-4xl">
      <BentoCard
        colSpan={2}
        href="#examples"
        linkAs={Link}
        icon={<Rocket />}
        title="Deploy in one command"
        description="Push to main and your app is live everywhere in seconds, with instant rollbacks."
        cta="Read the deploy guide"
        background={<TerminalVisual />}
      />
      <BentoCard
        rowSpan={2}
        href="#examples"
        linkAs={Link}
        icon={<Globe />}
        title="Global edge network"
        description="Requests are served from the region closest to your users."
        background={<GlobeVisual />}
      />
      <BentoCard
        href="#examples"
        linkAs={Link}
        icon={<BarChart3 />}
        title="Built-in analytics"
        description="Privacy-friendly metrics, no cookies."
        background={<ChartVisual />}
      />
      <BentoCard
        href="#examples"
        linkAs={Link}
        icon={<Lock />}
        title="Secure by default"
        description="TLS, DDoS shielding and secrets vault."
      />
      <BentoCard
        colSpan={3}
        href="#examples"
        linkAs={Link}
        icon={<GitPullRequest />}
        title="Previews for every pull request"
        description="Each branch gets its own URL, so reviewers can click through changes before they merge."
        cta="See preview deployments"
        background={<PreviewVisual />}
      />
    </BentoGrid>
  );
}
