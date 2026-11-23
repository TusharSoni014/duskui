import { Apple, Bird, Cat, Cherry, Citrus, Dog, Fish, Flower2, Grape, Leaf, Rabbit, Snail, Squirrel, Sprout, Trees, Turtle } from "lucide-react";

import { IconCloud, type IconCloudItem } from "@/components/dusk/icon-cloud/icon-cloud";

const palette = ["#c9a3b1", "#cbbd8f", "#94b8a5", "#97b1c6", "#aaa0c4", "#c7a58e"];
const icons = [
  [Apple, "Apple"],
  [Bird, "Bird"],
  [Cat, "Cat"],
  [Cherry, "Cherry"],
  [Citrus, "Citrus"],
  [Dog, "Dog"],
  [Fish, "Fish"],
  [Flower2, "Flower"],
  [Grape, "Grape"],
  [Leaf, "Leaf"],
  [Rabbit, "Rabbit"],
  [Snail, "Snail"],
  [Squirrel, "Squirrel"],
  [Sprout, "Sprout"],
  [Trees, "Trees"],
  [Turtle, "Turtle"],
] as const;

const items: IconCloudItem[] = icons.map(([Icon, label], i) => ({
  label,
  icon: <Icon style={{ color: palette[i % palette.length] }} strokeWidth={1.75} />,
}));

export default function IconCloudColors() {
  return (
    <div className="flex w-full flex-col items-center gap-2 rounded-xl border border-white/10 bg-background p-6">
      <IconCloud items={items} iconSize={48} speed={0.2} steerOnHover={false} maxScale={1.3} className="max-w-[300px]" label="Nature icons" />
      <p className="text-sm text-white/60">Drag to spin: it keeps its momentum, then settles back to a slow drift.</p>
    </div>
  );
}
