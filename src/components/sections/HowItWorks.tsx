import type { ReactNode } from "react";
import styles from "./HowItWorks.module.css";

type Step = {
  num: string;
  title: ReactNode;
  body: ReactNode;
};

const DEFAULT_STEPS: Step[] = [
  {
    num: "01",
    title: <>tell us <span className="gr">the gap</span></>,
    body: "UA lead for a launch, performance creative for a refresh, a fractional head of growth. Tell us the shape of the need and the timeline. We push back where it helps.",
  },
  {
    num: "02",
    title: <>we <span className="gr">match</span></>,
    body: "From a vetted roster of senior operators we actually know — not a job-board dragnet. You see a shortlist of real people, with real availability, fast.",
  },
  {
    num: "03",
    title: <>they <span className="gr">get to work</span></>,
    body: "You contract and pay them directly. You pay us a flat monthly fee for each month they're engaged. Scale up, scale down, stop any time.",
  },
];

export function HowItWorks({ steps = DEFAULT_STEPS }: { steps?: Step[] }) {
  return (
    <section className={styles.how} id="how">
      <div className="container">
        <div className={`scroll-reveal ${styles.top}`}>
          <p className="kicker kicker-mute">how it works</p>
          <h2 className={`display-section ${styles.headline}`}>
            brief monday. working <span className="gr">by friday.</span>
          </h2>
        </div>

        {steps.map((step, i) => (
          <div
            key={step.num}
            className={`scroll-reveal ${styles.row}`}
            style={
              {
                ["--delay" as string]: `${0.08 * i}s`,
              } as React.CSSProperties
            }
          >
            <span className={styles.rnum}>{step.num}</span>
            <span className={styles.rtitle}>{step.title}</span>
            <span className={styles.rbody}>{step.body}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
