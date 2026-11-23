"use client";

import * as React from "react";
import { InteractiveHoverButton } from "@/components/dusk/interactive-hover-button/interactive-hover-button";

export default function InteractiveHoverButtonLoadingDemo() {
  const [loading, setLoading] = React.useState(false);
  const timer = React.useRef<ReturnType<typeof setTimeout>>(undefined);

  React.useEffect(() => () => clearTimeout(timer.current), []);

  const subscribe = () => {
    setLoading(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setLoading(false), 2000);
  };

  return (
    <InteractiveHoverButton size="lg" loading={loading} onClick={subscribe} hoverLabel="It's free">
      Subscribe
    </InteractiveHoverButton>
  );
}
