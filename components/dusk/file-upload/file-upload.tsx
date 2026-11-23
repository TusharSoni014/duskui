"use client";

import * as React from "react";
import {
  AlertCircle,
  Check,
  File as FileIcon,
  FileArchive,
  FileAudio,
  FileText,
  FileVideo,
  Image as ImageIcon,
  RotateCcw,
  UploadCloud,
  X,
} from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

export type FileUploadStatus = "uploading" | "done" | "error";

export interface FileUploadItem {
  id: string;
  file: File;
  /** 0–100. */
  progress: number;
  status: FileUploadStatus;
  error?: string;
}

export interface FileRejection {
  file: File;
  reason: "type" | "size" | "count";
  message: string;
}

/**
 * Uploads one file. Call `report` with 0–100 as it progresses, resolve when
 * done, throw to mark it failed (the error message is shown). `signal` aborts
 * when the user removes the file or the component unmounts.
 */
export type FileUploadHandler = (
  file: File,
  report: (percent: number) => void,
  signal: AbortSignal
) => Promise<void>;

export interface FileUploadProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onDrop" | "onError"> {
  /** Accepted types, like the input's `accept`: `"image/*,.pdf,application/zip"`. Also enforced on drop. */
  accept?: string;
  /** Max size per file, in bytes. */
  maxSize?: number;
  /** Max number of files in the list. */
  maxFiles?: number;
  /** Allow picking several files at once. */
  multiple?: boolean;
  /** Your upload function. Without it, progress is simulated (handy for demos). */
  onUpload?: FileUploadHandler;
  /** Length of the simulated upload, in ms. */
  simulateDuration?: number;
  /** Fired with the files that passed validation. */
  onFilesAdded?: (files: File[]) => void;
  /** Fired with the files that failed validation. */
  onReject?: (rejections: FileRejection[]) => void;
  /** Fired when a file finishes uploading. */
  onFileComplete?: (file: File) => void;
  /** Fired when the user removes a file. */
  onFileRemove?: (file: File) => void;
  /** Main line in the dropzone. */
  label?: React.ReactNode;
  /** Second line, e.g. accepted types and size. Generated from `accept` and `maxSize` by default. */
  hint?: React.ReactNode;
  disabled?: boolean;
  /** `name` for the file input. */
  name?: string;
  /** Classes for the dropzone. */
  dropzoneClassName?: string;
}

export function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  const units = ["KB", "MB", "GB"];
  let value = bytes / 1024;
  let unit = 0;
  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024;
    unit++;
  }
  return `${value < 10 ? value.toFixed(1) : Math.round(value)} ${units[unit]}`;
}

function matchesAccept(file: File, accept?: string) {
  if (!accept) return true;
  const name = file.name.toLowerCase();
  const type = file.type.toLowerCase();
  return accept
    .split(",")
    .map((token) => token.trim().toLowerCase())
    .filter(Boolean)
    .some((token) => {
      if (token.startsWith(".")) return name.endsWith(token);
      if (token.endsWith("/*")) return type.startsWith(token.slice(0, -1));
      return type === token;
    });
}

