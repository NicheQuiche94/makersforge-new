"use client";

import { useState, useRef, type ReactNode, type FormEvent } from "react";
import { Button } from "@/components/atoms/Button";
import styles from "./EnquireForm.module.css";

/**
 * EnquireForm — studio enquiry form.
 *
 * Built per Andre 2026-05-30: required fields are first name, last
 * name, company, company email, title of hire, on-site/remote.
 * Everything else is optional dropdowns + checkboxes matching the
 * data we collect from specialists so the match is easy on our end.
 *
 * `profileCodename` (if set, passed via ?profile= search param on the
 * /enquire page) pre-populates a "requesting info about" header and a
 * hidden field so the receiving email knows which lineup row the
 * studio came from.
 */
type Props = {
  profileCodename?: string;
};

const LOCATION_OPTIONS = ["remote", "on-site", "hybrid", "either"];
const DISCIPLINES = [
  { v: "ua", l: "ua manager" },
  { v: "creative", l: "marketing artist" },
  { v: "either", l: "either / not sure yet" },
];
const INDUSTRIES = ["games", "apps"];
const GAMES_CATS = [
  "hypercasual",
  "hybridcasual",
  "casual",
  "midcore",
  "hardcore",
];
const APPS_CATS = [
  "health & fitness",
  "dating",
  "finance",
  "social",
  "education",
  "entertainment",
  "productivity",
  "shopping",
  "lifestyle",
  "photo & video",
];
const GENRES = [
  "puzzle",
  "rpg",
  "strategy",
  "casino",
  "simulation",
  "sports/racing",
  "action",
  "tabletop/cards",
];
const MONETISATION = ["iap", "iaa", "hybrid"];
const CHANNELS = [
  "meta",
  "google",
  "tiktok",
  "asa",
  "programmatic",
  "influencer",
  "aso",
];
const BUDGETS = [
  { v: "0", l: "< £250k / month" },
  { v: "1", l: "£250k–1m / month" },
  { v: "2", l: "£1m+ / month" },
  { v: "3", l: "not sure yet" },
];
const FORMATS = ["video", "playables", "static", "ugc", "motion"];
const EXPERTISE = [
  "incrementality",
  "skan / measurement",
  "creative scaling",
  "liveops",
  "reactivation",
  "audience strategy",
];
const RATE_BANDS = [
  { v: "0", l: "< £500 / day" },
  { v: "1", l: "£500–700 / day" },
  { v: "2", l: "£700+ / day" },
  { v: "any", l: "open" },
];

