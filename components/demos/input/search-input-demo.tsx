"use client";

import * as React from "react";
import { SearchInput } from "@/components/dusk/input/search-input";

const frameworks = ["Next.js", "Remix", "Astro", "Vite", "Gatsby", "Nuxt", "SvelteKit"];

export default function SearchInputDemo() {
  const [query, setQuery] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [results, setResults] = React.useState(frameworks);

  React.useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => {
      setResults(frameworks.filter((f) => f.toLowerCase().includes(query.toLowerCase())));
      setLoading(false);
    }, 400);
    return () => clearTimeout(t);
  }, [query]);

  return (
    <div className="w-full max-w-sm">
      <SearchInput
        value={query}
        onValueChange={setQuery}
        loading={loading}
        shortcut="j"
        placeholder="Search frameworks…"
        aria-label="Search frameworks"
      />
      <p className="mt-3 text-xs text-muted-foreground">
        {results.length ? results.join(" · ") : "No matches"}
      </p>
    </div>
  );
}
