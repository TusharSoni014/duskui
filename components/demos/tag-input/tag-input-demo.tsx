"use client";

import * as React from "react";

import { TagInput } from "@/components/dusk/tag-input/tag-input";

export default function TagInputDemo() {
  const [tags, setTags] = React.useState(["react", "motion", "tailwind"]);

  return (
    <div className="grid w-full max-w-md gap-2">
      <label htmlFor="topics" className="text-sm font-medium">
        Topics
      </label>
      <TagInput id="topics" value={tags} onValueChange={setTags} placeholder="Add a topic…" aria-describedby="topics-hint" />
      <p id="topics-hint" className="text-xs text-muted-foreground">
        Enter or comma to add · Backspace twice to remove · try a duplicate
      </p>
    </div>
  );
}
