"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { arrivalUtm } from "@/lib/analytics";
import { EmailField } from "@/components/lead/EmailField";
import { setLead } from "@/lib/lead";
import { trackLinkedIn } from "@/lib/linkedin";
import styles from "./grader.module.css";

/* (Andre 2026-11-08). One step: drop in the PDF (or paste the ad),
   leave an email, and the analysis arrives by email. The score is never
   shown here, so every use is a lead and Andre can offer the rewrite. */
export function GradingTool() {
  const [text, setText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [drag, setDrag] = useState(false);
  const [title, setTitle] = useState("");
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "sent">("idle");
  const [err, setErr] = useState("");
  const [devLink, setDevLink] = useState("");
  const [fromBrief, setFromBrief] = useState(false);
  const pick = useRef<HTMLInputElement>(null);

  // Arriving from "What am I hiring for?": start from the draft built from their brief.
  useEffect(() => {
    try {
      const d = JSON.parse(sessionStorage.getItem("mf-draft-ad") || "null");
      if (!d?.text || !new URLSearchParams(location.search).has("from")) return;
      setText(d.text);
      setTitle(d.title || "");
      if (d.email) setEmail(d.email);
      setFromBrief(true);
      sessionStorage.removeItem("mf-draft-ad");
    } catch {}
  }, []);

  const words = useMemo(() => text.split(/\s+/).filter(Boolean).length, [text]);
  const ready = (!!file || words >= 40) && /^\S+@\S+\.\S+$/.test(email);

  const takeFile = (f?: File | null) => {
    if (!f) return;
    setErr("");
    if (!/\.(pdf|txt|md)$/i.test(f.name)) return setErr("Drop in a PDF, or paste the text.");
    setFile(f);
  };

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ready) return;
    setErr("");
    setState("sending");
    const fd = new FormData();
    fd.set("email", email);
    if (title) fd.set("title", title);
    if (file) fd.set("file", file);
    else fd.set("text", text);
    fd.set("utm", JSON.stringify(arrivalUtm() ?? null));
    const r = await fetch("/api/ad-grade", { method: "POST", body: fd })
      .then((x) => x.json())
      .catch(() => ({ error: "That didn't go through. Please try again." }));
    if (r.error) {
      setErr(r.error);
      setState("idle");
    } else {
      setLead(r.lead);
      trackLinkedIn("ad_graded");
      setDevLink(r.devLink || "");
      setState("sent");
    }
  };

  return (
    <section className={styles.wrap}>
      <div className="container">
        <header className={styles.head}>
          <h1 className={styles.display}>
            {/* The LinkedIn ad's headline, for everyone (Andre 2026-11-09). */}
            Getting the wrong <span className="gr">applicants?</span>
          </h1>
          <p className={styles.lede}>Your job ad might be why. Drop it in for a score out of 100, with the fixes that will make the biggest difference. Free, straight to your inbox.</p>
        </header>

        {state === "sent" ? (
          <div className={`${styles.card} ${styles.sent}`}>
            <h2>Check your inbox</h2>
            <p>Your score and the full analysis are on their way to <b>{email}</b>. It usually takes a minute.</p>
            {devLink && (
              <p className={styles.devLink}>
                Local test (no email sent): <a href={devLink}>open the analysis</a>
              </p>
            )}
          </div>
        ) : (
          <form className={styles.card} onSubmit={send}>
            {fromBrief && <p className={styles.fromBrief}>Here&apos;s a draft built from your brief. Fill in everything in [square brackets], then send it for grading.</p>}

            {!file && !fromBrief && (
              <div
                className={`${styles.drop} ${drag ? styles.dragging : ""}`}
                onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
                onDragLeave={() => setDrag(false)}
                onDrop={(e) => { e.preventDefault(); setDrag(false); takeFile(e.dataTransfer.files?.[0]); }}
                onClick={() => pick.current?.click()}
                role="button"
                tabIndex={0}
              >
                <strong>Drop your job ad here</strong>
                <span>PDF, or click to choose a file</span>
                <input ref={pick} type="file" accept=".pdf,.txt,.md,application/pdf" hidden onChange={(e) => takeFile(e.target.files?.[0])} />
              </div>
            )}
            {file && (
              <div className={styles.fileRow}>
                <span>📄 {file.name}</span>
                <button type="button" onClick={() => setFile(null)}>Remove</button>
              </div>
            )}

            {!file && (
              <label className={styles.field}>
                <span>{fromBrief ? "Your draft" : "Or paste the text"}</span>
                <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Paste the whole ad here: title, location, salary, the lot." rows={fromBrief ? 12 : 5} />
                {words > 0 && <small>{words} words</small>}
              </label>
            )}

            <div className={styles.row}>
              <label className={styles.field}>
                <span>Job title <i>(if it isn&apos;t the first line)</i></span>
                <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Senior UA Manager" />
              </label>
              <label className={styles.field}>
                <span>Work email</span>
                <EmailField value={email} onChange={setEmail}>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@studio.com" />
                </EmailField>
              </label>
            </div>
            {err && <p className={styles.errLine}>{err}</p>}
            <div className={styles.actions}>
              <button type="submit" className={styles.go} disabled={!ready || state === "sending"}>{state === "sending" ? "Grading…" : "Email me my score →"}</button>
              <span className={styles.hint}>Your analysis arrives by email in about a minute.</span>
            </div>
          </form>
        )}

      </div>
    </section>
  );
}
