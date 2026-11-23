import Link from "next/link";
import { ArrowUpRight, BadgeCheck, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function BadgeDotIconsDemo() {
  return (
    <>
      <Badge variant="success" dot>Operational</Badge>
      <Badge variant="warning" dot>Degraded</Badge>
      <Badge variant="outline" dot className="text-muted-foreground">Offline</Badge>
      <Badge variant="soft">
        <BadgeCheck />
        Verified
      </Badge>
      <Badge variant="secondary" size="sm">
        <Clock />
        2m ago
      </Badge>
      <Badge asChild variant="outline" size="lg">
        <Link href="/components">
          Changelog
          <ArrowUpRight />
        </Link>
      </Badge>
    </>
  );
}
