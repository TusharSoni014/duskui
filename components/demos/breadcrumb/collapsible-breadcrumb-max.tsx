import { Slash } from "lucide-react";

import { CollapsibleBreadcrumb } from "@/components/dusk/breadcrumb/collapsible-breadcrumb";

const trail = [
  { label: "Docs", href: "#docs" },
  { label: "Guides", href: "#guides" },
  { label: "Deployment", href: "#deployment" },
  { label: "Edge", href: "#edge" },
  { label: "Caching" },
];

export default function CollapsibleBreadcrumbMaxDemo() {
  return (
    <CollapsibleBreadcrumb
      items={trail}
      maxItems={3}
      itemsAfterCollapse={1}
      separator={<Slash className="-rotate-12" />}
    />
  );
}
