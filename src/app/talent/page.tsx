import type { Metadata } from "next";
import { Button } from "@/components/atoms/Button";
import { Logo } from "@/components/atoms/Logo";
import styles from "./talent.module.css";

/**
 * /talent — the page for the people on the lineup.
 *
 * Rebuilt per Andre 2026-05-30 v3: the previous version reused the
 * home page's exact rhythm (hero → stat strip → statement → bento
 * → CTA) which felt like a copy. This version takes its own shape:
 *
 *   1. Hero (kept — distinct from home's full-bleed gradient hero)
 *   2. The promise wall — five commitments laid as a structured
 *      grid with the heat-glow framing the moment talent is asked
 *      to care about most (no salary cut + indefinite rep).
 *   3. The lifecycle — a horizontal flow showing what "indefinite
 *      representation" actually means in practice (join, match,
 *      engage, re-match — and back to match, forever).
 *   4. A letter to the lineup — closing pitch in conversational
 *      voice, signed off, sets up the apply CTA.
 *   5. CTABand wired to /apply.
 *
 * Layout/treatment differs from the home page: no stat strip, no
 * "don't let hiring slow you down" tension headline, no bento. The
 * page reads as an agency manifesto rather than a product pitch.
 */

export const metadata: Metadata = {
  title: "For talent · MakersForge",
  description:
    "Represented, not recruited. We never take a cut of your salary, and we stay with you indefinitely. The talent agency for senior growth specialists in mobile apps and games.",
};

export default function TalentPage() {
  return (
    <>
      <TalentHero />
      <PromiseWall />
      <Lifecycle />
      <Letter />
    </>
  );
}

/* ============================================================
   HERO — same compositional pattern as PricingHero / ApplyHero
   for cross-page consistency, but talent-specific copy.
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
            We&apos;re a talent agency for senior growth specialists in
            mobile apps and games. We never take a cut of your pay.
            Once you&apos;re on the lineup, you stay on it.
          </p>
          <div className={styles.heroCtas}>
            <Button href="/apply" variant="primary" arrow>
              apply to the lineup
            </Button>
            <Button href="#how" variant="ghost">
              how it works
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   PROMISE WALL — five non-negotiable commitments. The middle row
   is the load-bearing one (heat-glow background, big payoff
   headline) flanked by quieter paper cards above and below.
   ============================================================ */
function PromiseWall() {
  return (
    <section className={styles.wallSection}>
      <div className="container">
        <div className={styles.wallHeader}>
          <span className="kicker">The lineup contract</span>
          <h2 className={styles.wallH2}>
            five promises.{" "}
            <span className="gr">non-negotiable.</span>
          </h2>
          <p className={styles.wallSub}>
            What you sign up to when you join the lineup. These hold
            whether your last engagement was last week or last year.
          </p>
        </div>

        <div className={styles.wallGrid}>
          {/* Top row — two paper promises */}
          <PromiseCard
            num="01"
            title="no commission on your pay"
            body="Studios pay us a flat monthly fee. We never take a cut of what you earn. Day rate, salary, equity. None of it touches our invoice."
          />
          <PromiseCard
            num="02"
            title="no paid ranking"
            body="No specialist can pay to surface higher in the lineup. Matching is based on the brief and the fit, not what anyone paid."
          />

          {/* Middle row — heat-glow load-bearing promise */}
          <article
            className={`reveal heat-glow ${styles.promiseCard} ${styles.promiseHero}`}
          >
            <span className={`${styles.promiseNum} ${styles.promiseNumOnDark}`}>
              03
            </span>
            <div className={styles.promiseContent}>
              <h3
                className={`${styles.promiseH} ${styles.promiseHOnDark}`}
              >
                indefinite{" "}
                <em className={styles.promiseEm}>representation</em>.
              </h3>
              <p
                className={`${styles.promiseBody} ${styles.promiseBodyOnDark}`}
              >
                A contract ends. A six-month engagement wraps. You
                don&apos;t go back to job boards. We&apos;ve already
                been talking to the next set of teams. Once
                you&apos;re on the lineup, the relationship is
                permanent.
              </p>
            </div>
            <Logo
              variant="mark"
              size={280}
              monochrome="rgba(255,255,255,0.09)"
              className={styles.promiseEmblem}
              title=""
            />
          </article>

          {/* Bottom row — two paper promises */}
          <PromiseCard
            num="04"
            title="no AI training on your work"
            body="Your profile content, your case studies, your portfolio. We never use any of it to train AI models. Ours or anyone else's."
          />
          <PromiseCard
            num="05"
            title="no silent changes"
            body="If any of the above ever needs to change, we tell you first, clearly, with time to leave if you disagree. Quietly rolling back a promise isn't an option."
          />
        </div>
      </div>
    </section>
  );
}

