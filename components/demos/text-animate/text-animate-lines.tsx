import { TextAnimate } from "@/components/dusk/text-animate/text-animate";

export default function TextAnimateLines() {
  return (
    <TextAnimate
      by="line"
      animation="slideUp"
      once={false}
      className="max-w-md text-center text-xl leading-relaxed text-white/75"
    >
      Line mode measures where this paragraph actually wraps, so each visual line rises together, at every screen
      width, without you adding a single line break.
    </TextAnimate>
  );
}
