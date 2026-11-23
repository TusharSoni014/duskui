import { Check } from "lucide-react";
import { NeonBorder } from "@/components/dusk/neon/neon-border";

export default function NeonBorderDemo() {
  return (
    <NeonBorder className="w-full max-w-xs" contentClassName="bg-card p-6">
      <p className="text-sm font-medium text-white">Pro</p>
      <p className="mt-1 text-3xl font-bold">
        $12<span className="text-base font-normal text-white/50">/mo</span>
      </p>
      <ul className="mt-4 space-y-2 text-sm text-white/70">
        {["Unlimited projects", "Priority support", "Custom domains"].map((item) => (
          <li key={item} className="flex items-center gap-2">
            <Check className="size-4 text-white/50" aria-hidden />
            {item}
          </li>
        ))}
      </ul>
    </NeonBorder>
  );
}
