import { SparklesText } from "@/components/dusk/sparkles-text/sparkles-text";

export default function SparklesTextDensity() {
  return (
    <div className="grid w-full gap-8 text-center sm:grid-cols-3">
      <div className="space-y-2">
        <SparklesText count={3} size={[6, 10]} className="text-2xl font-semibold text-white">
          Subtle
        </SparklesText>
        <p className="font-mono text-xs text-white/50">count=3</p>
      </div>
      <div className="space-y-2">
        <SparklesText count={8} className="text-2xl font-semibold text-white">
          Default
        </SparklesText>
        <p className="font-mono text-xs text-white/50">count=8</p>
      </div>
      <div className="space-y-2">
        <SparklesText count={16} size={[6, 14]} lifetime={1.2} seed={42} className="text-2xl font-semibold text-white">
          Dazzling
        </SparklesText>
        <p className="font-mono text-xs text-white/50">count=16</p>
      </div>
    </div>
  );
}
