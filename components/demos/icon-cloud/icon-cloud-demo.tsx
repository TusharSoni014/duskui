import {
  Atom,
  Boxes,
  Braces,
  Cloud,
  CodeXml,
  Cpu,
  Database,
  FileCode,
  Gauge,
  GitBranch,
  Github,
  Globe,
  Layers,
  Lock,
  Package,
  Palette,
  Rocket,
  Server,
  Shield,
  Sparkles,
  Terminal,
  WandSparkles,
  Webhook,
  Zap,
} from "lucide-react";

import { IconCloud, type IconCloudItem } from "@/components/dusk/icon-cloud/icon-cloud";

const icons = [
  [Atom, "React"],
  [CodeXml, "TypeScript"],
  [Palette, "Tailwind CSS"],
  [WandSparkles, "Motion"],
  [Database, "Postgres"],
  [Server, "Node.js"],
  [Cloud, "Edge functions"],
  [GitBranch, "Git"],
  [Github, "GitHub"],
  [Terminal, "CLI"],
  [Package, "npm"],
  [Boxes, "Docker"],
  [Layers, "Design system"],
  [Lock, "Auth"],
  [Shield, "Security"],
  [Rocket, "Deploys"],
  [Zap, "Caching"],
  [Gauge, "Analytics"],
  [Cpu, "Workers"],
  [Webhook, "Webhooks"],
  [Braces, "JSON APIs"],
  [FileCode, "MDX"],
  [Globe, "CDN"],
  [Sparkles, "AI"],
] as const;

const items: IconCloudItem[] = icons.map(([Icon, label]) => ({ label, icon: <Icon /> }));

export default function IconCloudDemo() {
  return (
    <div className="flex w-full items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-background p-6">
      <IconCloud
        items={items}
        label="Our stack"
        itemClassName="rounded-xl border border-white/10 bg-card text-foreground/80 shadow-sm"
      />
    </div>
  );
}
