"use client";

import { useState, type FormEvent } from "react";
import { CATEGORY_ORDER, CATEGORY_LABELS, type JobCategory } from "@/lib/jobs";
import styles from "./AlertForm.module.css";

type Status = "idle" | "submitting" | "ok" | "error";

/**
 * Email alert signup. One field (email) + category multi-select, the
 * segmented category list is the asset (brief §4), so we always send the
 * selected categories through.
 *
 * Posts to /api/alerts, which stores the signup (Supabase) and notifies
 * Andre (Resend). `source` records which surface the signup came from
 * (board, a job page, an empty state, an expired page) for later analysis.
 *
 * `variant="dark"` renders on gradient/heat panels; default is the cream
 * card used in sidebars and empty states.
 */
export function AlertForm({
  source = "board",
  variant = "light",
  presetCategory,
  compact = false,
  hideHeader = false,
  bare = false,
}: {
  source?: string;
  variant?: "light" | "dark";
  presetCategory?: JobCategory;
  compact?: boolean;
  /** Drop the internal title/sub when the surrounding section already
      carries the heading (e.g. the board alert strip), so the form
      isn't a duplicated, over-tall block. */
  hideHeader?: boolean;
  /** Drop the form's own panel background/padding so it sits directly
      on a already-filled parent card (the two-up alert strip). */
  bare?: boolean;
}) {
  const [selected, setSelected] = useState<Set<JobCategory>>(
    () => new Set(presetCategory ? [presetCategory] : []),
  );
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const toggle = (c: JobCategory) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(c)) next.delete(c);
      else next.add(c);
      return next;
    });
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("submitting");
    setErrorMsg(null);

    const fd = new FormData(e.currentTarget);
    fd.set("source", source);
    // Selected categories aren't real inputs (they're pills), so append them.
    for (const c of selected) fd.append("categories", c);

    try {
      const res = await fetch("/api/alerts", { method: "POST", body: fd });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        setErrorMsg(j.error || `Signup failed (HTTP ${res.status}).`);
        setStatus("error");
        return;
      }
      setStatus("ok");
    } catch {
      setErrorMsg("Network error. Try again in a moment.");
      setStatus("error");
    }
  };

  const cls = `${styles.wrap} ${variant === "dark" ? styles.dark : styles.lightv} ${
    compact ? styles.compact : ""
  } ${bare ? styles.bare : ""}`;

  if (status === "ok") {
    return (
      <div className={cls}>
        <p className={styles.okKicker}>You&apos;re on the list</p>
        <p className={styles.okBody}>
          New roles in your categories will come straight to you. No spam, no
          filler jobs.
        </p>
      </div>
    );
  }

  return (
    <form className={cls} onSubmit={onSubmit}>
      {!hideHeader && (
        <div>
          <p className={styles.title}>Get alerted</p>
          <p className={styles.sub}>
            New roles in your category, straight to you. No spam, no filler
            jobs.
          </p>
        </div>
      )}

      <fieldset className={styles.cats}>
        <legend className={styles.legend}>Categories</legend>
        {CATEGORY_ORDER.map((c) => (
          <label
            key={c}
            className={styles.pill}
            data-on={selected.has(c) ? "true" : "false"}
          >
            <input
              type="checkbox"
              checked={selected.has(c)}
              onChange={() => toggle(c)}
            />
            <span>{CATEGORY_LABELS[c]}</span>
          </label>
        ))}
      </fieldset>

      <div className={styles.row}>
        <input
          className={styles.input}
          type="email"
          name="email"
          required
          placeholder="you@studio.com"
          aria-label="Email address"
        />
        <button
          type="submit"
          className={styles.btn}
          disabled={status === "submitting"}
        >
          {status === "submitting" ? "…" : "Notify me"}
        </button>
      </div>

      {status === "error" && errorMsg && (
        <p className={styles.error}>{errorMsg}</p>
      )}
    </form>
  );
}
