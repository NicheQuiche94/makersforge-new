import Link from "next/link";
import styles from "./ProofSections.module.css";
import { CornerGlow } from "./CornerGlow";

/**
 * Proof for the 500→5 service (2026-10-27): the Lessmore case study, the
 * MakersForge Talent Directory (the bench behind the promise) and client
 * testimonials (Lessmore figures + quotes from Andre, 2026-10-27).
 */

export function CaseStudy() {
  return (
    <section className={styles.section} id="proof">
      <CornerGlow variant="trSoft" />
      <div className={`container ${styles.contentAbove}`}>
        <header className={styles.header}>
          <p className="kicker">Case study</p>
          <h2 className={styles.h2}>22 hires. They only had to decide.</h2>
        </header>

        <div className={styles.caseGrid}>
          <div className={`card-shadow ${styles.card} ${styles.caseStory}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logos/lessmore.png" alt="Lessmore" className={styles.caseLogo} />
            <p className={styles.caseKicker}>Forge Master · We Are Warriors</p>
            <h3 className={styles.caseTitle}>No job ads. No 500-CV inbox.</h3>
            <p>
              Over 3.5 years we&apos;ve made 22 hires for Lessmore, the studio
              behind Forge Master and We Are Warriors, and 16 of them are still
              there a year on. Each one started with a single brief and ended
              with 5 candidates worth meeting, within 5 working days.
            </p>
            <p>
              Everything between the brief and the start date was ours, so
              their team kept shipping games while the hiring got done.
            </p>

          </div>

          <div className={styles.caseSide}>
            <div className={styles.stats}>
              <div className={`card-shadow ${styles.stat} ${styles.statHeat}`}>
                <div className={styles.statValue}>22</div>
                <div className={styles.statLabel}>hires for Lessmore</div>
              </div>
              <div className={`card-shadow ${styles.stat} ${styles.statViolet}`}>
                <div className={styles.statValue}>5</div>
                <div className={styles.statLabel}>working days, brief to shortlist</div>
              </div>
              <div className={`card-shadow ${styles.stat} ${styles.statGreen}`}>
                <div className={styles.statValue}>16</div>
                <div className={styles.statLabel}>of them still there after a year</div>
              </div>
            </div>
            <div className={`card-shadow ${styles.card} ${styles.caseQuote}`}>
              <p className={`${styles.quote} ${styles.caseQuoteText}`}>
                “One of the best recruiters I&apos;ve had the pleasure of
                working with. Andre is fast, efficient and focuses on the
                things that matter!”
              </p>
              <p className={styles.quoteBy}>
                <strong>Samer Al Dafai</strong> · Co-Founder, Lessmore
              </p>
            </div>
          </div>
        {/* Who did what, per hire (Andre 2026-10-27). */}
        <div className={`card-shadow ${styles.card} ${styles.split}`}>
          <div>
            <p className={styles.splitHead}>We handled</p>
            <ul className={styles.splitList}>
              <li>Headhunting and first calls</li>
              <li>A written summary for every candidate</li>
              <li>Booking and scheduling every interview</li>
              <li>Feedback calls after each round</li>
              <li>Rejections, handled properly</li>
              <li>Offers and start dates, confirmed</li>
            </ul>
          </div>
          <div>
            <p className={`${styles.splitHead} ${styles.splitHeadThem}`}>Lessmore did</p>
            <ul className={`${styles.splitList} ${styles.splitListThem}`}>
              <li>Review</li>
              <li>Interview</li>
              <li>
                Decide <span className={styles.thatsIt}>and that&apos;s it.</span>
              </li>
            </ul>
          </div>
        </div>
        </div>
      </div>
    </section>
  );
}

export function TalentDirectory() {
  return (
    <section className={`${styles.section} ${styles.sectionAlt}`}>
      <div className={`container ${styles.contentAbove}`}>
        <div className={styles.directory}>
          <div>
            <div className={styles.bigNumber}>250</div>
            <div className={styles.bigNumberLabel}>
              specialists we&apos;ve personally interviewed
            </div>
          </div>
          <div className={styles.directoryText}>
            <p className="kicker">The MakersForge Talent Directory</p>
            <h2 className={styles.h2} style={{ textAlign: "left" }}>
              How we hit 5 working days.
            </h2>
            <p>
              Every person in our Talent Directory has spent 30 to 90 minutes
              on the phone with us, and most have a written recruiter summary
              we&apos;ve already put in front of a hiring team. UA and growth,
              art, game design, Unity, product and data, across mobile games
              and apps.
            </p>
            <p>
              So when you brief us, we&apos;re not starting from a blank page.
              We start with people we already know, and headhunt beyond them
              for the right fit.
            </p>
            <Link href="/line-up" className={styles.textLink}>
              Browse the Talent Directory <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

const TESTIMONIALS = [
  {
    quote:
      "André has successfully sourced many candidates for different teams in our company. He's proven to take care of all requests reliably, whilst always treating his clients with respect and interest in understanding their products and specific employment needs. We can recommend working with André on a broad variety of roles for any studio.",
    name: "Sophie Baker",
    role: "Head of Operations, Lessmore",
  },
  {
    quote:
      "Andre was our go-to recruiter at Skunkworks and sourced some incredible talent for our growing company. This guy seems to have The Midas Touch when it comes to identifying potential hires, but in reality, Andre understood our business and our needs extremely well and was able to execute to close some of the best hires I've made in my career. I'm sure that's just a normal Tuesday for him.",
    name: "James Cramer",
    role: "Founder, Skunkworks",
  },
];

export function Testimonials() {
  return (
    <section className={styles.section}>
      <CornerGlow variant="tlSoft" />
      <div className={`container ${styles.contentAbove}`}>
        <header className={styles.header}>
          <p className="kicker">What studios say</p>
          <h2 className={styles.h2}>Hiring teams who&apos;ve done it this way.</h2>
        </header>
        <div className={`${styles.quotes} ${styles.quotesTwo}`}>
          {TESTIMONIALS.map((t) => (
            <figure key={t.name} className={`card-shadow ${styles.card}`} style={{ margin: 0 }}>
              <blockquote className={styles.quote} style={{ margin: "0 0 14px" }}>
                “{t.quote}”
              </blockquote>
              <figcaption className={styles.quoteBy}>
                <strong>{t.name}</strong> · {t.role}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
