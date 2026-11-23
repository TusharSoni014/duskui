"use client";

import * as React from "react";
import { Cloud, Database, Globe, HardDrive, Server, Zap } from "lucide-react";
import {
  AnimatedSelect,
  AnimatedSelectContent,
  AnimatedSelectGroup,
  AnimatedSelectItem,
  AnimatedSelectLabel,
  AnimatedSelectSeparator,
  AnimatedSelectTrigger,
  AnimatedSelectValue,
} from "@/components/dusk/select/animated-select";

export default function AnimatedSelectDemo() {
  const [region, setRegion] = React.useState("fra1");

  return (
    <div className="grid w-full max-w-xs gap-2">
      <label htmlFor="deploy-region" className="text-sm font-medium">
        Deploy region
      </label>
      <AnimatedSelect value={region} onValueChange={setRegion} name="region">
        <AnimatedSelectTrigger id="deploy-region">
          <AnimatedSelectValue placeholder="Choose a region" />
        </AnimatedSelectTrigger>
        <AnimatedSelectContent>
          <AnimatedSelectGroup>
            <AnimatedSelectLabel>Edge</AnimatedSelectLabel>
            <AnimatedSelectItem value="iad1" icon={<Zap />} description="12ms">
              Washington, D.C.
            </AnimatedSelectItem>
            <AnimatedSelectItem value="fra1" icon={<Globe />} description="18ms">
              Frankfurt
            </AnimatedSelectItem>
            <AnimatedSelectItem value="hnd1" icon={<Cloud />} description="41ms">
              Tokyo
            </AnimatedSelectItem>
          </AnimatedSelectGroup>
          <AnimatedSelectSeparator />
          <AnimatedSelectGroup>
            <AnimatedSelectLabel>Dedicated</AnimatedSelectLabel>
            <AnimatedSelectItem value="db1" icon={<Database />}>
              Database cluster
            </AnimatedSelectItem>
            <AnimatedSelectItem value="vm1" icon={<Server />}>
              Bare metal
            </AnimatedSelectItem>
            <AnimatedSelectItem value="local" icon={<HardDrive />} disabled>
              On-premise (soon)
            </AnimatedSelectItem>
          </AnimatedSelectGroup>
        </AnimatedSelectContent>
      </AnimatedSelect>
      <p className="text-xs text-muted-foreground" aria-live="polite">
        Deploying to <span className="font-mono text-foreground">{region}</span>
      </p>
    </div>
  );
}
