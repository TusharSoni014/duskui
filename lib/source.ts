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

export async function highlight(code: string, lang: string = "tsx") {
  highlighter ??= createHighlighter({
    themes: ["github-dark-default"],
    langs: ["tsx", "ts", "bash", "json", "css"],
  });
  return (await highlighter).codeToHtml(code, {
    lang,
    theme: "github-dark-default",
  });
}
