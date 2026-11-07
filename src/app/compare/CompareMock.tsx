"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { HOOKS, ROLES, GIFT_UNTIL, type Priority } from "@/lib/compare";
import styles from "./compare.module.css";

/* MOCKUP (Andre 2026-11-07): the landing page. A centred hero, the role in a
   balanced form, then the email we send their comparison link to, then a
   thank-you page. Draft wording. */
export function CompareMock() {
  const router = useRouter();
  const [hook, setHook] = useState(0);
  useEffect(() => {
    const n = Number(new URLSearchParams(window.location.search).get("hook"));
    if (n >= 1 && n <= HOOKS.length) setHook(n - 1);
  }, []);

  const [step, setStep] = useState<1 | 2>(1);
  const [role, setRole] = useState("senior-ua");
  const [salary, setSalary] = useState(70000);
  const [start, setStart] = useState("");
  const [budget, setBudget] = useState("");
  const [p, setP] = useState<Priority>("balanced");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const submit = async () => {
    setBusy(true);
    setError("");
    const r = await fetch("/api/compare", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role, salary, start, budget, p, email, name, company, hook }),
    })
      .then((x) => x.json())
      .catch(() => ({ error: "That didn't go through. Please try again." }));
    if (r.error) {
      setBusy(false);
      return setError(r.error);
    }
    const q = new URLSearchParams({ gift: start && start <= GIFT_UNTIL ? "1" : "0" });
    if (r.devLink) q.set("dev", r.devLink);
    router.push(`/compare/sent?${q}`);
  };

  return (
    <section className={styles.hero}>
      <div className={styles.heroInner}>
        <p className={styles.mock}>Mockup · draft wording · headline {hook + 1} of {HOOKS.length} (?hook=1, 2 or 3)</p>
        <span className="kicker">Hiring for a role?</span>
        <h1 className={styles.display}>{HOOKS[hook].h}</h1>
        <p className={styles.heroLede}>
          {HOOKS[hook].g} Cost, speed, accuracy and team hours, compared honestly, including when we&apos;re not the best option.
        </p>

        {step === 1 && (
          <div className={styles.formCard}>
            <p className={styles.stepLabel}>Step 1 of 2 · The role</p>
            <div className={styles.formGrid}>
              <label className={styles.wide}>
                <span className={styles.lbl}>Role</span>
                <select value={role} onChange={(e) => { setRole(e.target.value); setSalary(ROLES.find((r) => r.id === e.target.value)!.salary); }}>
                  {ROLES.map((r) => <option key={r.id} value={r.id}>{r.label}</option>)}
                </select>
              </label>
              <label className={styles.narrow}>
                <span className={styles.lbl}>Salary (£)</span>
                <input type="number" step={1000} value={salary} onChange={(e) => setSalary(Number(e.target.value) || 0)} />
              </label>
              <label className={styles.third}>
                <span className={styles.lbl}>Need the hire made by</span>
                <input type="date" value={start} onChange={(e) => setStart(e.target.value)} />
              </label>
              <label className={styles.third}>
                <span className={styles.lbl}>Budget (£) <i>optional</i></span>
                <input type="number" step={1000} placeholder="e.g. 10000" value={budget} onChange={(e) => setBudget(e.target.value)} />
              </label>
              <label className={styles.third}>
                <span className={styles.lbl}>What matters most</span>
                <select value={p} onChange={(e) => setP(e.target.value as Priority)}>
                  <option value="balanced">A balance of everything</option>
                  <option value="cost">Lowest cost</option>
                  <option value="speed">Hiring fast</option>
                  <option value="hours">Saving my team&apos;s time</option>
                </select>
              </label>
            </div>
            <button type="button" className={styles.bigGo} onClick={() => setStep(2)}>
              Compare my options →
            </button>
          </div>
        )}

        {step === 2 && (
          <div className={styles.formCard}>
            <p className={styles.stepLabel}>Step 2 of 2 · Where should we send it?</p>
            <p className={styles.formNote}>We&apos;ll email you a link to your comparison, so you can share it with your team.</p>
            <div className={styles.formGrid}>
              <label className={styles.full}>
                <span className={styles.lbl}>Work email</span>
                <input className={styles.emailInput} type="email" placeholder="you@studio.com" value={email} onChange={(e) => setEmail(e.target.value)} autoFocus />
              </label>
              <label className={styles.half}>
                <span className={styles.lbl}>Your name <i>optional</i></span>
                <input value={name} onChange={(e) => setName(e.target.value)} />
              </label>
              <label className={styles.half}>
                <span className={styles.lbl}>Company <i>optional</i></span>
                <input value={company} onChange={(e) => setCompany(e.target.value)} />
              </label>
            </div>
            {error && <p className={styles.err}>{error}</p>}
            <button type="button" className={styles.bigGo} disabled={busy || !/^\S+@\S+\.\S+$/.test(email)} onClick={submit}>
              {busy ? "Sending…" : "Send me my comparison →"}
            </button>
            <button type="button" className={styles.back} onClick={() => setStep(1)}>
              ← Back to the role
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
