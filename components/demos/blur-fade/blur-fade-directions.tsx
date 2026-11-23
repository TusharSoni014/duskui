import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, Circle } from "lucide-react";

import { BlurFade } from "@/components/dusk/blur-fade/blur-fade";

const directions = [
  { direction: "up", Icon: ArrowUp },
  { direction: "down", Icon: ArrowDown },
  { direction: "left", Icon: ArrowLeft },
  { direction: "right", Icon: ArrowRight },
  { direction: "none", Icon: Circle },
] as const;

export default function BlurFadeDirections() {
  return (
    <div className="grid w-full max-w-2xl grid-cols-2 gap-3 sm:grid-cols-5">
      {directions.map(({ direction, Icon }, i) => (
        <BlurFade
          key={direction}
          direction={direction}
          offset={24}
          delay={i * 0.12}
          duration={0.6}
          className="flex flex-col items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-5"
        >
          <Icon className="size-5 text-primary" aria-hidden />
          <code className="font-mono text-xs text-white/70">&quot;{direction}&quot;</code>
        </BlurFade>
      ))}
    </div>
  );
}
