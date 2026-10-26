"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/atoms/Button";
import styles from "./ProofSections.module.css";

/**
 * Quick brief (2026-10-27) — five fields instead of the ~20-field /enquire
 * form, so a studio that clicked through from an email can brief a role in
 * under a minute. Posts to the same /api/enquire route; fields the route
 * requires but we don't ask for here (location) go as "to discuss on call".
 */
export function QuickBrief({ industry }: { industry?: "games" | "apps" }) {
  const [state, setState] = useState<"idle" | "sending" | "done">("idle");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("sending");
    setError(null);
    const fd = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/enquire", { method: "POST", body: fd });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Something went wrong. Try again, or email andre@makersforge.gg.");
        setState("idle");
        return;
      }
      setState("done");
    } catch {
      setError("Something went wrong. Try again, or email andre@makersforge.gg.");
      setState("idle");
    }
  }

  return (
    <section className={styles.section} id="brief">
      <div className={`container ${styles.contentAbove}`}>
        <header className={styles.header}>
          <p className="kicker">Brief us a role</p>
          <h2 className={styles.h2}>Your 5 candidates start here.</h2>
          <p className={styles.lede}>
            Tell us the role. We&apos;ll come back within a working day to book
            the 30-minute brief.
          </p>
        </header>

        <div className={styles.briefWrap}>
          {state === "done" ? (
            <p className={styles.done}>
              Thanks, that&apos;s with us. We&apos;ll be in touch within a
              working day to book your brief.
            </p>
          ) : (
            <form className={styles.form} onSubmit={onSubmit}>
              <label className={styles.label}>
                First name
                <input className={styles.input} name="firstName" required autoComplete="given-name" />
              </label>
              <label className={styles.label}>
                Last name
                <input className={styles.input} name="lastName" required autoComplete="family-name" />
              </label>
              <label className={styles.label}>
                Work email
                <input className={styles.input} name="companyEmail" type="email" required autoComplete="email" />
              </label>
              <label className={styles.label}>
                Company
                <input className={styles.input} name="companyName" required autoComplete="organization" />
              </label>
              <label className={`${styles.label} ${styles.full}`}>
                Role(s) you&apos;re hiring for
                <input className={styles.input} name="titleOfHire" required placeholder="e.g. Senior UA Manager, Unity Developer" />
              </label>
              <input type="hidden" name="locationPref" value="to discuss on call" />
              <input type="hidden" name="message" value="Quick brief from the homepage" />
              {industry ? <input type="hidden" name="industries" value={industry} /> : null}
              {error ? <p className={styles.error}>{error}</p> : null}
              <div className={styles.formFoot}>
                <p className={styles.formNote}>
                  Rather talk first? <a href="/enquire">Book a 15-minute call</a>
                </p>
                <Button type="submit" variant="primary" arrow disabled={state === "sending"}>
                  {state === "sending" ? "Sending…" : "Brief us"}
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
