"use client";

import * as React from "react";
import { Combobox } from "@/components/dusk/combobox/combobox";

const frameworks = [
  { value: "next", label: "Next.js", keywords: ["react", "vercel"] },
  { value: "remix", label: "Remix", keywords: ["react router"] },
  { value: "astro", label: "Astro", keywords: ["islands"] },
  { value: "sveltekit", label: "SvelteKit", keywords: ["svelte"] },
  { value: "nuxt", label: "Nuxt", keywords: ["vue"] },
  { value: "solidstart", label: "SolidStart", keywords: ["solid"] },
  { value: "qwik", label: "Qwik City", keywords: ["resumable"] },
  { value: "gatsby", label: "Gatsby", disabled: true },
];

export default function ComboboxDemo() {
  const [framework, setFramework] = React.useState("");

  return (
    <div className="grid w-full max-w-xs gap-2">
      <label htmlFor="framework" className="text-sm font-medium">
        Framework
      </label>
      <Combobox
        id="framework"
        options={frameworks}
        value={framework}
        onValueChange={setFramework}
        placeholder="Select a framework…"
        searchPlaceholder="Search frameworks…"
        emptyMessage="No framework found."
        name="framework"
      />
    </div>
  );
}
