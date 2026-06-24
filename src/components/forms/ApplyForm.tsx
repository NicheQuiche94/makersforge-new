"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import styles from "./ApplyForm.module.css";

type Discipline = "ua" | "art";

type Status = "idle" | "submitting" | "ok" | "error";

export function ApplyForm() {
  const [discipline, setDiscipline] = useState<Discipline>("ua");
  const [industries, setIndustries] = useState<Set<string>>(new Set());
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const showGames = industries.has("games");
  const showApps = industries.has("apps");

  const toggleIndustry = (v: string) => {
    setIndustries((prev) => {
      const next = new Set(prev);
      if (next.has(v)) next.delete(v);
      else next.add(v);
      return next;
    });
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("submitting");
    setErrorMsg(null);

    const form = e.currentTarget;
    const fd = new FormData(form);

    try {
      const res = await fetch("/api/apply", { method: "POST", body: fd });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        setErrorMsg(j.error || `Submission failed (HTTP ${res.status}).`);
        setStatus("error");
        return;
      }
      setStatus("ok");
      form.reset();
      setDiscipline("ua");
      setIndustries(new Set());
    } catch {
      setErrorMsg("Network error. Try again or email andre@makersforge.gg.");
      setStatus("error");
    }
  };

  if (status === "ok") {
    return (
      <div className={`heat-glow ${styles.success}`}>
        <p className="kicker" style={{ marginBottom: 14 }}>application received</p>
        <h2 className={styles.successH}>
          we&apos;ll be <span className="gr">in touch.</span>
        </h2>
        <p className={styles.successBody}>
          Andre reads every roster application personally. If we&apos;re a good
          fit, expect a 20-min call within the week.
        </p>
        <button
          type="button"
          className={styles.successAgain}
          onClick={() => setStatus("idle")}
        >
          submit another →
        </button>
      </div>
    );
  }

  return (
    <form className={styles.form} onSubmit={onSubmit} encType="multipart/form-data">
      {/* Section 1: who you are */}
      <Section
        title="who you are"
        kicker="01"
        hint="Stays private. Never shown on the public lineup."
      >
        <Field label="full name" required>
          <input name="name" type="text" required className={styles.input} />
        </Field>
        <div className={styles.split}>
          <Field label="email" required>
            <input name="email" type="email" required className={styles.input} />
          </Field>
          <Field label="phone (optional)">
            <input name="phone" type="tel" className={styles.input} />
          </Field>
        </div>
        <Field label="linkedin (optional)">
          <input name="linkedin" type="url" placeholder="https://linkedin.com/in/…" className={styles.input} />
        </Field>
      </Section>

      {/* Section 2: your role */}
      <Section title="your role" kicker="02">
        <Field label="discipline" required>
          <div className={styles.radioRow}>
            <RadioPill
              name="discipline"
              value="ua"
              checked={discipline === "ua"}
              onChange={() => setDiscipline("ua")}
              label="ua manager"
            />
            <RadioPill
              name="discipline"
              value="art"
              checked={discipline === "art"}
              onChange={() => setDiscipline("art")}
              label="marketing artist"
            />
          </div>
        </Field>
        <div className={styles.split}>
          <Field label="role" required hint="e.g. ua manager, marketing artist, creative producer">
            <input name="role" type="text" required className={styles.input} />
          </Field>
          <Field label="background" required hint="e.g. ex-Supercell">
            <input name="background" type="text" required className={styles.input} />
          </Field>
        </div>
        <Field label="location" hint="city or 'eu · remote'">
          <input name="location" type="text" className={styles.input} />
        </Field>
      </Section>

      {/* Section 3: industry + experience */}
      <Section title="industry & experience" kicker="03">
        <Field label="industries">
          <CheckGroup
            name="industries"
            values={["games", "apps"]}
            onToggle={toggleIndustry}
          />
        </Field>
        {showGames && (
          <Field label="games category" hint="complexity">
            <CheckGroup
              name="gamesCat"
              values={["hypercasual", "hybridcasual", "casual", "midcore", "hardcore"]}
            />
          </Field>
        )}
        {showApps && (
          <Field label="apps category" hint="vertical">
            <CheckGroup
              name="appsCat"
              values={["health", "dating", "finance", "social", "education", "entertainment", "productivity", "shopping", "lifestyle", "photo"]}
            />
          </Field>
        )}
        {showGames && (
          <Field label="genre">
            <CheckGroup
              name="genre"
              values={["puzzle", "rpg", "strategy", "casino", "simulation", "sports", "action", "cards"]}
            />
          </Field>
        )}
      </Section>

      {/* Section 4: discipline-specific */}
      {discipline === "ua" ? (
        <Section title="ua specifics" kicker="04">
          <Field label="monetisation">
            <CheckGroup name="monetisation" values={["iap", "iaa", "hybrid"]} />
          </Field>
          <Field label="channels">
            <CheckGroup
              name="channels"
              values={["meta", "google", "tiktok", "asa", "programmatic", "influencer", "aso"]}
            />
          </Field>
          <Field label="monthly budget managed" hint="band">
            <div className={styles.radioRow}>
              <RadioPill name="budget" value="0" label="< £50k" />
              <RadioPill name="budget" value="1" label="£50k–250k" />
              <RadioPill name="budget" value="2" label="£250k–1m" />
              <RadioPill name="budget" value="3" label="£1m+" />
            </div>
          </Field>
        </Section>
      ) : (
        <Section title="art specifics" kicker="04">
          <Field label="creative formats">
            <CheckGroup
              name="formats"
              values={["video", "playable", "static", "ugc", "motion"]}
            />
          </Field>
        </Section>
      )}

      {/* Section 5: expertise + rate */}
      <Section title="expertise & rate" kicker="05">
        <Field label="special expertise">
          <CheckGroup
            name="expertise"
            values={["incrementality", "skan", "scaling", "liveops", "reactivation", "audience"]}
          />
        </Field>
        <div className={styles.split}>
          <Field label="day rate" hint="e.g. £600–750">
            <input name="dayRate" type="text" placeholder="£600–750" className={styles.input} />
          </Field>
          <Field label="rate min (number)" hint="for sorting">
            <input name="rateMin" type="number" min={0} placeholder="600" className={styles.input} />
          </Field>
        </div>
        <Field label="">
          <label className={styles.checkboxRow}>
            <input type="checkbox" name="available" defaultChecked />
            <span>currently available for new engagements</span>
          </label>
        </Field>
      </Section>

      {/* Section 6: tell us about you */}
      <Section title="tell us about you" kicker="06">
        <Field label="summary" hint="3–6 sentences. wins, teams you've thrived in, what you're best known for.">
          <textarea name="summary" rows={6} className={styles.textarea} />
        </Field>
        <Field label="cv" hint="PDF, DOC or DOCX. Max 5MB.">
          <input
            name="cv"
            type="file"
            accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            className={styles.file}
          />
        </Field>
      </Section>

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
            {status === "submitting" ? "submitting…" : "submit application"}
          </span>
          {status !== "submitting" && (
            <span className="btn-arrow" aria-hidden="true">
              →
            </span>
          )}
        </button>
        {/* Quiet footnote per cofounder pass L3 — eventually replaced
            by a direct join-HG-community link. */}
        <p className={styles.hgFootnote}>
          Already on HiddenGem?{" "}
          <a
            href="https://hiddengem.gg"
            target="_blank"
            rel="noopener noreferrer"
          >
            hiddengem.gg →
          </a>
        </p>
      </div>
    </form>
  );
}

