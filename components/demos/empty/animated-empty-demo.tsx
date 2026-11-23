"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnimatedEmpty } from "@/components/dusk/empty/animated-empty";

export default function AnimatedEmptyDemo() {
  return (
    <AnimatedEmpty
      className="w-full max-w-md"
      title="Your inbox is empty"
      description="New messages from your team and integrations will land here. Enjoy the quiet."
    >
      <Button>
        <Plus />
        Compose
      </Button>
      <Button variant="ghost">Invite teammates</Button>
    </AnimatedEmpty>
  );
}
