"use client";

import { useState, type FormEvent } from "react";
import { bookingUrl } from "@/lib/site";
import styles from "./InterviewRequest.module.css";

/**
 * Profile-page close (2026-10-27). Two clear routes so nobody books a call
 * thinking it's with the candidate: ask for the interview in writing (a short
 * form, emailed to Andre via /api/brief), or book 15 minutes with MakersForge.
 */
export function InterviewRequest({ codename }: { codename: string }) {
  const [open, setOpen] = useState(false);
  const [state, setState] = useState<"idle" | "sending" | "done">("idle");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("sending");
    setError(null);
    try {
      const res = await fetch("/api/brief", { method: "POST", body: new FormData(e.currentTarget) });
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

  const name = codename.toUpperCase();

  return (
    <div className={styles.band}>
      {state === "done" ? (
        <p className={styles.done}>
          <strong>Request sent.</strong> We&apos;ll check {name}&apos;s availability and
          come back to you to set up the interview.
        </p>
      ) : (
        <>
          <div className={styles.top}>
            <p className={styles.copy}>
              Want to meet <span className={styles.code}>{name}</span>? Ask in
              writing and we&apos;ll arrange the interview with them, or talk
              to us first.
            </p>
            <div className={styles.actions}>
              {!open ? (
                <button type="button" className={styles.primary} onClick={() => setOpen(true)}>
                  Request an interview <span aria-hidden="true">→</span>
                </button>
              ) : null}
              <a className={styles.secondary} href={bookingUrl(`Interested in profile ${codename}`)}>
                Book a call with us
              </a>
            </div>
          </div>
          <p className={styles.small}>
            The call is 15 minutes with Andre, MakersForge&apos;s founder, not with the candidate.
          </p>

          {open ? (
            <form className={styles.form} onSubmit={onSubmit}>
              <input type="hidden" name="profile" value={codename} />
              <div className={styles.row}>
                <label className={styles.field}>
                  <span>Your name</span>
                  <input name="name" required autoComplete="name" />
                </label>
                <label className={styles.field}>
                  <span>Work email</span>
                  <input name="email" type="email" required autoComplete="email" />
                </label>
              </div>
              <label className={styles.field}>
                <span>Anything we should know? (optional)</span>
                <textarea
                  name="details"
                  rows={3}
                  placeholder="The role, timing, or who'd run the interview."
                />
              </label>
              {error ? <p className={styles.error}>{error}</p> : null}
              <div className={styles.formFoot}>
                <button type="submit" className={styles.primary} disabled={state === "sending"}>
                  {state === "sending" ? "Sending…" : "Send request"}
                </button>
                <button type="button" className={styles.cancel} onClick={() => setOpen(false)}>
                  Cancel
                </button>
              </div>
            </form>
          ) : null}
        </>
      )}
    </div>
  );
}
