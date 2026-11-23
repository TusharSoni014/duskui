import "server-only";

import { promises as fs } from "node:fs";
import path from "node:path";
import { cache } from "react";
import { createHighlighter, type Highlighter } from "shiki";

/** Reads a project file at build time so docs always show the real source. */
export const readSource = cache(async (relativePath: string) => {
  const file = await fs.readFile(path.join(process.cwd(), relativePath), "utf8");
  return file.trimEnd();
});

let highlighter: Promise<Highlighter> | undefined;

const getHighlighter = () =>
  (highlighter ??= createHighlighter({
    themes: ["github-dark-default"],
    langs: ["tsx", "ts", "bash", "json", "css"],
  }));

const escapeHtml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/**
 * Highlights code with Shiki. If the cached highlighter breaks (seen after
 * dev-server hot reloads), it is recreated once; if that also fails, the code
 * is returned as plain escaped text so the page still renders.
 */
export async function highlight(code: string, lang: string = "tsx") {
  const render = async () =>
    (await getHighlighter()).codeToHtml(code, { lang, theme: "github-dark-default" });
  try {
    return await render();
  } catch {
    highlighter = undefined;
    try {
      return await render();
    } catch (error) {
      console.error("[highlight] falling back to plain text:", error);
      return `<pre class="shiki"><code>${escapeHtml(code)}</code></pre>`;
    }
  }
}
