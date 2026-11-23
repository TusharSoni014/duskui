import { FadeScrollArea } from "@/components/dusk/scroll-area/fade-scroll-area";

const notifications = [
  "Ada Kim commented on Dock spring tuning",
  "Deploy #482 finished in 41s",
  "Sam Patel requested your review",
  "New sign-in from Berlin",
  "Lee Wong merged motion-presets",
  "Weekly usage report is ready",
  "Maya Ruiz mentioned you in Design QA",
  "Invoice for November is available",
  "Deploy #481 rolled back",
  "3 new issues labelled a11y",
  "Your API key expires in 7 days",
  "Ada Kim starred dusk-web",
];

const tags = ["React", "Motion", "Radix", "Tailwind", "shadcn/ui", "a11y", "Springs", "Layout", "Gestures", "SSR"];

export default function FadeScrollAreaDemo() {
  return (
    <div className="flex w-full max-w-md flex-col gap-4">
      <FadeScrollArea className="h-64 rounded-xl border bg-card/40">
        <ul className="divide-y px-4">
          {notifications.map((text) => (
            <li key={text} className="py-3 text-sm text-muted-foreground">
              {text}
            </li>
          ))}
        </ul>
      </FadeScrollArea>
      <FadeScrollArea orientation="horizontal" className="rounded-xl border bg-card/40">
        <div className="flex w-max gap-2 p-3">
          {tags.map((tag) => (
            <span key={tag} className="rounded-full border px-3 py-1 text-xs text-muted-foreground">
              {tag}
            </span>
          ))}
        </div>
      </FadeScrollArea>
    </div>
  );
}
