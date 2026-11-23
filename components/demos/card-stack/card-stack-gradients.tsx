"use client";

import { CardStack } from "@/components/dusk/card-stack/card-stack";

const themes = [
  { name: "Graphite", color: "#3f3f46" },
  { name: "Sand", color: "#d6d3d1" },
  { name: "Moss", color: "#4d5b3a" },
  { name: "Clay", color: "#9a6b52" },
  { name: "Slate", color: "#475569" },
];

export default function CardStackGradients() {
  return (
    <div className="flex w-full justify-center rounded-xl border border-white/10 bg-background px-6 py-10">
      <CardStack
        items={themes}
        getKey={(t) => t.name}
        visible={5}
        offset={8}
        scaleStep={0.04}
        controls={false}
        label="Themes"
        className="max-w-[260px]"
        cardClassName="overflow-hidden border-white/15"
        renderItem={(t) => (
          <div className="flex aspect-[3/4] flex-col justify-end">
            <div className="flex-1" style={{ background: t.color }} />
            <div className="p-4">
              <p className="text-sm font-medium text-white">{t.name}</p>
              <p className="font-mono text-xs text-white/50">{t.color}</p>
            </div>
          </div>
        )}
      />
    </div>
  );
}
