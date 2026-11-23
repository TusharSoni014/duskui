"use client";

import * as React from "react";
import { RainbowButton } from "@/components/dusk/rainbow-button/rainbow-button";

export default function RainbowButtonLoadingDemo() {
  const [loading, setLoading] = React.useState(false);
  const timer = React.useRef<ReturnType<typeof setTimeout>>(undefined);

  React.useEffect(() => () => clearTimeout(timer.current), []);

  const publish = () => {
    setLoading(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setLoading(false), 2000);
  };

  return (
    <RainbowButton size="lg" loading={loading} loadingText="Publishing…" onClick={publish}>
      Publish site
    </RainbowButton>
  );
}
