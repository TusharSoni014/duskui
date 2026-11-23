import { Highlighter } from "@/components/dusk/highlighter/highlighter";

export default function HighlighterDemo() {
  return (
    <p className="max-w-lg text-center text-xl leading-relaxed text-white/75">
      DuskUI components are{" "}
      <Highlighter as="mark" action="highlight">
        free to copy
      </Highlighter>
      , built on{" "}
      <Highlighter action="underline" color="#22d3ee">
        shadcn/ui
      </Highlighter>{" "}
      and animated with{" "}
      <Highlighter action="circle" color="#f472b6">
        Motion
      </Highlighter>
      .
    </p>
  );
}
