"use client";

import * as React from "react";

import { FileUpload, type FileUploadHandler } from "@/components/dusk/file-upload/file-upload";

/**
 * A stand-in for a real request. In your app, use XMLHttpRequest's
 * `upload.onprogress` (fetch can't report upload progress) and abort it
 * with the signal. Here files bigger than 2 MB "fail" so you can try Retry.
 */
const fakeUpload: FileUploadHandler = (file, report, signal) =>
  new Promise((resolve, reject) => {
    const total = Math.max(800, Math.min(4000, file.size / 1500));
    const started = performance.now();
    const failAt = file.size > 2 * 1024 * 1024 ? 62 : Infinity;

    const timer = window.setInterval(() => {
      const percent = Math.min(100, ((performance.now() - started) / total) * 100);
      if (percent >= failAt) {
        window.clearInterval(timer);
        reject(new Error("Server rejected the file (413)"));
        return;
      }
      report(percent);
      if (percent >= 100) {
        window.clearInterval(timer);
        resolve();
      }
    }, 100);

    signal.addEventListener(
      "abort",
      () => {
        window.clearInterval(timer);
        reject(new DOMException("Upload cancelled", "AbortError"));
      },
      { once: true }
    );
  });

export default function FileUploadCallbackDemo() {
  const [log, setLog] = React.useState<string[]>([]);

  return (
    <div className="w-full max-w-md space-y-3">
      <FileUpload
        onUpload={fakeUpload}
        hint="Any file · over 2 MB fails, to show errors"
        onFileComplete={(file) => setLog((l) => [`✓ ${file.name}`, ...l].slice(0, 3))}
      />
      {log.length > 0 && (
        <p className="font-mono text-xs text-white/40">onFileComplete: {log.join("  ")}</p>
      )}
    </div>
  );
}
