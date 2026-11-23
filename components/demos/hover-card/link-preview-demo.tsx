import { LinkPreview } from "@/components/dusk/hover-card/link-preview";

export default function LinkPreviewDemo() {
  return (
    <p className="max-w-md text-sm leading-7 text-muted-foreground">
      DuskUI builds on{" "}
      <LinkPreview
        href="https://ui.shadcn.com"
        preview={{
          title: "shadcn/ui",
          description: "Beautifully designed components that you can copy and paste into your apps.",
          image: "https://picsum.photos/seed/duskui-shadcn/600/314",
        }}
      >
        shadcn/ui
      </LinkPreview>{" "}
      and animates everything with{" "}
      <LinkPreview
        href="https://motion.dev"
        preview={{
          title: "Motion — JavaScript & React animation library",
          description: "A production-grade animation library for React, JavaScript and Vue.",
          siteName: "motion.dev",
        }}
      >
        Motion
      </LinkPreview>
      . Move your cursor along a link and the card follows.
    </p>
  );
}
