import { HyperText } from "@/components/dusk/hyper-text/hyper-text";

const lines = [
  { label: "uplink", value: "ESTABLISHED", delay: 0 },
  { label: "cipher", value: "AES-256-GCM", delay: 250 },
  { label: "latency", value: "12ms", delay: 500 },
  { label: "status", value: "ALL SYSTEMS NOMINAL", delay: 750 },
];

export default function HyperTextTerminal() {
  return (
    <dl className="w-full max-w-sm space-y-2 rounded-xl border border-white/10 bg-black/40 p-5 font-mono text-sm">
      {lines.map((line, i) => (
        <div key={line.label} className="flex justify-between gap-4">
          <dt className="text-white/40">{line.label}</dt>
          <dd className="text-primary">
            <HyperText trigger="mount" delay={line.delay} duration={700} characters="01#%&*+=<>/" seed={i + 3}>
              {line.value}
            </HyperText>
          </dd>
        </div>
      ))}
    </dl>
  );
}
