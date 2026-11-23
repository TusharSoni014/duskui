import { ScanLine } from "@/components/dusk/hacker/scan-line";

export default function ScanLineCrtDemo() {
  return (
    <ScanLine
      curvature
      flicker
      lineSpacing={4}
      lineOpacity={0.5}
      barColor="#fbbf24"
      barDuration={5}
      className="w-full max-w-md bg-[#140d02]"
    >
      <div className="flex aspect-[4/3] flex-col justify-center gap-2 p-10 font-mono text-amber-300 [text-shadow:0_0_10px_rgb(251_191_36/0.6)]">
        <p className="text-xs tracking-[0.25em] text-amber-300/70">READY.</p>
        <p className="text-2xl font-bold">10 PRINT &quot;HELLO&quot;</p>
        <p className="text-2xl font-bold">20 GOTO 10</p>
        <p className="text-sm text-amber-300/70">RUN</p>
      </div>
    </ScanLine>
  );
}
