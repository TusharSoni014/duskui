"use client";

import * as React from "react";
import { CloudUpload } from "lucide-react";

import { FrostButton } from "@/components/dusk/glass/frost-button";
import { GlassBackdrop } from "@/components/demos/glass-card/glass-backdrop";

export default function FrostButtonLoading() {
  const [loading, setLoading] = React.useState(false);

  return (
    <>
      <GlassBackdrop />
      <FrostButton
        size="lg"
        tone="primary"
        className="min-w-40 rounded-full"
        loading={loading}
        loadingText="Publishing…"
        onClick={() => {
          setLoading(true);
          setTimeout(() => setLoading(false), 2000);
        }}
      >
        <CloudUpload />
        Publish
      </FrostButton>
    </>
  );
}
