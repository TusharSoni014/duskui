"use client";

import * as React from "react";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { HoldToConfirmButton } from "@/components/dusk/button/hold-to-confirm-button";

export default function HoldToConfirmDemo() {
  return (
    <HoldToConfirmButton
      size="lg"
      className="text-destructive"
      onConfirm={() => toast.success("Project deleted")}
    >
      <Trash2 />
      Hold to delete
    </HoldToConfirmButton>
  );
}
