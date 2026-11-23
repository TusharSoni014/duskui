import { Globe, type GlobeArc, type GlobeMarker } from "@/components/dusk/globe/globe";

const hub: [number, number] = [52.52, 13.405];
const spokes: [number, number][] = [
  [40.7128, -74.006],
  [-1.2921, 36.8219],
  [25.2048, 55.2708],
  [35.6762, 139.6503],
  [-33.9249, 18.4241],
];

const markers: GlobeMarker[] = [
  { location: hub, size: 0.08, color: "#ffffff", label: "Berlin (hub)" },
  ...spokes.map((location) => ({ location, size: 0.05 })),
];
const arcs: GlobeArc[] = spokes.map((to) => ({ from: hub, to }));

export default function GlobeArcs() {
  return (
    <div className="flex w-full flex-col items-center gap-6 rounded-xl border border-white/10 bg-background p-6 sm:flex-row sm:justify-between sm:p-10">
      <div className="max-w-xs">
        <p className="text-sm font-medium text-white">Arcs</p>
        <p className="mt-1 text-sm text-white/60">
          Connect locations with curved arcs. The hub marker overrides the default color with its own.
        </p>
      </div>
      <Globe
        className="max-w-[320px]"
        markers={markers}
        arcs={arcs}
        phi={-0.4}
        theta={0.35}
        speed={0.12}
        label="Globe with routes from Berlin"
      />
    </div>
  );
}
