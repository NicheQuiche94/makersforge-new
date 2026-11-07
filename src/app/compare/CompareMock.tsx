"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { HOOKS, ROLES, GIFT_UNTIL, type Priority } from "@/lib/compare";
import styles from "./compare.module.css";

/* MOCKUP (Andre 2026-11-07): the landing page. One form, one click: the role
   and their email together, then a thank-you page. Every extra click is a
   place to lose them. Draft wording. */
export function CompareMock() {
  const router = useRouter();
  const [hook, setHook] = useState(0);
  // Each visitor gets one headline at random and keeps it; ?hook=1|2|3 forces one for previews.
  useEffect(() => {
    const n = Number(new URLSearchParams(window.location.search).get("hook"));
    if (n >= 1 && n <= HOOKS.length) return setHook(n - 1);
    try {
      let v = Number(localStorage.getItem("mf-compare-hook"));
      if (!(v >= 1 && v <= HOOKS.length)) {
        v = 1 + Math.floor(Math.random() * HOOKS.length);
        localStorage.setItem("mf-compare-hook", String(v));
      }
      setHook(v - 1);
    } catch {
      setHook(Math.floor(Math.random() * HOOKS.length));
    }
  }, []);

  const [role, setRole] = useState("senior-ua");
  const [salary, setSalary] = useState(70000);
  const [start, setStart] = useState("");
  const [budget, setBudget] = useState("");
  const [p, setP] = useState<Priority>("balanced");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const submit = async () => {
    setBusy(true);
    setError("");
    const r = await fetch("/api/compare", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role, salary, start, budget, p, email, name, hook }),
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
            <label className={styles.wide}>
              <span className={styles.lbl}>Work email</span>
              <input type="email" required placeholder="you@studio.com" value={email} onChange={(e) => setEmail(e.target.value)} />
            </label>
            <label className={styles.narrow}>
              <span className={styles.lbl}>First name <i>optional</i></span>
              <input value={name} onChange={(e) => setName(e.target.value)} />
            </label>
          </div>
          {error && <p className={styles.err}>{error}</p>}
          <button type="submit" className={styles.bigGo} disabled={busy || !/^\S+@\S+\.\S+$/.test(email)}>
            {busy ? "Sending…" : "Email me my comparison →"}
          </button>
          <p className={styles.fine}>We&apos;ll email you a link to your comparison to share with your team. One email, no spam.</p>
        </form>
      </div>
    </section>
  );
}
