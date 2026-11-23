"use client";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";

const save = () =>
  new Promise<{ name: string }>((resolve) => setTimeout(() => resolve({ name: "brand-kit.fig" }), 1800));

export default function ToastPromiseDemo() {
  return (
    <Button
      variant="outline"
      onClick={() =>
        toast.promise(save(), {
          loading: "Uploading…",
          success: (file) => `${file.name} uploaded`,
          error: "Upload failed",
        })
      }
    >
      Upload file
    </Button>
  );
}
