import { MatrixRain } from "@/components/dusk/hacker/matrix-rain";

export default function MatrixRainCustomDemo() {
  return (
    <div className="grid h-80 w-full gap-3 sm:grid-cols-2">
      <div className="relative overflow-hidden rounded-lg bg-black">
        <MatrixRain color="#22d3ee" headColor="#ecfeff" fontSize={12} speed={1.6} fade={0.12} />
      </div>
      <div className="relative overflow-hidden rounded-lg bg-black">
        <MatrixRain color="#f43f5e" fontSize={20} speed={0.6} fade={0.05} density={0.9} characters="01" />
      </div>
    </div>
  );
}
