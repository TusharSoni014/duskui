import type { MDXComponents } from "mdx/types";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: ({ children }) => (
      <h1 style={{ fontSize: "32px", color: "red" }}>{children}</h1>
    ),
    ...components,
  };
}
