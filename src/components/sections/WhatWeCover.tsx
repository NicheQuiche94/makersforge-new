import Link from "next/link";
import styles from "./WhatWeCover.module.css";
import { CornerGlow } from "./CornerGlow";

/**
 * WhatWeCover — the mobile-growth disciplines we represent, as a row
 * of compact cards, with a soft CTA to the lineup underneath.
 *
 * Clusters settled 2026-07-02 (App-store folded into Creative; UA and
 * Analytics trimmed; Retention & CRM retired). Card treatment restored
 * 2026-07-19 so the homepage matches the card UI used across /jobs and
 * the line-up, rather than the interim hairline-column look.
 */

type Cluster = {
  label: string;
  roles: string[];
};

const CLUSTERS: Cluster[] = [
  {
    label: "User acquisition",
    roles: ["UA managers", "Growth managers", "Performance leads"],
  },
  {
    label: "Creative",
    roles: [
      "Marketing artists",
      "Motion designers",
      "Creative producers",
      "ASO managers",
    ],
  },
  {
    label: "Product",
    roles: ["Product leads", "Ad monetisation", "General managers"],
  },
  {
    label: "Analytics",
    roles: ["Data analysts", "Analytics engineers"],
  },
  {
    label: "Leadership",
    roles: ["Heads of Growth", "Heads of Marketing", "Fractional Heads"],
  },
];

export function WhatWeCover() {
  return (
    <section className={styles.section}>
      <CornerGlow variant="trSoft" />
      <div className={`container ${styles.contentAbove}`}>
        <header className={styles.header}>
          <p className="kicker">What we cover</p>
          <h2 className={styles.h2}>
            Growth teams for mobile apps and games.
          </h2>
        </header>

        <div className={styles.grid}>
          {CLUSTERS.map((cluster) => (
            <div
              key={cluster.label}
              className={`card-shadow ${styles.cluster}`}
            >
              <h3 className={styles.clusterLabel}>{cluster.label}</h3>
              <ul className={styles.roleList}>
                {cluster.roles.map((role) => (
                  <li key={role} className={styles.role}>
                    {role}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className={styles.ctaRow}>
          <Link href="/line-up" className={styles.cta}>
            <span className={styles.ctaArrow} aria-hidden="true">
              ↳
            </span>
            See the lineup
          </Link>
        </div>
      </div>
    </section>
  );
}
