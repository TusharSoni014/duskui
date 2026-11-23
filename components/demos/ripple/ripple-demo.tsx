import { Radio } from "lucide-react";

import { Ripple } from "@/components/dusk/ripple/ripple";

export default function RippleDemo() {
  return (
    <div className="relative flex h-96 w-full flex-col items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-background">
      <Ripple />
      <div className="relative flex size-16 items-center justify-center rounded-full border border-white/15 bg-background">
        <Radio className="size-7 text-white/70" aria-hidden />
      </div>
      <p className="relative mt-5 text-lg font-semibold text-white">Searching for devices</p>
      <p className="relative mt-1 text-sm text-white/60">3 devices nearby</p>
    </div>
  );
}
