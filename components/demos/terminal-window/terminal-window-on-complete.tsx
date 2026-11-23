"use client";

import * as React from "react";
import { TerminalWindow } from "@/components/dusk/hacker/terminal-window";

export default function TerminalWindowOnCompleteDemo() {
  const [deployed, setDeployed] = React.useState(false);

  return (
    <div className="flex w-full max-w-xl flex-col items-center gap-4">
      <TerminalWindow
        title="deploy"
        bodyClassName="h-48"
        onComplete={() => setDeployed(true)}
        lines={[
          { type: "command", text: "vercel deploy --prod" },
          "Building…",
          "Uploading build outputs…",
          { text: "✓ Production: https://duskui.com", className: "text-primary", delay: 700 },
        ]}
      />
      <p role="status" className="h-5 text-sm text-muted-foreground">
        {deployed ? "onComplete fired — deployment finished." : "Waiting for the session to finish…"}
      </p>
    </div>
  );
}
