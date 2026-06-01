import { Button } from "@/components/atoms/Button";
import styles from "./ForTalentBanner.module.css";

/**
 * ForTalentBanner — small home-page section pointing UA managers
 * and marketing artists at /talent.
 *
 * Added per Andre 2026-05-30 v4: the previous "join the lineup"
 * button on the carousel was getting lost. This banner is the
 * deliberate, hard-to-miss entry point on the home page for the
 * other side of the marketplace (talent rather than studios).
 *
 * Sized smaller than the main CTABand below it so the page rhythm
 * doesn't end with two full-bleed gradient panels back-to-back.
 */
export function ForTalentBanner() {
  return (
    <section className={styles.section}>
      <div className="container">
        <div className={`reveal card-shadow ${styles.banner}`}>
          <div className={styles.content}>
            <p className="kicker">For specialists</p>
            <h2 className={styles.h2}>
              On the <span className="gr">other side</span> of the lineup?
            </h2>
            <p className={styles.body}>
              UA, marketing art, motion. Senior people we represent indefinitely
              and put in front of the studios who brief us.
            </p>
          </div>
          <div className={styles.ctas}>
            <Button href="/talent" variant="primary" arrow>
              Find out more
            </Button>
            <Button href="/apply" variant="ghost">
              Apply to the lineup
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
