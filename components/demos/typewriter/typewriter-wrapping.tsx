import { Typewriter } from "@/components/dusk/text/typewriter";

export default function TypewriterWrappingDemo() {
  return (
    <div className="w-full max-w-xs rounded-xl border border-white/10 bg-white/[0.03] p-5">
      <Typewriter
        as="h3"
        phrases={[
          "Reserve space for the longest phrase",
          "So nothing below it jumps",
          "Even when lines wrap on small screens",
        ]}
        className="text-xl font-semibold leading-snug"
      />
      <p className="mt-3 text-sm leading-relaxed text-white/55">
        This paragraph never moves: the heading is always as tall as its longest phrase.
      </p>
    </div>
  );
}
