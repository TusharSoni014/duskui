import { ScanLine } from "@/components/dusk/hacker/scan-line";

export default function ScanLineDemo() {
  return (
    <ScanLine className="w-full max-w-lg rounded-xl border border-white/10 bg-[oklch(0.1_0.03_150)]">
      <div className="space-y-3 p-8 font-mono">
        <p className="text-xs tracking-[0.3em] text-primary/70">TERMINAL 07 — ONLINE</p>
        <h3 className="text-3xl font-bold text-primary [text-shadow:0_0_12px_var(--color-primary)]">
          ACCESS GRANTED
        </h3>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Uplink established. 3 new transmissions waiting in the queue. Type{" "}
          <span className="text-foreground">read --all</span> to decrypt.
        </p>
      </div>
    </ScanLine>
  );
}
