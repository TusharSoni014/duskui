"use client";

import * as React from "react";
import { Shuffle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CircularProgress } from "@/components/dusk/progress/circular-progress";

export default function CircularProgressDemo() {
  const [values, setValues] = React.useState([72, 45, 90]);

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex flex-wrap items-center justify-center gap-8">
        <CircularProgress value={values[0]} caption="Storage" aria-label="Storage used" />
        <CircularProgress
          value={values[1]}
          size={96}
          strokeWidth={8}
          caption="Tasks"
          aria-label="Tasks done"
          indicatorClassName="text-foreground"
        />
        <CircularProgress
          value={values[2]}
          size={72}
          strokeWidth={6}
          aria-label="Profile complete"
        />
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setValues(values.map(() => Math.round(Math.random() * 100)))}
      >
        <Shuffle />
        Shuffle
      </Button>
    </div>
  );
}
