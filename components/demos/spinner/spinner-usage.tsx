import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

export default function SpinnerUsageDemo() {
  return (
    <div className="flex flex-col items-center gap-5">
      <div className="flex flex-wrap items-center justify-center gap-3">
        {/* The button text already says what's happening, so the spinner is hidden from screen readers. */}
        <Button aria-disabled aria-busy>
          <Spinner aria-hidden />
          Saving…
        </Button>
        <Button variant="outline" aria-disabled aria-busy>
          <Spinner aria-hidden className="text-primary" />
          Syncing
        </Button>
        <Badge variant="soft" size="lg">
          <Spinner size="sm" aria-hidden />
          Deploying
        </Badge>
      </div>
      <div className="flex w-full max-w-xs items-center gap-3 rounded-lg border bg-card/40 px-3 py-2.5 text-sm">
        <Spinner className="text-primary" label="Fetching messages" />
        <span className="text-muted-foreground">Fetching new messages…</span>
      </div>
    </div>
  );
}
