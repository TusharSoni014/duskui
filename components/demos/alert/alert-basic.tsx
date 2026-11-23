import { CircleAlert, Terminal } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function AlertBasicDemo() {
  return (
    <div className="grid w-full max-w-lg gap-4">
      <Alert role="status">
        <Terminal />
        <AlertTitle>Heads up!</AlertTitle>
        <AlertDescription>
          You can add components to your app with the shadcn CLI.
        </AlertDescription>
      </Alert>
      <Alert variant="destructive">
        <CircleAlert />
        <AlertTitle>Your session has expired</AlertTitle>
        <AlertDescription>
          <p>Sign in again to keep editing. Unsaved changes are stored locally.</p>
        </AlertDescription>
      </Alert>
    </div>
  );
}
