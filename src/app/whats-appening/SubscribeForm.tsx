"use client";

import { useState } from "react";
import styles from "./appening.module.css";

type Choice = "both" | "games" | "apps";
const CHOICES: [Choice, string][] = [
  ["both", "Both"],
  ["games", "Games"],
  ["apps", "Apps"],
];

/* Email signup for What's Appening (Andre 2026-11-11): one line, a
   Both / Games / Apps toggle next to the email field. DRAFT copy. */
export function SubscribeForm({ source = "landing", cta = "Get it by email" }: { source?: string; cta?: string }) {
  const [email, setEmail] = useState("");
  const [choice, setChoice] = useState<Choice>("both");
  const [state, setState] = useState<"idle" | "busy" | "done">("idle");
  const [error, setError] = useState("");

  if (state === "done") return <p className={styles.okMsg}>You&apos;re in. The next issue lands in your inbox.</p>;
  return (
    <form
      className={styles.sub}
      onSubmit={async (ev) => {
        ev.preventDefault();
        setState("busy");
        setError("");
        const editions = choice === "both" ? ["games", "apps"] : [choice];
        const r = await fetch("/api/appening/subscribe", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, editions, source }) })
          .then((x) => x.json())
          .catch(() => ({ error: "That didn't go through. Please try again." }));
        if (r.error) {
          setState("idle");
          return setError(r.error);
        }
        setState("done");
      }}
    >
      <div className={styles.subLine}>
        <div className={styles.seg} role="radiogroup" aria-label="Which editions">
          {CHOICES.map(([v, label]) => (
            <button key={v} type="button" role="radio" aria-checked={choice === v} className={choice === v ? styles.segOn : ""} onClick={() => setChoice(v)}>
              {label}
            </button>
          ))}
        </div>
        <input type="email" required placeholder="you@studio.com" value={email} onChange={(e) => setEmail(e.target.value)} aria-label="Email" />
        <button className={styles.go} disabled={state === "busy"}>
          {cta}
        </button>
      </div>
      {error && <p className={styles.err}>{error}</p>}
    </form>
  );
}
