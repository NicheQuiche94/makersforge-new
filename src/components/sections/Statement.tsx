import { ArrowDoodle } from "@/components/atoms/ArrowDoodle";
import styles from "./Statement.module.css";

export function Statement() {
  return (
    <section className={styles.section}>
      <div className="container">
        <div className={`heat-glow ${styles.panel}`}>
          {/* Poster-style asymmetric headline. Mixed scales, mixed weight,
              italic-gradient emphasis. Arrow doodle as a marker pointing
              at "we won't." — the brand promise. */}
          <h2 className={styles.headline}>
            <span className={`${styles.line} ${styles.line1}`}>hiring</span>
            <span className={`${styles.line} ${styles.line2}`}>
              <em className="italic-gr-bright">shouldn&apos;t.</em>
            </span>
            <span className={`${styles.line} ${styles.line3}`}>slow growth.</span>
            <span className={`${styles.line} ${styles.line4}`}>
              <span className={styles.doodle} aria-hidden="true">
                <ArrowDoodle bright size={70} />
              </span>
              <em className="italic-gr-bright">we won&apos;t.</em>
            </span>
          </h2>

          <div className={styles.prose}>
            <div className={`reveal d1 ${styles.col}`}>
              <p className={`display-tiny ${styles.kicker}`}>
                the problem <span className="italic-gr-bright">we solve.</span>
              </p>
              <p className={styles.body}>
                Months posting ads, sifting CVs, gambling on culture fit. We
                keep a vetted bench of operators we already know.
              </p>
            </div>
            <div className={`reveal d2 ${styles.col}`}>
              <p className={`display-tiny ${styles.kicker}`}>
                the <span className="italic-gr-bright">answer.</span>
              </p>
              <p className={styles.body}>
                Ready to go this week. Senior UA and creative talent for apps
                and games —{" "}
                <strong>
                  at a flat monthly fee that doesn&apos;t scale with their pay.
                </strong>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
