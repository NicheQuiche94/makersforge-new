"use client";

import { useState, type FormEvent } from "react";
import { CATEGORY_ORDER, CATEGORY_LABELS, type JobCategory } from "@/lib/jobs";
import styles from "./AlertForm.module.css";

type Status = "idle" | "submitting" | "ok" | "error";

/**
 * Reverse alert (Andre 2026-07-19) — the mirror of AlertForm. A hiring
 * team describes who they want, and we tell them when someone matching
 * joins the line-up. Every submission is a warm hiring-side lead.
 *
 * Posts to /api/alerts with type="talent": the pills are the roles they
 * want, the textarea is the free-text spec (seniority, region, must-haves),
 * and Andre gets a "talent alert" email he can action manually.
 */
export function TalentAlertForm({
  source = "talent-alert",
  variant = "light",
  bare = false,
}: {
  source?: string;
  variant?: "light" | "dark";
  bare?: boolean;
}) {
  const [selected, setSelected] = useState<Set<JobCategory>>(() => new Set());
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const cls = `${styles.wrap} ${variant === "dark" ? styles.dark : styles.lightv} ${
    bare ? styles.bare : ""
  }`;

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
    fd.set("type", "talent");
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

  if (status === "ok") {
    return (
      <div className={cls}>
        <p className={styles.okKicker}>We&apos;re on it</p>
        <p className={styles.okBody}>
          We&apos;ll email you the moment someone matching your brief joins the
          line-up. Want to move faster? Reply and we&apos;ll talk.
        </p>
      </div>
    );
  }

  return (
    <form className={cls} onSubmit={onSubmit}>
      <fieldset className={styles.cats}>
        <legend className={styles.legend}>Roles you hire for</legend>
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

      <textarea
        className={styles.textarea}
        name="notes"
        placeholder="Who are you after? Seniority, region, must-have skills…"
        aria-label="Describe who you're looking for"
      />

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
          {status === "submitting" ? "…" : "Alert me"}
        </button>
      </div>

      {status === "error" && errorMsg && (
        <p className={styles.error}>{errorMsg}</p>
      )}
    </form>
  );
}
