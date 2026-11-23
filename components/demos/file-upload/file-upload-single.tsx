import { FileText } from "lucide-react";

import { FileUpload } from "@/components/dusk/file-upload/file-upload";

export default function FileUploadSingleDemo() {
  return (
    <div className="w-full max-w-sm space-y-2">
      <p className="flex items-center gap-2 text-sm font-medium text-white">
        <FileText aria-hidden className="size-4 text-primary" /> Résumé
      </p>
      <FileUpload
        multiple={false}
        accept=".pdf,.docx"
        maxSize={2 * 1024 * 1024}
        label={
          <>
            Drop your résumé or <span className="text-primary">choose a file</span>
          </>
        }
        simulateDuration={1400}
        dropzoneClassName="py-6"
      />
    </div>
  );
}
