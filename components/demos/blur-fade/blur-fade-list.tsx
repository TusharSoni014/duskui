import { Check } from "lucide-react";

import { BlurFadeGroup } from "@/components/dusk/blur-fade/blur-fade";

const features = [
  "Server-rendered and visible without JavaScript",
  "No flash for content already on screen at load",
  "One observer for the whole group",
  "Blur removed when done, so fixed children still work",
  "Instant under prefers-reduced-motion",
];

export default function BlurFadeList() {
  return (
    <BlurFadeGroup
      as="ul"
      stagger={0.07}
      direction="right"
      offset={16}
      blur={6}
      className="w-full max-w-md space-y-2"
      itemClassName="flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white/80"
    >
      {features.map((feature) => (
        <span key={feature} className="contents">
          <Check className="size-4 shrink-0 text-primary" aria-hidden />
          {feature}
        </span>
      ))}
    </BlurFadeGroup>
  );
}
