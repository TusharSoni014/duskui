import { DataStream } from "@/components/dusk/techy/data-stream";

export default function DataStreamDivider() {
  return (
    <div className="w-full space-y-3">
      <div className="relative h-16 w-full">
        <DataStream lanes={5} density={0.4} direction="left" color="#f472b6" />
      </div>
      <p className="text-center text-sm text-white/50">A thin band of lanes makes an animated section divider.</p>
    </div>
  );
}
