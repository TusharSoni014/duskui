import { FlipWords } from "@/components/dusk/flip-words/flip-words";

export default function FlipWordsDemo() {
  return (
    <h2 className="text-center text-4xl font-bold tracking-tight sm:text-5xl">
      Build{" "}
      <FlipWords words={["faster", "calmer", "accessible", "delightful"]} className="text-white/60" />
      <br />
      interfaces with DuskUI
    </h2>
  );
}
