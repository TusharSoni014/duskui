"use client";

import { TagInput } from "@/components/dusk/tag-input/tag-input";

const frameworks = [
  "Next.js",
  "Remix",
  "Astro",
  "Vite",
  "Nuxt",
  "SvelteKit",
  "SolidStart",
  "Qwik",
  "Gatsby",
  "Expo",
];

export default function TagInputSuggestionsDemo() {
  return (
    <div className="grid w-full max-w-md gap-2">
      <label htmlFor="stack" className="text-sm font-medium">
        Your stack
      </label>
      <TagInput id="stack" suggestions={frameworks} defaultValue={["Next.js"]} placeholder="Search frameworks…" />
    </div>
  );
}
