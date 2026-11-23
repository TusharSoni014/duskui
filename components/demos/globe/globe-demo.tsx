import { Globe, type GlobeMarker } from "@/components/dusk/globe/globe";

const regions: GlobeMarker[] = [
  { location: [37.7749, -122.4194], size: 0.07, label: "San Francisco" },
  { location: [40.7128, -74.006], size: 0.08, label: "New York" },
  { location: [-23.5505, -46.6333], size: 0.06, label: "São Paulo" },
  { location: [51.5072, -0.1276], size: 0.07, label: "London" },
  { location: [50.1109, 8.6821], size: 0.05, label: "Frankfurt" },
  { location: [19.076, 72.8777], size: 0.07, label: "Mumbai" },
  { location: [1.3521, 103.8198], size: 0.06, label: "Singapore" },
  { location: [35.6762, 139.6503], size: 0.08, label: "Tokyo" },
  { location: [-33.8688, 151.2093], size: 0.05, label: "Sydney" },
];

export default function GlobeDemo() {
  return (
    <div className="relative flex w-full flex-col items-center overflow-hidden rounded-xl border border-white/10 bg-background px-6 pt-10">
      <h3 className="text-center text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
        Every deploy reaches nine regions
      </h3>
      <p className="mt-2 max-w-sm text-center text-sm text-white/60">Drag the globe to spin it, or focus it and use the arrow keys.</p>
      <div className="relative -mb-40 mt-8 w-full max-w-[460px]">
        <Globe markers={regions} label="Globe showing nine edge regions" />
      </div>
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background to-transparent" />
    </div>
  );
}
