import { SparklesText } from "@/components/dusk/sparkles-text/sparkles-text";

export default function SparklesTextDensity() {
  return (
    <div className="grid w-full gap-8 text-center sm:grid-cols-3">
      <div className="space-y-2">
        <SparklesText count={2} className="text-2xl font-semibold text-white">
          Sparse
        </SparklesText>
        <p className="text-xs text-white/50">count=2</p>
      </div>
      <div className="space-y-2">
        <SparklesText className="text-2xl font-semibold text-white">
          Default
        </SparklesText>
        <p className="text-xs text-white/50">count=4</p>
      </div>
      <div className="space-y-2">
        <SparklesText count={8} size={[6, 12]} seed={42} className="text-2xl font-semibold text-white">
          Busy
        </SparklesText>
        <p className="text-xs text-white/50">count=8</p>
      </div>
    </div>
  );
}
