import styles from "./HowItWorksBento.module.css";

export function HowItWorksBento() {
  return (
    <section className={styles.section} id="how">
      <div className="container">
        <div className={styles.top}>
          <div>
            <p className="kicker">how it works</p>
            <h2 className={styles.headline}>
              brief monday. working <span className="gr">by friday.</span>
            </h2>
          </div>
          <p className={styles.topCopy}>
            Three steps, no recruitment theatre. You&apos;re talking to
            operators we already know within a day.
          </p>
        </div>

        <div className={styles.grid}>
          {/* Tile 1 — paper */}
          <article className={`reveal ${styles.tile} ${styles.tile1}`}>
            <div>
              <p className={styles.step}>01</p>
              <h3 className={styles.h3}>
                tell us <span className="gr">the gap</span>
              </h3>
              <p className={styles.body}>
                UA lead for a launch, performance creative for a refresh, a
                fractional head of growth. Tell us the shape and the timeline.
                We push back where it helps.
              </p>
            </div>
          </article>

          {/* Tile 2 — heat-deep gradient */}
          <article className={`reveal d1 ${styles.tile} ${styles.tile2}`}>
            <div>
              <p className={styles.step}>02</p>
              <h3 className={`${styles.h3} ${styles.h3OnDark}`}>we match.</h3>
              <p className={`${styles.body} ${styles.bodyOnDark}`}>
                From a vetted roster of senior operators we actually know — not
                a job-board dragnet. You see a shortlist of real people, with
                real availability, fast.
              </p>
            </div>
            <span className={styles.pillGrad}>
              <span className={styles.pillDot} aria-hidden="true" />
              shortlist in 48h
            </span>
          </article>

          {/* Tile 3 — charcoal (NOT pure ink) */}
          <article className={`reveal d2 ${styles.tile} ${styles.tile3}`}>
            <div>
              <p className={styles.step}>03</p>
              <h3 className={`${styles.h3} ${styles.h3OnDark}`}>they get to work.</h3>
              <p className={`${styles.body} ${styles.bodyOnDark}`}>
                You contract and pay them directly. You pay us a flat monthly
                fee for each month they&apos;re engaged. Scale up, scale down,
                stop any time.
              </p>
            </div>
          </article>

          {/* Tile 4 — bg-card */}
          <article className={`reveal d3 ${styles.tile} ${styles.tile4}`}>
            <div>
              <p className={styles.step}>·</p>
              <h3 className={styles.h3}>
                the <span className="gr">terms</span>
              </h3>
              <p className={styles.body}>
                Flat monthly fee. No percentage of their pay. No percentage of
                placement salary. Terms signed up front. Replacement matching
                included.
              </p>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
