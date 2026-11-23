import { CircleCheck, Info, TriangleAlert } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function AlertVariantsDemo() {
  return (
    <div className="grid w-full max-w-lg gap-4">
      <Alert variant="success" role="status">
        <CircleCheck />
        <AlertTitle>Deployment complete</AlertTitle>
        <AlertDescription>dusk-web is live on 3 regions in 42 seconds.</AlertDescription>
      </Alert>
      <Alert variant="warning">
        <TriangleAlert />
        <AlertTitle>You&apos;re at 90% of your build minutes</AlertTitle>
        <AlertDescription>
          <p>
            Builds pause when you hit the limit. <a href="#">Upgrade your plan</a> to keep shipping.
          </p>
        </AlertDescription>
      </Alert>
      <Alert variant="info" role="status">
        <Info />
        <AlertTitle>Scheduled maintenance on Sunday, 02:00 UTC</AlertTitle>
      </Alert>
    </div>
  );
}
