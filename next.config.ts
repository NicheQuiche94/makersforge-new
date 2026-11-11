import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* What's Appening: store art goes through the image optimiser (Google's CDN
     refuses some direct browser loads, and raw screenshots are ~600KB PNGs). */
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "play-lh.googleusercontent.com" },
      { protocol: "https", hostname: "*.mzstatic.com" },
      { protocol: "https", hostname: "i.ytimg.com" },
    ],
  },
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
      /* Short, sayable address for the client portal (2026-11-04). */
      {
        source: "/login",
        destination: "/account",
        permanent: false,
      },
      /* The old UA-only talent application (Andre 2026-11-06): closed until it is
         reworked. Links to it now email Andre instead. */
      {
        source: "/apply",
        destination: "/talent",
        permanent: false,
      },
      /* Short links for mailshots (2026-11-06): plain addresses that open
         the Talent Directory already filtered (?d= picks the discipline). */
      {
        source: "/growth",
        destination: "/line-up?d=ua",
        permanent: false,
      },
      {
        source: "/ua",
        destination: "/line-up?d=ua",
        permanent: false,
      },
      /* Short link for ads and posts (2026-11-08); the query (UTMs) carries over. */
      {
        source: "/grade",
        destination: "/job-ad-grading-tool",
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
