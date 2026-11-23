import { AnimatedPagination } from "@/components/dusk/pagination/animated-pagination";

export default function AnimatedPaginationFewDemo() {
  return (
    <AnimatedPagination
      totalPages={5}
      defaultPage={1}
      labels={{ previous: "Newer", next: "Older" }}
      aria-label="Blog pages"
    />
  );
}
