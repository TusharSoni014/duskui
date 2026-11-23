import { SplitText } from "@/components/dusk/text/split-text";

export default function SplitTextEffectsDemo() {
  return (
    <div className="grid w-full max-w-xl gap-6 text-3xl font-semibold tracking-tight sm:grid-cols-2">
      <SplitText as="p" effect="rise">
        Rise up
      </SplitText>
      <SplitText as="p" effect="drop">
        Drop in
      </SplitText>
      <SplitText as="p" effect="blur" stagger={0.05}>
        Out of focus
      </SplitText>
      <SplitText as="p" effect="fade" stagger={0.06} className="text-white/70">
        Quiet fade
      </SplitText>
    </div>
  );
}
