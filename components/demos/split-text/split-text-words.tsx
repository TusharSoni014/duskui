import { SplitText } from "@/components/dusk/text/split-text";

export default function SplitTextWordsDemo() {
  return (
    <SplitText
      as="p"
      by="words"
      effect="blur"
      once={false}
      duration={0.8}
      className="max-w-lg text-center text-xl leading-relaxed text-white/75"
    >
      Words arrive one after another every time this paragraph scrolls back into view, and line breaks only ever
      happen between them.
    </SplitText>
  );
}
