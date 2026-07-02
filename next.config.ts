import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* /roster renamed to /line-up 2026-07-02 to match the nav label.
     Permanent redirect so any external links, prior share URLs, or
     cached search results still resolve. Covers the base path plus
     any nested paths (e.g. /roster/cp-01/spec → /line-up/cp-01/spec)
     and query strings. */
  async redirects() {
    return [
      {
        source: "/roster",
        destination: "/line-up",
        permanent: true,
      },
      {
        source: "/roster/:path*",
        destination: "/line-up/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
