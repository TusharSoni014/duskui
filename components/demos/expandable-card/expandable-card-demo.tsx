import { Compass, Mountain, Sunrise, Waves } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ExpandableCard, type ExpandableCardItem } from "@/components/dusk/expandable-card/expandable-card";

function Art({ icon: Icon, hue }: { icon: typeof Mountain; hue: string }) {
  return (
    <span
      className="grid size-full place-items-center"
      style={{
        background: `radial-gradient(120% 90% at 20% 0%, color-mix(in oklab, ${hue} 60%, transparent), transparent 60%), linear-gradient(160deg, #0f2a24, #05100d)`,
      }}
    >
      <Icon className="size-9 text-white/85" aria-hidden />
    </span>
  );
}

const items: ExpandableCardItem[] = [
  {
    id: "ridge",
    title: "Northern Ridge",
    subtitle: "Photo series · 12 shots",
    description:
      "Three mornings above the tree line, chasing the few minutes when fog lifts off the valley and the ridge catches first light.",
    media: <Art icon={Mountain} hue="var(--color-primary)" />,
    content: <p>Shot on a 35mm prime at f/8. Prints ship on matte cotton paper in three sizes.</p>,
    action: <Button size="sm">View the series</Button>,
  },
  {
    id: "tide",
    title: "Low Tide",
    subtitle: "Photo series · 8 shots",
    description:
      "Long exposures of the estuary at dusk, where the water turns to glass and the mud flats mirror the sky.",
    media: <Art icon={Waves} hue="#22d3ee" />,
    content: <p>Each frame is a 30-second exposure with a ten-stop ND filter.</p>,
    action: <Button size="sm">View the series</Button>,
  },
  {
    id: "dawn",
    title: "First Light",
    subtitle: "Photo series · 16 shots",
    description:
      "A year of sunrises from the same rooftop, one frame a week, stitched into a slow calendar of color.",
    media: <Art icon={Sunrise} hue="#f59e0b" />,
    content: <p>The full sequence is also available as a 90-second timelapse.</p>,
    action: <Button size="sm">View the series</Button>,
  },
  {
    id: "trail",
    title: "Lost Trail",
    subtitle: "Photo series · 10 shots",
    description:
      "Forest paths that fade into nothing: overgrown, half-remembered routes through old woodland.",
    media: <Art icon={Compass} hue="#a78bfa" />,
    content: <p>Printed in black and white with a warm selenium tone.</p>,
    action: <Button size="sm">View the series</Button>,
  },
];

export default function ExpandableCardDemo() {
  return <ExpandableCard items={items} className="max-w-2xl" />;
}
