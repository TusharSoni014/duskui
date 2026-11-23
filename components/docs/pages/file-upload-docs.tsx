import { ComponentDocs, type DocConfig } from "@/components/docs/component-docs";
import { Code } from "@/components/docs/doc-primitives";

import FileUploadDemo from "@/components/demos/file-upload/file-upload-demo";
import FileUploadCallbackDemo from "@/components/demos/file-upload/file-upload-callback";
import FileUploadSingleDemo from "@/components/demos/file-upload/file-upload-single";

const demo = (file: string) => `components/demos/file-upload/${file}`;

const config: DocConfig = {
  title: "File Upload",
  intro:
    "A drag-and-drop file upload component for React and Tailwind CSS: an animated dropzone that also opens the file picker on click or keyboard, type and size validation with animated errors, and a file list with per-file progress bars, retry and cancel. Plug in your own async upload function or use the built-in simulation for demos.",
  tags: ["Drag & drop", "Real file input", "Progress per file", "Validation", "Cancel & retry", "prefers-reduced-motion"],
  hero: { Demo: FileUploadDemo, file: demo("file-upload-demo.tsx"), minHeight: 360 },
  install: {
    registry: "file-upload",
    source: "components/dusk/file-upload/file-upload.tsx",
    deps: "motion lucide-react",
    note: (
      <>
        Uses the DuskUI <Code>Button</Code> and <Code>Progress</Code>; the CLI installs them for you.
      </>
    ),
  },
  usage: {
    filename: "avatar-upload.tsx",
    code: `import { FileUpload, type FileUploadHandler } from "@/components/dusk/file-upload/file-upload"

// XMLHttpRequest reports upload progress; fetch doesn't.
const upload: FileUploadHandler = (file, report, signal) =>
  new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open("POST", "/api/upload")
    xhr.upload.onprogress = (e) => e.lengthComputable && report((e.loaded / e.total) * 100)
    xhr.onload = () => (xhr.status < 300 ? resolve() : reject(new Error(\`Upload failed (\${xhr.status})\`)))
    xhr.onerror = () => reject(new Error("Network error"))
    signal.addEventListener("abort", () => xhr.abort())
    const body = new FormData()
    body.append("file", file)
    xhr.send(body)
  })

export function AvatarUpload() {
  return <FileUpload accept="image/*" maxSize={5 * 1024 * 1024} maxFiles={3} onUpload={upload} />
}`,
  },
  examples: [
    {
      id: "upload-callback",
      title: "Your own upload function",
      description: (
        <>
          <Code>onUpload(file, report, signal)</Code> runs once per accepted file. Call <Code>report</Code> with
          0–100, resolve when done, or throw to mark the file failed with your message; the user can then retry.
          Removing a file aborts <Code>signal</Code>. Files over 2 MB fail in this demo.
        </>
      ),
      Demo: FileUploadCallbackDemo,
      file: demo("file-upload-callback.tsx"),
      minHeight: 380,
    },
    {
      id: "single",
      title: "Single file",
      description: (
        <>
          With <Code>multiple=&#123;false&#125;</Code> a new file replaces the current one. Customize the copy with{" "}
          <Code>label</Code> and <Code>hint</Code> (the hint is generated from <Code>accept</Code> and{" "}
          <Code>maxSize</Code> otherwise).
        </>
      ),
      Demo: FileUploadSingleDemo,
      file: demo("file-upload-single.tsx"),
      minHeight: 300,
    },
  ],
  api: {
    intro: <>Also accepts any HTML attribute for the wrapper <Code>div</Code>. <Code>id</Code> goes to the file input.</>,
    props: [
      { name: "accept", type: "string", description: 'Accepted types, like the input\'s accept: "image/*,.pdf". Also enforced on drop.' },
      { name: "maxSize", type: "number", description: "Max bytes per file." },
      { name: "maxFiles", type: "number", description: "Max files in the list." },
      { name: "multiple", type: "boolean", default: "true", description: "Allow several files. When false, a new file replaces the current one." },
      { name: "onUpload", type: "(file, report, signal) => Promise<void>", description: "Your upload. report(0–100) for progress, throw to fail. Simulated when omitted." },
      { name: "simulateDuration", type: "number", default: "2000", description: "Length of the simulated upload in ms." },
      { name: "onFilesAdded", type: "(files: File[]) => void", description: "Files that passed validation." },
      { name: "onReject", type: "(rejections: FileRejection[]) => void", description: "Files that failed validation, with reason (type | size | count) and message." },
      { name: "onFileComplete", type: "(file: File) => void", description: "A file finished uploading." },
      { name: "onFileRemove", type: "(file: File) => void", description: "The user removed (or cancelled) a file." },
      { name: "label", type: "ReactNode", description: "Main dropzone text." },
      { name: "hint", type: "ReactNode", description: "Secondary text. Defaults to the accepted types and limits." },
      { name: "disabled", type: "boolean", default: "false", description: "Disable picking and dropping." },
      { name: "name", type: "string", description: "name attribute for the file input." },
      { name: "dropzoneClassName", type: "string", description: "Classes for the dropzone." },
    ],
  },
  accessibility: [
    "The dropzone is the <label> of a real, visually hidden <input type=\"file\">. Keyboard users Tab to it and press Space or Enter; the dropzone shows the focus ring, and the hint is linked with aria-describedby.",
    "Drag and drop is an enhancement, never the only way to add files.",
    "Validation errors appear as role=\"alert\" messages that can be dismissed; added, finished, failed and removed files are announced through a polite live region.",
    "Each upload has a labelled progressbar; Cancel, Remove and Retry buttons name the file they act on. After removing a file, focus returns to the input.",
    "Status changes swap inside a fixed-height slot, so rows never shift.",
    "With prefers-reduced-motion the dropzone doesn't scale or bounce and list items only fade.",
  ],
};

export function FileUploadDocs() {
  return <ComponentDocs config={config} />;
}
