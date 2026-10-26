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

// 2026-10-27: back to the service Andre sells and the emails pitch —
// "from 500 candidates to 5" — not the lineup-first access model.
const STAGES: Stage[] = [
  {
    title: "Brief us in 30 minutes.",
    body: "One call about the role, the team and what great looks like. That's all the admin you'll do.",
  },
  {
    title: "We headhunt the people who aren't looking.",
    body: "The best candidates never see your job ad. We approach them, qualify them and sell them the role, starting from the 250 specialists we already know.",
  },
  {
    title: "5 candidates in 5 working days.",
    body: "Screened, assessed and shortlisted, each with a written recruiter summary. Not 500 CVs to sift.",
  },
  {
    title: "Interview and hire.",
    body: "Your process, your call. We book every interview, run feedback calls and rejections, and confirm the offer, so all you do is meet them and decide.",
  },
  {
    title: "One flat fee.",
    body: "£12,000 per permanent hire, not a percentage of salary. Contractors on a flat monthly fee.",
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
            <h2 className={styles.header}>From 500 to 5.</h2>
            <p className={styles.body}>
              Five steps from a 30-minute brief to your next hire.
            </p>
            <Link href="#brief" className={styles.cta}>
              <span className={styles.ctaArrow} aria-hidden="true">
                ↳
              </span>
              Brief us a role
            </Link>
          </div>

          <div className={styles.right}>
            {STAGES.map((stage, i) => (
              <div key={i} className={`card-shadow ${styles.stage} ${styles[`tone${i}`]}`}>
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
