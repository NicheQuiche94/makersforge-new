import Link from "next/link";
import styles from "./HowItWorksBento.module.css";
import { CornerGlow } from "./CornerGlow";

/**
 * HowItWorks — two-column: left-hand argument for the access model,
 * right-hand stack of numbered step cards.
 *
 * Was a click-to-expand +/- accordion; converted 2026-07-19 to
 * always-visible numbered cards so the section reads in the same card
 * language as the rest of the home page and every step is scannable
 * without interaction. Filename kept for the /#how anchor + imports.
 */

type Stage = {
  title: string;
  body: string;
};

const STAGES: Stage[] = [
  {
    title: "Have a look at the lineup.",
    body: "Filter by role, discipline, or availability. Every profile is someone we currently represent.",
  },
  {
    title: "Tell us who to introduce you to.",
    body: "Once someone catches your eye, request an intro through their profile. We reply the same day and set up the call that week.",
  },
  {
    title: "Meet the specialist.",
    body: "One call. You and the person doing the work. We don't sit in.",
  },
  {
    title: "You contract with the specialist.",
    body: "Day rate, hours, scope, you and the specialist agree it directly. We invoice a flat monthly fee for the engagement. Simple.",
  },
  {
    title: "The relationship keeps running.",
    body: "When the engagement ends, the specialist stays on the lineup. Need the next one, same process.",
  },
];

export function HowItWorksBento() {
  return (
    <section className={styles.section} id="how">
      <CornerGlow variant="tlSoft" />
      <div className={`container ${styles.contentAbove}`}>
        <div className={styles.split}>
          <div className={styles.left}>
            <p className="kicker">How it works</p>
            <h2 className={styles.header}>How it works.</h2>
            <p className={styles.body}>
              Recruitment agencies run searches. We represent people directly,
              so you don&apos;t need to. Look at the lineup, tell us who to
              introduce you to, and take the call. If it&apos;s a fit, you
              contract with them.
            </p>
            <Link href="/enquire" className={styles.cta}>
              <span className={styles.ctaArrow} aria-hidden="true">
                ↳
              </span>
              Get in touch
            </Link>
          </div>

          <div className={styles.right}>
            {STAGES.map((stage, i) => (
              <div key={i} className={`card-shadow ${styles.stage}`}>
                <span className={styles.stageNum} aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className={styles.stageText}>
                  <h3 className={styles.stageTitle}>{stage.title}</h3>
                  <p className={styles.stageBody}>{stage.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
