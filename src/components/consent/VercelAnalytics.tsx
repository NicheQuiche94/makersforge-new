"use client";

/**
 * Vercel Web Analytics (Andre 2026-11-05): cookieless, aggregate page views
 * for every visitor, so it runs without the cookie banner (PostHog, GA and
 * Apollo stay consent-gated). The client portal and admin pages are left out.
 */
import { Analytics } from "@vercel/analytics/next";
import { isExcludedPath, isInternal } from "@/lib/analytics";

export function VercelAnalytics() {
  return <Analytics beforeSend={(e) => (isInternal() || isExcludedPath(new URL(e.url).pathname) ? null : e)} />;
}
