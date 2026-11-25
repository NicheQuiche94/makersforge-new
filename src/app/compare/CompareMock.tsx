"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AD_HOOK, HOOKS, LEVELS, ROLES, ROTATING_HOOKS, type Level, type Pool } from "@/lib/compare";
import { tierFor } from "@/lib/tier";
import { activePromo } from "@/lib/promos";
import { CURRENCIES, CURRENCY_SYMBOLS, RATES, readStoredCurrency, writeStoredCurrency, type Currency } from "@/lib/currency";
import { DatePicker } from "./DatePicker";
import { setPageVariant } from "@/lib/analytics";
import styles from "./compare.module.css";
import { EmailField } from "@/components/lead/EmailField";
import { setLead } from "@/lib/lead";
import { trackLinkedIn } from "@/lib/linkedin";

/* /compare (Andre 2026-11-07): one form, one click, the role and their email
   together, then a thank-you page. Every extra click is a place to lose them.
   No budget field (Andre: nobody plans a hire by a recruitment budget, and it
   was being mistaken for the salary). */
const inCur = (gbp: number, c: Currency) => Math.round((gbp * RATES[c]) / 1000) * 1000;
const iso = (d: Date) => d.toISOString().slice(0, 10);

/** A row of pill buttons: one answer, tap again to change. */
function Seg<T extends string | boolean>({ value, set, options }: { value: T | null; set: (v: T) => void; options: [T, string][] }) {
  return (
    <span className={styles.seg} role="group">
      {options.map(([v, label]) => (
        <button key={String(v)} type="button" aria-pressed={value === v} onClick={() => set(v)}>
          {label}
        </button>
      ))}
    </span>
  );
}

