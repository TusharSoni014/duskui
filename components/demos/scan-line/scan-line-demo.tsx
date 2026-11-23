import { ScanLine } from "@/components/dusk/hacker/scan-line";

export default function ScanLineDemo() {
  return (
    <ScanLine className="w-full max-w-lg rounded-xl border border-white/10 bg-[oklch(0.1_0.03_150)]">
      <div className="space-y-3 p-8 font-mono">
        <p className="text-xs text-muted-foreground">Last login: Mon Nov 23 09:14</p>
        <h3 className="text-2xl font-semibold text-foreground">Connected to prod-eu-1</h3>
        <p className="text-sm leading-relaxed text-muted-foreground">
          3 deploys are queued. Run <span className="text-foreground">deploy status</span> to see them.
        </p>
      </div>
    </ScanLine>
  );
}
