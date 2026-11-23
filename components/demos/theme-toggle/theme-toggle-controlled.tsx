"use client";

import * as React from "react";
import { ThemeToggle, type Theme } from "@/components/dusk/theme-toggle/theme-toggle";
import { Button } from "@/components/ui/button";

const palette =
  "[--pv-bg:#fffdf8] [--pv-fg:#1c1917] [--pv-muted:#78716c] [--pv-border:#e7e5e4] [&.dark]:[--pv-bg:#0c0f0e] [&.dark]:[--pv-fg:#e7e5e4] [&.dark]:[--pv-muted:#8a918e] [&.dark]:[--pv-border:#1f2624]";

export default function ThemeToggleControlledDemo() {
  const article = React.useRef<HTMLElement>(null);
  const [theme, setTheme] = React.useState<Theme>("dark");

  return (
    <div className="flex w-full max-w-md flex-col items-center gap-4">
      <article
        ref={article}
        className={`dark ${palette} w-full rounded-2xl border border-(--pv-border) bg-(--pv-bg) p-6 text-(--pv-fg)`}
      >
        <div className="mb-3 flex items-start justify-between gap-4">
          <h3 className="font-serif text-xl font-semibold">Reading mode</h3>
          <ThemeToggle theme={theme} onThemeChange={setTheme} target={article} size="sm" label="Dark reading mode" />
        </div>
        <p className="text-sm leading-relaxed text-(--pv-muted)">
          The toggle reveals the new theme from the button. Changing the theme from outside (the
          buttons below) updates the same state and switches instantly.
        </p>
      </article>
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Button size="sm" aria-pressed={theme === "light"} variant={theme === "light" ? "default" : "outline"} onClick={() => setTheme("light")}>
          Light
        </Button>
        <Button size="sm" aria-pressed={theme === "dark"} variant={theme === "dark" ? "default" : "outline"} onClick={() => setTheme("dark")}>
          Dark
        </Button>
        <span className="ml-2 font-mono text-xs" aria-live="polite">
          theme: {theme}
        </span>
      </div>
    </div>
  );
}
