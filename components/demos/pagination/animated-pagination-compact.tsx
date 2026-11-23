import { AnimatedPagination } from "@/components/dusk/pagination/animated-pagination";

export default function AnimatedPaginationCompactDemo() {
  return (
    <div className="flex w-full flex-col items-center gap-6">
      <AnimatedPagination totalPages={50} defaultPage={25} siblingCount={0} labels={null} aria-label="Compact pagination" />
      {/* Thirteen buttons can't fit a phone, so the wide variant scrolls sideways there. */}
      <div className="w-full overflow-x-auto pb-1">
        <AnimatedPagination
          totalPages={99}
          defaultPage={48}
          siblingCount={2}
          boundaryCount={2}
          labels={null}
          aria-label="Wide pagination"
          className="mx-auto w-max"
        />
      </div>
    </div>
  );
}
