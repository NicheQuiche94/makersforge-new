"use client";

import { useState, type FormEvent } from "react";
import { CATEGORY_ORDER, CATEGORY_LABELS } from "@/lib/jobs";
import { HiringCTA } from "./JobCtas";
import styles from "./JobPostForm.module.css";

type Status = "idle" | "submitting" | "ok" | "error";

/**
 * Employer submission form (brief §4). Framed as FREE posting. Submissions
 * email Andre, manual on purpose in v1, because every submission is a sales
 * conversation, and the confirmation screen carries the hiring-side CTA.
 */
export function JobPostForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("submitting");
    setErrorMsg(null);
    const fd = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/jobs-post", { method: "POST", body: fd });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        setErrorMsg(j.error || `Submission failed (HTTP ${res.status}).`);
        setStatus("error");
        return;
      }
      setStatus("ok");
    } catch {
      setErrorMsg("Network error. Try again or email andre@makersforge.gg.");
      setStatus("error");
    }
  };

  if (status === "ok") {
    return (
      <div className={styles.success}>
        <p className={styles.successKicker}>Got it, role received</p>
        <h2 className={styles.successH}>We&apos;ll review and post it.</h2>
        <p className={styles.successBody}>
          Andre reviews every submission personally, usually within a day. If
          it&apos;s in remit, it goes live on the board and we&apos;ll email you
          the link.
        </p>
        <HiringCTA />
      </div>
    );
  }

  return (
    <form className={styles.form} onSubmit={onSubmit}>
      <div className={styles.grid}>
        <Field label="Company name" required>
          <input name="company" type="text" required className={styles.input} />
        </Field>
        <Field label="Company website" required>
          <input
            name="companyUrl"
            type="url"
            required
            placeholder="https://…"
            className={styles.input}
          />
        </Field>
        <Field label="Role title" required>
          <input name="title" type="text" required className={styles.input} />
        </Field>
        <Field label="Category" required>
          <select name="category" required className={styles.input} defaultValue="">
            <option value="" disabled>
              Choose a category…
            </option>
            {CATEGORY_ORDER.map((c) => (
              <option key={c} value={c}>
                {CATEGORY_LABELS[c]}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Location" required hint="e.g. Berlin, Germany or Remote, EMEA">
          <input name="location" type="text" required className={styles.input} />
        </Field>
        <Field label="Work mode" required>
          <select name="remote" required className={styles.input} defaultValue="">
            <option value="" disabled>
              Choose…
            </option>
            <option value="remote">Remote</option>
            <option value="hybrid">Hybrid</option>
            <option value="onsite">On-site</option>
          </select>
        </Field>
        <Field label="Apply URL" required hint="Your posting or ATS link, we always send candidates here">
          <input
            name="applyUrl"
            type="url"
            required
            placeholder="https://…"
            className={styles.input}
          />
        </Field>
        <Field label="Your contact email" required>
          <input
            name="contactEmail"
            type="email"
            required
            className={styles.input}
          />
        </Field>
      </div>

      <Field label="Anything else? (optional)" hint="Team, budget, what a great hire looks like">
        <textarea name="notes" rows={4} className={styles.textarea} />
      </Field>

      <div className={styles.submitRow}>
        {status === "error" && errorMsg && (
          <p className={styles.error}>{errorMsg}</p>
        )}
        <button
          type="submit"
          className={`btn btn-primary ${styles.submit}`}
          disabled={status === "submitting"}
        >
          <span className="btn-label">
            {status === "submitting" ? "Submitting…" : "Submit your role"}
          </span>
          {status !== "submitting" && (
            <span className="btn-arrow" aria-hidden="true">
              →
            </span>
          )}
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  hint,
  required,
  children,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className={styles.field}>
      <span className={styles.label}>
        {label}
        {required && <span className={styles.req}> *</span>}
        {hint && <span className={styles.hint}> · {hint}</span>}
      </span>
      {children}
    </label>
  );
}
