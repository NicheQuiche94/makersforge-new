import styles from "./WhatWeCover.module.css";

/**
 * WhatWeCover — sits between Statement and HowItWorks.
 *
 * Andre's call: naming just UA / ASO / Marketing Art on the hero was
 * too narrow. Growth managers, analysts, fractional Heads all live in
 * grey areas between those three. This section groups the disciplines
 * we cover into loose clusters so the mobile-growth grey areas have a
 * visible home too. Roles inside each cluster are examples, not the
 * exhaustive list — the note at the top acknowledges the overlap.
 */

type Cluster = {
  label: string;
  roles: string[];
};

const CLUSTERS: Cluster[] = [
  {
    label: "User acquisition",
    roles: ["UA managers", "Growth managers", "Media buyers", "Performance leads"],
  },
  {
    label: "App store",
    roles: ["ASO managers", "ASO strategists"],
  },
  {
    label: "Creative",
    roles: ["Marketing artists", "Motion designers", "Creative producers"],
  },
  {
    label: "Analytics",
    roles: ["Growth analysts", "Product analysts", "MMP wranglers"],
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
          <h2 className={styles.headline}>
            <span className="gr">Growth teams for mobile apps and games.</span>
          </h2>
          <p className={styles.subhead}>
            Grouped roughly. Roles overlap. If who you need isn&apos;t obvious,
            ask.
          </p>
        </header>

        <div className={styles.grid}>
          {CLUSTERS.map((cluster) => (
            <article
              key={cluster.label}
              className={`reveal card-shadow ${styles.card}`}
            >
              <h3 className={styles.cardTitle}>{cluster.label}</h3>
              <ul className={styles.roleList}>
                {cluster.roles.map((role) => (
                  <li key={role} className={styles.role}>
                    {role}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
