import Link from "next/link";
import { ArrowUpRight, Layers, MousePointerClick } from "lucide-react";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const links = [
  { href: "/components/button", title: "Button", text: "Loading states and Motion blocks.", Icon: MousePointerClick },
  { href: "/components/input", title: "Input", text: "Floating labels, OTP and more.", Icon: Layers },
];

export default function CardInteractiveDemo() {
  return (
    <div className="grid w-full max-w-xl gap-4 sm:grid-cols-2">
      {links.map(({ href, title, text, Icon }) => (
        <Card key={href} asChild interactive className="group">
          <Link href={href}>
            <CardHeader>
              <Icon className="mb-2 size-5 text-muted-foreground" aria-hidden />
              <CardTitle className="flex items-center gap-1">
                {title}
                <ArrowUpRight
                  className="size-4 text-muted-foreground transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  aria-hidden
                />
              </CardTitle>
              <CardDescription>{text}</CardDescription>
            </CardHeader>
          </Link>
        </Card>
      ))}
    </div>
  );
}
