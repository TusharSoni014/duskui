"use client";

import * as React from "react";
import { Upload } from "lucide-react";
import { CyberButton } from "@/components/dusk/hacker/cyber-button";

export default function CyberButtonLoadingDemo() {
  const [loading, setLoading] = React.useState(false);
  const timer = React.useRef<ReturnType<typeof setTimeout>>(undefined);

  React.useEffect(() => () => clearTimeout(timer.current), []);

  return (
    <CyberButton
      size="lg"
      loading={loading}
      loadingText="UPLOADING"
      onClick={() => {
        setLoading(true);
        timer.current = setTimeout(() => setLoading(false), 1800);
      }}
    >
      <Upload />
      Upload payload
    </CyberButton>
  );
}
