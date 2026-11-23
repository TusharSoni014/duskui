"use client";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export default function ToastBasicDemo() {
  return (
    <div className="flex flex-wrap justify-center gap-2">
      <Button variant="outline" onClick={() => toast("Event created", { description: "Sunday, December 3 at 9:00 AM" })}>
        Default
      </Button>
      <Button variant="outline" onClick={() => toast.success("Changes saved")}>
        Success
      </Button>
      <Button variant="outline" onClick={() => toast.info("New version available", { description: "Refresh to update." })}>
        Info
      </Button>
      <Button variant="outline" onClick={() => toast.warning("Storage almost full")}>
        Warning
      </Button>
      <Button variant="outline" onClick={() => toast.error("Couldn't reach the server")}>
        Error
      </Button>
      <Button
        variant="outline"
        onClick={() =>
          toast("Message archived", {
            action: { label: "Undo", onClick: () => toast.success("Message restored") },
          })
        }
      >
        With action
      </Button>
    </div>
  );
}
