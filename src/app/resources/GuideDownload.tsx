"use client";
import { useEffect, useState } from "react";
import { EmailNotice } from "@/components/legal/EmailNotice";
import { arrivalUtm, track } from "@/lib/analytics";
import { captureLeadParam, getLead, setLead } from "@/lib/lead";
import type { Download } from "@/lib/resources";
import r from "./resources.module.css";

/* A guide on the Resources hub (Andre 2026-11-25). The hub is open to everyone;
   the email is asked for only when someone clicks to download. Anyone we already
   know (they unlocked before, used a free tool, or opened our email link) downloads
   straight away. The tools stay ungated because they ask for an email to send
   the result anyway. */
export function GuideDownload({ d }: { d: Download }) {
  const [asking, setAsking] = useState(false);
  const [done, setDone] = useState(false);
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    captureLeadParam();
  }, []);

  useEffect(() => {
    if (!asking) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setAsking(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [asking]);

  // Known visitors download straight away; everyone else gets the email ask first.
  const onDownload = (e: React.MouseEvent) => {
    if (getLead()) {
      track("guide_downloaded", { file: d.file });
      return;
    }
    e.preventDefault();
    track("guide_gate_opened", { file: d.file });
    setAsking(true);
  };

  const submit = async (e: React.FormEvent) => {
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
    track("resources_unlocked", { file: d.file });
    setLead(res.lead);
    setDone(true);
  };

  return (
    <article className={r.feature}>
      <a href={d.file} target="_blank" rel="noopener" className={r.cover} aria-label={`Download ${d.title}`} onClick={onDownload}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={d.cover} alt="" width={794} height={1123} />
      </a>
      <div className={r.featureBody}>
        <h2>{d.title}</h2>
        <p className={r.blurb}>{d.blurb}</p>
        <ul className={r.inside}>
          {d.inside.map((x) => (
            <li key={x}>{x}</li>
          ))}
        </ul>
        <div className={r.actions}>
          <a href={d.file} target="_blank" rel="noopener" className={r.download} onClick={onDownload}>
            Download the guide
          </a>
          <span className={r.meta}>{d.meta}</span>
        </div>
      </div>

      {asking && (
        <div className={r.overlay} onClick={(e) => e.target === e.currentTarget && setAsking(false)}>
          <div className={r.modalRing}>
            <div className={r.modal} role="dialog" aria-modal="true" aria-labelledby="dl-title">
              <button type="button" className={r.close} onClick={() => setAsking(false)} aria-label="Close">
                ×
              </button>
              {done ? (
                <>
                  <h2 id="dl-title">
                    It&apos;s <span className="gr">yours.</span>
                  </h2>
                  <a href={d.file} target="_blank" rel="noopener" className={r.download} onClick={() => setAsking(false)}>
                    Download the guide
                  </a>
                  <p className={r.notice}>We&apos;ve emailed you the link too.</p>
                </>
              ) : (
                <>
                  <h2 id="dl-title">
                    Get the <span className="gr">free {d.tag.toLowerCase()}</span>
                  </h2>
                  <form className={r.unlockForm} onSubmit={submit}>
                    <input type="email" required placeholder="Your work email" value={email} onChange={(e) => setEmail(e.target.value)} aria-label="Your work email" autoFocus />
                    <button type="submit" disabled={sending}>
                      {sending ? "One moment…" : "Get the guide"}
                    </button>
                  </form>
                  {err && <p className={r.err}>{err}</p>}
                  <EmailNotice className={r.notice} deliver="the guide" about="the guide" />
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </article>
  );
}
