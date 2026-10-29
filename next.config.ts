import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Headless Chrome for the one-click spec PDF; keep it out of the bundle. */
  serverExternalPackages: ["@sparticuz/chromium-min", "puppeteer-core"],
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
      /* The long enquiry form never converted; it now goes straight to
         the 15-minute Cal.com booking page (2026-10-27). */
      {
        source: "/enquire",
        destination: "https://cal.com/makersforge/15",
        permanent: false,
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
