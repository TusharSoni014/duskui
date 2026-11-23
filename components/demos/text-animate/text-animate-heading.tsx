import { TextAnimate } from "@/components/dusk/text-animate/text-animate";

export default function TextAnimateHeading() {
  return (
    <div className="max-w-lg space-y-3 text-center">
      <TextAnimate as="p" animation="fadeIn" by="word" className="text-sm font-medium text-white/60">
        Changelog · v2.0
      </TextAnimate>
      <TextAnimate as="h3" animation="slideUp" by="word" delay={0.2} className="text-4xl font-semibold tracking-tight">
        {"Faster builds.\nFewer surprises."}
      </TextAnimate>
      <TextAnimate as="p" animation="blurIn" by="word" delay={0.6} stagger={0.03} className="text-white/60">
        A new compiler, smarter caching and a calmer dev server.
      </TextAnimate>
    </div>
  );
}
