"use client";
import { EmailNotice } from "@/components/legal/EmailNotice";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { HISTORY, HOOKS, LEVELS, PLAN_HOOK, PROCESS, ROLES, RUNNERS, STAKES, type History, type Level, type Runner, type Stakes } from "@/lib/compare";
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

export function CompareMock({ fromAd = false }: { fromAd?: boolean }) {
  const router = useRouter();
  // 2026-11-26 (Andre): the headline A/B test is over; everyone sees "Your hiring plan".
  // ?hook=1..5 still forces an old one for previews. (fromAd is kept for old ad links.)
  void fromAd;
  const [hook, setHook] = useState(PLAN_HOOK);
  useEffect(() => {
    const n = Number(new URLSearchParams(window.location.search).get("hook"));
    const i = n >= 1 && n <= HOOKS.length ? n - 1 : PLAN_HOOK;
    setHook(i);
    // Our counter records the headline each visitor saw.
    setPageVariant(HOOKS[i].accent);
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
  const [history, setHistory] = useState<History | "">("");
  const [runner, setRunner] = useState<Runner | "">("");
  const [stakes, setStakes] = useState<Stakes | "">("");
  const [asked, setAsked] = useState<"" | "no" | "yes">("");
  const [process, setProcess] = useState("");
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
      body: JSON.stringify({ role, salary: Number(salary) || 0, cur, start, p: "balanced", level: lvl, history: history || undefined, runner: runner || undefined, stakes: stakes || undefined, asked: asked ? asked === "yes" : undefined, process: process ? Number(process) : undefined, email, name, hook }),
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
          {hook === PLAN_HOOK ? HOOKS[hook].g : `${HOOKS[hook].g} Cost, speed, accuracy and team hours, compared honestly, including when we're not the best option.`}
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
            <label className={styles.half}>
              <span className={styles.lbl}>Level</span>
              <select value={lvl} onChange={(e) => setLevel(e.target.value as Level)}>
                {LEVELS.map((l) => <option key={l.id} value={l.id}>{l.label}</option>)}
              </select>
            </label>
            <label className={styles.half}>
              <span className={styles.lbl}>Hired for a role like this before?</span>
              <select value={history} onChange={(e) => setHistory(e.target.value as History)}>
                <option value="" disabled>Choose one</option>
                {HISTORY.map((h) => <option key={h.id} value={h.id}>{h.label}</option>)}
              </select>
            </label>
            <label className={styles.half}>
              <span className={styles.lbl}>Who would run the hiring?</span>
              <select value={runner} onChange={(e) => setRunner(e.target.value as Runner)}>
                <option value="" disabled>Choose one</option>
                {RUNNERS.map((r) => <option key={r.id} value={r.id}>{r.label}</option>)}
              </select>
            </label>
            <label className={styles.half}>
              <span className={styles.lbl}>How important is this hire?</span>
              <select value={stakes} onChange={(e) => setStakes(e.target.value as Stakes)}>
                <option value="" disabled>Choose one</option>
                {STAKES.map((x) => <option key={x.id} value={x.id}>{x.label}</option>)}
              </select>
            </label>
            <label className={styles.half}>
              <span className={styles.lbl}>How long is your interview process?</span>
              <select value={process} onChange={(e) => setProcess(e.target.value)}>
                <option value="" disabled>Choose one</option>
                {PROCESS.map((p) => <option key={p.w} value={p.w}>{p.label}</option>)}
              </select>
            </label>
            <label className={styles.half}>
              <span className={styles.lbl}>Asked for referrals yet?</span>
              <select value={asked} onChange={(e) => setAsked(e.target.value as "no" | "yes")}>
                <option value="" disabled>Choose one</option>
                <option value="no">Not yet</option>
                <option value="yes">Yes, nothing that fits</option>
              </select>
            </label>
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
            {busy ? "Sending…" : "Email me my route →"}
          </button>
          <EmailNotice className={styles.fine} deliver="a link to your route to share with your team" about="the tool" />
        </form>
      </div>
    </section>
  );
}
