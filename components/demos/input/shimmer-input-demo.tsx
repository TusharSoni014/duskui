"use client";

import * as React from "react";
import { ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ShimmerInput } from "@/components/dusk/input/shimmer-input";

export default function ShimmerInputDemo() {
  const [loading, setLoading] = React.useState(false);

  return (
    <form
      className="flex w-full max-w-md items-center gap-2"
      onSubmit={(e) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => setLoading(false), 2500);
      }}
    >
      <ShimmerInput loading={loading} placeholder="Ask anything…" aria-label="Prompt" />
      <Button type="submit" size="icon" loading={loading} aria-label="Send">
        <ArrowUp />
      </Button>
    </form>
  );
}
