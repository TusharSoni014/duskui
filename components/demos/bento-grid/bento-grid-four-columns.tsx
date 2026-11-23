import { Bell, Bot, Cpu, Database, GitBranch, Layers, ShieldCheck } from "lucide-react";

import { BentoCard, BentoGrid } from "@/components/dusk/bento-grid/bento-grid";

function Dots() {
  return (
    <div className="absolute inset-0 bg-[radial-gradient(rgb(255_255_255/0.08)_1px,transparent_1px)] [background-size:16px_16px]" />
  );
}

export default function BentoGridFourColumnsDemo() {
  return (
    <BentoGrid columns={4} className="max-w-4xl auto-rows-[minmax(11rem,auto)]">
      <BentoCard
        colSpan={2}
        rowSpan={2}
        icon={<Bot />}
        title="AI assistant"
        description="Ask questions about your codebase and get answers with links to the exact lines."
        background={<Dots />}
      />
      <BentoCard icon={<Database />} title="Postgres" description="Serverless, branching." background={<Dots />} />
      <BentoCard icon={<Cpu />} title="GPU jobs" description="Pay per second." background={<Dots />} />
      <BentoCard
        colSpan={2}
        icon={<GitBranch />}
        title="Branch previews"
        description="Every pull request gets a live URL."
      />
      <BentoCard icon={<ShieldCheck />} title="SOC 2" description="Audited yearly." />
      <BentoCard icon={<Bell />} title="Alerts" description="Slack, email, webhooks." />
      <BentoCard
        colSpan={2}
        icon={<Layers />}
        title="Monorepo aware"
        description="Only rebuild what changed."
      />
    </BentoGrid>
  );
}
