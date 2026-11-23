"use client";

import * as React from "react";
import { Timer } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { SessionTimeoutDialog } from "@/components/dusk/alert-dialog/session-timeout-dialog";

export default function SessionTimeoutDialogDemo() {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)}>
        <Timer />
        Simulate 15 min idle
      </Button>
      <SessionTimeoutDialog
        open={open}
        onOpenChange={setOpen}
        seconds={20}
        onStay={() => toast.success("Session extended")}
        onSignOut={(reason) =>
          toast(reason === "timeout" ? "Signed out after inactivity" : "Signed out")
        }
      />
    </>
  );
}
