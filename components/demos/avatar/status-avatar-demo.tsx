"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { StatusAvatar, type AvatarStatus } from "@/components/dusk/avatar/status-avatar";

const order: AvatarStatus[] = ["online", "away", "busy", "offline"];

export default function StatusAvatarDemo() {
  const [status, setStatus] = React.useState<AvatarStatus>("online");

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="flex items-center gap-6">
        <StatusAvatar name="Maya Chen" src="https://i.pravatar.cc/150?img=47" status="online" />
        <StatusAvatar name="Leo Park" src="https://i.pravatar.cc/150?img=12" status="away" />
        <StatusAvatar name="Ines Duarte" src="https://i.pravatar.cc/150?img=32" status="busy" />
        <StatusAvatar name="Sam Okafor" status="offline" />
      </div>
      <div className="flex items-center gap-4">
        <StatusAvatar name="Ava Lindqvist" src="https://i.pravatar.cc/150?img=5" status={status} size="lg" />
        <Button
          variant="outline"
          size="sm"
          onClick={() => setStatus((s) => order[(order.indexOf(s) + 1) % order.length])}
        >
          Status: <span className="capitalize">{status}</span>
        </Button>
      </div>
    </div>
  );
}
