"use client";

import * as React from "react";
import { SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

export default function EmptySearchDemo() {
  const [query, setQuery] = React.useState("date range picker");

  return (
    <div className="w-full max-w-md rounded-xl border bg-card/40">
      <div className="border-b p-3">
        <Input
          type="search"
          aria-label="Search components"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search components…"
        />
      </div>
      <Empty outline={false} className="py-10">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <SearchX />
          </EmptyMedia>
          <EmptyTitle>No results{query ? ` for “${query}”` : ""}</EmptyTitle>
          <EmptyDescription>
            Check the spelling or try a broader term. You can also <a href="#">browse all components</a>.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button variant="outline" size="sm" onClick={() => setQuery("")}>
            Clear search
          </Button>
        </EmptyContent>
      </Empty>
    </div>
  );
}
