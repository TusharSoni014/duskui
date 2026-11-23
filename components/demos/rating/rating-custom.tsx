"use client";

import { Flame, Heart, Zap } from "lucide-react";

import { Rating } from "@/components/dusk/rating/rating";

export default function RatingCustomDemo() {
  return (
    <div className="flex flex-col items-start gap-5">
      <div className="flex flex-col items-start gap-1.5 sm:flex-row sm:items-center sm:gap-4">
        <span className="w-20 text-sm text-muted-foreground">Hearts</span>
        <Rating icon={Heart} defaultValue={3} label="Hearts" color="#f472b6" />
      </div>
      <div className="flex flex-col items-start gap-1.5 sm:flex-row sm:items-center sm:gap-4">
        <span className="w-20 text-sm text-muted-foreground">Energy</span>
        <Rating icon={Zap} count={10} size="sm" defaultValue={7} label="Energy level" />
      </div>
      <div className="flex flex-col items-start gap-1.5 sm:flex-row sm:items-center sm:gap-4">
        <span className="w-20 text-sm text-muted-foreground">Spice</span>
        <Rating
          icon={Flame}
          count={3}
          size={36}
          defaultValue={2}
          label="Spice level"
          getValueText={(v) => ["No spice", "Mild", "Hot", "Extra hot"][v]}
        />
      </div>
    </div>
  );
}
