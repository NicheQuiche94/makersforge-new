"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { GROUPS, type Result } from "@/lib/adGrader";
import styles from "./grader.module.css";

/* The analysis (Andre 2026-11-08): score, sections, biggest fixes, Andre's
   rewrite offer, the full breakdown and the bridge to /compare. Shown on the
   page the email links to; `id` set means the rewrite button is real. */
export function AdResult({ result, bench, id, title, requested = false, autoRewrite = false }: { result: Result; bench: { avg: number; withPay: number }; id?: string; title?: string; requested?: boolean; autoRewrite?: boolean }) {
  const [open, setOpen] = useState<string | null>(null);
  const [asked, setAsked] = useState(requested);
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const ask = async () => {
    if (!id) return setAsked(true);
    setBusy(true);
    setErr("");
    const r = await fetch("/api/ad-grade/rewrite", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, note }) })
      .then((x) => x.json())
      .catch(() => ({ error: "That didn't go through. Please try again." }));
    setBusy(false);
    if (r.error) setErr(r.error);
    else setAsked(true);
  };

  // "Rewrite my ad for me" in the email lands here with ?rewrite=1: one click, done.
  const fired = useRef(false);
  useEffect(() => {
    if (autoRewrite && id && !requested && !fired.current) {
      fired.current = true;
      void ask();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoRewrite, id, requested]);

  return (
    <div className={styles.result}>
      {title && <p className={styles.forTitle}>Your analysis: {title}</p>}
      <div className={styles.scoreHead}>
        <div className={`${styles.ring} ${styles[result.band.tone]}`} style={{ ["--p" as string]: `${result.score}` }}>
          <strong>{result.score}</strong>
          <span>/ 100</span>
        </div>
        <div className={styles.scoreText}>
          <h2>{result.band.label}</h2>
          <p>{result.band.line}</p>
          <p className={styles.bench}>
            The average mobile games ad on our job board scores <b>{bench.avg}</b>. Only {bench.withPay}% publish a salary.
          </p>
        </div>
      </div>

      <div className={styles.groups}>
        {result.groups.map((g) => (
          <div key={g.id} className={styles.group}>
            <div className={styles.groupTop}>
              <span>{g.title}</span>
              <b>{g.got}/{g.max}</b>
            </div>
            <div className={styles.bar}><i style={{ width: `${(g.got / g.max) * 100}%` }} /></div>
          </div>
        ))}
      </div>

      {result.fixes.length > 0 && (
        <div className={styles.fixes}>
          <h3>Your biggest fixes</h3>
          <ol>
            {result.fixes.map((f) => (
              <li key={f.label}>
                <div>
                  <strong>{f.label}</strong>
                  <p>{f.fix}</p>
                </div>
                <em>+{f.lost}</em>
              </li>
            ))}
          </ol>
        </div>
      )}

      <div className={styles.offer}>
        <div>
          <h3>Want it at 90+? I&apos;ll rewrite it for you.</h3>
          <p>
            I&apos;ll edit it myself, by hand, and send it back within 2 working days. If it doesn&apos;t score 90 or more, I&apos;ll keep going
            until it does.
          </p>
          {!asked && (
            <textarea className={styles.note} value={note} onChange={(e) => setNote(e.target.value)} rows={2} placeholder="Anything I should know? (optional: the salary range, things you can't say publicly…)" />
          )}
          <p className={styles.sig}>Andre, Founder, MakersForge</p>
        </div>
        {asked ? (
          <p className={styles.done}>Got it. I&apos;ll be in touch by email, and you&apos;ll have it back within 2 working days.</p>
        ) : (
          <button type="button" className={styles.goLight} onClick={ask} disabled={busy}>{busy ? "Sending…" : "Rewrite my ad →"}</button>
        )}
      </div>
      {err && <p className={styles.errLine}>{err}</p>}

      <div className={styles.breakdown}>
        <h3>The full breakdown</h3>
        {GROUPS.map((g) => (
          <div key={g.id} className={styles.bGroup}>
            <p className={styles.bHead}>
              {g.title} <span>{g.blurb}</span>
            </p>
            {result.items
              .filter((i) => i.group === g.id)
              .map((i) => (
                <div key={i.id} className={styles.item}>
                  <button type="button" onClick={() => setOpen(open === i.id ? null : i.id)} aria-expanded={open === i.id}>
                    <span className={`${styles.mark} ${styles[i.status]}`}>{i.status === "yes" ? "✓" : i.status === "partly" ? "~" : "✗"}</span>
                    <span className={styles.itemLabel}>{i.label}</span>
                    <span className={styles.pts}>{i.got}/{i.weight}</span>
                  </button>
                  {open === i.id && (
                    <div className={styles.itemBody}>
                      {i.note && <p>{i.note}</p>}
                      {i.got < i.weight && <p><b>Fix:</b> {i.fix}</p>}
                    </div>
                  )}
                </div>
              ))}
          </div>
        ))}
      </div>

      <div className={styles.bridge}>
        <p>
          A great ad still only reaches people who are actively looking. The best candidates usually aren&apos;t. See how every way to hire
          compares for your role.
        </p>
        <Link href="/compare" className={styles.go}>Compare hiring routes →</Link>
      </div>
    </div>
  );
}
