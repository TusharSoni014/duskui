"use client";

import * as React from "react";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const total = 10;

export default function PaginationBasicDemo() {
  const [page, setPage] = React.useState(2);
  const pages = [1, 2, 3];

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          {/* asChild renders a <button>; in an app, pass href (or your router's Link) instead. */}
          <PaginationPrevious asChild aria-disabled={page === 1 || undefined}>
            <button type="button" onClick={() => page > 1 && setPage(page - 1)} />
          </PaginationPrevious>
        </PaginationItem>
        {pages.map((p) => (
          <PaginationItem key={p}>
            <PaginationLink asChild isActive={p === page}>
              <button type="button" onClick={() => setPage(p)}>
                {p}
              </button>
            </PaginationLink>
          </PaginationItem>
        ))}
        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink asChild isActive={page === total}>
            <button type="button" onClick={() => setPage(total)}>
              {total}
            </button>
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationNext asChild aria-disabled={page === total || undefined}>
            <button type="button" onClick={() => page < total && setPage(page + 1)} />
          </PaginationNext>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
