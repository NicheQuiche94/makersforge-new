"use client";

import { useState } from "react";
import { TIER_FEE, TIER_NAME, gbp } from "@/lib/plans";
import { tierFor } from "@/lib/tier";
import styles from "./TierChecker.module.css";

/* /pricing: "Which tier is my role?" (Andre 2026-11-09, MOCKUP). The tier is
   the level in the job title, nothing else. */
export function TierChecker() {
  const [role, setRole] = useState("");
  const t = role.trim() ? tierFor(role) : null;
  return (
    <section className={styles.wrap} aria-labelledby="tiers">
      <div className={styles.check}>
        <h2 id="tiers">Which tier is my role?</h2>
        <div className={styles.inputs}>
          <label>
            <span>Job title</span>
            <input value={role} onChange={(e) => setRole(e.target.value)} placeholder="e.g. Senior UA Manager" />
          </label>
        </div>
        {t && (
          <p className={`${styles.result} ${t.tier !== "team" ? styles.resultSpec : ""}`}>
            <b>
              {TIER_NAME[t.tier]} · {gbp(TIER_FEE[t.tier])}
            </b>{" "}
            {t.reason}.
          </p>
        )}
        <p className={styles.small}>The tier is the level in the job title, never years of experience or a negotiation.</p>
      </div>
    </section>
  );
}