export function EnquireForm({ profileCodename }: Props) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const fd = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/enquire", {
        method: "POST",
        body: fd,
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Something went wrong. Try again.");
        setSubmitting(false);
        return;
      }
      setSuccess(true);
      formRef.current?.reset();
    } catch {
      setError("Network error. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className={`heat-glow ${styles.success}`}>
        <p className="kicker">thanks for the brief.</p>
        <h2 className={styles.successH}>we&apos;ll be in touch.</h2>
        <p className={styles.successBody}>
          Expect a reply in under 24 hours. If we have a clean match in the
          lineup already, you&apos;ll get the shortlist with that reply.
          Otherwise, a 20-minute call to dig in.
        </p>
        <button
          type="button"
          className={styles.successAgain}
          onClick={() => setSuccess(false)}
        >
          send another
        </button>
      </div>
    );
  }

  return (
    <form ref={formRef} className={styles.form} onSubmit={onSubmit}>
      {profileCodename && (
        <input type="hidden" name="profile" value={profileCodename} />
      )}

      {profileCodename && (
        <div className={styles.profileBanner}>
          <span className={styles.profileBannerLabel}>requesting info about</span>
          <span className={styles.profileBannerCode}>{profileCodename}</span>
        </div>
      )}

      <Section kicker="01" title="who's asking" hint="required.">
        <div className={styles.split}>
          <Field label="first name" required>
            <input name="firstName" type="text" required className={styles.input} />
          </Field>
          <Field label="last name" required>
            <input name="lastName" type="text" required className={styles.input} />
          </Field>
        </div>
        <div className={styles.split}>
          <Field label="company name" required>
            <input name="companyName" type="text" required className={styles.input} />
          </Field>
          <Field label="company email" required>
            <input name="companyEmail" type="email" required className={styles.input} />
          </Field>
        </div>
      </Section>

      <Section kicker="02" title="the hire" hint="required.">
        <Field label="title of hire" required>
          <input
            name="titleOfHire"
            type="text"
            required
            placeholder="e.g. ua manager, marketing artist, creative producer"
            className={styles.input}
          />
        </Field>
        <Field label="on-site / remote / hybrid" required>
          <div className={styles.radioRow}>
            {LOCATION_OPTIONS.map((v) => (
              <RadioPill key={v} name="locationPref" value={v}>
                {v}
              </RadioPill>
            ))}
          </div>
        </Field>
        <Field label="discipline">
          <div className={styles.radioRow}>
            {DISCIPLINES.map((d) => (
              <RadioPill key={d.v} name="discipline" value={d.v}>
                {d.l}
              </RadioPill>
            ))}
          </div>
        </Field>
        <Field label="timeline">
          <input
            name="timeline"
            type="text"
            placeholder="e.g. start in 2 weeks, end of Q3, asap"
            className={styles.input}
          />
        </Field>
      </Section>

      <Section
        kicker="03"
        title="context"
        hint="optional. helps us match faster."
      >
        <Field label="industry">
          <div className={styles.checkGroup}>
            {INDUSTRIES.map((v) => (
              <CheckPill key={v} name="industries" value={v}>
                {v}
              </CheckPill>
            ))}
          </div>
        </Field>
        <div className={styles.split}>
          <Field label="games category">
            <div className={styles.checkGroup}>
              {GAMES_CATS.map((v) => (
                <CheckPill key={v} name="gamesCat" value={v}>
                  {v}
                </CheckPill>
              ))}
            </div>
          </Field>
          <Field label="apps category">
            <div className={styles.checkGroup}>
              {APPS_CATS.map((v) => (
                <CheckPill key={v} name="appsCat" value={v}>
                  {v}
                </CheckPill>
              ))}
            </div>
          </Field>
        </div>
        <Field label="genre">
          <div className={styles.checkGroup}>
            {GENRES.map((v) => (
              <CheckPill key={v} name="genre" value={v}>
                {v}
              </CheckPill>
            ))}
          </div>
        </Field>
        <div className={styles.split}>
          <Field label="monetisation">
            <div className={styles.checkGroup}>
              {MONETISATION.map((v) => (
                <CheckPill key={v} name="monetisation" value={v}>
                  {v}
                </CheckPill>
              ))}
            </div>
          </Field>
          <Field label="day rate band">
            <select name="dayRateBand" className={styles.input}>
              <option value="">no preference</option>
              {RATE_BANDS.map((r) => (
                <option key={r.v} value={r.v}>
                  {r.l}
                </option>
              ))}
            </select>
          </Field>
        </div>
        <Field label="channels">
          <div className={styles.checkGroup}>
            {CHANNELS.map((v) => (
              <CheckPill key={v} name="channels" value={v}>
                {v}
              </CheckPill>
            ))}
          </div>
        </Field>
        <Field label="monthly budget managed">
          <select name="budget" className={styles.input}>
            <option value="">no preference</option>
            {BUDGETS.map((b) => (
              <option key={b.v} value={b.v}>
                {b.l}
              </option>
            ))}
          </select>
        </Field>
        <Field label="creative formats">
          <div className={styles.checkGroup}>
            {FORMATS.map((v) => (
              <CheckPill key={v} name="formats" value={v}>
                {v}
              </CheckPill>
            ))}
          </div>
        </Field>
        <Field label="special expertise">
          <div className={styles.checkGroup}>
            {EXPERTISE.map((v) => (
              <CheckPill key={v} name="expertise" value={v}>
                {v}
              </CheckPill>
            ))}
          </div>
        </Field>
        <Field label="anything else worth knowing">
          <textarea
            name="message"
            rows={5}
            className={styles.textarea}
            placeholder="What's the goal, the context, the wrinkle. As much or as little as you want."
          />
        </Field>
      </Section>

      <div className={styles.submitRow}>
        {error && <p className={styles.error}>{error}</p>}
        <Button type="submit" variant="primary" arrow disabled={submitting}>
          {submitting ? "Sending…" : "Send the brief"}
        </Button>
      </div>
    </form>
  );
}

function Section({
  kicker,
  title,
  hint,
  children,
}: {
  kicker: string;
  title: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <fieldset className={styles.section}>
      <legend className={styles.legend}>
        <span className={styles.sectionKicker}>{kicker}</span>
        <span className={styles.sectionTitle}>{title}</span>
      </legend>
      {hint && <p className={styles.sectionHint}>{hint}</p>}
      <div className={styles.fields}>{children}</div>
    </fieldset>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <label className={styles.field}>
      <span className={styles.fieldLabel}>
        {label}
        {required && <span className={styles.req}> *</span>}
      </span>
      {children}
    </label>
  );
}

function RadioPill({
  name,
  value,
  children,
}: {
  name: string;
  value: string;
  children: ReactNode;
}) {
  return (
    <label className={styles.radioPill}>
      <input type="radio" name={name} value={value} />
      {children}
    </label>
  );
}

function CheckPill({
  name,
  value,
  children,
}: {
  name: string;
  value: string;
  children: ReactNode;
}) {
  return (
    <label className={styles.checkPill}>
      <input type="checkbox" name={name} value={value} />
      {children}
    </label>
  );
}
