import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BinaryRain } from "@/components/dusk/techy/binary-rain";

export default function BinaryRainLogin() {
  return (
    <div className="relative flex h-96 w-full items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-background p-6">
      <BinaryRain density={0.3} speed={0.7} className="opacity-60" />
      <form className="relative w-full max-w-xs space-y-3 rounded-xl border border-white/10 bg-card/90 p-5 backdrop-blur-sm">
        <h3 className="text-lg font-semibold text-white">Sign in to your workspace</h3>
        <Input type="email" placeholder="you@example.com" aria-label="Email" />
        <Button type="button" className="w-full">
          Continue
        </Button>
      </form>
    </div>
  );
}
