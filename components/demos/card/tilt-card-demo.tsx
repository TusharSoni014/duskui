import { Layers } from "lucide-react";
import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TiltCard } from "@/components/dusk/card/tilt-card";

export default function TiltCardDemo() {
  return (
    <TiltCard className="w-72">
      <CardHeader className="gap-3">
        {/* translateZ lifts the icon off the card while it tilts. */}
        <div className="mb-6 grid size-12 place-items-center rounded-xl border border-white/10 bg-white/[0.04] text-white/80 [transform:translateZ(24px)]">
          <Layers className="size-6" aria-hidden />
        </div>
        <CardTitle className="text-xl [transform:translateZ(16px)]">Design system audit</CardTitle>
        <CardDescription className="[transform:translateZ(8px)]">
          Move a mouse over the card and it tilts gently toward the cursor.
        </CardDescription>
      </CardHeader>
    </TiltCard>
  );
}
