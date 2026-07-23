"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { CONTRACT_LABELS } from "@/lib/terms";
import { HiringCTA } from "./JobCtas";
import styles from "./JobPostForm.module.css";

type Status = "idle" | "submitting" | "ok" | "error";

/** What we already know about the role, used to pre-fill the form so the
 *  employer confirms/corrects rather than starting from scratch. */
export type ClaimDefaults = {
  currency?: string;
  payMin?: number;
  payMax?: number;
  payPeriod?: string;
  contract?: string;
  hoursPerWeek?: number;
  fullTime?: boolean;
  remoteScope?: string;
  remoteWhere?: string;
  isRemote?: boolean;
};

/**
 * Claim form — the employer verifies they're hiring for THIS sourced role and
 * confirms/completes its working terms. Pre-filled with what we pulled +
 * inferred. Submitting emails Andre; once he's verified the sender, the role is
 * added to claimed-roles.json and flips to employer-verified (badge + score,
 * "Sourced" framing gone). Manual on purpose — human verification is what makes
 * "verified" mean something.
 */
export function ClaimForm({
  slug,
  company,
  title,
  defaults,
}: {
  slug: string;
  company: string;
  title: string;
  defaults: ClaimDefaults;
}) {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("submitting");
    setErrorMsg(null);
    const fd = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/claim", { method: "POST", body: fd });
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
        <p className={styles.successKicker}>Claim received</p>
        <h2 className={styles.successH}>We&apos;ll verify and mark it.</h2>
        <p className={styles.successBody}>
          Andre checks every claim personally, usually within a day. Once we
          confirm you&apos;re hiring for this role, the listing shows as
          employer-verified with the details you gave, and the &ldquo;sourced&rdquo;
          note comes off.
        </p>
        <HiringCTA />
      </div>
    );
  }

  return (
    <form className={styles.form} onSubmit={onSubmit}>
      <input type="hidden" name="slug" value={slug} />
      <input type="hidden" name="company" value={company} />
      <input type="hidden" name="title" value={title} />

      <div className={styles.grid}>
        <Field label="Your name" required>
          <input name="contactName" type="text" required className={styles.input} />
        </Field>
        <Field
          label="Work email"
          required
          hint="use your company email so we can verify"
        >
          <input name="contactEmail" type="email" required className={styles.input} />
        </Field>
      </div>

      <p className={styles.sectionNote}>
        Confirm or complete the terms below. Anything you leave blank stays
        &ldquo;not disclosed&rdquo;. Your call, shown honestly.
      </p>

      <div className={styles.grid}>
        <Field label="Currency">
          <select
            name="currency"
            className={styles.input}
            defaultValue={defaults.currency || "GBP"}
          >
            <option value="GBP">£ GBP</option>
            <option value="USD">$ USD</option>
            <option value="EUR">€ EUR</option>
          </select>
        </Field>
        <Field label="Pay period">
          <select
            name="payPeriod"
            className={styles.input}
            defaultValue={defaults.payPeriod || "year"}
          >
            <option value="year">Per year</option>
            <option value="month">Per month</option>
            <option value="day">Per day</option>
            <option value="hour">Per hour</option>
          </select>
        </Field>
        <Field label="Pay from" hint="lower end of the range">
          <input
            name="payMin"
            type="number"
            min="0"
            className={styles.input}
            defaultValue={defaults.payMin ?? ""}
          />
        </Field>
        <Field label="Pay to" hint="upper end of the range">
          <input
            name="payMax"
            type="number"
            min="0"
            className={styles.input}
            defaultValue={defaults.payMax ?? ""}
          />
        </Field>
        <Field label="Contract">
          <select
            name="contract"
            className={styles.input}
            defaultValue={defaults.contract || ""}
          >
            <option value="">Not stated</option>
            {(["permanent", "fixed_term", "rolling", "contractor"] as const).map(
              (c) => (
                <option key={c} value={c}>
                  {CONTRACT_LABELS[c]}
                </option>
              ),
            )}
          </select>
        </Field>
        <Field label="Weekly hours" hint="e.g. 40, or leave blank">
          <input
            name="hoursPerWeek"
            type="number"
            min="1"
            max="60"
            className={styles.input}
            defaultValue={defaults.hoursPerWeek ?? ""}
          />
        </Field>
        <Field label="Second job" hint="only if relevant, e.g. part-time">
          <select name="secondJob" className={styles.input} defaultValue="">
            <option value="">Not applicable</option>
            <option value="allowed">Allowed</option>
            <option value="exclusive">Exclusive (no second job)</option>
          </select>
        </Field>
        {defaults.isRemote && (
          <Field label="Remote scope">
            <select
              name="remoteScope"
              className={styles.input}
              defaultValue={defaults.remoteScope || ""}
            >
              <option value="">Not stated</option>
              <option value="global">Worldwide</option>
              <option value="region">A region / timezone band</option>
              <option value="country">One country</option>
            </select>
          </Field>
        )}
        {defaults.isRemote && (
          <Field label="Remote location" hint="e.g. UK, EU (CET ±3h), Worldwide">
            <input
              name="remoteWhere"
              type="text"
              className={styles.input}
              defaultValue={defaults.remoteWhere ?? ""}
            />
          </Field>
        )}
      </div>

      <Field label="Anything to correct or add? (optional)">
        <textarea name="notes" rows={3} className={styles.textarea} />
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
            {status === "submitting" ? "Submitting…" : "Claim this listing"}
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
  children: ReactNode;
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
