"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { grade, GROUPS, type Result } from "@/lib/adGrader";
import styles from "./grader.module.css";

export type Sample = { id: string; label: string; title: string; text: string };

/* MOCKUP (Andre 2026-11-08). One step: paste the ad, leave an email, get the
   score. In the live version the result arrives by email (like /compare);
   here it shows straight away so the weights can be tried on real ads. */
export function GradingTool({ samples, bench }: { samples: Sample[]; bench: { avg: number; n: number; withPay: number } }) {
  const [text, setText] = useState("");
  const [title, setTitle] = useState("");
  const [email, setEmail] = useState("");
  const [result, setResult] = useState<Result | null>(null);
  const [open, setOpen] = useState<string | null>(null);
  const [asked, setAsked] = useState(false);
  const out = useRef<HTMLDivElement>(null);

  // Arriving from "What am I hiring for?": start from the draft built from their brief.
  const [fromBrief, setFromBrief] = useState(false);
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
  const ready = words >= 40 && /^\S+@\S+\.\S+$/.test(email);

  const run = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!ready) return;
    setResult(grade(text, title || undefined));
    setAsked(false);
    setTimeout(() => out.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
  };

  const trySample = (id: string) => {
    const s = samples.find((x) => x.id === id);
    if (!s) return;
    setText(s.text);
    setTitle(s.title);
    if (!email) setEmail("mock@makersforge.gg");
    setResult(grade(s.text, s.title));
    setAsked(false);
    setTimeout(() => out.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
  };

  return (
    <section className={styles.wrap}>
      <div className="container">
        <header className={styles.head}>
          <span className={styles.mock}>Mockup: scoring rules and wording are drafts</span>
          <h1 className={styles.display}>
            Is your job ad <span className="gr">losing</span> you good candidates?
          </h1>
          <p className={styles.lede}>Paste your job ad and get a score out of 100, with the fixes that will make the biggest difference. Free, in under a minute.</p>
        </header>

        <form className={styles.card} onSubmit={run}>
          {fromBrief && (
            <p className={styles.fromBrief}>
              Here&apos;s a draft built from your brief. Fill in everything in [square brackets], then grade it.
            </p>
          )}
          <label className={styles.field}>
            <span>Your job ad</span>
            <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Paste the whole ad here: title, location, salary, the lot." rows={10} />
            <small>{words ? `${words} words` : "Paste the full text for the most accurate score."}</small>
          </label>
          <div className={styles.row}>
            <label className={styles.field}>
              <span>Job title <i>(if it isn&apos;t the first line)</i></span>
              <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Senior UA Manager" />
            </label>
            <label className={styles.field}>
              <span>Work email</span>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@studio.com" />
            </label>
          </div>
          <div className={styles.actions}>
            <button type="submit" className={styles.go} disabled={!ready}>Grade my ad →</button>
            <span className={styles.hint}>We&apos;ll email you your score and fixes.</span>
          </div>
          <div className={styles.samples}>
            <span>Mockup only: try a real ad from our job board</span>
            <select value="" onChange={(e) => trySample(e.target.value)}>
              <option value="">Pick one…</option>
              {samples.map((s) => (
                <option key={s.id} value={s.id}>{s.label}</option>
              ))}
            </select>
          </div>
        </form>

        {result && (
          <div ref={out} className={styles.result}>
            <p className={styles.mockNote}>In the live version this arrives by email, with a link back to this page.</p>

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
                  Send it over and I&apos;ll edit it myself, by hand, and send it back within 2 working days. If it doesn&apos;t score 90 or more,
                  I&apos;ll keep going until it does.
                </p>
                <p className={styles.sig}>Andre, Founder, MakersForge</p>
              </div>
              {asked ? (
                <p className={styles.done}>Got it. I&apos;ll be in touch at {email || "your email"}.</p>
              ) : (
                <button type="button" className={styles.goLight} onClick={() => setAsked(true)}>Rewrite my ad →</button>
              )}
            </div>

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
                A great ad still only reaches people who are actively looking. The best candidates usually aren&apos;t. See how every way to
                hire compares for your role.
              </p>
              <Link href="/compare" className={styles.go}>Compare hiring routes →</Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
