"use client";

import { FeedbackPopover } from "@/components/dusk/popover/feedback-popover";

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default function FeedbackPopoverDemo() {
  return (
    // Reserve room below the button: the panel opens in place, not in a portal.
    <div className="flex h-64 w-80 items-start justify-start">
      <FeedbackPopover
        maxLength={280}
        onSubmit={async (message) => {
          await wait(1100);
          if (message.toLowerCase().includes("error")) {
            throw new Error("Couldn't send. Check your connection.");
          }
        }}
      />
    </div>
  );
}
