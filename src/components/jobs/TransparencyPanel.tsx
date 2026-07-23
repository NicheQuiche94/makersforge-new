import { type Terms, type WorkMode, transparencyReport } from "@/lib/terms";
import styles from "./TransparencyPanel.module.css";

/**
 * Fair Board Standard panel — the honest disclosure breakdown for a role.
 *
 * The point of difference vs every other board: undisclosed dimensions are
 * shown as "Not disclosed", never hidden. The score is descriptive (how much
 * this employer chose to disclose), not a rating of the job. Denominator is
 * dynamic — dimensions that don't apply (remote scope on an on-site role) are
 * left out entirely rather than counted as a miss.
 */
export function TransparencyPanel({
  terms,
  mode,
}: {
  terms?: Terms;
  mode?: WorkMode;
}) {
  const report = transparencyReport(terms, mode);
  if (report.total === 0) return null;

  return (
    <section
      className={styles.panel}
      aria-label="Transparency: pay, contract and working terms"
    >
      <header className={styles.head}>
        <p className={styles.kicker}>Fair Board Standard</p>
        {report.full ? (
          <span className={`heat-glow ${styles.badge}`}>Fully transparent</span>
        ) : (
          <span className={styles.score}>
            {report.disclosed}/{report.total} disclosed
          </span>
        )}
      </header>

      <dl className={styles.rows}>
        {report.dims.map((d) => (
          <div
            key={d.key}
            className={styles.row}
            data-disclosed={d.disclosed ? "true" : "false"}
          >
            <dt className={styles.label}>{d.label}</dt>
            <dd className={styles.value}>{d.value}</dd>
          </div>
        ))}
      </dl>

      {!report.full && (
        <p className={styles.note}>
          &ldquo;Not disclosed&rdquo; is the employer&apos;s choice, shown
          honestly.
        </p>
      )}
    </section>
  );
}
