"use client";

import { Button } from "@/components/ui/button";
import { animatedToast } from "@/components/dusk/toast/animated-toast";

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
let attempts = 0;

export default function AnimatedToastDemo() {
  return (
    <div className="flex flex-wrap justify-center gap-2">
      <Button
        onClick={() =>
          animatedToast.promise(() => wait(2000).then(() => ({ url: "dusk-web.vercel.app" })), {
            loading: { title: "Deploying dusk-web…", description: "Building and uploading 128 files" },
            success: (data) => ({ title: "Deployed", description: `Live at ${data.url}` }),
            error: "Deployment failed",
          })
        }
      >
        Deploy
      </Button>
      <Button
        variant="outline"
        onClick={() => {
          attempts = 0;
          animatedToast.promise(
            async () => {
              await wait(1500);
              // Fails the first time; Retry succeeds.
              if (attempts++ === 0) throw new Error("Network error");
            },
            {
              loading: "Syncing contacts…",
              success: "Contacts synced",
              error: (error) => ({
                title: "Sync failed",
                description: error instanceof Error ? error.message : undefined,
              }),
            }
          );
        }}
      >
        Sync (fails once)
      </Button>
      <Button variant="outline" onClick={() => animatedToast.success("Invite sent", { description: "ada@dusk.dev can join now." })}>
        Success
      </Button>
      <Button
        variant="outline"
        onClick={() =>
          animatedToast.warning("API key expires in 3 days", {
            duration: 8000,
            action: { label: "Rotate key", onClick: () => animatedToast.success("New key created") },
          })
        }
      >
        With action
      </Button>
    </div>
  );
}
