"use client";

import * as React from "react";
import { PulsatingButton } from "@/components/dusk/pulsating-button/pulsating-button";

export default function PulsatingButtonLoadingDemo() {
  const [loading, setLoading] = React.useState(false);
  const timer = React.useRef<ReturnType<typeof setTimeout>>(undefined);

  React.useEffect(() => () => clearTimeout(timer.current), []);

  const claim = () => {
    setLoading(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setLoading(false), 2000);
  };

  return (
    <PulsatingButton size="lg" loading={loading} loadingText="Claiming…" onClick={claim}>
      Claim your spot
    </PulsatingButton>
  );
}
