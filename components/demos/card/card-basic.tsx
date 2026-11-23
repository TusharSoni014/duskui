import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function CardBasicDemo() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Pro plan</CardTitle>
        <CardDescription>For teams shipping every day.</CardDescription>
        <CardAction>
          <Badge variant="soft">Popular</Badge>
        </CardAction>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-semibold tracking-tight">
          $24<span className="text-sm font-normal text-muted-foreground"> / month</span>
        </p>
        <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
          <li>Unlimited projects</li>
          <li>Preview deployments</li>
          <li>Priority support</li>
        </ul>
      </CardContent>
      <CardFooter>
        <Button className="w-full">Upgrade</Button>
      </CardFooter>
    </Card>
  );
}
