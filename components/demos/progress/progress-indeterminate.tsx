import { Progress } from "@/components/ui/progress";

export default function ProgressIndeterminateDemo() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-3">
      <span id="progress-indeterminate-label" className="text-sm font-medium">Preparing your export…</span>
      <Progress value={null} aria-labelledby="progress-indeterminate-label" />
    </div>
  );
}
