import { Button } from "@/components/ui/button";
import { FlickeringGrid } from "@/components/dusk/flickering-grid/flickering-grid";

export default function FlickeringGridDemo() {
  return (
    <div className="relative flex h-80 w-full items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-background">
      <FlickeringGrid className="[mask-image:radial-gradient(ellipse_at_center,#000_20%,transparent_75%)]" />
      <div className="relative px-6 text-center">
        <h3 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">All systems operational</h3>
        <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-white/60">99.98% uptime across 24 regions over the last 90 days.</p>
        <Button variant="outline" className="mt-5">
          View the network
        </Button>
      </div>
    </div>
  );
}
