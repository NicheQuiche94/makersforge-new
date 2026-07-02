import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { StatStrip } from "@/components/sections/StatStrip";
import styles from "./sandbox.module.css";

/**
 * /sandbox — preview surface for home-page section variants.
 *
 * Not linked from nav. Not indexed. Andre uses this to eyeball
 * proposed redesigns before any of them get pushed into
 * src/app/page.tsx. Approved variants get ported into their
 * respective component files.
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

const NEW_PRINCIPLES: { icon: ReactNode; title: string; body: string }[] = [
  {
    icon: <WalletIcon />,
    title: "Talent doesn't pay for representation.",
    body:
      "The specialist keeps 100% of what they earn. Studios pay us a flat monthly fee; the talent side never sees an invoice from us.",
  },
  {
    icon: <ScalesIcon />,
    title: "We work for both sides.",
    body:
      "A recruiter's job is done when someone gets hired. Ours is done when the specialist wants to come back to the lineup and the studio wants to work with us again.",
  },
  {
    icon: <InfinityIcon />,
    title: "Indefinite representation.",
    body:
      "Once a specialist is on the lineup, they stay on it. We keep the relationship warm between engagements and open the next round when the current one wraps.",
  },
];

const COMPARISON: { them: string; us: string }[] = [
  {
    them: "Sells search to companies",
    us: "Represents specialists directly",
  },
  {
    them: "Per-hire fee or a cut of the salary",
    us: "Flat monthly fee, paid by the studio",
  },
  {
    them: "Job's done at placement",
    us: "Indefinite representation, both sides",
  },
  {
    them: "You brief them; they go find people",
    us: "You look at the lineup; we set up the call",
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
          Preview surface for the home-page reshuffle. Iterate here, then
          port. StatStrip (three centred tiles). WhatWeCover (four columns,
          no subhead, CTA to the lineup). NEW Principles (actual talent-
          agent commitments, not the old how-it-works points). NEW
          Represented-not-searched explainer with a comparison strip.
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
          Variant 2 — WhatWeCover: four columns, no subhead, CTA
          ============================================================ */}
      <section className={styles.variant}>
        <p className={styles.variantLabel}>
          WhatWeCover · no subhead, CTA to the lineup
        </p>
        <div className="container">
          <header className={styles.wwcHeader}>
            <p className="kicker">What we cover</p>
            <h2 className={styles.wwcH2}>
              <span className="gr">Growth teams for mobile apps and games.</span>
            </h2>
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

          <div className={styles.wwcCtaRow}>
            <Link href="/roster" className={styles.arrowCta}>
              <span className={styles.arrowCtaArrow} aria-hidden="true">
                ↳
              </span>
              See the lineup
            </Link>
          </div>
        </div>
      </section>

      {/* ============================================================
          Variant 3 — NEW Principles: actual talent-agent commitments
          ============================================================ */}
      <section className={styles.variant}>
        <p className={styles.variantLabel}>
          Principles · actual commitments (new copy)
        </p>
        <div className="container">
          <header className={styles.principlesHeader}>
            <p className="kicker">Principles</p>
            <h2 className={styles.principlesH2}>
              <span className="gr">How we hold ourselves.</span>
            </h2>
          </header>

          <div className={styles.principlesGrid}>
            {NEW_PRINCIPLES.map((p) => (
              <div key={p.title} className={styles.principle}>
                <div className={styles.iconWrap}>{p.icon}</div>
                <h3 className={styles.principleTitle}>{p.title}</h3>
                <p className={styles.principleBody}>{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          Variant 4 — NEW Represented-not-searched explainer
          ============================================================ */}
      <section className={styles.variant}>
        <p className={styles.variantLabel}>
          Explainer · represented, not searched
        </p>
        <div className="container">
          <header className={styles.explainerHeader}>
            <p className="kicker">The difference</p>
            <h2 className={styles.explainerH2}>
              <span className="gr">Represented, not searched.</span>
            </h2>
          </header>

          <div className={styles.explainerBody}>
            <p className={styles.explainerP}>
              A recruitment agency runs searches. They don&apos;t know the
              people they&apos;re finding for you; they go and look. A talent
              agent represents specialists directly. Everyone on the lineup
              is someone we already work with. Ask us for an intro and
              you&apos;re talking to them the same week.
            </p>
          </div>

          <div className={styles.comparison}>
            <div className={styles.comparisonCol}>
              <p className={styles.comparisonLabel}>Recruitment agency</p>
            </div>
            <div className={styles.comparisonCol}>
              <p className={styles.comparisonLabel}>Talent agent</p>
            </div>
            {COMPARISON.map((row, i) => (
              <div key={i} className={styles.comparisonRow}>
                <div className={styles.comparisonCell}>{row.them}</div>
                <div className={`${styles.comparisonCell} ${styles.comparisonUs}`}>
                  {row.us}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

/* ============================================================
   Icons for the NEW principles.
   ============================================================ */

function WalletIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
      <path
        d="M3 8a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8z"
        strokeLinejoin="round"
      />
      <path d="M3 10h18" strokeLinecap="round" />
      <circle cx="17" cy="14" r="1.2" fill="currentColor" stroke="none" />
    </svg>
  );
}

function ScalesIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
      <path d="M12 4v16" strokeLinecap="round" />
      <path d="M6 7h12" strokeLinecap="round" />
      <path d="M3 14l3-7 3 7" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M15 14l3-7 3 7" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3 14a3 3 0 0 0 6 0" strokeLinecap="round" />
      <path d="M15 14a3 3 0 0 0 6 0" strokeLinecap="round" />
    </svg>
  );
}

function InfinityIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
      <path
        d="M7 12c0-2.2 1.6-4 3.7-4 1.5 0 2.6 1 3.3 2.3 0.7 1.3 1.8 2.3 3.3 2.3 2.1 0 3.7-1.8 3.7-4s-1.6-4-3.7-4c-1.5 0-2.6 1-3.3 2.3-0.7 1.3-1.8 2.3-3.3 2.3C3.6 8 2 9.8 2 12s1.6 4 3.7 4c1.5 0 2.6-1 3.3-2.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
