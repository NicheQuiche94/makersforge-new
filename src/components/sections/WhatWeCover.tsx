import Link from "next/link";
import styles from "./WhatWeCover.module.css";
import { CornerGlow } from "./CornerGlow";
import type { Cluster } from "@/data/segments";

/**
 * WhatWeCover — the mobile-growth disciplines we represent, as a row
 * of compact cards, with a soft CTA to the lineup underneath.
 *
 * Clusters settled 2026-07-02 (App-store folded into Creative; UA and
 * Analytics trimmed; Retention & CRM retired). Card treatment restored
 * 2026-07-19 so the homepage matches the card UI used across /jobs and
 * the line-up, rather than the interim hairline-column look.
 */

// 2026-10-23: widened from growth-only to the whole team (Andre: most recent
// hires were design + engineering; don't lose app/game companies who assume
// we only do UA). Growth stays first — it's still the sharpest edge.
const CLUSTERS: Cluster[] = [
  {
    label: "Growth & UA",
    roles: ["UA managers", "Growth managers", "Monetisation managers", "Performance leads", "ASO managers"],
  },
  {
    label: "Art & creative",
    roles: ["Game artists", "Marketing artists", "Motion designers", "Creative producers"],
  },
  {
    label: "Product & design",
    roles: ["Product managers", "Game designers", "Product designers", "UI/UX designers"],
  },
  {
    label: "Engineering",
    roles: ["iOS & Android engineers", "Unity engineers", "Backend engineers"],
  },
  {
    label: "Data",
    roles: ["Data analysts", "Analytics engineers", "Data scientists"],
  },
  {
    label: "Leadership",
    roles: ["Heads of Growth", "Heads of Engineering", "Fractional heads"],
  },
];

/** Home uses the defaults; /games and /apps pass their own (see segments.ts). */
export function WhatWeCover({
  title = "The whole team behind a game or app.",
  clusters = CLUSTERS,
}: { title?: string; clusters?: Cluster[] } = {}) {
  return (
    <section className={styles.section}>
      <CornerGlow variant="trSoft" />
      <div className={`container ${styles.contentAbove}`}>
        <header className={styles.header}>
          <p className="kicker">What we cover</p>
          <h2 className={styles.h2}>
            {title}
          </h2>
        </header>

        <div className={styles.grid}>
          {clusters.map((cluster) => (
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
            Browse the Talent Directory
          </Link>
        </div>
      </div>
    </section>
  );
}
