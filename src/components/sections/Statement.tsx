import { Blob } from "@/components/atoms/Blob";
import styles from "./Statement.module.css";

export function Statement() {
  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.grid}>
          <h2 className={`reveal ${styles.headline}`}>
            hiring shouldn&apos;t{" "}
            <span className="ghost">slow</span> growth <Blob />{" "}
            <span className="gr">we won&apos;t.</span>
          </h2>
          <div className={`reveal d1 ${styles.left}`}>
            <p className={`display-tiny ${styles.kicker}`}>
              the problem <span className="gr">we solve.</span>
            </p>
            <p className={styles.copy}>
              Months posting ads, sifting CVs, gambling on culture fit. We keep
              a vetted bench of operators we already know.
            </p>
          </div>
          <div className={`reveal d2 ${styles.right}`}>
            <p className={styles.copyLg}>
              Ready to go this week. Senior UA and creative talent for apps and
              games —{" "}
              <strong>
                at a flat monthly fee that doesn&apos;t scale with their pay.
              </strong>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
