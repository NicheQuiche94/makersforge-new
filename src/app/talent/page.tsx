import type { Metadata } from "next";
import { Button } from "@/components/atoms/Button";
import { Logo } from "@/components/atoms/Logo";
import { StatStrip } from "@/components/sections/StatStrip";
import { CTABand } from "@/components/sections/CTABand";
import styles from "./talent.module.css";

/**
 * /talent — the page for the people on the lineup.
 *
 * Framing per Andre's punch list (2026-05-30):
 *   - We are a TALENT AGENCY, not a recruitment business.
 *   - We never take a cut of talent's salary or pay.
 *   - We represent talent INDEFINITELY — contract ends, we find the
 *     next one. Always.
 *   - We do the work of canvassing companies and bringing matches.
 *
 * This is the placeholder page. Copy will be properly rewritten in
 * a dedicated copywriting pass; the structure here captures the
 * narrative arc Andre described (years spent → recruiters take a
 * cut → we represent you, forever) so the layout has something
 * load-bearing to react to.
 *
 * Layout matches the homepage rhythm: hero, stat strip, statement,
 * how-it-works bento, CTA band. Section-level alignment varies
 * (hero left → statement centred → bento mixed → CTA centred) per
 * [[feedback-section-placement-variation]].
 */

export const metadata: Metadata = {
  title: "For talent — MakersForge",
  description:
    "Represented, not recruited. We never take a cut of your salary, and we stay with you indefinitely. The talent agency for senior growth operators in mobile apps and games.",
};

// All-gradient stat values per Andre 2026-05-30. Talent-side
// framing emphasises the zero-cut and the indefinite representation.
const TALENT_STATS = [
  {
    n: <span className="gr">0%</span>,
    label: "of your salary, ever",
  },
  {
    n: <span className="gr">&infin;</span>,
    label: "indefinite representation",
  },
  {
    n: <span className="gr">2</span>,
    label: "disciplines live",
  },
  {
    n: <span className="gr">50+</span>,
    label: "specialists on the lineup",
  },
];

export default function TalentPage() {
  return (
    <>
      <TalentHero />
      <StatStrip cells={TALENT_STATS} />
      <TalentStatement />
      <TalentHowItWorks />
      <CTABand
        headline={
          <>
            apply to the{" "}
            <span className={styles.ctaItalic}>lineup.</span>
          </>
        }
        body="Senior UA managers and marketing artists in mobile apps and games. Tell us who you are, what you've shipped, where you're based. We'll be in touch when it fits."
        cta={{ label: "apply to the lineup", href: "/apply" }}
      />
    </>
  );
}

/* ============================================================
   Hero — left-anchored, mirrors PricingHero compositional pattern
   so all page heroes feel consistent. Two-colour headline (ink +
   gradient) per the simplification rule applied to PricingHero.
   ============================================================ */
