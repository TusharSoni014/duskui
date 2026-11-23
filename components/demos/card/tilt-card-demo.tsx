import { Sparkles } from "lucide-react";
import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TiltCard } from "@/components/dusk/card/tilt-card";

export default function TiltCardDemo() {
  return (
    <TiltCard className="w-72 bg-[radial-gradient(120%_80%_at_0%_0%,color-mix(in_oklab,var(--color-primary)_18%,transparent),transparent_60%)]">
      <CardHeader className="gap-3">
        {/* translateZ lifts the icon off the card while it tilts. */}
        <div className="mb-6 grid size-12 place-items-center rounded-xl bg-primary text-primary-foreground shadow-lg [transform:translateZ(40px)]">
          <Sparkles className="size-6" aria-hidden />
        </div>
        <CardTitle className="text-xl [transform:translateZ(24px)]">DuskUI Pro</CardTitle>
        <CardDescription className="[transform:translateZ(12px)]">
          Hover with a mouse and move around — the card follows in 3D.
        </CardDescription>
      </CardHeader>
    </TiltCard>
  );
}
