import { Crop, Heart, Share2, SlidersHorizontal, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { BlurPanel } from "@/components/dusk/glass/blur-panel";

const tiles = [
  "from-amber-300 to-rose-500",
  "from-sky-400 to-violet-600",
  "from-teal-300 to-teal-600",
  "from-fuchsia-500 to-indigo-600",
  "from-lime-300 to-emerald-600",
  "from-orange-400 to-pink-600",
  "from-cyan-300 to-blue-600",
  "from-rose-400 to-purple-700",
  "from-yellow-300 to-orange-600",
];

const tools = [
  { label: "Adjust", icon: SlidersHorizontal },
  { label: "Crop", icon: Crop },
  { label: "Favorite", icon: Heart },
  { label: "Share", icon: Share2 },
  { label: "Delete", icon: Trash2 },
];

export default function BlurPanelToolbar() {
  return (
    <div
      role="region"
      tabIndex={0}
      aria-label="Photo grid"
      className="relative h-80 w-full max-w-md overflow-y-auto overscroll-contain rounded-xl border border-white/10 bg-background p-2 outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
    >
      <div className="grid grid-cols-3 gap-2 pb-16">
        {[...tiles, ...tiles].map((tone, i) => (
          <div key={i} className={`aspect-square rounded-md bg-linear-to-br ${tone}`} />
        ))}
      </div>
      <BlurPanel
        as="nav"
        aria-label="Photo tools"
        scrollRange={false}
        intensity="strong"
        edge="none"
        className="sticky bottom-2 mx-auto -mt-14 flex w-fit gap-1 rounded-full p-1.5 shadow-[inset_0_1px_0_rgb(255_255_255/0.15)] ring-1 ring-white/15"
      >
        {tools.map(({ label, icon: Icon }) => (
          <Button
            key={label}
            variant="ghost"
            size="icon-sm"
            aria-label={label}
            className="rounded-full text-white/85 hover:text-white dark:hover:bg-white/15"
          >
            <Icon />
          </Button>
        ))}
      </BlurPanel>
    </div>
  );
}
