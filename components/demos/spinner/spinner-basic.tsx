import { Spinner } from "@/components/ui/spinner";

export default function SpinnerBasicDemo() {
  return (
    <div className="flex items-end gap-6">
      <Spinner size="sm" />
      <Spinner />
      <Spinner size="lg" className="text-primary" />
      <Spinner size="xl" className="text-primary" label="Loading dashboard" />
      <Spinner size="lg" className="text-sky-300" />
    </div>
  );
}
