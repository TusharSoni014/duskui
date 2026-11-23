import { Activity, Gauge, ShieldCheck } from "lucide-react";

import { DotSpotlight } from "@/components/dusk/backgrounds/dot-spotlight";

const features = [
  { icon: Gauge, title: "Fast", text: "p99 under 40 ms." },
  { icon: ShieldCheck, title: "Secure", text: "Encrypted end to end." },
  { icon: Activity, title: "Observable", text: "Traces on every call." },
];

export default function DotSpotlightFeatures() {
  return (
    <div className="relative w-full overflow-hidden rounded-xl border border-white/10 bg-background p-6">
      <DotSpotlight fade={false} />
      <div className="relative grid gap-3 sm:grid-cols-3">
        {features.map(({ icon: Icon, title, text }) => (
          <div key={title} className="rounded-xl border border-white/10 bg-card/80 p-4 backdrop-blur-sm">
            <Icon className="size-5 text-white/60" aria-hidden />
            <p className="mt-3 font-medium text-white">{title}</p>
            <p className="text-sm text-white/60">{text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
