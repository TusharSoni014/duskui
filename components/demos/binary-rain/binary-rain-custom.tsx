import { BinaryRain } from "@/components/dusk/techy/binary-rain";

export default function BinaryRainCustom() {
  return (
    <div className="grid w-full gap-4 sm:grid-cols-2">
      <div className="relative h-56 overflow-hidden rounded-xl border border-white/10 bg-background">
        <BinaryRain color="#7dd3fc" fontSize={18} speed={0.6} density={0.3} />
        <span className="absolute bottom-3 left-4 font-mono text-xs text-white/70">fontSize=18 · speed=0.6</span>
      </div>
      <div className="relative h-56 overflow-hidden rounded-xl border border-white/10 bg-background">
        <BinaryRain color="#a3a3a3" characters="0123456789ABCDEF" fontSize={12} speed={1.2} density={0.6} />
        <span className="absolute bottom-3 left-4 font-mono text-xs text-white/70">characters=&quot;0–F&quot;</span>
      </div>
    </div>
  );
}
