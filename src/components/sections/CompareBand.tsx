import Link from "next/link";
import styles from "./CompareBand.module.css";

/* Homepage entry to /compare (Andre 2026-11-07). DRAFT wording. */
export function CompareBand() {
  return (
    <section className={styles.band}>
      <div className="container">
        <div className={styles.card}>
          <div>
            <h2 className={styles.h}>Not sure which way to hire for this role?</h2>
            <p className={styles.p}>
              Compare an agency, a job ad and us for your role: cost, speed, interviews and your team&apos;s hours, honestly. It
              takes a minute.
            </p>
          </div>
          <Link href="/compare" className={styles.go}>
            Compare hiring routes →
          </Link>
        </div>
      </div>
    </section>
  );
}
