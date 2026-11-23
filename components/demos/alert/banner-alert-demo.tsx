"use client";

import * as React from "react";
import { ArrowRight, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BannerAlert } from "@/components/dusk/alert/banner-alert";

export default function BannerAlertDemo() {
  const [open, setOpen] = React.useState(true);

  return (
    <div className="flex w-full max-w-2xl flex-col items-center gap-4">
      {/* A mock app window so the banner has a "top of page" to live at. */}
      <div className="w-full overflow-hidden rounded-xl border bg-background">
        <BannerAlert
          open={open}
          onOpenChange={setOpen}
          action={
            <a href="#" className="inline-flex items-center gap-1 font-medium text-primary hover:underline">
              Read the changelog
              <ArrowRight className="size-3.5" aria-hidden />
            </a>
          }
        >
          <span className="font-medium">DuskUI 2.0 is here</span>
          <span className="text-muted-foreground"> with 40 new animated components.</span>
        </BannerAlert>
        <div className="flex items-center gap-3 border-b px-4 py-3">
          <span className="size-5 rounded-md bg-primary/80" aria-hidden />
          <span className="text-sm font-medium">Acme</span>
          <span className="ml-auto h-2 w-24 rounded-full bg-white/10" aria-hidden />
        </div>
        <div className="grid gap-2 p-4" aria-hidden>
          <div className="h-3 w-2/3 rounded-full bg-white/[0.06]" />
          <div className="h-3 w-1/2 rounded-full bg-white/[0.06]" />
          <div className="h-3 w-3/5 rounded-full bg-white/[0.06]" />
        </div>
      </div>
      <Button variant="outline" size="sm" onClick={() => setOpen(true)} disabled={open}>
        <RotateCcw />
        Show banner
      </Button>
    </div>
  );
}
