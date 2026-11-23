"use client";

import { Trash2, UserX } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { DestructiveAlertDialog } from "@/components/dusk/alert-dialog/destructive-alert-dialog";

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default function DestructiveAlertDialogDemo() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <DestructiveAlertDialog
        trigger={
          <Button variant="destructive">
            <Trash2 />
            Delete project
          </Button>
        }
        title="Delete dusk-web?"
        description="This permanently deletes the project and everything in it."
        consequences={["14 deployments and their logs", "2 custom domains", "All environment variables"]}
        confirmText="dusk-web"
        confirmLabel="Delete project"
        pendingLabel="Deleting…"
        onConfirm={async () => {
          await wait(1400);
          toast.success("dusk-web was deleted");
        }}
      />
      <DestructiveAlertDialog
        trigger={
          <Button variant="outline">
            <UserX />
            Remove member (fails)
          </Button>
        }
        icon={<UserX />}
        title="Remove Ada Kim from the team?"
        description="She loses access to every project right away."
        confirmLabel="Remove"
        onConfirm={async () => {
          await wait(1100);
          throw new Error("Ada is the only owner. Transfer ownership first.");
        }}
      />
    </div>
  );
}
