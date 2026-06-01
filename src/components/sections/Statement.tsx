import styles from "./Statement.module.css";

/**
 * Statement — second section after the hero.
 *
 * v4 (Andre 2026-05-30 v4): the "Don't let hiring slow you down"
 * fear-of-friction framing was retired. New angle is SPEED + REAL
 * AVAILABILITY — momentum doesn't get to stop because brilliant
 * operators are already on call and ready to start. Section also
 * went from a tall poster-headline + heat-gradient body panel to
 * a Nura-style 3-card grid (Principles kicker + mixed-weight
 * headline + three icon cards). Shorter, tighter, cleaner.
 */
export function Statement() {
  return (
    <section className={styles.section}>
      <div className="container">
        <header className={styles.header}>
          <p className={`kicker ${styles.kicker}`}>Principles</p>
          <h2 className={styles.headline}>
            Growth needs people who can move.{" "}
            <span className={styles.softer}>
              We keep brilliant operators on call, so your product keeps
              shipping.
            </span>
          </h2>
        </header>

        <div className={styles.grid}>
          <PrincipleCard
            icon={<AvailabilityIcon />}
            title="Available now"
            body="Senior operators with real availability, ready to brief on a Tuesday and start the following Monday. No quarter-long waits."
          />
          <PrincipleCard
            icon={<VettedIcon />}
            title="Already vetted"
            body="Every profile is someone we know directly or have worked with. The shortlist is real people, not a job-board dragnet."
          />
          <PrincipleCard
            icon={<DirectIcon />}
            title="Direct to fit"
            body="Brief us, or come to the lineup and ask for the specific person. Either way we make the intro and stay close to the matching."
          />
        </div>
      </div>
    </section>
  );
}

function PrincipleCard({
  icon,
  title,
  body,
}: {
  icon: React.ReactNode;
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

/* ============================================================
   ICONS — small monochrome SVGs sitting inside a heat-gradient
   hex container at the top of each card. Styled via currentColor
   so the stroke inherits ink/white based on surface.
   ============================================================ */

function AvailabilityIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function VettedIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
      <path
        d="M12 3l8 3v6c0 4.4-3.1 8-8 9-4.9-1-8-4.6-8-9V6l8-3z"
        strokeLinejoin="round"
      />
      <path
        d="M8.5 12l2.5 2.5L16 9.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function DirectIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
      <path d="M4 12h14" strokeLinecap="round" />
      <path
        d="M14 6l6 6-6 6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
