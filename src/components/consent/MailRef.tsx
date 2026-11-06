"use client";

/**
 * Tagged mailshot links (?r=<ref>, see api/r): report the landing page, then
 * report "engaged" once the page has been open ~8 seconds or they scroll,
 * click or type (scanners never do), and take the ref off the address bar so
 * a shared or bookmarked link doesn't count as that person. If they accept
 * cookies, PostHog ties the rest of the visit to them too (lib/analytics).
 */
import { useEffect } from "react";
import { isInternal, setMailRef } from "@/lib/analytics";

const ENGAGED_MS = 8000;

export function MailRef() {
  useEffect(() => {
    const url = new URL(window.location.href);
    const r = url.searchParams.get("r");
    if (!r || !/^[a-z0-9]{6}$/.test(r)) return;
    url.searchParams.delete("r");
    window.history.replaceState(window.history.state, "", url.pathname + url.search + url.hash);
    if (isInternal()) return;
    setMailRef(r);

    const post = (body: object) =>
      fetch("/api/r", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ r, ...body }), keepalive: true });
    let id: number | null = null;
    let done = false;
    let visibleMs = 0;
    let since = document.visibilityState === "visible" ? Date.now() : 0;
    const engaged = () => {
      if (done || id == null) return;
      done = true;
      post({ stage: "engaged", id }).catch(() => {});
      cleanup();
    };
    const tick = () => {
      if (since) visibleMs += Date.now() - since;
      since = document.visibilityState === "visible" ? Date.now() : 0;
      if (visibleMs >= ENGAGED_MS) engaged();
    };
    const timer = window.setInterval(tick, 1000);
    const onScroll = () => window.scrollY > 150 && engaged();
    const events: [string, () => void][] = [["scroll", onScroll], ["pointerdown", engaged], ["keydown", engaged], ["visibilitychange", tick]];
    const target = (n: string) => (n === "visibilitychange" ? document : window);
    events.forEach(([n, f]) => target(n).addEventListener(n, f, { passive: true }));
    function cleanup() {
      window.clearInterval(timer);
      events.forEach(([n, f]) => target(n).removeEventListener(n, f));
    }

    post({ stage: "land", path: url.pathname })
      .then((res) => res.json())
      .then((d) => {
        id = typeof d?.id === "number" ? d.id : null;
        if (visibleMs >= ENGAGED_MS) engaged();
      })
      .catch(() => {});
    return cleanup;
  }, []);
  return null;
}