function describeAccept(accept?: string) {
  if (!accept) return "";
  return accept
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean)
    .map((t) => (t.endsWith("/*") ? `${t.slice(0, -2)}s` : t.replace(/^\./, "").replace(/^.*\//, "")).toUpperCase())
    .join(", ");
}

function iconFor(file: File) {
  const { type, name } = file;
  if (type.startsWith("image/")) return ImageIcon;
  if (type.startsWith("video/")) return FileVideo;
  if (type.startsWith("audio/")) return FileAudio;
  if (/zip|tar|rar|7z|gzip/.test(type) || /\.(zip|tar|gz|rar|7z)$/i.test(name)) return FileArchive;
  if (type.startsWith("text/") || type === "application/pdf" || /\.(md|txt|pdf|docx?)$/i.test(name)) return FileText;
  return FileIcon;
}

/** A stand-in upload that eases to 100% over `duration` ms. */
function simulateUpload(duration: number): FileUploadHandler {
  return (_file, report, signal) =>
    new Promise((resolve, reject) => {
      const tick = 80;
      const steps = Math.max(1, duration / tick);
      let progress = 0;
      let step = 0;
      const timer = window.setInterval(() => {
        step++;
        // Fast start, slower finish, like a real network transfer.
        progress = Math.min(100, 100 * (1 - Math.pow(1 - step / steps, 1.6)));
        report(progress);
        if (step >= steps) {
          window.clearInterval(timer);
          resolve();
        }
      }, tick);
      signal.addEventListener(
        "abort",
        () => {
          window.clearInterval(timer);
          reject(new DOMException("Upload cancelled", "AbortError"));
        },
        { once: true }
      );
    });
}

/**
 * A drag-and-drop file dropzone with an animated file list.
 *
 * The dropzone is a `<label>` for a real, visually hidden
 * `<input type="file">`, so clicking opens the picker, keyboard users Tab to
 * the input and press Space or Enter, and assistive tech gets native
 * semantics. Dragging files over it lights it up; dropped or picked files are
 * checked against `accept`, `maxSize` and `maxFiles`, and rejections slide in
 * as alerts. Accepted files upload through your `onUpload` (or a simulated
 * upload) with a per-file progress bar, and can be removed (which aborts
 * them) or retried if they fail.
 */
export function FileUpload({
  accept,
  maxSize,
  maxFiles,
  multiple = true,
  onUpload,
  simulateDuration = 2000,
  onFilesAdded,
  onReject,
  onFileComplete,
  onFileRemove,
  label,
  hint,
  disabled = false,
  name,
  id,
  className,
  dropzoneClassName,
  ...props
}: FileUploadProps) {
  const reduceMotion = useReducedMotion() ?? false;
  const baseId = React.useId();
  const inputId = id ?? `${baseId}-input`;
  const hintId = `${baseId}-hint`;

  const inputRef = React.useRef<HTMLInputElement>(null);
  const counter = React.useRef(0);
  const controllers = React.useRef(new Map<string, AbortController>());
  const dragDepth = React.useRef(0);

  const [files, setFiles] = React.useState<FileUploadItem[]>([]);
  const [rejections, setRejections] = React.useState<(FileRejection & { id: string })[]>([]);
  const [dragging, setDragging] = React.useState(false);
  const [status, setStatus] = React.useState("");

  // Keep the latest callbacks without restarting uploads.
  const callbacks = React.useRef({ onUpload, onFileComplete, simulateDuration });
  React.useEffect(() => {
    callbacks.current = { onUpload, onFileComplete, simulateDuration };
  });

  // Abort everything still running on unmount.
  React.useEffect(() => {
    const running = controllers.current;
    return () => {
      running.forEach((controller) => controller.abort());
      running.clear();
    };
  }, []);

  const update = (fileId: string, patch: Partial<FileUploadItem>) =>
    setFiles((list) => list.map((item) => (item.id === fileId ? { ...item, ...patch } : item)));

  const startUpload = (item: FileUploadItem) => {
    const controller = new AbortController();
    controllers.current.set(item.id, controller);
    const { onUpload: handler, simulateDuration: duration } = callbacks.current;
    const upload = handler ?? simulateUpload(duration);
    let last = -1;

    upload(
      item.file,
      (percent) => {
        if (controller.signal.aborted) return;
        const value = Math.round(Math.min(100, Math.max(0, percent)));
        if (value === last) return;
        last = value;
        update(item.id, { progress: value });
      },
      controller.signal
    ).then(
      () => {
        if (controller.signal.aborted) return;
        controllers.current.delete(item.id);
        update(item.id, { progress: 100, status: "done" });
        setStatus(`${item.file.name} uploaded.`);
        callbacks.current.onFileComplete?.(item.file);
      },
      (error: unknown) => {
        if (controller.signal.aborted) return;
        controllers.current.delete(item.id);
        const message = error instanceof Error && error.message ? error.message : "Upload failed";
        update(item.id, { status: "error", error: message });
        setStatus(`${item.file.name} failed: ${message}`);
      }
    );
  };

  const addFiles = (incoming: File[]) => {
    if (disabled || !incoming.length) return;
    const picked = multiple ? incoming : incoming.slice(0, 1);
    const accepted: FileUploadItem[] = [];
    const rejected: FileRejection[] = [];
    let room = maxFiles === undefined ? Infinity : maxFiles - (multiple ? files.length : 0);

    for (const file of picked) {
      if (!matchesAccept(file, accept)) {
        rejected.push({ file, reason: "type", message: `${file.name} isn't an accepted file type.` });
      } else if (maxSize !== undefined && file.size > maxSize) {
        rejected.push({ file, reason: "size", message: `${file.name} is larger than ${formatBytes(maxSize)}.` });
      } else if (room <= 0) {
        rejected.push({
          file,
          reason: "count",
          message: `${file.name} wasn't added: the limit is ${maxFiles} file${maxFiles === 1 ? "" : "s"}.`,
        });
      } else {
        room--;
        accepted.push({ id: `${baseId}-${counter.current++}`, file, progress: 0, status: "uploading" });
      }
    }

    setRejections(rejected.map((r, i) => ({ ...r, id: `${baseId}-r${counter.current++}-${i}` })));
    if (rejected.length) onReject?.(rejected);

    if (accepted.length) {
      if (!multiple) {
        // Single mode: the new file replaces the old one.
        controllers.current.forEach((controller) => controller.abort());
        controllers.current.clear();
        setFiles(accepted);
      } else {
        setFiles((list) => [...list, ...accepted]);
      }
      setStatus(`${accepted.length} file${accepted.length === 1 ? "" : "s"} added.`);
      onFilesAdded?.(accepted.map((item) => item.file));
      accepted.forEach(startUpload);
    }
  };

  const remove = (item: FileUploadItem) => {
    controllers.current.get(item.id)?.abort();
    controllers.current.delete(item.id);
    setFiles((list) => list.filter((f) => f.id !== item.id));
    setStatus(`${item.file.name} removed.`);
    onFileRemove?.(item.file);
    // Return focus somewhere sensible: the input.
    inputRef.current?.focus();
  };

  const retry = (item: FileUploadItem) => {
    const fresh = { ...item, progress: 0, status: "uploading" as const, error: undefined };
    update(item.id, fresh);
    startUpload(fresh);
  };

  const hasFiles = (event: React.DragEvent) => Array.from(event.dataTransfer.types).includes("Files");

  const defaultHint = [
    describeAccept(accept),
    maxSize !== undefined ? `up to ${formatBytes(maxSize)}` : "",
    maxFiles !== undefined && multiple ? `max ${maxFiles} files` : "",
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <div data-slot="file-upload" className={cn("w-full", className)} {...props}>
      <motion.label
        htmlFor={inputId}
        data-dragging={dragging || undefined}
        data-disabled={disabled || undefined}
        animate={{ scale: dragging && !reduceMotion ? 1.015 : 1 }}
        transition={{ type: "spring", stiffness: 400, damping: 28 }}
        onDragEnter={(event) => {
          if (disabled || !hasFiles(event)) return;
          event.preventDefault();
          dragDepth.current++;
          setDragging(true);
        }}
        onDragOver={(event) => {
          if (disabled || !hasFiles(event)) return;
          event.preventDefault();
          event.dataTransfer.dropEffect = "copy";
        }}
        onDragLeave={() => {
          dragDepth.current = Math.max(0, dragDepth.current - 1);
          if (dragDepth.current === 0) setDragging(false);
        }}
        onDrop={(event) => {
          if (disabled) return;
          event.preventDefault();
          dragDepth.current = 0;
          setDragging(false);
          addFiles(Array.from(event.dataTransfer.files));
        }}
        className={cn(
          "group/drop relative isolate flex cursor-pointer flex-col items-center justify-center gap-3 overflow-hidden rounded-xl border border-dashed border-white/15 bg-white/[0.02] px-6 py-10 text-center",
          "transition-[border-color,background-color,box-shadow] duration-300 hover:border-white/30 hover:bg-white/[0.04]",
          "has-[input:focus-visible]:border-primary/60 has-[input:focus-visible]:ring-[3px] has-[input:focus-visible]:ring-ring/40",
          "data-dragging:border-primary data-dragging:bg-primary/[0.06] data-dragging:shadow-[0_0_0_4px_color-mix(in_oklab,var(--color-primary)_12%,transparent),0_0_40px_-8px_color-mix(in_oklab,var(--color-primary)_45%,transparent)]",
          "data-disabled:cursor-not-allowed data-disabled:opacity-50",
          dropzoneClassName
        )}
      >
        {/* Glow that fades in while dragging. */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_80%_at_50%_0%,color-mix(in_oklab,var(--color-primary)_22%,transparent),transparent)] opacity-0 transition-opacity duration-300 group-data-dragging/drop:opacity-100"
        />
        <motion.span
          aria-hidden
          className="flex size-12 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white/70 transition-colors duration-300 group-hover/drop:text-white group-data-dragging/drop:border-primary/50 group-data-dragging/drop:text-primary"
          animate={dragging && !reduceMotion ? { y: [0, -6, 0] } : { y: 0 }}
          transition={dragging ? { duration: 1, repeat: Infinity, ease: "easeInOut" } : { duration: 0.2 }}
        >
          <UploadCloud className="size-6" />
        </motion.span>
        <span className="space-y-1">
          <span className="block text-sm font-medium text-white">
            {dragging ? "Drop to upload" : (label ?? (
              <>
                Drag & drop {multiple ? "files" : "a file"} here, or{" "}
                <span className="text-primary underline-offset-4 group-hover/drop:underline">browse</span>
              </>
            ))}
          </span>
          {(hint ?? defaultHint) && (
            <span id={hintId} className="block text-xs text-white/50">
              {hint ?? defaultHint}
            </span>
          )}
        </span>
        <input
          ref={inputRef}
          id={inputId}
          name={name}
          type="file"
          accept={accept}
          multiple={multiple}
          disabled={disabled}
          aria-describedby={(hint ?? defaultHint) ? hintId : undefined}
          className="sr-only"
          onKeyDown={(event) => {
            // Space opens the picker natively; make Enter do the same everywhere.
            if (event.key === "Enter") {
              event.preventDefault();
              event.currentTarget.click();
            }
          }}
          onChange={(event) => {
            addFiles(Array.from(event.currentTarget.files ?? []));
            // Allow picking the same file again.
            event.currentTarget.value = "";
          }}
        />
      </motion.label>

      <div className="mt-3 space-y-2 empty:hidden">
        <AnimatePresence initial={false}>
          {rejections.map((r) => (
            <motion.div
              key={r.id}
              role="alert"
              layout={!reduceMotion}
              initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -6, scale: 0.98 }}
              animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1, x: [0, -4, 4, -2, 0] }}
              exit={{ opacity: 0, transition: { duration: 0.15 } }}
              transition={{ duration: 0.3, x: { duration: 0.35, delay: 0.1 } }}
              className="flex items-start gap-2 rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-red-200"
            >
              <AlertCircle aria-hidden className="mt-0.5 size-4 shrink-0 text-red-400" />
              <span className="min-w-0 flex-1 break-words">{r.message}</span>
              <button
                type="button"
                aria-label="Dismiss"
                onClick={() => setRejections((list) => list.filter((x) => x.id !== r.id))}
                className="rounded text-red-200/70 outline-none hover:text-red-100 focus-visible:ring-2 focus-visible:ring-ring/50"
              >
                <X aria-hidden className="size-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* empty:hidden keeps the gap out until there's something to show. */}
      <ul aria-label="Selected files" className="relative mt-3 space-y-2 empty:hidden">
        <AnimatePresence initial={false} mode="popLayout">
          {files.map((item) => {
            const Icon = iconFor(item.file);
            return (
              <motion.li
                key={item.id}
                layout={reduceMotion ? false : "position"}
                initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={reduceMotion ? { opacity: 0 } : { opacity: 0, x: -16, transition: { duration: 0.18 } }}
                transition={{ type: "spring", stiffness: 420, damping: 34 }}
                data-status={item.status}
                className="group/file flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.03] p-3 data-[status=error]:border-destructive/40"
              >
                <span
                  aria-hidden
                  className="flex size-9 shrink-0 items-center justify-center rounded-md bg-white/[0.06] text-white/70 group-data-[status=done]/file:text-primary group-data-[status=error]/file:text-red-400"
                >
                  <Icon className="size-4.5" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-3">
                    <p className="truncate text-sm font-medium text-white">{item.file.name}</p>
                    <span className="shrink-0 text-xs tabular-nums text-white/50">
                      {item.status === "uploading"
                        ? `${item.progress}%`
                        : item.status === "error"
                          ? "Failed"
                          : formatBytes(item.file.size)}
                    </span>
                  </div>
                  {/* Fixed-height slot so switching between bar, error and size doesn't shift the row. */}
                  <div className="mt-1.5 flex h-4 items-center">
                    <AnimatePresence mode="wait" initial={false}>
                      {item.status === "uploading" ? (
                        <motion.div
                          key="bar"
                          className="w-full"
                          exit={{ opacity: 0, transition: { duration: 0.2 } }}
                        >
                          <Progress
                            value={item.progress}
                            aria-label={`Uploading ${item.file.name}`}
                            className="h-1.5"
                          />
                        </motion.div>
                      ) : (
                        <motion.p
                          key={item.status}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className={cn(
                            "flex items-center gap-1 truncate text-xs",
                            item.status === "error" ? "text-red-300" : "text-white/50"
                          )}
                        >
                          {item.status === "done" ? (
                            <>
                              <Check aria-hidden className="size-3.5 text-primary" /> Uploaded
                            </>
                          ) : (
                            item.error
                          )}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
                {item.status === "error" && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    aria-label={`Retry ${item.file.name}`}
                    onClick={() => retry(item)}
                  >
                    <RotateCcw aria-hidden />
                  </Button>
                )}
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  aria-label={`${item.status === "uploading" ? "Cancel" : "Remove"} ${item.file.name}`}
                  onClick={() => remove(item)}
                >
                  <X aria-hidden />
                </Button>
              </motion.li>
            );
          })}
        </AnimatePresence>
      </ul>

      <p aria-live="polite" className="sr-only">
        {status}
      </p>
    </div>
  );
}
