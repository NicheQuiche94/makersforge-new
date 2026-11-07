import Link from "next/link";
import styles from "./CompareBand.module.css";

/* Homepage entry to /compare (Andre 2026-11-07): a short section that echoes
   the /compare page itself. DRAFT wording. */
export function CompareBand() {
  return (
    <section className={styles.band}>
      <div className="container">
        <h2 className={styles.h}>
          Not sure which way to hire is most <span className={`gr ${styles.accent}`}>cost-effective</span>?
        </h2>
        <Link href="/compare" className={styles.go}>
          Compare hiring routes →
        </Link>
      </div>
    </section>
  );
}
