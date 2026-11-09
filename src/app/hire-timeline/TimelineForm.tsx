"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DatePicker } from "../compare/DatePicker";
import { EmailField } from "@/components/lead/EmailField";
import { COUNTRIES, METHODS, type Method } from "@/lib/hireTimeline";
import { tierFor } from "@/lib/tier";
import { TIER_NAME } from "@/lib/plans";
import styles from "../compare/compare.module.css";
import own from "./timeline.module.css";

const iso = (d: Date) => d.toISOString().slice(0, 10);

/* MOCKUP: the real version emails the timeline (same pattern as /compare);
   here the button goes straight to the result so Andre can review it. */
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

  const go = () => {
    const q = new URLSearchParams({ t: title, c: country, m: method, ...(needBy && { by: needBy }), mock: "1" });
    router.push(`/hire-timeline/r?${q}`);
  };

  return (
    <section className={styles.hero}>
      <div className={styles.heroInner}>
        <span className={styles.mock}>Mockup: not live yet</span>
        <h1 className={styles.display}>
          When will your hire <span className={`gr ${styles.accent}`}>actually start?</span>
        </h1>
        <p className={styles.heroLede}>
          Hiring with a job ad? See how long each stage usually takes, add the notice period in their country, and find out if they&apos;ll be in by the date you need them. From published hiring benchmarks.
        </p>

        <form
          className={styles.formCard}
          onSubmit={(e) => {
            e.preventDefault();
            go();
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
                <input type="email" placeholder="you@studio.com" value={email} onChange={(e) => setEmail(e.target.value)} />
              </EmailField>
            </label>
            <label className={styles.narrow}>
              <span className={styles.lbl}>
                First name <i>optional</i>
              </span>
              <input value={name} onChange={(e) => setName(e.target.value)} />
            </label>
          </div>
          <button type="submit" className={styles.bigGo} disabled={!title.trim()}>
            Email me my timeline →
          </button>
          <p className={styles.fine}>Mockup: this goes straight to the result. The live version emails it to you first, to share with your team.</p>
        </form>
      </div>
    </section>
  );
}
