import { PlasmaLoader } from "@/components/dusk/neon/plasma-loader";

export default function PlasmaLoaderColorsDemo() {
  return (
    <div className="flex items-center gap-10">
      <PlasmaLoader color="#f472b6" secondaryColor="#22d3ee" />
      <PlasmaLoader color="#facc15" secondaryColor="#fb7185" speed={2.4} />
      <PlasmaLoader color="#a78bfa" speed={1} />
    </div>
  );
}
