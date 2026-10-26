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
    title: "Try us free.",
    body: "Send us a role or a job spec and we'll send 3 anonymised profiles from people we've already interviewed. No terms, no obligation.",
  },
  {
    title: "Brief us. We headhunt.",
    body: "Like what you see? Agree terms, give us 30 minutes on the role, and we headhunt the people who never see your job ad, starting from the 250 specialists we know.",
  },
  {
    title: "5 candidates in 5 working days.",
    body: "Screened, assessed and shortlisted, each with a written recruiter summary. Not 500 CVs to sift.",
  },
  {
    title: "Interview and hire.",
    body: "Your process, your call. We book every interview, run feedback calls and rejections, and negotiate the offer through to acceptance. You meet them, decide, and sort the contract.",
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
          <div className={`reveal ${styles.left}`}>
            <p className="kicker">How it works</p>
            <h2 className={styles.header}>From 500 to 5.</h2>
            <p className={styles.body}>
              Five steps from 3 free profiles to your next hire.
            </p>
            <Link href="#brief" className={styles.cta}>
              <span className={styles.ctaArrow} aria-hidden="true">
                ↳
              </span>
              Try us free
            </Link>
          </div>

          <div className={styles.right}>
            {STAGES.map((stage, i) => (
              <div key={i} className={`reveal card-shadow ${styles.stage} ${styles[`tone${i}`]}`} style={{ transitionDelay: `${i * 0.08}s` }}>
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
