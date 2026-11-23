import { Highlighter } from "@/components/dusk/highlighter/highlighter";

export default function HighlighterMultiline() {
  return (
    <p className="max-w-xs text-lg leading-loose text-white/70">
      Strokes are measured from the text&apos;s own line boxes, so{" "}
      <Highlighter as="mark" action="highlight" duration={1.4}>
        a long highlight follows the sentence across every line break
      </Highlighter>{" "}
      and an{" "}
      <Highlighter action="underline" strokeWidth={3} iterations={1} color="#fbbf24">
        underline wraps just as neatly
      </Highlighter>
      . Resize the window and they redraw.
    </p>
  );
}
