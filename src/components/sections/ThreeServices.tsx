import Link from "next/link";
import styles from "./ThreeServices.module.css";
import { CornerGlow } from "./CornerGlow";

/**
 * The "one home, three services" section — the spine of the Version B home
 * narrative. Replaces the old competing CTA bands (For-talent + job-board)
 * with a single structured moment: three equal doors into the one home.
 */
const SERVICES = [
  {
    service: "Representation",
    who: "For talent",
    body: "We represent the best growth, product, design, engineering and art talent in games and apps indefinitely, and put you in front of the companies asking for intros.",
    href: "/apply",
    cta: "Join the line-up",
  },
  {
    service: "Recruitment",
    who: "For companies",
    body: "Need a UA manager, a product designer or a Unity engineer for your game or app? Tell us the brief and we'll introduce you to people from the lineup who fit, ready to start.",
    href: "/enquire",
    cta: "Book a briefing",
  },
  {
    // Replaced the job board card (2026-10-23: board pulled while it's reworked).
    service: "Targeted search",
    who: "When the lineup doesn't fit",
    body: "Nobody right on the lineup? We run the search ourselves, only in games and apps, for permanent and contract roles. Same flat fee either way.",
    href: "/enquire",
    cta: "Brief a search",
  },
];

export function ThreeServices() {
  return (
    <section className={styles.section}>
      <CornerGlow variant="trSoft" />
      <div className={`container ${styles.contentAbove}`}>
        <header className={styles.head}>
          <p className="kicker">One home, three services</p>
          <h2 className={styles.h2}>
            Everything your team needs, in one place.
          </h2>
        </header>

        <div className={styles.grid}>
          {SERVICES.map((s) => (
            <Link
              key={s.service}
              href={s.href}
              className={`reveal card-shadow ${styles.card}`}
            >
              <span className={styles.eyebrow}>{s.service}</span>
              <h3 className={styles.who}>{s.who}</h3>
              <p className={styles.body}>{s.body}</p>
              <span className={styles.link}>
                {s.cta} <span aria-hidden="true">→</span>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
