import styles from "./Principles.module.css";
import { CornerGlow } from "./CornerGlow";

/**
 * Principles — talent-agent commitments as paper cards.
 *
 * Icons dropped 2026-07-19 (Andre). Briefly carried index numerals,
 * but that clashed with How-it-works' numbered steps (two different
 * numbering treatments), so these are clean text cards now: numbering
 * is reserved for the actual sequence in How-it-works. First card is a
 * wide horizontal bento; the other two sit side by side beneath.
 */

type Principle = {
  title: string;
  body: string;
};

const PRINCIPLES: Principle[] = [
  {
    title: "Talent doesn't pay for representation.",
    body: "The specialist keeps 100% of what they earn. Studios pay us a flat monthly fee; the talent side never sees an invoice from us.",
  },
  {
    title: "We work for both sides.",
    body: "A recruiter's job is done when someone gets hired. Ours is done when the specialist wants to come back to the lineup and the studio wants to work with us again.",
  },
  {
    title: "Indefinite representation.",
    body: "Once a specialist is on the lineup, they stay on it. We keep the relationship warm between engagements and open the next round when the current one wraps.",
  },
];

export function Principles() {
  return (
    <section className={styles.section}>
      <CornerGlow variant="trSoft" />
      <div className={`container ${styles.contentAbove}`}>
        <header className={styles.header}>
          <p className="kicker">Principles</p>
          <h2 className={styles.h2}>How we hold ourselves.</h2>
        </header>

        <div className={styles.grid}>
          {PRINCIPLES.map((p) => (
            <div key={p.title} className={`card-shadow ${styles.principle}`}>
              <div className={styles.text}>
                <h3 className={styles.title}>{p.title}</h3>
                <p className={styles.body}>{p.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
