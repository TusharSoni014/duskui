import { ArrowRight } from "lucide-react";
import { SafariMockup } from "@/components/dusk/device-mockup/device-mockup";

export default function DeviceMockupSafariDemo() {
  return (
    <SafariMockup url="duskui.com" tilt className="max-w-xl">
      <div className="flex size-full flex-col items-center justify-center gap-3 bg-[radial-gradient(80%_60%_at_50%_0%,color-mix(in_oklab,var(--color-primary)_22%,transparent),transparent_70%)] p-6 text-center">
        <span className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs text-primary">
          New · 60+ components
        </span>
        <p className="text-2xl font-bold tracking-tight sm:text-3xl">Ship interfaces that glow.</p>
        <p className="max-w-xs text-sm text-muted-foreground">
          Hover with a mouse: the whole window tilts toward the cursor.
        </p>
        <span className="mt-1 inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground">
          Get started <ArrowRight className="size-4" aria-hidden />
        </span>
      </div>
    </SafariMockup>
  );
}
