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
    body: "We represent the best UA, growth and marketing-art operators indefinitely, and put you in front of the studios asking for intros.",
    href: "/apply",
    cta: "Join the line-up",
  },
  {
    service: "Recruitment",
    who: "For companies",
    body: "Need a UA manager or marketing artist for your game or app? Tell us the brief and we'll introduce you to people from the lineup who fit, ready to start.",
    href: "/enquire",
    cta: "Book a briefing",
  },
  {
    service: "Job board",
    who: "For both, free",
    body: "The only board dedicated to UA, growth and marketing-art roles in games and apps. Browse it, or host your own roles, at no charge.",
    href: "/jobs",
    cta: "Open the board",
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
            Everything a growth team needs, in one place.
          </h2>
        </header>

        <div className={styles.grid}>
          {SERVICES.map((s) => (
            <Link
              key={s.href}
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
