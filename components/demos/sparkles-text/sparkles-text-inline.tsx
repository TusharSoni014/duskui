import { SparklesText } from "@/components/dusk/sparkles-text/sparkles-text";

export default function SparklesTextInline() {
  return (
    <p className="max-w-md text-center text-lg leading-relaxed text-white/70">
      Every plan now includes{" "}
      <SparklesText as="strong" count={5} size={[6, 11]} className="font-semibold text-primary">
        unlimited projects
      </SparklesText>{" "}
      and a custom domain, at no extra cost.
    </p>
  );
}
