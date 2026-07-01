"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./HowItWorksBento.module.css";

/**
 * HowItWorks — two-column: left-hand argument for the access model,
 * right-hand stack of collapsible numbered stages.
 *
 * Andre swapped the previous 3-tile bento for this pattern after
 * candidate feedback that the process wasn't clear enough on the site.
 * The old bento is preserved in git; file name kept for compatibility
 * with the /#how anchor link and existing imports.
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
    title: "Contract with them, not us.",
    body: "Day rate, hours, scope, you and the specialist agree. We invoice a flat monthly fee for the engagement. Simple.",
  },
  {
    title: "The relationship keeps running.",
    body: "When the engagement ends, the specialist stays on the lineup. Need the next one, same process.",
  },
];

export function HowItWorksBento() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className={styles.section} id="how">
      <div className="container">
        <div className={styles.split}>
          <div className={styles.left}>
            <p className="kicker">How it works</p>
            <h2 className={styles.header}>
              <span className="gr">How it works.</span>
            </h2>
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
              <StageRow
                key={i}
                index={i + 1}
                stage={stage}
                open={openIndex === i}
                onToggle={() =>
                  setOpenIndex(openIndex === i ? null : i)
                }
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function StageRow({
  index,
  stage,
  open,
  onToggle,
}: {
  index: number;
  stage: Stage;
  open: boolean;
  onToggle: () => void;
}) {
  const label = String(index).padStart(2, "0");
  return (
    <div className={`${styles.stage} ${open ? styles.stageOpen : ""}`}>
      <button
        type="button"
        className={styles.stageBtn}
        onClick={onToggle}
        aria-expanded={open}
      >
        <span className={styles.stageNum} aria-hidden="true">
          {label}
        </span>
        <span className={styles.stageTitle}>{stage.title}</span>
        <span className={styles.stageToggle} aria-hidden="true">
          {open ? "−" : "+"}
        </span>
      </button>
      <div className={styles.stageBodyWrap} aria-hidden={!open}>
        <p className={styles.stageBody}>{stage.body}</p>
      </div>
    </div>
  );
}
