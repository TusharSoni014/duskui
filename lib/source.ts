import "server-only";

import { promises as fs } from "node:fs";
import path from "node:path";
import { cache } from "react";
import { createHighlighter, type Highlighter } from "shiki";
import { createJavaScriptRegexEngine } from "shiki/engine/javascript";

/** Reads a project file at build time so docs always show the real source. */
export const readSource = cache(async (relativePath: string) => {
  const file = await fs.readFile(path.join(process.cwd(), relativePath), "utf8");
  return file.trimEnd();
});

// One highlighter per process. It lives on globalThis so dev hot reloads reuse
// it instead of piling up new instances. The JavaScript regex engine avoids the
// Oniguruma WASM build, whose memory got corrupted in long-running dev servers
// ("ShikiError: …scape").
const store = globalThis as typeof globalThis & { __duskHighlighter?: Promise<Highlighter> };

const getHighlighter = () =>
  (store.__duskHighlighter ??= createHighlighter({
    themes: ["github-dark-default"],
    langs: ["tsx", "ts", "bash", "json", "css"],
    engine: createJavaScriptRegexEngine(),
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
    store.__duskHighlighter = undefined;
    try {
      return await render();
    } catch (error) {
      console.error("[highlight] falling back to plain text:", error);
      return `<pre class="shiki"><code>${escapeHtml(code)}</code></pre>`;
    }
  }
}
