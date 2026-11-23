"use client";

import * as React from "react";
import { RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingCard } from "@/components/dusk/card/loading-card";

export default function LoadingCardDemo() {
  const [loading, setLoading] = React.useState(true);
  const timer = React.useRef<ReturnType<typeof setTimeout>>(undefined);

  const load = React.useCallback(() => {
    setLoading(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setLoading(false), 1600);
  }, []);

  React.useEffect(() => {
    timer.current = setTimeout(() => setLoading(false), 1600);
    return () => clearTimeout(timer.current);
  }, []);

  return (
    <div className="flex w-full max-w-sm flex-col items-center gap-4">
      <LoadingCard loading={loading} loadingLabel="Loading profile" className="w-full">
        <CardHeader className="flex items-center gap-3">
          <div className="grid size-10 shrink-0 place-items-center rounded-full bg-primary/15 font-semibold text-primary">
            AK
          </div>
          <div className="grid gap-1">
            <CardTitle>Ada Kim</CardTitle>
            <CardDescription>Design engineer · Berlin</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="text-sm leading-relaxed text-muted-foreground">
          Builds motion systems and design tooling. Currently obsessed with spring physics and
          variable fonts.
        </CardContent>
        <CardFooter className="gap-2">
          <Button size="sm">Follow</Button>
          <Button size="sm" variant="outline">Message</Button>
        </CardFooter>
      </LoadingCard>
      <Button variant="ghost" size="sm" onClick={load} disabled={loading}>
        <RotateCw />
        Reload
      </Button>
    </div>
  );
}
