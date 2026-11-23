"use client";

import * as React from "react";

import { UrlInput } from "@/components/dusk/input-group/url-input";

export default function UrlInputDemo() {
  const [url, setUrl] = React.useState("https://duskui.com");

  return (
    <div className="grid w-full max-w-sm gap-2">
      <label htmlFor="site-url" className="text-sm font-medium">
        Website
      </label>
      <UrlInput id="site-url" value={url} onValueChange={setUrl} name="website" />
      <p className="truncate text-xs text-muted-foreground">
        Value: <span className="font-mono text-foreground/80">{url || "—"}</span>
      </p>
    </div>
  );
}
