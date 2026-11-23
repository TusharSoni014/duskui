import {
  SkeletonAvatarRow,
  SkeletonCard,
  SkeletonTable,
  SkeletonText,
} from "@/components/dusk/skeleton/skeleton-presets";

export default function SkeletonPresetsDemo() {
  return (
    <div className="grid w-full max-w-2xl gap-6" role="status" aria-label="Loading dashboard">
      <div className="grid gap-6 sm:grid-cols-2">
        <SkeletonCard />
        <div className="grid content-start gap-6 rounded-xl border bg-card p-4">
          <SkeletonAvatarRow action />
          <SkeletonText lines={4} />
          <SkeletonAvatarRow square avatarClassName="size-9" />
        </div>
      </div>
      <SkeletonTable rows={4} columns={4} />
    </div>
  );
}