export function CompareMock({ fromAd = false }: { fromAd?: boolean }) {
  const router = useRouter();
  // Each visitor gets one headline at random and keeps it; ?hook=1|2|3 forces one for previews.
  // From the LinkedIn ad (?ad=1) the page leads with the ad's own headline, from the first paint.
  const [hook, setHook] = useState(fromAd ? AD_HOOK : 0);
  useEffect(() => {
    // Our counter records the headline each visitor saw (runs before it in the same render).
    const show = (i: number) => {
      setHook(i);
      setPageVariant(HOOKS[i].accent);
    };
    if (fromAd) {
      setPageVariant(HOOKS[AD_HOOK].accent);
      return;
    }
    const n = Number(new URLSearchParams(window.location.search).get("hook"));
    if (n >= 1 && n <= HOOKS.length) return show(n - 1);
    try {
      let v = Number(localStorage.getItem("mf-compare-hook"));
      if (!(v >= 1 && v <= ROTATING_HOOKS)) {
        v = 1 + Math.floor(Math.random() * ROTATING_HOOKS);
        localStorage.setItem("mf-compare-hook", String(v));
      }
      show(v - 1);
    } catch {
      show(Math.floor(Math.random() * ROTATING_HOOKS));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [cur, setCur] = useState<Currency>("GBP");
  const [role, setRole] = useState("Senior UA Manager");
  // Kept as typed (a string, so the box can be empty while typing). Switching currency
  // keeps the number: they mean euros when they pick €, not a conversion (Andre).
  const [salary, setSalary] = useState("70000");
  useEffect(() => {
    const c = readStoredCurrency();
    setCur(c);
    setSalary(String(inCur(70000, c)));
  }, []);
  const pickCur = (c: Currency) => {
    setCur(c);
    writeStoredCurrency(c);
  };
  const [start, setStart] = useState("");
  // The questions behind the suggested order (Andre 2026-11-25). Level follows the title until they pick one.
  const [level, setLevel] = useState<Level | null>(null);
  const [pool, setPool] = useState<Pool | null>(null);
  const [ta, setTa] = useState<boolean | null>(null);
  const [fee, setFee] = useState<boolean | null>(null);
  const [asked, setAsked] = useState<boolean | null>(null);
  const titleLevel: Level = { executive: "lead", senior: "senior", team: "mid" }[tierFor(role).tier] as Level;
  const lvl = level ?? titleLevel;
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const promo = activePromo();
  const soon = (weeks: number) => iso(new Date(Date.now() + weeks * 7 * 864e5));
  const quick = [
    ...(promo?.id === "christmas" && promo.special.needBy ? [{ label: "Before Christmas", value: promo.special.needBy }] : []),
    { label: "In 4 weeks", value: soon(4) },
    { label: "In 8 weeks", value: soon(8) },
    { label: "In 3 months", value: soon(13) },
  ];

  const submit = async () => {
    setBusy(true);
    setError("");
    const r = await fetch("/api/compare", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role, salary: Number(salary) || 0, cur, start, p: "balanced", level: lvl, pool, ta, fee, asked, email, name, hook }),
    })
      .then((x) => x.json())
      .catch(() => ({ error: "That didn't go through. Please try again." }));
    if (r.error) {
      setBusy(false);
      return setError(r.error);
    }
    setLead(r.lead);
    trackLinkedIn("compare_requested");
    const q = new URLSearchParams({ gift: r.gift ? (r.special ? "2" : "1") : "0" });
    if (r.devLink) q.set("dev", r.devLink);
    router.push(`/compare/sent?${q}`);
  };

  return (
    <section className={styles.hero}>
      <div className={styles.heroInner}>
        <h1 className={styles.display}>
          {HOOKS[hook].pre}
          <span className={`gr ${styles.accent}`}>{HOOKS[hook].accent}</span>
          {HOOKS[hook].post}
        </h1>
        <p className={styles.heroLede}>
          {HOOKS[hook].g} Cost, speed, accuracy and team hours, compared honestly, including when we&apos;re not the best option.
        </p>

        <form
          className={styles.formCard}
          onSubmit={(e) => {
            e.preventDefault();
            if (!busy) submit();
          }}
        >
          <div className={styles.formGrid}>
            <label className={styles.wide}>
              <span className={styles.lbl}>Role</span>
              {/* Any job title (Andre 2026-11-09: most roles weren't in the old dropdown).
                  The common ones are suggestions that also fill in a typical salary. */}
              <input
                list="compare-roles"
                value={role}
                placeholder="e.g. Senior UA Manager"
                onChange={(e) => {
                  setRole(e.target.value);
                  const known = ROLES.find((r) => r.label.toLowerCase() === e.target.value.trim().toLowerCase());
                  if (known) setSalary(String(inCur(known.salary, cur)));
                }}
              />
              <datalist id="compare-roles">
                {ROLES.map((r) => (
                  <option key={r.id} value={r.label} />
                ))}
              </datalist>
            </label>
            <div className={`${styles.narrow} ${styles.field}`}>
              <span className={styles.lblRow}>
                <span className={styles.lbl}>Salary</span>
                <span className={styles.curSeg} role="group" aria-label="Currency">
                  {CURRENCIES.map((c) => (
                    <button key={c} type="button" className={cur === c ? styles.curOn : ""} onClick={() => pickCur(c)} aria-pressed={cur === c}>
                      {CURRENCY_SYMBOLS[c]}
                    </button>
                  ))}
                </span>
              </span>
              <input type="text" inputMode="numeric" aria-label={`Salary in ${cur}`} placeholder="e.g. 70000" value={salary} onChange={(e) => setSalary(e.target.value.replace(/[^0-9]/g, ""))} />
            </div>
            <div className={`${styles.half} ${styles.field}`}>
              <span className={styles.lbl}>Need the hire made by</span>
              <DatePicker value={start} onChange={setStart} placeholder="Pick a date" quick={quick} />
            </div>
            <div className={`${styles.half} ${styles.field}`}>
              <span className={styles.lbl}>Level</span>
              <Seg value={lvl} set={setLevel} options={LEVELS.map((l) => [l.id, l.label])} />
            </div>
            <div className={`${styles.half} ${styles.field}`}>
              <span className={styles.lbl}>How many people could do this role?</span>
              <Seg value={pool} set={setPool} options={[["common", "Lots of people"], ["specialist", "A small, specialist pool"]]} />
            </div>
            <div className={`${styles.half} ${styles.field}`}>
              <span className={styles.lbl}>Who would run the hiring?</span>
              <Seg value={ta} set={setTa} options={[[true, "An in-house recruiter or TA"], [false, "The hiring manager"]]} />
            </div>
            <div className={`${styles.half} ${styles.field}`}>
              <span className={styles.lbl}>Could you pay a recruitment fee?</span>
              <Seg value={fee} set={setFee} options={[[true, "Yes"], [false, "Not for this role"]]} />
            </div>
            <div className={`${styles.half} ${styles.field}`}>
              <span className={styles.lbl}>Asked your team for referrals yet?</span>
              <Seg value={asked} set={setAsked} options={[[false, "Not yet"], [true, "Yes, no luck"]]} />
            </div>
            <label className={styles.wide}>
              <span className={styles.lbl}>Work email</span>
              <EmailField value={email} onChange={setEmail}>
                <input type="email" required placeholder="you@studio.com" value={email} onChange={(e) => setEmail(e.target.value)} />
              </EmailField>
            </label>
            <label className={styles.narrow}>
              <span className={styles.lbl}>First name <i>optional</i></span>
              <input value={name} onChange={(e) => setName(e.target.value)} />
            </label>
          </div>
          {error && <p className={styles.err}>{error}</p>}
          <button type="submit" className={styles.bigGo} disabled={busy || !role.trim() || !/^\S+@\S+\.\S+$/.test(email)}>
            {busy ? "Sending…" : "Email me my comparison →"}
          </button>
          <p className={styles.fine}>We&apos;ll email you a link to your comparison to share with your team. One email, no spam.</p>
        </form>
      </div>
    </section>
  );
}
