import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Button } from "@/components/atoms/Button";
import { CTABand } from "@/components/sections/CTABand";
import styles from "./talent.module.css";

/**
 * /talent — the page for the people on the lineup.
 *
 * v5 (Andre 2026-05-30 v5):
 *   - Promise wall and lifecycle now use the SAME card pattern as
 *     the home page's Statement Principles section: paper card +
 *     heat-h gradient hex icon + Figtree title + body. The previous
 *     "big number eyebrow + title + body" layout was inconsistent
 *     with home and the "Once on the lineup" heat-glow band had a
 *     ghost logo that overlapped the body text.
 *   - Grey "softer" subhead colour retired here too.
 *   - Lifecycle horizontal-timeline-with-dots removed in favour of
 *     three PrincipleCards in a row (matches home).
 *   - CTABand at the bottom switched to compact (matches Pricing).
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
        compact
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
            Represented, <span className="gr">not recruited.</span>
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
   PROMISE WALL — five commitments using the same card pattern
   as home Statement Principles. Hex gradient icon + Figtree
   title + body. 3-up grid (auto-fits to 1-3 columns by width).
   ============================================================ */
function PromiseWall() {
  return (
    <section className={styles.wallSection}>
      <div className="container">
        <header className={styles.wallHeader}>
          <p className="kicker">How the lineup works for you</p>
          <h2 className={styles.wallH2}>
            <span className="gr">Five things you can actually count on.</span>
          </h2>
          <p className={styles.wallSubhead}>
            The lineup is a promise, not a marketing line. Here&apos;s what
            you sign up for the moment you&apos;re on it.
          </p>
        </header>

        <div className={styles.wallGrid}>
          <PrincipleCard
            icon={<FeeIcon />}
            title="Our fee comes from the studio"
            body="Studios pay us a flat monthly fee. That fee is independent of whatever day rate or salary you and the studio agree on. Your number is your number."
          />
          <PrincipleCard
            icon={<FitIcon />}
            title="We earn from fit, not from your salary"
            body="Traditional recruiters typically take a percentage of the salary they place you at, so a higher salary means a bigger cut for them. Our flat fee means we put you forward because the role is right, not because the payout is bigger."
          />
          <PrincipleCard
            icon={<SeatIcon />}
            title="Once on the lineup, that's your seat"
            body="You're not signed up for a one-off referral. While your current engagement is running, we're already lining up the next round of conversations. The lineup keeps moving for you."
          />
          <PrincipleCard
            icon={<ShieldIcon />}
            title="Your work stays your work"
            body="Nothing you share with us gets used to train AI models. Your profile content, case studies and portfolio assets are not fed into anyone's training data, including our own systems."
          />
          <PrincipleCard
            icon={<BellIcon />}
            title="We don't sneak changes through"
            body="If something on this list ever has to change, we'll tell you about it before it takes effect. Plain words, enough time to leave the lineup if you're not on board with the new version."
          />
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   LIFECYCLE — three steps using the same PrincipleCard pattern.
   No more horizontal timeline with dots (Andre 2026-05-30 v5:
   "didn't work, match the cards to home").
   ============================================================ */
function Lifecycle() {
  return (
    <section className={styles.lifeSection} id="how">
      <div className="container">
        <header className={styles.lifeHeader}>
          <p className="kicker">How it actually runs</p>
          <h2 className={styles.lifeH2}>
            <span className="gr">Apply once. Stay on the lineup.</span>
          </h2>
          <p className={styles.lifeSubhead}>
            Three steps and a relationship that doesn&apos;t expire after a
            single referral.
          </p>
        </header>

        <div className={styles.lifeGrid}>
          <PrincipleCard
            icon={<ApplyIcon />}
            title="Apply"
            body="Fill out the form. We read it, get in touch and jump on a call to get to know you better."
          />
          <PrincipleCard
            icon={<MatchIcon />}
            title="Match"
            body="Studios brief us or browse the lineup directly. We make the intro when the fit feels right."
          />
          <PrincipleCard
            icon={<StayIcon />}
            title="Stay"
            body="Engagement wraps, you stay on the lineup. We're already lining up the next conversation."
          />
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   Shared card primitive — mirrors the home Statement Principle
   card so cards across the site stay visually consistent.
   ============================================================ */
function PrincipleCard({
  icon,
  title,
  body,
}: {
  icon: ReactNode;
  title: string;
  body: string;
}) {
  return (
    <article className={`reveal card-shadow ${styles.card}`}>
      <div className={styles.iconWrap}>{icon}</div>
      <h3 className={styles.cardTitle}>{title}</h3>
      <p className={styles.cardBody}>{body}</p>
    </article>
  );
}

/* Icons — simple monochrome SVGs. White on the heat-gradient hex. */

function FeeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
      <path d="M14 8a3 3 0 1 0-3 3" strokeLinecap="round" />
      <path d="M8 12h8" strokeLinecap="round" />
      <path d="M8 16h6" strokeLinecap="round" />
      <path d="M11 11v9" strokeLinecap="round" />
    </svg>
  );
}

function FitIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
      <path d="M12 4v16" strokeLinecap="round" />
      <path d="M6 7h12" strokeLinecap="round" />
      <path d="M3 14l3-7 3 7" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M15 14l3-7 3 7" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3 14a3 3 0 0 0 6 0" strokeLinecap="round" />
      <path d="M15 14a3 3 0 0 0 6 0" strokeLinecap="round" />
    </svg>
  );
}

function SeatIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
      <circle cx="12" cy="6" r="2.5" />
      <path d="M12 8.5v9" strokeLinecap="round" />
      <path d="M6 14h12" strokeLinecap="round" />
      <path d="M6 14a6 6 0 0 0 12 0" strokeLinecap="round" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
      <path
        d="M12 3l8 3v6c0 4.4-3.1 8-8 9-4.9-1-8-4.6-8-9V6l8-3z"
        strokeLinejoin="round"
      />
      <path
        d="M9 12l2 2 4-4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
      <path
        d="M5 17h14l-2-3v-4a5 5 0 0 0-10 0v4l-2 3z"
        strokeLinejoin="round"
      />
      <path d="M10 20a2 2 0 0 0 4 0" strokeLinecap="round" />
    </svg>
  );
}

function ApplyIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
      <path
        d="M6 3h9l4 4v13a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z"
        strokeLinejoin="round"
      />
      <path d="M15 3v4h4" strokeLinejoin="round" />
      <path d="M9 12h7M9 16h7" strokeLinecap="round" />
    </svg>
  );
}

function MatchIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
      <path
        d="M10 5l-5 5a3 3 0 0 0 0 4l5 5a3 3 0 0 0 4 0l5-5a3 3 0 0 0 0-4l-5-5a3 3 0 0 0-4 0z"
        strokeLinejoin="round"
      />
      <path
        d="M9 12l2 2 4-4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function StayIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
      <path
        d="M4 12a8 8 0 0 1 14-5l2-2v6h-6l2-2A6 6 0 1 0 18 12"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
