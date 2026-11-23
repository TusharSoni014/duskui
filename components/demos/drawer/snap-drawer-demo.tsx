import { Clock, MapPin, Star } from "lucide-react";

import { Button } from "@/components/ui/button";
import { SnapDrawer } from "@/components/dusk/drawer/snap-drawer";

const reviews = [
  { name: "Mara", text: "Best flat white in the neighbourhood, and they remember your order." },
  { name: "Jun", text: "Quiet in the mornings. Plenty of sockets by the window." },
  { name: "Theo", text: "The cardamom bun is worth the queue." },
  { name: "Ines", text: "Friendly staff, oat milk at no extra cost." },
  { name: "Sam", text: "Gets busy after ten — come early if you want a table." },
];

export default function SnapDrawerDemo() {
  return (
    <SnapDrawer
      trigger={<Button variant="outline">Show place details</Button>}
      snapPoints={[0.28, 0.6, 1]}
      snapLabels={["Peek", "Half height", "Full height"]}
      title="Dusk Coffee Roasters"
      description="Café · 4 min walk"
      peek={
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Star className="size-4 fill-primary text-primary" aria-hidden /> 4.8 (312)
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="size-4" aria-hidden /> Open until 18:00
          </span>
          <span className="flex items-center gap-1.5">
            <MapPin className="size-4" aria-hidden /> 12 Lantern St
          </span>
        </div>
      }
    >
      <h3 className="mb-3 text-sm font-semibold">Reviews</h3>
      <ul className="flex flex-col gap-3">
        {reviews.map((review) => (
          <li key={review.name} className="rounded-xl border bg-white/[0.02] p-3 text-sm">
            <p className="font-medium">{review.name}</p>
            <p className="mt-1 text-muted-foreground">{review.text}</p>
          </li>
        ))}
      </ul>
    </SnapDrawer>
  );
}
