"use client";

import { Bell, Cloud, Rocket, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnimatedEmpty } from "@/components/dusk/empty/animated-empty";

export default function AnimatedEmptyCustomDemo() {
  return (
    <AnimatedEmpty
      className="w-full max-w-md"
      icon={Rocket}
      satellites={[Cloud, Zap, Bell]}
      title="No deployments yet"
      titleAs="h4"
      description="Push to your main branch or deploy from the CLI and your first build will show up here."
    >
      <Button>Deploy now</Button>
    </AnimatedEmpty>
  );
}
