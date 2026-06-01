import type { Metadata } from "next";
import { Button } from "@/components/atoms/Button";
import { Logo } from "@/components/atoms/Logo";
import { CTABand } from "@/components/sections/CTABand";
import styles from "./talent.module.css";

/**
 * /talent — the page for the people on the lineup.
 *
 * v4 (Andre 2026-05-30 v4):
 *   - All em-dashes removed across copy.
 *   - Promise card hierarchy fixed: title biggest, number second,
 *     body third. Previously the big Cal Sans number dominated.
 *   - Body text universally bigger.
 *   - Five promises rewrites per detailed notes: 1 unchanged copy
 *     but em-dash purged, 2 reframed around "fit not salary
 *     percentage", 3/4 de-AI'd to sound like a person, 5 last
 *     line removed.
 *   - Lifecycle: dropped the 4-step card row, replaced with a
 *     3-step HORIZONTAL TIMELINE (cards connected by a gradient
 *     line), much shorter copy per card.
 *   - "A note from Andre" letter section removed — will be a
 *     video down the line.
 *   - Replaced with a bigger CTA band matching the home page
 *     CTA style + apply-the-lineup wording.
 */

export const metadata: Metadata = {
  title: "For talent · MakersForge",
  description:
    "Represented, not recruited. A talent agency for senior growth specialists in mobile apps and games.",
};

export default function TalentPage() {
  return (
    <>
      <TalentHero />
      <PromiseWall />
      <Lifecycle />
      <CTABand
        headline={
          <>
            Ready to be properly{" "}
            <em style={{ fontStyle: "italic", color: "#fff" }}>represented?</em>
          </>
        }
        body="One application. We read every one. If the lineup feels like the right fit, we'll be in touch within the week."
        cta={{ label: "Apply to the lineup", href: "/apply" }}
      />
    </>
  );
}

function TalentHero() {
  return (
    <section className={styles.heroSection}>
      <div className="container">
        <div className={styles.heroInner}>
          <span className={`kicker ${styles.heroKicker}`}>For talent</span>
          <h1 className={styles.heroH1}>
            Represented.
            <br />
            <span className="gr">Not recruited.</span>
          </h1>
          <p className={styles.heroSub}>
            A talent agency for senior growth folks in mobile apps and games.
            UA managers, marketing artists, motion designers, performance
            creative leads. Studios brief us or browse the lineup directly.
            We handle the rest.
          </p>
          <div className={styles.heroCtas}>
            <Button href="/apply" variant="primary" arrow>
              Apply to the lineup
            </Button>
            <Button href="#how" variant="ghost">
              How it works
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   PROMISE WALL — 5 commitments, 2 + 1 hero band + 2 layout.
   Hierarchy in each card (Andre 2026-05-30 v4): TITLE biggest,
   number second, body third.
   ============================================================ */
function PromiseWall() {
  return (
    <section className={styles.wallSection}>
      <div className="container">
        <div className={styles.wallHeader}>
          <p className="kicker">How the lineup works for you</p>
          <h2 className={styles.wallH2}>
            Five things you can{" "}
            <span className={styles.wallSofter}>
              actually count on.
            </span>
          </h2>
        </div>

        <div className={styles.wallGrid}>
          <PromiseCard
            num="01"
            title="Our fee comes from the studio"
            body="Studios pay us a flat monthly fee. That fee is independent of whatever day rate or salary you and the studio agree on. Your number is your number. Nothing comes off the top."
          />
          <PromiseCard
            num="02"
            title="We earn from fit, not from your salary"
            body="Traditional recruiters typically take a percentage of the salary they place you at, which means a higher salary makes them a bigger cut. We charge the studio a flat fee, so when we put you forward it's because the role and the brief are right for you, not because you'd earn us a bigger payout."
          />

          <article
            className={`reveal heat-glow ${styles.promiseCard} ${styles.promiseHero}`}
          >
            <p className={`${styles.promiseNum} ${styles.promiseNumOnDark}`}>
              03
            </p>
            <h3
              className={`${styles.promiseH} ${styles.promiseHOnDark}`}
            >
              Once on the lineup, that&apos;s your seat
            </h3>
            <p
              className={`${styles.promiseBody} ${styles.promiseBodyOnDark}`}
            >
              You&apos;re not signed up for a one-off referral. While your
              current engagement is running, we&apos;re already lining up the
              next round of conversations. So when something wraps you
              aren&apos;t scrambling on LinkedIn from scratch, and the lineup
              keeps moving for you in the background.
            </p>
            <Logo
              variant="mark"
              size={280}
              monochrome="rgba(255,255,255,0.09)"
              className={styles.promiseEmblem}
              title=""
            />
          </article>

          <PromiseCard
            num="04"
            title="Your work stays your work"
            body="Nothing you share with us gets used to train AI models. Your profile content, case studies and portfolio assets are not fed into anyone's training data, including our own systems and any partners we work with. If that ever changes, you'll hear about it from us before it does."
          />
          <PromiseCard
            num="05"
            title="We don't sneak changes through"
            body="If something on this list ever has to change, we'll tell you about it before it takes effect. Plain words, enough time to leave the lineup if you're not on board with the new version."
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
    <article
      className={`reveal card-shadow ${styles.promiseCard} ${styles.promiseCardPaper}`}
    >
      <p className={styles.promiseNum}>{num}</p>
      <h3 className={styles.promiseH}>{title}</h3>
      <p className={styles.promiseBody}>{body}</p>
    </article>
  );
}

/* ============================================================
   LIFECYCLE — 3-step horizontal timeline. Gradient connector
   line runs across the cards. Concise copy per Andre's note
   ("Too much info, not enough clarity"). Same treatment per
   card, no highlighted variant.
   ============================================================ */
function Lifecycle() {
  return (
    <section className={styles.lifeSection} id="how">
      <div className="container">
        <div className={styles.lifeHeader}>
          <p className="kicker">How it actually runs</p>
          <h2 className={styles.lifeH2}>
            Apply once.{" "}
            <span className={styles.wallSofter}>
              Stay on the lineup.
            </span>
          </h2>
        </div>

        <div className={styles.timeline}>
          <div className={styles.timelineLine} aria-hidden="true" />
          <LifeStep
            num="01"
            title="Apply"
            body="Fill out the form. We read it, get in touch and jump on a call to get to know you better."
          />
          <LifeStep
            num="02"
            title="Match"
            body="Studios brief us or browse the lineup directly. We make the intro when the fit feels right."
          />
          <LifeStep
            num="03"
            title="Stay"
            body="Engagement wraps, you stay on the lineup. We're already lining up the next conversation."
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
}: {
  num: string;
  title: string;
  body: string;
}) {
  return (
    <article className={`reveal card-shadow ${styles.lifeStep}`}>
      <span className={styles.lifeDot} aria-hidden="true" />
      <p className={styles.lifeNum}>{num}</p>
      <h3 className={styles.lifeStepH}>{title}</h3>
      <p className={styles.lifeStepBody}>{body}</p>
    </article>
  );
}
