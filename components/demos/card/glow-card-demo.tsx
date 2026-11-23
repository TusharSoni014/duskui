import { Cpu, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { GlowCard } from "@/components/dusk/card/glow-card";

export default function GlowCardDemo() {
  return (
    <div className="grid w-full max-w-xl gap-4 sm:grid-cols-2">
      <GlowCard>
        <CardHeader>
          <Zap className="mb-2 size-5 text-muted-foreground" aria-hidden />
          <CardTitle>Edge functions</CardTitle>
          <CardDescription>Run code in the region closest to each request.</CardDescription>
        </CardHeader>
        <CardFooter>
          <Button variant="outline" size="sm">Learn more</Button>
        </CardFooter>
      </GlowCard>
      <GlowCard radius={120}>
        <CardHeader>
          <Cpu className="mb-2 size-5 text-muted-foreground" aria-hidden />
          <CardTitle>GPU instances</CardTitle>
          <CardDescription>Spin up an H100 in seconds. Pay by the minute.</CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">A smaller radius keeps the highlight tight.</CardContent>
      </GlowCard>
    </div>
  );
}
