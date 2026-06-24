import { Button } from "@/components/atoms/Button";
import styles from "./ForTalentBanner.module.css";

/**
 * ForTalentBanner — small home-page section pointing UA managers
 * and marketing artists at /talent.
 *
 * v2 (cofounder pass F1): the previous "On the other side of the
 * lineup?" framing read ambiguously — could still be heard as an
 * employer-side line. Rewritten as a direct second-person question
 * to specialists. Dropped the secondary Apply CTA — the /talent
 * page itself owns that ask, this banner just needs to send the
 * right people there.
 */
export function ForTalentBanner() {
  return (
    <section className={styles.section}>
      <div className="container">
        <div className={`reveal card-shadow ${styles.banner}`}>
          <div className={styles.content}>
            <p className="kicker">For specialists</p>
            <h2 className={styles.h2}>
              Are you a{" "}
              <span className="gr">growth specialist</span> looking for your
              next engagement?
            </h2>
            <p className={styles.body}>
              UA managers, ASO managers, marketing artists, motion designers,
              creative producers. We represent strong operators indefinitely
              and put you in front of the studios who brief us.
            </p>
          </div>
          <div className={styles.ctas}>
            <Button href="/talent" variant="primary" arrow>
              Find out more
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
