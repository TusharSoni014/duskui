import { Cpu, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { GlowCard } from "@/components/dusk/card/glow-card";

export default function GlowCardDemo() {
  return (
    <div className="grid w-full max-w-xl gap-4 sm:grid-cols-2">
      <GlowCard>
        <CardHeader>
          <Zap className="mb-2 size-5 text-primary" aria-hidden />
          <CardTitle>Edge functions</CardTitle>
          <CardDescription>Run code close to your users with 0 ms cold starts.</CardDescription>
        </CardHeader>
        <CardFooter>
          <Button variant="outline" size="sm">Learn more</Button>
        </CardFooter>
      </GlowCard>
      <GlowCard color="#a78bfa" radius={200}>
        <CardHeader>
          <Cpu className="mb-2 size-5 text-violet-400" aria-hidden />
          <CardTitle>GPU instances</CardTitle>
          <CardDescription>Spin up an H100 in seconds. Pay by the minute.</CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">Custom color & radius.</CardContent>
      </GlowCard>
    </div>
  );
}
