import { WavyBackground } from "@/components/dusk/wavy-background/wavy-background";

const palette = ["#38bdf8", "#60a5fa", "#818cf8", "#a78bfa"];

export default function WavyBackgroundLines() {
  return (
    <div className="relative flex h-72 w-full items-end overflow-hidden rounded-xl border border-white/10 bg-background p-4">
      <WavyBackground colors={palette} waveWidth={1.5} blur={0} waveOpacity={0.5} amplitude={0.25} speed={1} seed={3} />
      <span className="relative font-mono text-xs text-white/70">waveWidth={2} blur={0}</span>
    </div>
  );
}
