"use client";

import { useEffect, useState } from "react";
import { HOOKS, ROLES, type Priority } from "@/lib/compare";
import styles from "./compare.module.css";

/* MOCKUP (Andre 2026-11-07): the form. Role first, then the email we send
   their comparison link to. Draft wording. */
export function CompareMock() {
  const [hook, setHook] = useState(0);
  useEffect(() => {
    const n = Number(new URLSearchParams(window.location.search).get("hook"));
    if (n >= 1 && n <= HOOKS.length) setHook(n - 1);
  }, []);

  const [step, setStep] = useState<1 | 2 | 3>(1);
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
  const [devLink, setDevLink] = useState("");

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
    setBusy(false);
    if (r.error) return setError(r.error);
    setDevLink(r.devLink || "");
    setStep(3);
  };

  return (
    <section className={styles.wrap}>
      <div className="container">
        <p className={styles.mock}>
          Mockup for Andre · not live · draft numbers and wording · headline {hook + 1} of {HOOKS.length} (add ?hook=1, 2 or 3)
        </p>
        <h1 className={styles.h1}>{HOOKS[hook].h}</h1>
        <p className={styles.lede}>
          {HOOKS[hook].g} Cost, speed, accuracy and team hours, compared honestly, including when we&apos;re not the best option.
        </p>

        {step === 1 && (
          <div className={styles.panel}>
            <p className={styles.stepLabel}>Step 1 of 2 · Your role</p>
            <div className={styles.inputs}>
              <label>
                Role
                <select value={role} onChange={(e) => { setRole(e.target.value); setSalary(ROLES.find((r) => r.id === e.target.value)!.salary); }}>
                  {ROLES.map((r) => <option key={r.id} value={r.id}>{r.label}</option>)}
                </select>
              </label>
              <label>
                Salary (£)
                <input type="number" step={1000} value={salary} onChange={(e) => setSalary(Number(e.target.value) || 0)} />
              </label>
              <label>
                They need to start by
                <input type="date" value={start} onChange={(e) => setStart(e.target.value)} />
              </label>
              <label>
                Budget for this hire (£) <span>optional</span>
                <input type="number" step={1000} placeholder="e.g. 10000" value={budget} onChange={(e) => setBudget(e.target.value)} />
              </label>
              <label>
                What matters most
                <select value={p} onChange={(e) => setP(e.target.value as Priority)}>
                  <option value="balanced">A balance of everything</option>
                  <option value="cost">Lowest cost</option>
                  <option value="speed">Starting soonest</option>
                  <option value="hours">Saving my team&apos;s time</option>
                </select>
              </label>
            </div>
            <button type="button" className={styles.go} onClick={() => setStep(2)}>
              Compare my options →
            </button>
          </div>
        )}

        {step === 2 && (
          <div className={styles.panel}>
            <p className={styles.stepLabel}>Step 2 of 2 · Where should we send it?</p>
            <p className={styles.note}>We&apos;ll email you a link to your comparison, so you can share it with your team.</p>
            <div className={styles.inputs}>
              <label>
                Work email
                <input type="email" placeholder="you@studio.com" value={email} onChange={(e) => setEmail(e.target.value)} />
              </label>
              <label>
                Your name <span>optional</span>
                <input value={name} onChange={(e) => setName(e.target.value)} />
              </label>
              <label>
                Company <span>optional</span>
                <input value={company} onChange={(e) => setCompany(e.target.value)} />
              </label>
            </div>
            {error && <p className={styles.err}>{error}</p>}
            <div className={styles.ctas}>
              <button type="button" className={styles.ghost} onClick={() => setStep(1)}>← Back</button>
              <button type="button" className={styles.go} disabled={busy || !/^\S+@\S+\.\S+$/.test(email)} onClick={submit}>
                {busy ? "Sending…" : "Send my comparison →"}
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className={styles.panel}>
            <p className={styles.stepLabel}>Sent</p>
            <h2 className={styles.h2}>Check your inbox</h2>
            <p className={styles.note}>
              Your comparison is on its way to <b>{email}</b>. It should land in a minute; check your spam folder if not.
            </p>
            {devLink && (
              <p className={styles.dev}>
                Local test: the email was saved to <code>.onboarding-outbox</code> instead of being sent.{" "}
                <a href={devLink}>Open the comparison it links to →</a>
              </p>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
