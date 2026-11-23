import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataStream } from "@/components/dusk/techy/data-stream";

export default function DataStreamDemo() {
  return (
    <div className="relative flex h-80 w-full items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-background">
      <DataStream />
      <div className="relative max-w-sm rounded-2xl border border-white/10 bg-background/70 px-6 py-5 text-center backdrop-blur-md">
        <h3 className="text-2xl font-semibold tracking-tight text-white">Real-time, all the time</h3>
        <p className="mt-2 text-sm text-white/60">Stream millions of events per second with sub-10ms latency.</p>
        <Button className="mt-4" size="sm">
          Start streaming
          <ArrowRight />
        </Button>
      </div>
    </div>
  );
}
