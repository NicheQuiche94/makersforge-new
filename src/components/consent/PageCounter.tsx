"use client";

/**
 * Our cookie-free page counter (api/pv): one row per page viewed, closed with
 * how long it stayed open and whether they engaged (scrolled, clicked, typed,
 * or stayed 8+ seconds). Skips the team's own browsers, local copies and the
 * client portal / admin pages. Stores nothing on the device.
 */
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { arrivalUtm, currentMailRef, isExcludedPath, isInternal, takePageVariant } from "@/lib/analytics";

const LOCAL = /^(localhost|127\.|0\.0\.0\.0)/;

export function PageCounter() {
  const pathname = usePathname();
  useEffect(() => {
    if (!pathname || isInternal() || isExcludedPath(pathname) || LOCAL.test(window.location.hostname)) return;
    const utm = arrivalUtm();
    let ref: string | null = null;
    try {
      const h = document.referrer ? new URL(document.referrer).hostname : "";
      ref = h && h !== window.location.hostname ? h.replace(/^www\./, "") : null;
    } catch {}
    let id: number | null = null;
    let visibleMs = 0;
    let since = document.visibilityState === "visible" ? Date.now() : 0;
    let engaged = false;
    let sent = false;
    const elapsed = () => visibleMs + (since ? Date.now() - since : 0);
    const end = () => {
      if (sent || id == null) return;
      sent = true;
      navigator.sendBeacon("/api/pv", JSON.stringify({ stage: "end", id, ms: elapsed(), engaged: engaged || elapsed() >= 8000 }));
    };
    const onVis = () => {
      if (document.visibilityState === "hidden") {
        if (since) visibleMs += Date.now() - since;
        since = 0;
        end();
      } else {
        since = Date.now();
        sent = false; // came back: the closing beacon will be resent with the new total
      }
    };
    const onEngage = () => (engaged = true);
    document.addEventListener("visibilitychange", onVis);
    window.addEventListener("pagehide", end);
    window.addEventListener("scroll", onEngage, { passive: true, once: true });
    window.addEventListener("pointerdown", onEngage, { once: true });
    fetch("/api/pv", {
      method: "POST",
      body: JSON.stringify({
        stage: "view",
        path: pathname,
        source: utm.utm_source,
        medium: utm.utm_medium,
        campaign: utm.utm_campaign,
        content: utm.utm_content,
        referrer: ref,
        ref: currentMailRef(),
        variant: takePageVariant(),
      }),
      keepalive: true,
    })
      .then((r) => r.json())
      .then((d) => (id = typeof d?.id === "number" ? d.id : null))
      .catch(() => {});
    return () => {
      end(); // route change inside the site closes this page's row
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("pagehide", end);
      window.removeEventListener("scroll", onEngage);
      window.removeEventListener("pointerdown", onEngage);
    };
  }, [pathname]);
  return null;
}
