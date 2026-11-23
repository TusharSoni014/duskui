import { Skeleton } from "@/components/ui/skeleton";

const modes = [
  { animation: "shimmer", label: "shimmer (default)" },
  { animation: "pulse", label: "pulse" },
  { animation: "none", label: "none" },
] as const;

export default function SkeletonAnimationsDemo() {
  return (
    <div className="grid w-full max-w-2xl gap-6 sm:grid-cols-3">
      {modes.map(({ animation, label }) => (
        <figure key={animation} className="grid gap-3">
          <div className="grid gap-2 rounded-xl border bg-card p-4" aria-hidden>
            <Skeleton animation={animation} className="aspect-video w-full rounded-lg" />
            <Skeleton animation={animation} className="h-3.5 w-3/4" />
            <Skeleton animation={animation} className="h-3 w-1/2" />
          </div>
          <figcaption className="text-center font-mono text-xs text-muted-foreground">{label}</figcaption>
        </figure>
      ))}
    </div>
  );
}
