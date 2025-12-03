"use client";

import React, { useState, useRef } from "react";
import Editor, { OnMount, loader } from "@monaco-editor/react";
import { Check, Copy, Terminal } from "lucide-react";
import { cn } from "@/lib/utils";

// Define DuskUI custom theme
const duskuiTheme = {
  base: "vs-dark" as const,
  inherit: true,
  rules: [
    { token: "", foreground: "e4e4e7" }, // zinc-200
    { token: "comment", foreground: "71717a", fontStyle: "italic" }, // zinc-500
    { token: "keyword", foreground: "c084fc" }, // purple-400
    { token: "keyword.control", foreground: "c084fc" },
    { token: "keyword.operator", foreground: "c084fc" },
    { token: "storage", foreground: "c084fc" },
    { token: "storage.type", foreground: "c084fc" },
    { token: "string", foreground: "4ade80" }, // green-400
    { token: "string.key", foreground: "60a5fa" }, // blue-400
    { token: "number", foreground: "fb923c" }, // orange-400
    { token: "constant", foreground: "fb923c" },
    { token: "constant.numeric", foreground: "fb923c" },
    { token: "constant.language", foreground: "f472b6" }, // pink-400
    { token: "variable", foreground: "e4e4e7" },
    { token: "variable.parameter", foreground: "fbbf24" }, // amber-400
    { token: "variable.other", foreground: "e4e4e7" },
    { token: "entity.name.function", foreground: "60a5fa" }, // blue-400
    { token: "entity.name.class", foreground: "fbbf24" }, // amber-400
    { token: "entity.name.type", foreground: "fbbf24" },
    { token: "entity.other.attribute-name", foreground: "c084fc" }, // purple-400
    { token: "support.function", foreground: "60a5fa" },
    { token: "support.class", foreground: "fbbf24" },
    { token: "support.type", foreground: "22d3ee" }, // cyan-400
    { token: "tag", foreground: "f472b6" }, // pink-400
    { token: "tag.attribute.name", foreground: "c084fc" },
    { token: "attribute.name", foreground: "c084fc" },
    { token: "attribute.value", foreground: "4ade80" },
    { token: "meta.tag", foreground: "f472b6" },
    { token: "type", foreground: "22d3ee" }, // cyan-400
    { token: "type.identifier", foreground: "22d3ee" },
    { token: "delimiter", foreground: "a1a1aa" }, // zinc-400
    { token: "delimiter.bracket", foreground: "fbbf24" }, // amber-400
    { token: "punctuation", foreground: "a1a1aa" },
    { token: "operator", foreground: "22d3ee" }, // cyan-400
    // JSX/TSX specific
    { token: "tag.open", foreground: "60a5fa" },
    { token: "tag.close", foreground: "60a5fa" },
    { token: "metatag", foreground: "f472b6" },
    { token: "metatag.content", foreground: "4ade80" },
  ],
  colors: {
    "editor.background": "#09090b", // zinc-950
    "editor.foreground": "#e4e4e7", // zinc-200
    "editor.lineHighlightBackground": "#18181b", // zinc-900
    "editor.selectionBackground": "#3f3f4640",
    "editor.inactiveSelectionBackground": "#3f3f4620",
    "editorLineNumber.foreground": "#52525b", // zinc-600
    "editorLineNumber.activeForeground": "#a1a1aa", // zinc-400
    "editorCursor.foreground": "#ebff38", // primary
    "editor.selectionHighlightBackground": "#ebff3820",
    "editorBracketMatch.background": "#ebff3830",
    "editorBracketMatch.border": "#ebff38",
    "editorGutter.background": "#09090b",
    "editorWidget.background": "#18181b",
    "editorWidget.border": "#27272a",
    "input.background": "#18181b",
    "input.border": "#27272a",
    "focusBorder": "#ebff38",
    "scrollbarSlider.background": "#27272a80",
    "scrollbarSlider.hoverBackground": "#3f3f46",
    "scrollbarSlider.activeBackground": "#52525b",
  },
};

// Language detection helper
function detectLanguage(code: string, filename?: string): string {
  if (filename) {
    const ext = filename.split(".").pop()?.toLowerCase();
    const extMap: Record<string, string> = {
      ts: "typescript",
      tsx: "typescript",
      js: "javascript",
      jsx: "javascript",
      json: "json",
      css: "css",
      scss: "scss",
      html: "html",
      md: "markdown",
      sh: "shell",
      bash: "shell",
      py: "python",
      rb: "ruby",
      go: "go",
      rs: "rust",
      sql: "sql",
      yaml: "yaml",
      yml: "yaml",
    };
    if (ext && extMap[ext]) return extMap[ext];
  }

  // Auto-detect from content
  if (code.includes("import") && (code.includes("from") || code.includes("{"))) {
    if (code.includes("<") && code.includes("/>")) return "typescript"; // TSX
    return "typescript";
  }
  if (code.includes("npm ") || code.includes("npx ")) return "shell";
  if (code.includes("function") || code.includes("const")) return "javascript";

  return "typescript"; // default
}

