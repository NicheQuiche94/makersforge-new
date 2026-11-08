"use client";

import { useState } from "react";
import { TIER_FEE, TIER_NAME, gbp } from "@/lib/plans";
import { tierFor } from "@/lib/tier";
import styles from "./TierChecker.module.css";

/* /pricing: "Which tier is my role?" (Andre 2026-11-08, two-tier pricing
   MOCKUP). The fixed rules, written out, and a checker that applies them. */
export function TierChecker() {
  const [role, setRole] = useState("");
  const [salary, setSalary] = useState("");
  const t = role.trim() ? tierFor(role, salary) : null;
  return (
    <section className={styles.wrap} aria-labelledby="tiers">
      <div className={styles.tiers}>
        <div className={styles.tier}>
          <p className={styles.name}>Generalist</p>
          <p className={styles.fee}>{gbp(TIER_FEE.generalist)}</p>
          <p className={styles.what}>Most hires: art, design, engineering, product, data and marketing roles below Head level, up to £70k.</p>
        </div>
        <div className={`${styles.tier} ${styles.spec}`}>
          <p className={styles.name}>Specialist</p>
          <p className={styles.fee}>from {gbp(TIER_FEE.specialist)}</p>
          <p className={styles.what}>The hires that move revenue, and senior hires. A specialist role is any one of:</p>
          <ul>
            <li>a salary of £70,000 or more</li>
            <li>Head, Director, VP or C-level, in any discipline</li>
            <li>Lead level or above in UA and growth, monetisation, live-ops and retention, or economy design</li>
          </ul>
        </div>
      </div>

      <div className={styles.check}>
        <h2 id="tiers">Which tier is my role?</h2>
        <div className={styles.inputs}>
          <label>
            <span>Role</span>
            <input value={role} onChange={(e) => setRole(e.target.value)} placeholder="e.g. Senior UA Manager" />
          </label>
          <label>
            <span>Salary</span>
            <input value={salary} onChange={(e) => setSalary(e.target.value)} placeholder="e.g. £65k, or €80,000" />
          </label>
        </div>
        {t && (
          <p className={`${styles.result} ${t.tier === "specialist" ? styles.resultSpec : ""}`}>
            <b>
              {TIER_NAME[t.tier]} · {t.tier === "specialist" ? `from ${gbp(TIER_FEE.specialist)}` : gbp(TIER_FEE.generalist)}
            </b>{" "}
            {t.reason}.
          </p>
        )}
        <p className={styles.small}>
          The tier comes from the role, never from a negotiation. For Head, VP and C-level searches we confirm the fee within one working day, before you sign.
        </p>
      </div>
    </section>
  );
}
