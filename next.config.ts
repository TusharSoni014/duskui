import type { NextConfig } from "next";

import { legacyCategorySlugs } from "./lib/components-data";

const legacy = legacyCategorySlugs.join("|");

const nextConfig: NextConfig = {
  // Components used to live under /components/<category>/<slug>. Keep old links
  // (and anything search engines indexed) working with permanent redirects.
  async redirects() {
    return [
      {
        source: `/components/:category(${legacy})/:slug`,
        destination: "/components/:slug",
        permanent: true,
      },
      {
        source: `/components/:category(${legacy})`,
        destination: "/components",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
