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
            A talent agency for senior growth folks in mobile apps and games.
            UA managers, marketing artists, motion designers, performance
            creative leads. Studios brief us or browse the lineup directly.
            We handle the rest.
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
          <span className="kicker">how the lineup works for you</span>
          <h2 className={styles.wallH2}>
            five things you can{" "}
            <span className="gr">actually count on.</span>
          </h2>
          <p className={styles.wallSub}>
            Promises wear thin fast in this industry, so we&apos;ve kept it to
            the five that genuinely change the deal. They hold whether your
            last engagement was last week or last year.
          </p>
        </div>

        <div className={styles.wallGrid}>
          {/* Top row — two paper promises */}
          <PromiseCard
            num="01"
            title="our fee comes from the studio"
            body="We charge the studio a flat monthly fee. That fee is independent of whatever day rate or salary you and the studio agree on. Your number is your number — nothing comes off the top."
          />
          <PromiseCard
            num="02"
            title="no pay-to-play on the lineup"
            body="Nobody pays us to surface higher when a brief comes in. We put forward who actually fits the role, not who threw the most money at being seen first."
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
                once on the lineup,{" "}
                <em className={styles.promiseEm}>that&apos;s your seat</em>.
              </h3>
              <p
                className={`${styles.promiseBody} ${styles.promiseBodyOnDark}`}
              >
                Contract wraps. Six-month engagement ends. You don&apos;t
                go back to LinkedIn and start over. We&apos;re already
                talking to the next round of teams while the current
                engagement is running. The lineup is a permanent seat, not
                a one-shot referral.
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
            title="your work isn't training data"
            body="Your profile, your case studies, your portfolio. None of it gets fed into a model. Not ours, not a partner's, not later down the line when someone offers us a number."
          />
          <PromiseCard
            num="05"
            title="we don't sneak changes through"
            body="If one of these ever has to change, you'll hear it from us first, in clear words, with time to leave the lineup if you don't agree. Quietly walking back a promise isn't on the table."
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
          <span className="kicker">how it actually runs</span>
          <h2 className={styles.lifeH2}>
            apply once.{" "}
            <span className="gr">stay on the lineup.</span>
          </h2>
          <p className={styles.lifeSub}>
            Same loop, every time. You&apos;re not signing up for a one-off
            referral — you&apos;re joining a roster that&apos;s live on the
            site, with two ways a studio can find you.
          </p>
        </div>

        <div className={styles.lifeFlow}>
          <LifeStep
            num="01"
            title="apply to the lineup"
            body="Send your profile. Wins, channels, ranges, what you'd actually want to be doing next. We read everything that comes in. Selective intake — the lineup only works for studios if the people on it are real seniors."
          />
          <LifeStep
            num="02"
            title="studios come in two ways"
            body="Some brief us directly: 'we need a senior UA manager for a match-3 launch in Q3.' Some come to the site, read the lineup, and ask to talk to a specific person. Both happen. We handle the intros either way, and we'll suggest similar profiles when it makes sense."
            highlight
          />
          <LifeStep
            num="03"
            title="you contract direct"
            body="The contract is between you and the studio. They pay you. We invoice them our flat monthly fee. We handle scheduling, the rate conversation if you want help, and the bits between the call and the start date."
          />
          <LifeStep
            num="04"
            title="engagement wraps, we keep going"
            body="Contract finishes. You don't drop off the lineup. We're already working the next conversations. Could be next week, could be a few months. Either way, you're still represented. Loop back to 02."
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
            a note from andre
          </span>
          <p className={styles.letterSalutation}>hey,</p>
          <p className={styles.letterP}>
            Quick note on what MakersForge actually is, because
            I&apos;d rather be straight than oversell it. It&apos;s a
            talent agency. I represent senior growth folks — UA
            managers, marketing artists, motion designers, performance
            creative leads — for mobile apps and games studios.
          </p>
          <p className={styles.letterP}>
            The way it works on the studio side: they brief me on what
            they need, or they come to the site, read the lineup, and
            ask to talk to a specific person. Both happen. I do the
            intros, the scheduling, the rate conversation if you want
            me in it, and I&apos;ll usually suggest a couple of similar
            profiles in case the first one isn&apos;t the fit.
          </p>
          <p className={styles.letterP}>
            What I charge the studio is a flat monthly fee that&apos;s
            independent of what you and the studio agree on. Whatever
            you negotiate is yours. And once you&apos;re on the lineup,
            you stay on it. Engagement wraps and you don&apos;t go back
            to scrolling LinkedIn — I&apos;m working the next round of
            conversations while the current one runs.
          </p>
          <p className={styles.letterP}>
            I&apos;ll be honest: I&apos;m not promising you a job a
            month. The BD work is on me — I&apos;ll be putting
            MakersForge in front of the right studios through content,
            outreach, and the usual hustle. Some months will be busier
            than others. What I can promise is that you&apos;ll be
            represented properly and studios who want to find you will
            be able to.
          </p>
          <p className={styles.letterP}>
            If that sounds like the kind of thing you&apos;re up for,
            apply below.
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
