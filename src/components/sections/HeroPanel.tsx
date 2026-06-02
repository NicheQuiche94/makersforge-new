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
    <section className={`heat-glow ${styles.hero}`} data-nav-gradient>
      <div className={styles.inner}>
        <div className={styles.top}>
          <div className={styles.masthead}>
            <span>Est. 2024</span>
            <span>a SeedCraft venture</span>
          </div>
        </div>

        <div className={styles.middle}>
          <h1 className={styles.headline}>
            <span className={styles.headlineLine}>Growth specialists.</span>
            <span className={styles.headlineLine}>On call.</span>
          </h1>
        </div>

        <div className={styles.bottom}>
          <p className={styles.heroLede}>
            Live lineup of UA and Marketing Art specialists. Mobile games and
            apps. Europe, Middle East, and Africa.
          </p>

          <div className={styles.ctas}>
            <Button href="/roster" variant="light" arrow>
              See the lineup
            </Button>
            <Button href="/#how" variant="on-dark">
              How it works
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
