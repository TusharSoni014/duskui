import { Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Meteors } from "@/components/dusk/backgrounds/meteors";

export default function MeteorsCard() {
  return (
    <div className="flex w-full justify-center p-4">
      <div className="relative w-full max-w-xs overflow-hidden rounded-2xl border border-white/10 bg-card p-6">
        <Meteors count={6} stars={14} speed={0.8} tailLength={90} />
        <div className="relative">
          <p className="text-sm font-medium text-primary">Pro</p>
          <p className="mt-1 text-3xl font-semibold text-white">
            $24<span className="text-base font-normal text-white/50">/mo</span>
          </p>
          <ul className="mt-4 space-y-2 text-sm text-white/70">
            {["Unlimited projects", "Priority builds", "Custom domains"].map((item) => (
              <li key={item} className="flex items-center gap-2">
                <Check className="size-4 text-primary" aria-hidden />
                {item}
              </li>
            ))}
          </ul>
          <Button className="mt-6 w-full">Upgrade</Button>
        </div>
      </div>
    </div>
  );
}