/* ============================================================
   Sub-components
   ============================================================ */

function Section({
  title,
  kicker,
  hint,
  children,
}: {
  title: string;
  kicker: string;
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
      {label && (
        <span className={styles.label}>
          {label}
          {required && <span className={styles.req}> *</span>}
          {hint && <span className={styles.hint}> · {hint}</span>}
        </span>
      )}
      {children}
    </label>
  );
}

function RadioPill({
  name,
  value,
  label,
  checked,
  onChange,
}: {
  name: string;
  value: string;
  label: string;
  checked?: boolean;
  onChange?: () => void;
}) {
  return (
    <label className={styles.radioPill}>
      <input
        type="radio"
        name={name}
        value={value}
        defaultChecked={checked}
        onChange={onChange}
      />
      <span>{label}</span>
    </label>
  );
}

function CheckGroup({
  name,
  values,
  onToggle,
}: {
  name: string;
  values: string[];
  onToggle?: (v: string) => void;
}) {
  return (
    <div className={styles.checkGroup}>
      {values.map((v) => (
        <label key={v} className={styles.checkPill}>
          <input
            type="checkbox"
            name={name}
            value={v}
            onChange={onToggle ? () => onToggle(v) : undefined}
          />
          <span>{v}</span>
        </label>
      ))}
    </div>
  );
}
