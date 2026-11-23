import { InteractiveHoverButton } from "@/components/dusk/interactive-hover-button/interactive-hover-button";

export default function InteractiveHoverButtonDemo() {
  return (
    <>
      <InteractiveHoverButton size="lg">Get started</InteractiveHoverButton>
      <InteractiveHoverButton size="lg" hoverLabel="Let's talk">
        Contact sales
      </InteractiveHoverButton>
    </>
  );
}
