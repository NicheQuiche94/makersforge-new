import styles from "./Statement.module.css";

export function Statement() {
  return (
    <section className={styles.section}>
      <div className="container">
        {/* Poster-style asymmetric headline. Same stagger as before but
            smaller scales so the hero stays the dominant moment. No
            colored accents — italic alone carries emphasis. */}
        <h2 className={styles.headline}>
          <span className={`${styles.line} ${styles.line1}`}>hiring</span>
          <span className={`${styles.line} ${styles.line2}`}>
            <em>shouldn&apos;t.</em>
          </span>
          <span className={`${styles.line} ${styles.line3}`}>
            slow <span className="gr">growth.</span>
          </span>
        </h2>

        {/* Chapters — problem / answer as a 2-act narrative. Each
            chapter has a number, a Cal Sans display-small label, and
            body copy below a hairline. Motion can later choreograph
            the reveal of each block independently. */}
        <div className={styles.chapters}>
          <article className={`reveal ${styles.chapter}`}>
            <header className={styles.chapterHead}>
              <span className={styles.chapterNum}>01 /</span>
              <h3 className={styles.chapterLabel}>
                the problem <em>we solve.</em>
              </h3>
            </header>
            <p className={styles.body}>
              <strong>Months posting ads</strong>, sifting CVs, gambling on
              culture fit. We keep a{" "}
              <strong>vetted bench of operators</strong> we already know — so
              the shortlist is real people, not a search dragnet.
            </p>
          </article>

          <article className={`reveal d1 ${styles.chapter}`}>
            <header className={styles.chapterHead}>
              <span className={styles.chapterNum}>02 /</span>
              <h3 className={styles.chapterLabel}>
                the <em>answer.</em>
              </h3>
            </header>
            <p className={styles.body}>
              <strong>Ready to go this week.</strong> Senior UA and creative
              talent for apps and games —{" "}
              <strong>at a flat monthly fee</strong> that doesn&apos;t scale
              with their pay.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}
