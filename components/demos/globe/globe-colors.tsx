import { Globe } from "@/components/dusk/globe/globe";

export default function GlobeColors() {
  return (
    <div className="grid w-full gap-6 rounded-xl border border-white/10 bg-background p-6 sm:grid-cols-2">
      <figure className="flex flex-col items-center gap-3">
        <Globe
          className="max-w-[240px]"
          baseColor="#4b5568"
          glowColor="#11151c"
          markerColor="#93c5fd"
          markers={[{ location: [64.1466, -21.9426], size: 0.08 }]}
          mapBrightness={5}
          label="Blue globe"
        />
        <figcaption className="text-sm text-white/60">Custom colors</figcaption>
      </figure>
      <figure className="flex flex-col items-center gap-3">
        <Globe
          className="max-w-[240px]"
          autoRotate={false}
          draggable={false}
          phi={4.6}
          theta={0.2}
          baseColor="#5c544b"
          glowColor="#1a1714"
          markerColor="#fdba74"
          mapSamples={9000}
          markers={[{ location: [-1.2921, 36.8219], size: 0.08 }]}
          label="Static warm-gray globe centred on Africa"
        />
        <figcaption className="text-sm text-white/60">Static: no rotation or dragging</figcaption>
      </figure>
    </div>
  );
}
