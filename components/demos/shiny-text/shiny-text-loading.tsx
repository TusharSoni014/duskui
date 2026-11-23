import { ShinyText } from "@/components/dusk/text/shiny-text";

export default function ShinyTextLoadingDemo() {
  return (
    <div className="flex w-full max-w-sm items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
      <span className="size-2 rounded-full bg-white/40" aria-hidden />
      <ShinyText role="status" duration={1.2} repeatDelay={0.2} spread={0.25} className="text-sm font-medium">
        Generating your component…
      </ShinyText>
    </div>
  );
}
