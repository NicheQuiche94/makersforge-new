import type { Metadata } from "next";
import type { ReactNode } from "react";
import { StatStrip } from "@/components/sections/StatStrip";
import styles from "./sandbox.module.css";

/**
 * /sandbox — preview surface for home-page section variants.
 *
 * Not linked from nav. Not indexed. Andre uses this to eyeball the
 * proposed redesigns (StatStrip trimmed, WhatWeCover containerless,
 * Statement columns-not-cards) side-by-side with the live home page
 * before any of them get pushed into src/app/page.tsx. Approved
 * variants get ported into their respective component files.
 */

export const metadata: Metadata = {
  title: "Sandbox · MakersForge",
  robots: { index: false, follow: false },
};

/* ============================================================
   Data — kept local so edits happen here, then port to live.
   ============================================================ */

const NEW_HOME_STATS = [
  { n: <span className="gr">EMEA</span>, label: "Europe, Middle East, Africa" },
  { n: <span className="gr">Flat</span>, label: "Monthly fee, no markup" },
  { n: <span className="gr">∞</span>, label: "Indefinite representation" },
];

const CLUSTERS: { label: string; roles: string[] }[] = [
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

const PRINCIPLES: { icon: ReactNode; title: string; body: string }[] = [
  {
    icon: <AvailabilityIcon />,
    title: "Currently available",
    body:
      "The specialists on the lineup are open to new work now. What you see is who you can talk to this month.",
  },
  {
    icon: <VettedIcon />,
    title: "Already vetted",
    body:
      "Everyone on the lineup is someone we've worked with or dug into. No CV stacks, no unknowns.",
  },
  {
    icon: <DirectIcon />,
    title: "Direct intro",
    body:
      "Pick from the lineup and we set up the call. You talk to the specialist, not to us.",
  },
];

/* ============================================================
   Page
   ============================================================ */

export default function SandboxPage() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <p className="kicker">Sandbox</p>
        <h1 className={styles.h1}>Home variants</h1>
        <p className={styles.hint}>
          Three redesigns landing here first so we can push them clean.
          StatStrip trimmed to three centred tiles. WhatWeCover switched to
          four columns, no cards. Statement kept the icons but dropped the
          card containers.
        </p>
      </header>

      {/* ============================================================
          Variant 1 — StatStrip
          ============================================================ */}
      <section className={styles.variant}>
        <p className={styles.variantLabel}>
          StatStrip · three tiles, filled
        </p>
        <StatStrip cells={NEW_HOME_STATS} />
      </section>

      {/* ============================================================
          Variant 2 — WhatWeCover: four columns, containerless
          ============================================================ */}
      <section className={styles.variant}>
        <p className={styles.variantLabel}>
          WhatWeCover · four columns, no cards
        </p>
        <div className="container">
          <header className={styles.wwcHeader}>
            <p className="kicker">What we cover</p>
            <h2 className={styles.wwcH2}>
              <span className="gr">Growth teams for mobile apps and games.</span>
            </h2>
            <p className={styles.wwcSubhead}>
              Grouped roughly. Roles overlap. If who you need isn&apos;t
              obvious, ask.
            </p>
          </header>

          <div className={styles.clusterGrid}>
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
        </div>
      </section>

      {/* ============================================================
          Variant 3 — Principles: three columns, containerless
          ============================================================ */}
      <section className={styles.variant}>
        <p className={styles.variantLabel}>
          Principles · three columns, no card containers
        </p>
        <div className="container">
          <header className={styles.principlesHeader}>
            <p className="kicker">Principles</p>
            <h2 className={styles.principlesH2}>
              <span className="gr">Represented, not searched.</span>
            </h2>
            <p className={styles.principlesSubhead}>
              These are the specialists we currently represent.
            </p>
          </header>

          <div className={styles.principlesGrid}>
            {PRINCIPLES.map((p) => (
              <div key={p.title} className={styles.principle}>
                <div className={styles.iconWrap}>{p.icon}</div>
                <h3 className={styles.principleTitle}>{p.title}</h3>
                <p className={styles.principleBody}>{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

/* ============================================================
   Icons — inlined from Statement.tsx so this sandbox doesn't
   need Statement.tsx to expose them.
   ============================================================ */

function AvailabilityIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function VettedIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
      <path
        d="M12 3l8 3v6c0 4.4-3.1 8-8 9-4.9-1-8-4.6-8-9V6l8-3z"
        strokeLinejoin="round"
      />
      <path
        d="M8.5 12l2.5 2.5L16 9.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function DirectIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
      <path d="M4 12h14" strokeLinecap="round" />
      <path
        d="M14 6l6 6-6 6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
