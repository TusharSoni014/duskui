import { Skeleton } from "@/components/ui/skeleton";

export default function SkeletonBasicDemo() {
  return (
    <div className="flex w-full max-w-sm items-center gap-4" role="status">
      <span className="sr-only">Loading profile</span>
      <Skeleton className="size-12 shrink-0 rounded-full" />
      <div className="grid flex-1 gap-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    </div>
  );
}
