import { Button } from "@/components/atoms/Button";
import styles from "./HeroPanel.module.css";

export function HeroPanel() {
  return (
    <section className={styles.wrap}>
      <div className="container">
        <div className={styles.panel}>
          <div className={styles.top}>
            <p className={styles.kick}>
              Growth team contractors · mobile apps &amp; games
            </p>
            <div className={styles.meta}>
              <span>est. 2026</span>
              <span className={styles.live}>
                <span className={styles.liveDot} aria-hidden="true" />
                32 available now
              </span>
            </div>
          </div>

          <h1 className={styles.headline}>
            <span className={styles.l1}>you brief it.</span>
            <span className={styles.l2}>
              <span className={styles.dim}>they</span>{" "}
              <span className={styles.solid}>build it.</span>
            </span>
          </h1>

          <div className={styles.foot}>
            <p className={styles.lede}>
              A live roster of senior UA managers and marketing artists for
              mobile apps and games.{" "}
              <strong>Pay them direct, pay us a flat monthly fee.</strong>{" "}
              No percentage games.
            </p>
            <div className={styles.actions}>
              <Button href="/roster" variant="light" arrow>
                see who&apos;s available
              </Button>
              <Button href="/#how" variant="on-dark">
                how it works
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
