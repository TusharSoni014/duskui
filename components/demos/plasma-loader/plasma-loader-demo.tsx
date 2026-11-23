import { PlasmaLoader } from "@/components/dusk/neon/plasma-loader";

export default function PlasmaLoaderDemo() {
  return (
    <div className="flex items-center gap-10">
      <PlasmaLoader size={32} />
      <PlasmaLoader size={56} />
      <PlasmaLoader size={88} />
    </div>
  );
}
