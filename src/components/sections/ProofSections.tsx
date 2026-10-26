import Link from "next/link";
import styles from "./ProofSections.module.css";
import { CornerGlow } from "./CornerGlow";

/**
 * Proof for the 500→5 service (2026-10-27): the Lessmore case study, the
 * MakersForge Talent Directory (the bench behind the promise) and client
 * testimonials. Anything in <Todo> is a placeholder Andre still has to
 * supply — it renders with a loud dashed outline so it can't ship unnoticed.
 */

function Todo({ note, children }: { note: string; children: React.ReactNode }) {
  return (
    <div className={styles.todo}>
      <span className={styles.todoTag}>Andre: {note}</span>
      {children}
    </div>
  );
}

export function CaseStudy() {
  return (
    <section className={styles.section} id="proof">
      <CornerGlow variant="trSoft" />
      <div className={`container ${styles.contentAbove}`}>
        <header className={styles.header}>
          <p className="kicker">Case study</p>
          <h2 className={styles.h2}>3.5 years. Every hire, the same way.</h2>
        </header>

        <div className={styles.caseGrid}>
          <div className={`card-shadow ${styles.card} ${styles.caseStory}`}>
            <p className={styles.caseKicker}>Lessmore · Forge Master, We Are Warriors</p>
            <h3 className={styles.caseTitle}>No job ads. No 500-CV inbox.</h3>
            <p>
              Lessmore, the studio behind Forge Master and We Are Warriors, has
              recruited this way for the past 3.5 years. Every time they need
              someone, they brief us, and 5 working days later they have 5
              candidates worth meeting.
            </p>
            <p>
              The time it saves them is huge: they make fast decisions without
              compromising on quality, and their team stays focused on shipping
              games.
            </p>
          </div>

          <div>
            <Todo note="Lessmore numbers">
              <div className={styles.stats}>
                <div className={styles.stat}>
                  <div className={styles.statValue}>XX</div>
                  <div className={styles.statLabel}>hires made</div>
                </div>
                <div className={styles.stat}>
                  <div className={styles.statValue}>5 days</div>
                  <div className={styles.statLabel}>brief to shortlist</div>
                </div>
                <div className={styles.stat}>
                  <div className={styles.statValue}>XX%</div>
                  <div className={styles.statLabel}>still there after a year</div>
                </div>
              </div>
            </Todo>
            <div style={{ height: 18 }} />
            <Todo note="Lessmore quote + name">
              <div className={`card-shadow ${styles.card}`}>
                <p className={styles.quote}>
                  “A one or two sentence quote from Lessmore about what working
                  with MakersForge is like, ideally mentioning speed and quality.”
                </p>
                <p className={styles.quoteBy}>
                  <strong>Name Surname</strong> · Role, Lessmore
                </p>
              </div>
            </Todo>
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
            <div className={styles.bigNumber}>371</div>
            <div className={styles.bigNumberLabel}>
              specialists we&apos;ve personally interviewed
            </div>
          </div>
          <div className={styles.directoryText}>
            <p className="kicker">The MakersForge Talent Directory</p>
            <h2 className={styles.h2} style={{ textAlign: "left" }}>
              Why 5 days is possible.
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

export function Testimonials() {
  const placeholders = [1, 2, 3];
  return (
    <section className={styles.section}>
      <CornerGlow variant="tlSoft" />
      <div className={`container ${styles.contentAbove}`}>
        <header className={styles.header}>
          <p className="kicker">What studios say</p>
          <h2 className={styles.h2}>Hiring teams who&apos;ve done it this way.</h2>
        </header>
        <div className={styles.quotes}>
          {placeholders.map((n) => (
            <Todo key={n} note={`testimonial ${n}`}>
              <div className={`card-shadow ${styles.card}`}>
                <p className={styles.quote}>
                  “Client quote. One or two sentences about the result: who we
                  found, how fast, and what difference it made.”
                </p>
                <p className={styles.quoteBy}>
                  <strong>Name Surname</strong> · Title, Studio
                </p>
              </div>
            </Todo>
          ))}
        </div>
      </div>
    </section>
  );
}
