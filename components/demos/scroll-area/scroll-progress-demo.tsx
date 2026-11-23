import { ScrollProgress } from "@/components/dusk/scroll-area/scroll-progress";

const sections = [
  ["Springs, not curves", "Springs carry velocity from one gesture into the next, so interrupted motion never jumps. Give them a duration and a bounce instead of stiffness and damping when you want predictable timing."],
  ["Animate the cheap things", "Transforms and opacity run on the compositor. Width, height and top cause layout on every frame — reach for layout animations or FLIP instead."],
  ["Exit faster than you enter", "Entrances can take their time to explain where something came from. Exits should get out of the way: roughly half the duration feels right."],
  ["Respect reduced motion", "Swap slides and scales for fades when the user asks for less motion. The interface should keep its meaning, not its choreography."],
  ["Direction is information", "Content that slides in from the side you're moving toward tells people where they are without a single word of copy."],
] as const;

export default function ScrollProgressDemo() {
  return (
    <ScrollProgress className="h-80 w-full max-w-md rounded-xl border bg-card/40">
      <article className="space-y-6 p-6 pt-7">
        <h3 className="text-lg font-semibold tracking-tight">Five rules for interface motion</h3>
        {sections.map(([title, body], i) => (
          <section key={title} className="space-y-2">
            <h4 className="text-sm font-medium text-foreground">
              {i + 1}. {title}
            </h4>
            <p className="text-sm leading-relaxed text-muted-foreground">{body}</p>
          </section>
        ))}
      </article>
    </ScrollProgress>
  );
}
