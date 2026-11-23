import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ButtonAsChildDemo() {
  return (
    <Button asChild variant="outline">
      <Link href="/components">
        Browse components
        <ArrowUpRight />
      </Link>
    </Button>
  );
}
