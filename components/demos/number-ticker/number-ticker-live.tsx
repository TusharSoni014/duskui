"use client";

import * as React from "react";
import { Minus, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { NumberTicker } from "@/components/dusk/text/number-ticker";

const PRICE = 24.99;

export default function NumberTickerLiveDemo() {
  const [items, setItems] = React.useState(3);

  return (
    <div className="w-full max-w-xs rounded-xl border border-white/10 bg-white/[0.03] p-5">
      <p className="text-sm text-white/55">Cart total · {items} items</p>
      <NumberTicker
        as="p"
        value={items * PRICE}
        currency="USD"
        duration={0.8}
        bounce={0.15}
        className="mt-1 text-4xl font-bold tracking-tight"
      />
      <div className="mt-4 flex gap-2">
        <Button
          variant="outline"
          size="icon-sm"
          aria-label="Remove item"
          onClick={() => setItems((n) => Math.max(0, n - 1))}
        >
          <Minus />
        </Button>
        <Button size="sm" onClick={() => setItems((n) => n + 1)}>
          <Plus /> Add item
        </Button>
      </div>
    </div>
  );
}