function PromiseCard({
  num,
  title,
  body,
}: {
  num: string;
  title: string;
  body: string;
}) {
  return (
    <article className={`reveal ${styles.promiseCard} ${styles.promiseCardPaper}`}>
      <span className={styles.promiseNum}>{num}</span>
      <div className={styles.promiseContent}>
        <h3 className={styles.promiseH}>{title}</h3>
        <p className={styles.promiseBody}>{body}</p>
      </div>
    </article>
  );
}

/* ============================================================
   LIFECYCLE — the indefinite-representation loop. Four steps
   laid in a horizontal flow that visually closes back to step 2
   so the "back to match" beat reads as endless.
   ============================================================ */
function Lifecycle() {
  return (
    <section className={styles.lifeSection} id="how">
      <div className="container">
        <div className={styles.lifeHeader}>
          <span className="kicker">how it works</span>
          <h2 className={styles.lifeH2}>
            join once.{" "}
            <span className="gr">represented forever.</span>
          </h2>
          <p className={styles.lifeSub}>
            The cycle that runs as long as you want it to. No
            re-application after every contract. No going back to job
            boards.
          </p>
        </div>

        <div className={styles.lifeFlow}>
          <LifeStep
            num="01"
            title="join the lineup"
            body="Send your profile. Wins, channels, ranges, what you want next. We read every application; we're selective about who joins so the lineup stays high signal."
          />
          <LifeStep
            num="02"
            title="we work the inbound"
            body="Studios brief us. We pitch you forward when the fit is real. Direct intros to the hiring team. We help with interview prep and rate negotiation."
            highlight
          />
          <LifeStep
            num="03"
            title="you sign, you ship"
            body="Contract direct with the studio. They pay you. We invoice them our flat monthly fee. You get on with the work."
          />
          <LifeStep
            num="04"
            title="we stay on it"
            body="Engagement wraps. We're already talking to the next set of teams. Six-month gap or six-week gap, the lineup keeps moving for you. Loop back to 02."
            loopArrow
          />
        </div>
      </div>
    </section>
  );
}

function LifeStep({
  num,
  title,
  body,
  highlight,
  loopArrow,
}: {
  num: string;
  title: string;
  body: string;
  highlight?: boolean;
  loopArrow?: boolean;
}) {
  return (
    <article
      className={`reveal ${styles.lifeStep} ${
        highlight ? styles.lifeStepHighlight : ""
      }`}
    >
      <div className={styles.lifeStepHead}>
        <span className={styles.lifeNum}>{num}</span>
        {loopArrow && (
          <span className={styles.lifeLoop} aria-hidden="true">
            ↻
          </span>
        )}
      </div>
      <h3 className={styles.lifeStepH}>{title}</h3>
      <p className={styles.lifeStepBody}>{body}</p>
    </article>
  );
}

/* ============================================================
   LETTER — closing pitch in conversational voice. Single column,
   wider measure than the body sections elsewhere, signs off as
   if from Andre directly.
   ============================================================ */
function Letter() {
  return (
    <section className={styles.letterSection}>
      <div className="container">
        <div className={styles.letterInner}>
          <span className={`kicker ${styles.letterKicker}`}>
            from the desk
          </span>
          <p className={styles.letterSalutation}>dear specialist,</p>
          <p className={styles.letterP}>
            The mobile growth world is full of people who pretend
            recruitment is a service to talent. It isn&apos;t. The
            standard model takes 20% to 30% of your salary, refers you
            once, and disappears. We built MakersForge for the
            opposite of that.
          </p>
          <p className={styles.letterP}>
            We represent you the way a music agent represents a
            songwriter. We do the work of finding the rooms. We bring
            the brief. We push back when the brief is bad. When the
            engagement is up, we&apos;re already working the next one.
            That&apos;s the job. We get paid by the studio for doing
            it well. You keep what you earn.
          </p>
          <p className={styles.letterP}>
            You don&apos;t need to be open to work to apply. Most of
            the lineup is in engagements right now. We line up the next
            one while the current one runs.
          </p>
          <p className={styles.letterSignoff}>
            <span className={styles.letterSignoffName}>Andre</span>
            <span className={styles.letterSignoffRole}>
              founder, MakersForge
            </span>
          </p>

          <div className={styles.letterCta}>
            <Button href="/apply" variant="primary" arrow>
              apply to the lineup
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
