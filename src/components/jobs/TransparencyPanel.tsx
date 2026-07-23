import Link from "next/link";
import {
  type Terms,
  type WorkMode,
  isVerifiedSource,
  transparencyReport,
} from "@/lib/terms";
import styles from "./TransparencyPanel.module.css";

/**
 * Fair Board Standard panel — the working terms for a role.
 *
 * The behaviour is PROVENANCE-AWARE, because fairness demands it:
 *
 * - Employer-verified roles (the employer posted them here, so they opted into
 *   the Standard) get a disclosure score, a "Fully transparent" badge at full
 *   disclosure, and "Not disclosed" for blanks — they chose what to state and
 *   we hold them to it.
 *
 * - Sourced roles (pulled from a public ATS / board — the company never asked
 *   to be here) get NO score and NO judgement. Unknowns read "Not stated"
 *   (a fact about the posting, not a charge against the employer), and we
 *   invite whoever's hiring to claim the listing and complete it. We never
 *   imply a company withheld anything when it never signed up to disclose.
 */
export function TransparencyPanel({
  terms,
  mode,
  source,
  company,
}: {
  terms?: Terms;
  mode?: WorkMode;
  source: string;
  company?: string;
}) {
  const report = transparencyReport(terms, mode);
  if (report.total === 0) return null;

  const verified = isVerifiedSource(source);
  const blankLabel = verified ? "Not disclosed" : "Not stated";

  return (
    <section
      className={styles.panel}
      aria-label="Working terms: pay, contract, hours"
    >
      <header className={styles.head}>
        <p className={styles.kicker}>Fair Board Standard</p>
        {verified ? (
          report.full ? (
            <span className={`heat-glow ${styles.badge}`}>Fully transparent</span>
          ) : (
            <span className={styles.score}>
              {report.disclosed}/{report.total} disclosed
            </span>
          )
        ) : (
          <span className={styles.tag}>Sourced listing</span>
        )}
      </header>

      <dl className={styles.rows}>
        {report.dims.map((d) => {
          // Bonus signals (e.g. second job) only appear when positively stated —
          // their absence is never shown as a gap or counted against the role.
          if (!d.scored && !d.disclosed) return null;
          return (
            <div
              key={d.key}
              className={styles.row}
              data-disclosed={d.disclosed ? "true" : "false"}
              data-bonus={!d.scored ? "true" : undefined}
            >
              <dt className={styles.label}>{d.label}</dt>
              <dd className={styles.value}>
                {d.disclosed ? d.value : blankLabel}
              </dd>
            </div>
          );
        })}
      </dl>

      {verified && !report.full && (
        <p className={styles.note}>
          &ldquo;Not disclosed&rdquo; is the employer&apos;s choice, shown
          honestly.
        </p>
      )}

      {!verified && (
        <p className={styles.note}>
          Pulled from {company ? `${company}’s` : "a"} public posting, so
          some terms aren&apos;t captured here.{" "}
          <Link href="/jobs/post" className={styles.claim}>
            Hiring for this role? Claim it &rarr;
          </Link>
        </p>
      )}
    </section>
  );
}
