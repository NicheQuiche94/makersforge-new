import { Button } from "@/components/atoms/Button";
import styles from "./HeroHome.module.css";

export function HeroHome() {
  return (
    <header className={styles.hero} id="top">
      <div className="container">
        <div className={styles.inner}>
          <p className={`kicker kicker-mute ${styles.kicker}`}>
            Growth team contractors · mobile apps &amp; games
          </p>

          <h1 className={`display-hero ${styles.headline}`}>
            <span className={styles.l1}>you brief it.</span>
            <br />
            <span className={styles.l2}>
              they <span className="gr">build it.</span>
            </span>
          </h1>

          <div className={styles.foot}>
            <div className={styles.box}>
              <p className={`body-text-lg ${styles.sub}`}>
                A live roster of senior UA managers and marketing artists for
                mobile apps and games.{" "}
                <strong>
                  Pay them direct, pay us a flat monthly fee.
                </strong>{" "}
                No percentage games.
              </p>
              <div className={styles.actions}>
                <Button href="/roster" variant="fill" arrow>
                  see who&apos;s available
                </Button>
                <Button href="#how" variant="outline">
                  how it works
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
