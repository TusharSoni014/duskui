import { WavyBackground } from "@/components/dusk/wavy-background/wavy-background";

export default function WavyBackgroundColors() {
  return (
    <div className="relative flex h-80 w-full items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-background">
      <WavyBackground
        colors={["#fb923c", "#facc15", "#fda4af"]}
        waveWidth={60}
        blur={24}
        speed={0.6}
        waveOpacity={0.25}
        seed={7}
      />
      <h3 className="relative px-6 text-center text-3xl font-semibold tracking-tight text-white sm:text-4xl">
        Warm palette
      </h3>
    </div>
  );
}
