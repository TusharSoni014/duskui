import { FlipWords } from "@/components/dusk/flip-words/flip-words";

export default function FlipWordsStyles() {
  return (
    <div className="flex flex-col items-center gap-8 text-center">
      <p className="text-3xl tracking-tight text-white/80">
        Made for{" "}
        <FlipWords
          words={["designers", "builders", "small teams"]}
          interval={2600}
          className="font-serif text-white italic"
        />
      </p>
      <p className="text-2xl font-medium text-white/70">
        Deploy to{" "}
        <FlipWords
          words={["edge", "staging", "production"]}
          interval={2200}
          letterStagger={0.05}
          className="rounded-md border border-white/10 bg-white/5 px-2 text-white"
        />
      </p>
    </div>
  );
}
