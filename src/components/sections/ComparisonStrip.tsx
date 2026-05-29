import styles from "./ComparisonStrip.module.css";

type Row = { label: string; us: string; them: string };

const ROWS: Row[] = [
  { label: "Contract pricing", us: "flat monthly fee", them: "20–40% markup on day rate" },
  { label: "Permanent placement", us: "flat £10,000", them: "20–30% of first-year salary" },
  { label: "Who pays the operator", us: "you do, directly", them: "agency — opaque margin" },
  { label: "Bench you're hiring from", us: "vetted senior operators we know", them: "job-board candidate pool" },
  { label: "Speed to shortlist", us: "48h", them: "2–6 weeks" },
];

export function ComparisonStrip() {
  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.top}>
          <span className="kicker">vs. traditional recruitment</span>
          <h3 className={styles.h3}>
            flat fee <span className="gr">vs. the percentage trap.</span>
          </h3>
          <p className={styles.body}>
            Most recruiters take 20–30% of first-year salary, or skim a margin
            off every day rate. We don&apos;t. Here&apos;s how it stacks up.
          </p>
        </div>

        <div className={styles.table}>
          <div className={`${styles.cell} ${styles.head}`} />
          <div className={`${styles.cell} ${styles.head} ${styles.headUs}`}>
            MakersForge
          </div>
          <div className={`${styles.cell} ${styles.head}`}>Traditional</div>

          {ROWS.map((r) => (
            <RowFragment key={r.label} {...r} />
          ))}
        </div>
      </div>
    </section>
  );
}

function RowFragment({ label, us, them }: Row) {
  return (
    <>
      <div className={`${styles.cell} ${styles.row}`}>{label}</div>
      <div className={`${styles.cell} ${styles.us}`}>{us}</div>
      <div className={`${styles.cell} ${styles.them}`}>{them}</div>
    </>
  );
}
