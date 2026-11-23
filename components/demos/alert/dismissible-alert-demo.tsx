"use client";

import * as React from "react";
import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DismissibleAlert } from "@/components/dusk/alert/dismissible-alert";

export default function DismissibleAlertDemo() {
  // Bumping the key remounts both alerts, bringing them back.
  const [round, setRound] = React.useState(0);

  return (
    <div className="flex w-full max-w-lg flex-col gap-3">
      <div key={round} className="flex flex-col gap-3">
        <DismissibleAlert
          variant="info"
          title="New: branch previews"
          actions={
            <>
              <Button size="sm" variant="soft">Try it</Button>
              <Button size="sm" variant="ghost">Learn more</Button>
            </>
          }
        >
          Every pull request now gets its own URL. Share it with reviewers in one click.
        </DismissibleAlert>
        <DismissibleAlert variant="success" title="Settings saved" autoDismiss={5000}>
          Closes by itself in 5 seconds. Hover or focus it to pause.
        </DismissibleAlert>
      </div>
      <p className="text-sm text-muted-foreground">Content below slides up as the alerts close.</p>
      <Button variant="outline" size="sm" className="self-start" onClick={() => setRound((r) => r + 1)}>
        <RotateCcw />
        Reset
      </Button>
    </div>
  );
}
