import { Cloud, Code2, Cpu, Database, GitBranch, Globe, Lock, Moon, Terminal, Zap } from "lucide-react";

import { OrbitingCircles } from "@/components/dusk/orbiting-circles/orbiting-circles";

const chip =
  "flex size-full items-center justify-center rounded-full border border-white/10 bg-card text-muted-foreground";

export default function OrbitingCirclesDemo() {
  return (
    <div className="relative flex h-[420px] w-full items-center justify-center overflow-hidden">
      <div className="relative z-10 flex size-16 items-center justify-center rounded-xl border bg-card text-foreground">
        <Moon className="size-7" aria-hidden />
        <span className="sr-only">DuskUI</span>
      </div>

      <OrbitingCircles radius={80} duration={16} iconSize={36}>
        <span className={chip}><Zap className="size-4" aria-hidden /></span>
        <span className={chip}><Lock className="size-4" aria-hidden /></span>
        <span className={chip}><Cpu className="size-4" aria-hidden /></span>
        <span className={chip}><Terminal className="size-4" aria-hidden /></span>
      </OrbitingCircles>

      <OrbitingCircles radius={160} duration={28} reverse iconSize={44}>
        <span className={chip}><Globe className="size-5" aria-hidden /></span>
        <span className={chip}><Database className="size-5" aria-hidden /></span>
        <span className={chip}><GitBranch className="size-5" aria-hidden /></span>
        <span className={chip}><Cloud className="size-5" aria-hidden /></span>
        <span className={chip}><Code2 className="size-5" aria-hidden /></span>
      </OrbitingCircles>
    </div>
  );
}
