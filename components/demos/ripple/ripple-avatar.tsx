import { Ripple } from "@/components/dusk/ripple/ripple";

export default function RippleAvatar() {
  return (
    <div className="flex w-full justify-center p-4">
      <div className="relative flex w-full max-w-xs flex-col items-center overflow-hidden rounded-xl border border-white/10 bg-card px-6 pb-6 pt-24">
        <Ripple mainCircleSize={64} circleGap={48} duration={5} className="bottom-auto h-64" />
        <div className="relative flex size-16 items-center justify-center rounded-full bg-white/5 text-xl font-semibold text-white ring-1 ring-white/15">
          AK
        </div>
        <p className="relative mt-20 font-medium text-white">Calling Aiko…</p>
        <p className="relative mt-1 text-sm text-white/60">Ringing on 2 devices</p>
      </div>
    </div>
  );
}
