"use client";

/** Mounted once in the root layout: starts PostHog (if consented) and records route changes. */
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { initAnalytics, pageview } from "@/lib/analytics";

export function PostHog() {
  const pathname = usePathname();
  useEffect(() => {
    initAnalytics();
  }, []);
  useEffect(() => {
    pageview(pathname);
  }, [pathname]);
  return null;
}
