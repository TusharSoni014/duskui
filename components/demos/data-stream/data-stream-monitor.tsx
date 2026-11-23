import { DataStream } from "@/components/dusk/techy/data-stream";

const stats = [
  { label: "Throughput", value: "8.2 GB/s" },
  { label: "Packets", value: "1.4M/s" },
  { label: "Latency", value: "6 ms" },
];

export default function DataStreamMonitor() {
  return (
    <div className="w-full max-w-lg overflow-hidden rounded-xl border border-white/10 bg-card">
      <div className="relative h-40 border-b border-white/10">
        <DataStream lanes={16} speed={1.4} density={0.6} color="#7dd3fc" />
      </div>
      <dl className="grid grid-cols-3 divide-x divide-white/10">
        {stats.map((s) => (
          <div key={s.label} className="px-4 py-3">
            <dt className="text-xs text-white/50">{s.label}</dt>
            <dd className="mt-0.5 text-sm font-medium tabular-nums text-white">{s.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
