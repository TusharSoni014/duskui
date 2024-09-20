/** @type {import('next').NextConfig} */
import nextMDX from "@next/mdx";

const withMDX = nextMDX();

const nextConfig = {
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  images: {
    remotePatterns: [
      {
        hostname: "pub-f215723903f74ba688c6a4a886cd3abb.r2.dev",
        pathname: "/**",
        port: "",
        protocol: "https",
      },
    ],
  },
};
 
// Merge MDX config with Next.js config
export default withMDX(nextConfig);
