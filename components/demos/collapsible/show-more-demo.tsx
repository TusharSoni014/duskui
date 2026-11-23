import { ShowMore } from "@/components/dusk/collapsible/show-more";

export default function ShowMoreDemo() {
  return (
    <article className="w-full max-w-md space-y-2">
      <h3 className="text-base font-semibold">Why we build at dusk</h3>
      <ShowMore collapsedHeight={96}>
        <p>
          The best interfaces feel calm. They answer before you ask, move only when movement means something, and
          get out of the way the rest of the time.
        </p>
        <p className="mt-3">
          DuskUI started as a set of internal components for a dark-first product. Every piece had to survive a
          keyboard-only pass, a screen reader pass and a reduced-motion pass before it shipped.
        </p>
        <p className="mt-3">
          Springs replaced durations, because springs can be interrupted without a jump. Heights animate to their
          natural size, so nothing below them ever snaps into place.
        </p>
      </ShowMore>
    </article>
  );
}
