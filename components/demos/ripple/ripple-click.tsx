import { Ripple } from "@/components/dusk/ripple/ripple";

export default function RippleClick() {
  return (
    <div className="relative flex h-80 w-full cursor-crosshair select-none items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-background">
      <Ripple numCircles={0} interactive />
      <p className="relative text-sm text-white/60">Click or tap anywhere</p>
    </div>
  );
}
