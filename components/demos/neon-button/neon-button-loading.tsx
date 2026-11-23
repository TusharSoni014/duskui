"use client";

import * as React from "react";
import { Rocket } from "lucide-react";
import { NeonButton } from "@/components/dusk/neon/neon-button";

export default function NeonButtonLoadingDemo() {
  const [loading, setLoading] = React.useState(false);

  const launch = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1800);
  };

  return (
    <NeonButton size="lg" color="#22d3ee" loading={loading} loadingText="Launching…" onClick={launch}>
      <Rocket />
      Launch
    </NeonButton>
  );
}
