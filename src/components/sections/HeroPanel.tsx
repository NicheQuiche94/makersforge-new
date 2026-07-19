import { Button } from "@/components/atoms/Button";
import { Logo } from "@/components/atoms/Logo";
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

        <div className={styles.main}>
          <h1 className={styles.headline}>
            <span className={styles.headlineLine}>The home for</span>
            <span className={styles.headlineLine}>growth teams in</span>
            <span className={styles.headlineLine}>games and apps.</span>
          </h1>

          <p className={styles.heroLede}>
            Representation for the talent, recruitment for the studios, and a
            job board that&apos;s free for both.
          </p>

          <div className={styles.ctas}>
            <Button href="/apply" variant="light" arrow>
              Get represented
            </Button>
            <Button href="/enquire" variant="on-dark">
              Hire a team
            </Button>
          </div>
        </div>

        {/* Ghost MF hex bottom-right. Right edge aligns with the
            nav bar's right edge for balance per follow-up note. */}
        <Logo
          variant="mark"
          size={260}
          monochrome="rgba(255, 255, 255, 0.12)"
          className={styles.heroEmblem}
          title=""
        />
      </div>
    </section>
  );
}
