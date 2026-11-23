import { AnimatedPagination } from "@/components/dusk/pagination/animated-pagination";

export default function AnimatedPaginationCompactDemo() {
  return (
    <div className="flex flex-col items-center gap-6">
      <AnimatedPagination totalPages={50} defaultPage={25} siblingCount={0} labels={null} aria-label="Compact pagination" />
      <AnimatedPagination totalPages={99} defaultPage={48} siblingCount={2} boundaryCount={2} labels={null} aria-label="Wide pagination" />
    </div>
  );
}
