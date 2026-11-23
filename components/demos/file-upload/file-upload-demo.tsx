import { FileUpload } from "@/components/dusk/file-upload/file-upload";

export default function FileUploadDemo() {
  return (
    <div className="w-full max-w-md">
      <FileUpload accept="image/*,.pdf" maxSize={5 * 1024 * 1024} maxFiles={4} />
    </div>
  );
}
