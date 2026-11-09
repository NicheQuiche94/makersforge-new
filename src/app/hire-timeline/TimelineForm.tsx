"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DatePicker } from "../compare/DatePicker";
import { EmailField } from "@/components/lead/EmailField";
import { COUNTRIES, METHODS, type Method } from "@/lib/hireTimeline";
import { tierFor } from "@/lib/tier";
import { setLead } from "@/lib/lead";
import { trackLinkedIn } from "@/lib/linkedin";
import { TIER_NAME } from "@/lib/plans";
import styles from "../compare/compare.module.css";
import own from "./timeline.module.css";

const iso = (d: Date) => d.toISOString().slice(0, 10);

/* /hire-timeline (Andre 2026-11-09): one form with their email; the
   timeline goes by email (same pattern as /compare), with the headline on
   the next page as a teaser. */
export function TimelineForm() {
  const router = useRouter();
  const [title, setTitle] = useState("Senior UA Manager");
  const [country, setCountry] = useState("DE");
  const [method, setMethod] = useState<Method>("jobad");
  const [needBy, setNeedBy] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const tier = tierFor(title);
  const [now] = useState(() => Date.now());
  const soon = (weeks: number) => iso(new Date(now + weeks * 7 * 864e5));
  const quick = [
    { label: "In 6 weeks", value: soon(6) },
    { label: "In 3 months", value: soon(13) },
    { label: "In 4 months", value: soon(17) },
  ];

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const go = async () => {
    setBusy(true);
    setError("");
    const r = await fetch("/api/hire-timeline", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ title, country, method, needBy, email, name }) })
      .then((x) => x.json())
      .catch(() => ({ error: "That didn't go through. Please try again." }));
    if (r.error) {
      setBusy(false);
      return setError(r.error);
    }
    setLead(r.lead);
    trackLinkedIn("timeline_requested");
    const q = new URLSearchParams({ start: r.start, late: String(r.late ?? "") });
    if (r.devLink) q.set("dev", r.devLink);
    router.push(`/hire-timeline/sent?${q}`);
  };

  return (
    <section className={styles.hero}>
      <div className={styles.heroInner}>
        <h1 className={styles.display}>
          Will your <span className={own.nowrap}>job ad</span> hire <span className={`gr ${styles.accent}`}>in time?</span>
        </h1>
        <p className={styles.heroLede}>
          See when a job ad hire is likely to start, notice period included, against the date you need them.
        </p>

        <form
          className={styles.formCard}
          onSubmit={(e) => {
            e.preventDefault();
            if (!busy) go();
          }}
        >
          <div className={styles.formGrid}>
            <label className={styles.wide}>
              <span className={styles.lbl}>Job title</span>
              <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Senior UA Manager" />
              {title.trim() && (
                <span className={own.tierHint}>
                  {TIER_NAME[tier.tier]} level · {tier.reason.toLowerCase()}
                </span>
              )}
            </label>
            <label className={styles.narrow}>
              <span className={styles.lbl}>Where they&apos;ll be based</span>
              <select value={country} onChange={(e) => setCountry(e.target.value)}>
                {COUNTRIES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>
            </label>
            <label className={styles.half}>
              <span className={styles.lbl}>How you&apos;re hiring now</span>
              <select value={method} onChange={(e) => setMethod(e.target.value as Method)}>
                {METHODS.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.label}
                  </option>
                ))}
              </select>
            </label>
            <div className={`${styles.half} ${styles.field}`}>
              <span className={styles.lbl}>You need them starting by</span>
              <DatePicker value={needBy} onChange={setNeedBy} placeholder="Pick a date" quick={quick} />
            </div>
            <label className={styles.wide}>
              <span className={styles.lbl}>Work email</span>
              <EmailField value={email} onChange={setEmail}>
                <input type="email" required placeholder="you@studio.com" value={email} onChange={(e) => setEmail(e.target.value)} />
              </EmailField>
            </label>
            <label className={styles.narrow}>
              <span className={styles.lbl}>
                First name <i>optional</i>
              </span>
              <input value={name} onChange={(e) => setName(e.target.value)} />
            </label>
          </div>
          {error && <p className={styles.err}>{error}</p>}
          <button type="submit" className={styles.bigGo} disabled={busy || !title.trim() || !/^\S+@\S+\.\S+$/.test(email)}>
            {busy ? "Sending…" : "Email me my timeline →"}
          </button>
          <p className={styles.fine}>We&apos;ll email you a link to share with your team. One email, no spam.</p>
        </form>
      </div>
    </section>
  );
}
