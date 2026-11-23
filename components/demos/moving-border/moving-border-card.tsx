import { Cpu } from "lucide-react";
import { MovingBorder } from "@/components/dusk/moving-border/moving-border";

export default function MovingBorderCardDemo() {
  return (
    <MovingBorder className="w-full max-w-sm" beamSize={100} contentClassName="p-6">
      <Cpu className="size-6 text-white/60" aria-hidden />
      <p className="mt-4 text-lg font-semibold">Edge functions</p>
      <p className="mt-1 text-sm text-white/60">
        Run code close to your users in 30 regions.
      </p>
    </MovingBorder>
  );
}
