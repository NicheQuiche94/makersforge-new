import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Button } from "@/components/atoms/Button";
import { CTABand } from "@/components/sections/CTABand";
import { CornerGlow } from "@/components/sections/CornerGlow";
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
    "Represented, not recruited. A talent agency for vetted growth specialists in mobile apps and games.",
};

export default function TalentPage() {
  return (
    <>
      <TalentHero />
      <Lifecycle />
      <StudiosPayBanner />
      <PromiseWall />
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

/* ============================================================
   VALUE BANNER — full-width heat-glow card between Lifecycle and
   PromiseWall. Reframed 2026-07-19 (Andre): was the "studios pay
   our fee, you keep your full rate" money statement, which read as
   defensive and doubled up with a promise card. Now leads with the
   real value: hosted + proactively pitched, so interviews come to
   them. Function name kept to avoid churn.
   ============================================================ */
function StudiosPayBanner() {
  return (
    <section className={styles.payBannerSection}>
      <div className="container">
        <article
          className={`reveal heat-glow card-shadow ${styles.payBanner}`}
        >
          <h2 className={styles.payBannerH}>
            The right interviews{" "}
            <em className={styles.payBannerEm}>come to you.</em>
          </h2>
          <p className={styles.payBannerBody}>
            You&apos;re hosted where studios hire, and we take you to the ones
            you fit. Conversations land in your inbox instead of you chasing
            applications, and we run each one from first intro to signed.
          </p>
        </article>
      </div>
    </section>
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
            A talent agency for vetted growth people in mobile apps and games.
            UA managers, ASO managers, marketing artists, motion designers and
            creative producers. We host you in front of hiring studios and run
            the whole process, from first intro to signed.
          </p>
          <div className={styles.heroCtas}>
            <Button href="/apply" variant="primary" arrow>
              Apply to the lineup
            </Button>
            <Button href="#how" variant="ghost">
              How it works
            </Button>
            <Button href="/jobs" variant="ghost">
              Open the job board
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
      <CornerGlow variant="trSoft" />
      <div className={`container ${styles.contentAbove}`}>
        <header className={styles.wallHeader}>
          <p className="kicker">How the lineup works for you</p>
          <h2 className={styles.wallH2}>Four things you can count on.</h2>
          <p className={styles.wallSubhead}>
            Here&apos;s what you&apos;re signing up for the moment you&apos;re on
            the lineup.
          </p>
        </header>

        {/* Reduced from 5 → 4 cards per cofounder pass T2. The dropped
            card ("Our fee comes from the studio") is now the dark
            bento banner above this section, where it can stand alone
            as the load-bearing promise. */}
        <div className={styles.wallGrid}>
          <PrincipleCard
            icon={<MatchIcon />}
            title="We run your interview process"
            body="From the first intro to a signed contract, we manage the process for you. Feedback comes back straight and fast, and nothing drags on for months. You always know where you stand."
          />
          <PrincipleCard
            icon={<FitIcon />}
            title="You contract directly with the studio"
            body="You and the studio agree your terms one to one. We handle everything around the deal and keep it moving, so you're never left waiting on a reply."
          />
          <PrincipleCard
            icon={<SeatIcon />}
            title="Once on the lineup, that's your seat"
            body="One engagement wraps and you stay on the lineup. We're already lining up the next round of conversations, so it never resets to zero."
          />
          <PrincipleCard
            icon={<ShieldIcon />}
            title="Your work stays your work"
            body="Nothing you share gets fed into AI training, ours or anyone else's. Your profile content, case studies and portfolio assets stay yours."
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
      <CornerGlow variant="tlSoft" />
      <div className={`container ${styles.contentAbove}`}>
        <header className={styles.lifeHeader}>
          <p className="kicker">How it actually runs</p>
          <h2 className={styles.lifeH2}>Apply once. Stay on the lineup.</h2>
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

/* Icons — simple monochrome SVGs. White on the heat-gradient hex.
   FeeIcon kept available even though the 01 card it accompanied is
   now a dark banner; harmless dead export, cheap to keep. */

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