function TalentHero() {
  return (
    <section className={styles.heroSection}>
      <div className="container">
        <div className={styles.heroInner}>
          <span className={`kicker ${styles.heroKicker}`}>For talent</span>
          <h1 className={styles.heroH1}>
            represented.
            <br />
            <span className="gr">not recruited.</span>
          </h1>
          <p className={styles.heroSub}>
            We&apos;re a talent agency for senior growth operators in mobile
            apps and games. We never take a cut of your pay. Once
            you&apos;re on the lineup, you stay on it.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   Statement — centred headline + 3-statement arc (setup left,
   tension right, resolution centre). Mirrors the homepage
   Statement K composition.
   ============================================================ */
function TalentStatement() {
  return (
    <section className={styles.stmtSection}>
      <div className="container">
        <div className={styles.stmtColumn}>
          <h2 className={`reveal ${styles.stmtH2}`}>
            you do{" "}
            <span className={styles.stmtGradient}>the work</span>.
            <br />
            <span className={styles.stmtItalic}>
              we make the calls
            </span>
            .
          </h2>

          <div className={styles.stmtBody}>
            <p className={`reveal d1 ${styles.stmtLine}`}>
              you spent years getting good at this.
              <br />
              the wins are real. the reputation is yours.
            </p>
            <p
              className={`reveal d2 ${styles.stmtLine} ${styles.stmtRight}`}
            >
              then a recruiter takes 25% the moment you sign.
            </p>
            <p
              className={`reveal d3 ${styles.stmtLine} ${styles.stmtCenter}`}
            >
              we never touch your salary.
              <br />
              one contract or ten, the cut is zero.
              <br />
              once on the lineup, you stay on the lineup.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   How it works for talent — 3-tile bento mirroring the homepage
   HowItWorksBento L2 layout (small + big top row, full-width
   bottom with right bleed). Different copy, same structural
   rhythm so the site reads as one product.
   ============================================================ */
function TalentHowItWorks() {
  return (
    <section className={styles.bentoSection} id="how">
      <div className="container">
        <div className={styles.bentoTop}>
          <div>
            <p className="kicker">how it works</p>
            <h2 className={styles.bentoH2}>
              join. match.{" "}
              <span className="gr">stay represented.</span>
            </h2>
          </div>
          <p className={styles.bentoTopCopy}>
            Three steps. No middleman skim. You stay represented for as
            long as you want us in your corner.
          </p>
        </div>

        <div className={styles.bentoGrid}>
          {/* Row 1: small paper + big heat */}
          <div className={styles.bentoRow}>
            <article
              className={`reveal ${styles.bentoTile} ${styles.bentoPaper}`}
            >
              <span className={styles.bentoNum} aria-hidden="true">
                01
              </span>
              <div className={styles.bentoContent}>
                <h3 className={styles.bentoTitle}>
                  join <span className="gr">the lineup</span>.
                </h3>
                <p className={styles.bentoBody}>
                  Send your profile. Wins, channels, ranges, what you
                  want next. We read every application; we&apos;re
                  selective about who joins so the lineup stays high
                  signal.
                </p>
              </div>
            </article>

            <article
              className={`reveal d1 heat-glow ${styles.bentoTile} ${styles.bentoHeat}`}
            >
              <span
                className={`${styles.bentoNum} ${styles.bentoNumOnDark}`}
                aria-hidden="true"
              >
                02
              </span>
              <div className={styles.bentoContent}>
                <h3
                  className={`${styles.bentoTitle} ${styles.bentoTitleOnDark}`}
                >
                  we work the inbound.
                </h3>
                <p
                  className={`${styles.bentoBody} ${styles.bentoBodyOnDark}`}
                >
                  Companies brief us. We pitch you forward when it
                  fits. Direct intros to the hiring team. We help
                  with the interview prep and rate negotiation.
                </p>
                <span className={styles.bentoPill}>
                  <span
                    className={styles.bentoPillDot}
                    aria-hidden="true"
                  />
                  no cut of your pay
                </span>
              </div>
            </article>
          </div>

          {/* Row 2: charcoal full-width with right bleed */}
          <article
            className={`reveal d1 ${styles.bentoTile} ${styles.bentoCharcoal} ${styles.bentoBleed}`}
          >
            <span
              className={`${styles.bentoNum} ${styles.bentoNumOnDark}`}
              aria-hidden="true"
            >
              03
            </span>
            <div className={styles.bentoContent}>
              <h3
                className={`${styles.bentoTitle} ${styles.bentoTitleOnDark}`}
              >
                we stay represented.
              </h3>
              <p
                className={`${styles.bentoBody} ${styles.bentoBodyOnDark}`}
              >
                A seven-month contract ends. A six-month engagement
                wraps. You don&apos;t go back to job boards. We&apos;ve
                been talking to the next set of teams already. Once
                you&apos;re on the lineup, the relationship is
                permanent.
              </p>
            </div>
            {/* Ghosted MakersForge mark in the bottom-right of the
                bleed tile — same brand-signature treatment as the
                CTA band. */}
            <Logo
              variant="mark"
              size={300}
              monochrome="rgba(255,255,255,0.08)"
              className={styles.bentoEmblem}
              title=""
            />
          </article>
        </div>
      </div>
    </section>
  );
}
