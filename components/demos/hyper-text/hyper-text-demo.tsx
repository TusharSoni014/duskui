import { HyperText } from "@/components/dusk/hyper-text/hyper-text";

export default function HyperTextDemo() {
  return (
    <div className="text-center">
      <HyperText as="h2" className="font-mono text-4xl font-bold tracking-tight sm:text-6xl">
        DECODE THE NIGHT
      </HyperText>
      <p className="mt-4 text-sm text-white/50">Hover the headline to run it again.</p>
    </div>
  );
}
