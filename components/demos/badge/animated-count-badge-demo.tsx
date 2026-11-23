"use client";

import * as React from "react";
import { Bell, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnimatedCountBadge } from "@/components/dusk/badge/animated-count-badge";

export default function AnimatedCountBadgeDemo() {
  const [count, setCount] = React.useState(8);

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex items-center gap-8">
        <span className="relative inline-flex">
          <Button variant="outline" size="icon" aria-label={`Notifications, ${count} unread`}>
            <Bell />
          </Button>
          <AnimatedCountBadge
            value={count}
            className="absolute -top-2 -right-2"
            aria-hidden
          />
        </span>
        <AnimatedCountBadge value={count * 137} max={9999} variant="soft" label={(n) => `${n} stars`} />
      </div>
      <div className="flex gap-2">
        <Button variant="secondary" size="icon-sm" aria-label="Decrease" onClick={() => setCount((c) => Math.max(0, c - 1))}>
          <Minus />
        </Button>
        <Button variant="secondary" size="sm" onClick={() => setCount((c) => c + 7)}>
          +7
        </Button>
        <Button variant="secondary" size="icon-sm" aria-label="Increase" onClick={() => setCount((c) => c + 1)}>
          <Plus />
        </Button>
      </div>
    </div>
  );
}
