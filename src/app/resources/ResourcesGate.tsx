"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { arrivalUtm, track } from "@/lib/analytics";
import { LEAD_EVENT, captureLeadParam, getLead, setLead } from "@/lib/lead";
import r from "./resources.module.css";

/* One email unlocks every resource (Andre 2026-11-24). Anyone we already know
   (they've used a free tool, or opened our email link) goes straight in. Until
   then the page sits blurred behind a centred modal. The nav stays usable. */
export function ResourcesGate({ children }: { children: React.ReactNode }) {
  // null on the server and during hydration, then whether we know them.
  const known = useSyncExternalStore(
    (cb) => {
      window.addEventListener(LEAD_EVENT, cb);
      return () => window.removeEventListener(LEAD_EVENT, cb);
    },
    () => !!getLead(),
    () => null,
  );
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    captureLeadParam();
  }, []);

  const open = known === true;
  const locked = known === false;

  useEffect(() => {
    if (!locked) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [locked]);

  const unlock = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");
    setSending(true);
    const res = await fetch("/api/resources/unlock", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, utm: arrivalUtm() ?? null }),
    })
      .then((x) => x.json())
      .catch(() => ({ error: "That didn't go through. Please try again." }));
    setSending(false);
    if (res.error) return setErr(res.error);
    track("resources_unlocked");
    setLead(res.lead);
  };

  return (
    <>
      <div className={open ? undefined : r.blurred} aria-hidden={!open}>
        {children}
      </div>
      {locked && (
        <div className={r.overlay}>
          <div className={r.modalRing}>
          <div className={r.modal} role="dialog" aria-modal="true" aria-labelledby="unlock-title">
            <h2 id="unlock-title">
              Gain access to all our <span className="gr">free resources</span>, guides and reports
            </h2>
            <form className={r.unlockForm} onSubmit={unlock}>
              <input type="email" required placeholder="Your work email" value={email} onChange={(e) => setEmail(e.target.value)} aria-label="Your work email" autoFocus />
              <button type="submit" disabled={sending}>
                {sending ? "One moment…" : "Get access"}
              </button>
            </form>
            {err && <p className={r.err}>{err}</p>}
          </div>
          </div>
        </div>
      )}
    </>
  );
}
