import Link from "next/link";
import styles from "./WhatWeCover.module.css";

/**
 * WhatWeCover — four containerless columns of the mobile-growth
 * disciplines we represent, with a soft CTA to the lineup underneath.
 *
 * Reshuffled 2026-07-02: retired the six paper-card grid version;
 * subhead pulled; App-store cluster dropped (ASO managers folded into
 * Creative); UA and Analytics trimmed per Andre's role list; Retention
 * & CRM retired as unused. Editorial hairlines instead of cards so the
 * section reads as content-first rather than tiled.
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
      <div className="container">
        <header className={styles.header}>
          <p className="kicker">What we cover</p>
          <h2 className={styles.h2}>
            <span className="gr">Growth teams for mobile apps and games.</span>
          </h2>
        </header>

        <div className={styles.grid}>
          {CLUSTERS.map((cluster) => (
            <div key={cluster.label} className={styles.cluster}>
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
          <Link href="/roster" className={styles.cta}>
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
