import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AuroraBackground } from "@/components/dusk/backgrounds/aurora-background";

export default function AuroraBackgroundSubtle() {
  return (
    <div className="relative flex h-80 w-full items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-background p-6">
      <AuroraBackground intensity={0.35} speed={0.5} blur={72} />
      <form className="relative w-full max-w-sm space-y-3 rounded-2xl border border-white/10 bg-card/80 p-5 backdrop-blur-md">
        <h3 className="text-lg font-semibold text-white">Join the waitlist</h3>
        <p className="text-sm text-white/60">Low intensity and half speed keep the focus on the form.</p>
        <div className="flex gap-2">
          <Input type="email" placeholder="you@example.com" aria-label="Email" />
          <Button type="button">Notify me</Button>
        </div>
      </form>
    </div>
  );
}