interface CodeBlockProps {
  code: string;
  title?: string;
  language?: string;
  showLineNumbers?: boolean;
  className?: string;
  maxHeight?: number;
}

export function CodeBlock({
  code,
  title,
  language,
  showLineNumbers = true,
  className,
  maxHeight = 400,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const [isEditorReady, setIsEditorReady] = useState(false);
  const editorRef = useRef<Parameters<OnMount>[0] | null>(null);

  const detectedLanguage = language || detectLanguage(code, title);
  const isTerminal = detectedLanguage === "shell" || title?.toLowerCase().includes("terminal");
  const lineCount = code.split("\n").length;
  const editorHeight = Math.min(Math.max(lineCount * 20 + 16, 60), maxHeight);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleEditorMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;

    // Define and set the DuskUI theme
    monaco.editor.defineTheme("duskui", duskuiTheme);
    monaco.editor.setTheme("duskui");

    setIsEditorReady(true);
  };

  const handleEditorWillMount = (monaco: typeof import("monaco-editor")) => {
    // Pre-define theme before mount
    monaco.editor.defineTheme("duskui", duskuiTheme);
  };

  return (
    <div
      className={cn(
        "relative rounded-lg overflow-hidden border border-white/10 bg-zinc-950",
        className
      )}
    >
      {/* Header */}
      {title && (
        <div className="flex items-center justify-between px-4 py-2.5 bg-zinc-900/80 border-b border-white/10">
          <div className="flex items-center gap-2">
            {isTerminal ? (
              <Terminal className="w-3.5 h-3.5 text-primary" />
            ) : (
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/60" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                <div className="w-3 h-3 rounded-full bg-green-500/60" />
              </div>
            )}
            <span className="text-xs text-white/50 font-mono ml-1">{title}</span>
          </div>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 text-xs text-white/40 hover:text-white transition-colors px-2 py-1 rounded hover:bg-white/5"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-green-400" />
                <span className="text-green-400">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* Editor */}
      <div className="relative" style={{ height: editorHeight }}>
        {!isEditorReady && (
          <div className="absolute inset-0 flex items-center justify-center bg-zinc-950">
            <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
          </div>
        )}
        <Editor
          height={editorHeight}
          language={detectedLanguage}
          value={code}
          theme="duskui"
          beforeMount={handleEditorWillMount}
          onMount={handleEditorMount}
          options={{
            readOnly: true,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            fontSize: 13,
            fontFamily: "'JetBrains Mono', 'Fira Code', Consolas, monospace",
            fontLigatures: true,
            lineNumbers: showLineNumbers ? "on" : "off",
            lineNumbersMinChars: 3,
            glyphMargin: false,
            folding: false,
            lineDecorationsWidth: 12,
            renderLineHighlight: "none",
            scrollbar: {
              vertical: "auto",
              horizontal: "auto",
              verticalScrollbarSize: 8,
              horizontalScrollbarSize: 8,
              alwaysConsumeMouseWheel: false,
            },
            overviewRulerLanes: 0,
            hideCursorInOverviewRuler: true,
            overviewRulerBorder: false,
            contextmenu: false,
            selectOnLineNumbers: false,
            selectionHighlight: false,
            occurrencesHighlight: "off",
            cursorStyle: "line",
            cursorBlinking: "solid",
            renderValidationDecorations: "off",
            padding: { top: 12, bottom: 12 },
            wordWrap: "on",
            wrappingStrategy: "advanced",
            domReadOnly: true,
          }}
        />
      </div>

      {/* No title - show floating copy button */}
      {!title && (
        <button
          onClick={handleCopy}
          className="absolute top-2 right-2 flex items-center gap-1.5 text-xs text-white/40 hover:text-white transition-colors px-2 py-1 rounded bg-zinc-900/80 hover:bg-zinc-800 border border-white/5"
        >
          {copied ? (
            <Check className="w-3.5 h-3.5 text-green-400" />
          ) : (
            <Copy className="w-3.5 h-3.5" />
          )}
        </button>
      )}
    </div>
  );
}

// Simple inline code component
export function InlineCode({ children }: { children: React.ReactNode }) {
  return (
    <code className="px-1.5 py-0.5 rounded bg-primary/10 text-primary font-mono text-sm">
      {children}
    </code>
  );
}
