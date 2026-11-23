"use client";

import * as React from "react";

import { AnimatedPagination } from "@/components/dusk/pagination/animated-pagination";

const perPage = 10;
const totalItems = 240;

export default function AnimatedPaginationDemo() {
  const [page, setPage] = React.useState(1);
  const totalPages = Math.ceil(totalItems / perPage);
  const from = (page - 1) * perPage + 1;
  const to = Math.min(page * perPage, totalItems);

  return (
    <div className="flex w-full flex-col items-center gap-4">
      <AnimatedPagination totalPages={totalPages} page={page} onPageChange={setPage} />
      <p className="text-sm text-muted-foreground tabular-nums" aria-live="polite">
        Showing <span className="text-foreground">{from}–{to}</span> of {totalItems} results
      </p>
    </div>
  );
}
