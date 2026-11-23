import { ArrowRight } from "lucide-react";
import { SafariMockup } from "@/components/dusk/device-mockup/device-mockup";

export default function DeviceMockupSafariDemo() {
  return (
    <SafariMockup url="duskui.com" tilt className="max-w-xl">
      <div className="flex size-full flex-col items-center justify-center gap-3 p-6 text-center">
        <span className="rounded-full border px-3 py-1 text-xs text-muted-foreground">Version 2.0</span>
        <p className="text-2xl font-semibold tracking-tight sm:text-3xl">Components for product teams</p>
        <p className="max-w-xs text-sm text-muted-foreground">
          Hover with a mouse: the window tilts slightly toward the cursor.
        </p>
        <span className="mt-1 inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground">
          Get started <ArrowRight className="size-4" aria-hidden />
        </span>
      </div>
    </SafariMockup>
  );
}
