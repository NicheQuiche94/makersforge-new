import { Button } from "@/components/atoms/Button";
import styles from "./HeroPanel.module.css";

/**
 * Homepage hero — Exp 02 v3 per Andre's call.
 *
 * Full-bleed heat-glow section (no rounded panel container). The
 * heat-glow utility provides the composite: heat-deep gradient base
 * + radial highlights + noise overlay. White typography throughout.
 *
 * Layout:
 *   - Top-left  : kicker with pulse dot
 *   - Top-right : small editorial masthead (est. 2026 / a SeedCraft venture)
 *   - Middle    : main headline "growth team contractors. / on call."
 *                 (both lines Cal Sans white, flush left, same size)
 *   - Bottom    : 4 uniform glass UI pills + dual CTAs
 */
export function HeroPanel() {
  return (
    <section className={`heat-glow ${styles.hero}`}>
      <div className={styles.inner}>
        <div className={styles.top}>
          <p className={styles.kicker}>
            <span className={styles.pulseDot} aria-hidden="true" />
            mobile apps &amp; games · EMEA
          </p>
          <div className={styles.masthead}>
            <span>est. 2026</span>
            <span>a SeedCraft venture</span>
          </div>
        </div>

        <div className={styles.middle}>
          <h1 className={styles.headline}>
            <span className={styles.headlineLine}>growth team contractors.</span>
            <span className={styles.headlineLine}>on call.</span>
          </h1>
        </div>

        <div className={styles.bottom}>
          <div className={styles.glassCards}>
            <div className={styles.glassCard}>
              <span className={styles.pulseDot} aria-hidden="true" />
              32 available now
            </div>
            <div className={styles.glassCard}>85% same-week shortlist</div>
            <div className={styles.glassCard}>EMEA · UK · 8 cities</div>
            <div className={styles.glassCard}>est. 2026 · SeedCraft</div>
          </div>

          <div className={styles.ctas}>
            <Button href="/roster" variant="light" arrow>
              see who&apos;s available
            </Button>
            <Button href="/#how" variant="on-dark">
              how it works
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
