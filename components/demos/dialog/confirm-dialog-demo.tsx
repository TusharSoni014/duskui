"use client";

import * as React from "react";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/dusk/dialog/confirm-dialog";

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default function ConfirmDialogDemo() {
  return (
    <>
      <ConfirmDialog
        trigger={
          <Button variant="destructive">
            <Trash2 />
            Delete project
          </Button>
        }
        variant="destructive"
        title="Delete “dusk-web”?"
        description="This permanently deletes the project, its deployments and domains. This can't be undone."
        confirmText="dusk-web"
        confirmLabel="Delete project"
        pendingLabel="Deleting…"
        onConfirm={async () => {
          await wait(1400);
          toast.success("Project deleted");
        }}
      />
      <ConfirmDialog
        trigger={<Button variant="outline">Publish (fails)</Button>}
        title="Publish to production?"
        description="Your changes go live for every visitor."
        confirmLabel="Publish"
        onConfirm={async () => {
          await wait(1200);
          throw new Error("Build failed: 2 type errors. Fix them and try again.");
        }}
      />
    </>
  );
}
