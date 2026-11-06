"use client";

/**
 * Tagged mailshot links (?r=<ref>, see api/r): report the landing page once,
 * then take the ref off the address bar so a shared or bookmarked link
 * doesn't count as that person. If they accept cookies, PostHog ties the
 * rest of the visit to them too (lib/analytics setMailRef).
 */
import { useEffect } from "react";
import { setMailRef } from "@/lib/analytics";

export function MailRef() {
  useEffect(() => {
    const url = new URL(window.location.href);
    const r = url.searchParams.get("r");
    if (!r || !/^[a-z0-9]{8}$/.test(r)) return;
    fetch("/api/r", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ r, path: url.pathname }),
      keepalive: true,
    }).catch(() => {});
    setMailRef(r);
    url.searchParams.delete("r");
    window.history.replaceState(window.history.state, "", url.pathname + url.search + url.hash);
  }, []);
  return null;
}
