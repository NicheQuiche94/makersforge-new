import type { Metadata } from "next";
import { Logo } from "@/components/atoms/Logo";
import styles from "./lab.module.css";

export const metadata: Metadata = {
  title: "Design Lab · MakersForge",
  description:
    "Internal side-by-side design experiments. Not indexed.",
  robots: { index: false, follow: false },
};

export default function LabPage() {
  return (
    <div className={styles.lab}>
      {/* Intro */}
      <section className={styles.intro}>
        <div className="container">
          <p className="kicker">Internal · design lab</p>
          <h1 className={styles.h1}>
            side-by-side <span className="gr">experiments.</span>
          </h1>
          <p className={styles.introCopy}>
            Andre and Claude evaluate design moves here before propagating to
            the main pages. Each experiment shows variants stacked so you
            can scroll-compare in one pass. Not indexed.
          </p>
        </div>
      </section>

      {/* ============================================================
          EXPERIMENT 06 · Stat strip restyle iterations
          Andre's note 2026-05-30: current stat strip looks better
          than before but Cal Sans feels angular at that scale and
          the mixed colours (black "50" + orange "+") feel weird.
          Four iterations exploring different directions.
          ============================================================ */}
      <section className={styles.experiment}>
        <div className="container">
          <header className={styles.expHeader}>
            <p className={`kicker ${styles.expKicker}`}>
              Experiment 06 · Stat strip iterations
            </p>
            <h2 className={styles.expH2}>
              cal sans, gradient pills, tiger stripe, or figtree heavy?
            </h2>
            <p className={styles.expCopy}>
              Current production uses Cal Sans with mixed
              ink+gradient values in a hairline-ruled magazine strip.
              Andre&apos;s read: looks angular and the colour mix
              feels off. Four variants below to compare.
            </p>
          </header>
        </div>

        <StatN1Baseline />
        <StatN2GradientPills />
        <StatN3TigerStripe />
        <StatN4Figtree />

        <div className="container">
          <p className={styles.afterNote}>
            Pick a direction and I&apos;ll propagate to the live
            StatStrip component.
          </p>
        </div>
      </section>

      {/* ============================================================
          EXPERIMENT 07 · Roster list-style banner rows
          Andre's note 2026-05-30: tiger-stripe roster cards work,
          but a list-style with full-banner rows could also be very
          effective. One variant to compare against current grid.
          ============================================================ */}
      <section className={styles.experiment}>
        <div className="container">
          <header className={styles.expHeader}>
            <p className={`kicker ${styles.expKicker}`}>
              Experiment 07 · Roster list-style banner rows
            </p>
            <h2 className={styles.expH2}>
              full-width banner rows vs the tiger-stripe grid.
            </h2>
            <p className={styles.expCopy}>
              Current production: 3-column grid of cards with
              tiger-stripe alternation. Alternative: each profile is a
              full-container-width banner row, ~120px tall, profile
              data laid out horizontally. Reads as a directory listing
              rather than a card wall.
            </p>
          </header>
        </div>

        <RosterListBannerMock />

        <div className="container">
          <p className={styles.afterNote}>
            Compare against the live{" "}
            <a
              href="/line-up"
              style={{ color: "var(--ink)", textDecoration: "underline" }}
            >
              /line-up
            </a>{" "}
            tiger-stripe grid. Pick one or hybrid.
          </p>
        </div>
      </section>

      {/* ============================================================
          EXPERIMENT 05 · HowItWorks bento — LOCKED & PROPAGATED
          L2 pair-grouping pattern with 3 tiles won. The "terms"
          tile was dropped (redundant with the pricing page). Live
          version reflects this exactly. Lab mock retained below
          as the historical reference of what was decided.
          ============================================================ */}
      <section className={styles.experiment}>
        <div className="container">
          <header className={styles.expHeader}>
            <p className={`kicker ${styles.expKicker}`}>
              Experiment 05 · HowItWorks bento ·{" "}
              <span style={{ color: "var(--ink)" }}>
                locked &amp; propagated
              </span>
            </p>
            <h2 className={styles.expH2}>
              pair grouping + bleed. terms tile dropped.
            </h2>
            <p className={styles.expCopy}>
              <strong>Locked: L2 pair-grouping with 3 tiles.</strong>{" "}
              Row 1: small paper &ldquo;01 tell us the gap&rdquo; +
              big heat &ldquo;02 we match.&rdquo; side-by-side. Row
              2: full-width charcoal &ldquo;03 they get to
              work.&rdquo; with right bleed. The 4th terms tile was
              dropped (information lives on the pricing page).
              Mock below kept as historical reference. Live version
              now matches.
            </p>
          </header>
        </div>

        <HowMockL2 />
      </section>

      {/* ============================================================
          EXPERIMENT 04 · Full Statement section iteration (v7)
          v6 J1 (left-aligned big statements) confirmed as the
          direction. Three corrections + restructure for v7:
            1. ALIGNMENT: Headline + body now share a max-width
               sized to the headline's widest line ("slow you
               down."). Body's left and right edges visually align
               with the headline's bounds. Previously the body had
               its own max-width (880px centred) which extended
               wider than the headline on both sides.
            2. STRUCTURE: Body restructured from two long statements
               into three short ones, each a separate phrase with
               its own visual weight: setup beats, tension hit,
               resolution. Internal line breaks within each statement
               for readability (e.g. "you ship at speed." and "you
               find what works." as two lines within statement A).
            3. NO EM-DASHES anywhere. Period-only punctuation. This
               is a durable site-wide style rule, not just this
               section.
          Copy still placeholder. Andre flagged some inaccuracies
          (this isn't a quarter-long crawl, the bench warming line
          could be tightened). Copywriting pass deferred until
          layout is fully locked.
          ============================================================ */}
      <section className={styles.experiment}>
        <div className="container">
          <header className={styles.expHeader}>
            <p className={`kicker ${styles.expKicker}`}>
              Experiment 04 · Full Statement section iteration (v7)
            </p>
            <h2 className={styles.expH2}>
              aligned. broken up. no em-dashes.
            </h2>
            <p className={styles.expCopy}>
              v6 J1 confirmed. Three corrections:{" "}
              <strong>
                headline + body share a max-width matched to the
                headline&apos;s widest line
              </strong>{" "}
              so the left/right edges align;{" "}
              <strong>
                body broken into three statements
              </strong>{" "}
              (setup / tension / resolution), each can break across
              multiple lines internally; and{" "}
              <strong>no em-dashes anywhere</strong> (site-wide style
              rule). Copy still placeholder. Lock the layout first.
            </p>
          </header>
        </div>

        <StatementCurrent />
        <StatementSectionK1 />

        <div className="container">
          <p className={styles.afterNote}>
            Confirm alignment / structure, then I propagate to the
            live Statement section. Copywriting pass separately.
            Then Experiment 05 (HowItWorks bento dramatic mixed
            sizes).
          </p>
        </div>

        <div className="container">
          <p className={`${styles.afterNote} ${styles.rejectedNote}`}>
            Below: rejected first-pass attempts (A / B / C) kept dim
            for reference. Word-by-word grid anchoring read as
            disjointed rather than asymmetric. Other rejected
            generations (D-J) removed.
          </p>
        </div>

        <div className={styles.dimmedAttempts}>
          <StatementVariantA />
          <StatementVariantB />
          <StatementVariantC />
        </div>
      </section>

      {/* ============================================================
          EXPERIMENT 01 · Bleed wordmark — REJECTED
          The bleed depends on the references' edge-to-edge aesthetic
          (photos bleeding, wordmarks bleeding). Our containerized
          aesthetic (rounded panels inside max-width container,
          hairlines as boundaries) created tension rather than
          signature. Kept as a record of what was tried, not a
          direction to revisit.
          ============================================================ */}
      <section className={styles.experimentRejected}>
        <div className="container">
          <header className={styles.expHeader}>
            <p className={`kicker ${styles.expKicker}`}>
              Experiment 01 · Bleed wordmark · <span style={{ color: "#c72e00" }}>rejected</span>
            </p>
            <h2 className={styles.expH2}>didn&apos;t translate.</h2>
            <p className={styles.expCopy}>
              Bleed needs an edge-to-edge aesthetic to land. Our
              containerized rounded-panel + cream BG creates tension
              with it rather than signature. Moving on.
            </p>
          </header>
        </div>
      </section>

      {/* ============================================================
          EXPERIMENT 02 · Full-bleed hero (Reload Creative Branding pattern)
          - Heat gradient runs full section (no rounded panel)
          - Glass full-width nav (no centered pill)
          - White type across everything with weight contrast
          - Glass UI containers as floating data overlays
          ============================================================ */}
      <section className={styles.experiment}>
        <div className="container">
          <header className={styles.expHeader}>
            <p className={`kicker ${styles.expKicker}`}>
              Experiment 02 · Full-bleed hero (Reload pattern)
            </p>
            <h2 className={styles.expH2}>
              full-bleed gradient, glass nav, glass UI cards, white type.
            </h2>
            <p className={styles.expCopy}>
              Pattern from the Creative Branding Agency reference. Hero
              panel container dropped; heat gradient + composite radials
              + noise run the FULL section. Nav becomes a full-width
              glass bar instead of the centered pill. Typography all
              white with weight contrast carrying the rhythm. Floating
              glass UI cards layered for data overlays. Single mock
              below — if direction lands we iterate variants.
            </p>
          </header>
        </div>

        <HeroV2Mock />

        <div className="container">
          <p className={styles.afterNote}>
            ↑ v2 of the mock. Logo monochrome white, &quot;you brief it.&quot;
            dropped, &quot;growth team contractors. on call.&quot; promoted to
            main headline, top-right is a small editorial masthead, all
            four glass pills uniform. If this lands: I propagate to
            homepage (replaces the current rounded hero panel), nav
            decision below decides which pattern goes site-wide.
          </p>
        </div>
      </section>

      {/* ============================================================
          EXPERIMENT 03 · Nav variants
          Same nav element shown four ways on heat-glow strips so we
          can compare against the gradient surface. We'll need to
          confirm the winner also works on cream sections.
          ============================================================ */}
      <section className={styles.experiment}>
        <div className="container">
          <header className={styles.expHeader}>
            <p className={`kicker ${styles.expKicker}`}>
              Experiment 03 · Nav variants
            </p>
            <h2 className={styles.expH2}>which nav pattern goes site-wide?</h2>
            <p className={styles.expCopy}>
              Four patterns shown on heat-glow strips so we can compare
              against the gradient hero. Same logo + same links + same
              CTA in each; only the layout/treatment changes. Once a
              winner is picked we&apos;ll also confirm it reads on cream
              sections.
            </p>
          </header>
        </div>

        <NavStage
          label="Variant A · Full-width glass bar (current Exp 02 mock)"
          description="Edge-to-edge glass strip. Logo flush-left, links center, CTA flush-right. Holds the whole top of the viewport."
        >
          <NavVariantA />
        </NavStage>

        <NavStage
          label="Variant B v2 · Centered floating pill — condensed + balanced + whiter"
          description="Andre's pick from the first pass. Tightened: logo bumped to size 34 so its hex matches the CTA button height (balanced). Link colour bumped from 0.72→0.85 white (less faded). Pill padding tighter and tighter gap between links — feels apps-and-games-shaped, gives the artsy editorial vibe a UI element to live inside."
        >
          <NavVariantB />
        </NavStage>

        <NavStage
          label="Variant E · Logo in white card + separate links pill (modified D)"
          description="Logo gets its own little white container on the left so it can keep its NORMAL colours (gradient hex + ink MF + ink wordmark) instead of being all-white-on-glass. Links + CTA sit as a separate floating glass pill on the right. Two distinct chips, edge-anchored."
        >
          <NavVariantE />
        </NavStage>

        <NavStage
          label="Variant F · NEW · White pill + gradient CTA + normal-colour logo"
          description="Same structure as B v2 (single centered pill, condensed) but inverted: pill background is white (95% alpha, soft backdrop-blur), so the logo can sit in its NORMAL colours (gradient hex + ink MF + ink wordmark) inside the pill itself. CTA flips from solid white → gradient background with white text. Single-element nav (no white card + glass pill split like E). Compare against E above."
        >
          <NavVariantF />
        </NavStage>

        <NavStage
          label="Variant A · Full-width glass bar (reference)"
          description="Original Exp 02 mock direction. Kept here for context."
        >
          <NavVariantA />
        </NavStage>

        <NavStage
          label="Variant C · Edge-anchored, no container (reference)"
          description="Lightest treatment. Kept here for context."
        >
          <NavVariantC />
        </NavStage>

        <NavStage
          label="Variant D · Split with centered links pill (reference — superseded by E)"
          description="Original split direction. Variant E above is a refinement that swaps the centered-links-pill for a white logo card to solve the &quot;logo all-white on glass&quot; readability issue."
        >
          <NavVariantD />
        </NavStage>

        <div className="container">
          <p className={styles.afterNote}>
            Once a nav direction lands, I&apos;ll confirm it reads on
            cream sections too (homepage scroll past the hero, roster
            page header, pricing page header — all cream surfaces). The
            glass treatment needs an alpha + blur variation that works
            on both gradient AND cream.
          </p>
        </div>
      </section>
    </div>
  );
}

/* ============================================================
   STAT STRIP MOCKS · Experiment 06
   Four variants of the homepage stats row. Same data, different
   typographic + container treatments.
   ============================================================ */

type StatN = { val: React.ReactNode; label: string };

const STATS_N: StatN[] = [
  { val: <>50<span className="gr">+</span></>, label: "on the lineup" },
  { val: <span className="gr">2</span>, label: "disciplines live" },
  { val: <>&lt;7<span className="gr">d</span></>, label: "avg deployment" },
  { val: "£0", label: "% of salary taken" },
];

function StatSlot({
  label,
  description,
  children,
}: {
  label: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className={styles.stmtSlot}>
      <div className="container">
        <p className={styles.variantLabel}>{label}</p>
        <p className={styles.navStageDesc}>{description}</p>
      </div>
      <div className={styles.statStage}>
        <div className="container">{children}</div>
      </div>
    </div>
  );
}

/* N1 — baseline / production. Cal Sans values, hairlines, ink+gradient mix. */
function StatN1Baseline() {
  return (
    <StatSlot
      label="Variant N1 · Baseline (current production)"
      description="What's live now. Cal Sans, hairlines between cells, mixed ink and gradient on the values. Reference point only."
    >
      <div className={styles.statRowBare}>
        {STATS_N.map((s, i) => (
          <div key={i} className={styles.statCellBare}>
            <p className={styles.statNCal}>{s.val}</p>
            <p className={styles.statLabel}>{s.label}</p>
          </div>
        ))}
      </div>
    </StatSlot>
  );
}

/* N2 — gradient pills. Each cell is its own heat-gradient pill with
   white value and white label. Solves the "mixed colours feel weird"
   issue by going uniform-gradient across all cells. */
function StatN2GradientPills() {
  return (
    <StatSlot
      label="Variant N2 · Gradient pills, white text"
      description="Each cell becomes its own heat-gradient pill with white value and white label. Eliminates the mixed black/orange colour issue by going uniform gradient everywhere."
    >
      <div className={styles.statRowPills}>
        {STATS_N.map((s, i) => (
          <div key={i} className={`heat-glow ${styles.statPill}`}>
            <p className={styles.statNCalWhite}>{s.val}</p>
            <p className={styles.statLabelWhite}>{s.label}</p>
          </div>
        ))}
      </div>
    </StatSlot>
  );
}

/* N3 — tiger stripe. Alternate paper card + gradient card across
   the 4 cells. Echoes the roster page tiger-stripe pattern site-wide. */
function StatN3TigerStripe() {
  return (
    <StatSlot
      label="Variant N3 · Tiger-striped pills (paper / gradient alternating)"
      description="Alternates paper cells and gradient cells across the row. Echoes the roster page tiger-stripe pattern, ties the visual language together across sections."
    >
      <div className={styles.statRowPills}>
        {STATS_N.map((s, i) => {
          const isGrad = i % 2 === 1;
          return (
            <div
              key={i}
              className={`${
                isGrad ? "heat-glow " : ""
              }${styles.statPill} ${isGrad ? styles.statPillGrad : styles.statPillPaper}`}
            >
              <p
                className={
                  isGrad ? styles.statNCalWhite : styles.statNCal
                }
              >
                {s.val}
              </p>
              <p
                className={
                  isGrad ? styles.statLabelWhite : styles.statLabel
                }
              >
                {s.label}
              </p>
            </div>
          );
        })}
      </div>
    </StatSlot>
  );
}

/* N4 — Figtree heavy treatment. Same hairline strip as baseline but
   the value font swaps to Figtree 800 to test whether the angular
   Cal Sans feel goes away at this size. */
function StatN4Figtree() {
  return (
    <StatSlot
      label="Variant N4 · Hairline strip with Figtree heavy values"
      description="Same hairline structure as baseline but the values use Figtree 800 instead of Cal Sans. Tests whether Cal Sans's angularity is the problem at this scale."
    >
      <div className={styles.statRowBare}>
        {STATS_N.map((s, i) => (
          <div key={i} className={styles.statCellBare}>
            <p className={styles.statNFig}>{s.val}</p>
            <p className={styles.statLabel}>{s.label}</p>
          </div>
        ))}
      </div>
    </StatSlot>
  );
}

/* ============================================================
   ROSTER LIST-STYLE BANNER MOCK · Experiment 07
   Full-container-width banner rows. Profile data laid out
   horizontally inside each row.
   ============================================================ */

type ListProfile = {
  m: string;
  name: string;
  role: string;
  loc: string;
  rate: string;
  av: boolean;
};

const LIST_PROFILES: ListProfile[] = [
  { m: "ua·101", name: "senior ua manager", role: "ex-supercell · games + apps", loc: "uk · remote", rate: "£600–750", av: true },
  { m: "art·204", name: "perf. creative lead", role: "ex-calm · apps", loc: "eu remote", rate: "£500–650", av: true },
  { m: "ua·114", name: "head of ua", role: "ex-rovio · games", loc: "helsinki", rate: "£700–850", av: false },
  { m: "art·211", name: "senior motion designer", role: "ex-king · games", loc: "lisbon", rate: "£450–550", av: true },
];

function RosterListBannerMock() {
  return (
    <StatSlot
      label="Variant · Full-width banner rows (list style)"
      description="Each profile is a full-container-width banner row, ~110px tall. Codename + name + role on the left, location + rate in the middle, availability status on the right. Tiger-striped paper/gradient alternation kept so the visual rhythm carries over from the grid."
    >
      <div className={styles.rosterList}>
        {LIST_PROFILES.map((p, i) => {
          const isGrad = i % 2 === 1;
          return (
            <div
              key={p.m}
              className={`${
                isGrad ? "heat-glow " : ""
              }${styles.rosterRow} ${
                isGrad ? styles.rosterRowGrad : styles.rosterRowPaper
              }`}
            >
              <div className={styles.rosterRowLeft}>
                <span
                  className={`${styles.rosterMono} ${
                    isGrad ? styles.rosterOnDark : ""
                  }`}
                >
                  {p.m}
                </span>
                <h3
                  className={`${styles.rosterRowName} ${
                    isGrad ? styles.rosterOnDark : ""
                  }`}
                >
                  {p.name}
                </h3>
                <p
                  className={`${styles.rosterRowRole} ${
                    isGrad ? styles.rosterRowRoleOnDark : ""
                  }`}
                >
                  {p.role}
                </p>
              </div>
              <div className={styles.rosterRowMid}>
                <RosterRowMeta
                  k="location"
                  v={p.loc}
                  onDark={isGrad}
                />
                <RosterRowMeta
                  k="day rate"
                  v={p.rate}
                  onDark={isGrad}
                />
              </div>
              <div className={styles.rosterRowRight}>
                <span
                  className={`${styles.rosterRowStatus} ${
                    p.av ? styles.statusAv : styles.statusCt
                  } ${isGrad ? styles.statusOnDark : ""}`}
                >
                  <span className={styles.rosterStatusDot} />
                  {p.av ? "available" : "in contract"}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </StatSlot>
  );
}

function RosterRowMeta({
  k,
  v,
  onDark,
}: {
  k: string;
  v: string;
  onDark: boolean;
}) {
  return (
    <div className={styles.rosterRowMetaCell}>
      <span
        className={`${styles.rosterRowK} ${
          onDark ? styles.rosterRowKOnDark : ""
        }`}
      >
        {k}
      </span>
      <span
        className={`${styles.rosterRowV} ${
          onDark ? styles.rosterRowVOnDark : ""
        }`}
      >
        {v}
      </span>
    </div>
  );
}

/* ============================================================
   HOW IT WORKS BENTO MOCKS · Experiment 05
   Local rendering of bento tiles so we can experiment with
   widths / surfaces / alignment / bleed without touching the
   live HowItWorksBento component.
   ============================================================ */

type MockSurface = "paper" | "heat" | "charcoal" | "card";
type MockAlign = "left" | "right";

type MockTile = {
  num: string;
  title: React.ReactNode;
  body: string;
  surface: MockSurface;
  align: MockAlign;
  widthPct: number;
  pill?: string;
  bleed?: "right";
};

function MockTileRow({ tile }: { tile: MockTile }) {
  const onDark = tile.surface === "heat" || tile.surface === "charcoal";
  return (
    <div
      className={`${styles.howWrap} ${
        tile.align === "right" ? styles.howAlignRight : styles.howAlignLeft
      }`}
    >
      <div
        className={`${styles.howTile} ${styles[`howSurface_${tile.surface}`]} ${
          tile.surface === "heat" ? "heat-glow" : ""
        } ${tile.bleed === "right" ? styles.howBleedRight : ""}`}
        style={{ width: `${tile.widthPct}%` }}
      >
        <span
          className={`${styles.howNum} ${onDark ? styles.howNumOnDark : ""}`}
          aria-hidden="true"
        >
          {tile.num}
        </span>
        <div className={styles.howContent}>
          <h3
            className={`${styles.howTitle} ${
              onDark ? styles.howTitleOnDark : ""
            }`}
          >
            {tile.title}
          </h3>
          <p
            className={`${styles.howBody} ${onDark ? styles.howBodyOnDark : ""}`}
          >
            {tile.body}
          </p>
          {tile.pill && (
            <span className={styles.howPill}>
              <span className={styles.howPillDot} aria-hidden="true" />
              {tile.pill}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

/* L2 (LOCKED) · Pair grouping with 3 tiles. Row 1: small paper +
   big heat side-by-side. Row 2: charcoal full-width with right
   bleed. Terms tile dropped — redundant with pricing page. */
function HowMockL2() {
  return (
    <div className={styles.howSlot}>
      <div className="container">
        <p className={styles.variantLabel}>
          Variant L2 (LOCKED) · Pair grouping, 3 tiles, charcoal bleed
        </p>
        <p className={styles.navStageDesc}>
          Row 1: small paper &ldquo;01 tell us the gap&rdquo; + big
          heat &ldquo;02 we match.&rdquo; side-by-side. Row 2:
          full-width charcoal &ldquo;03 they get to work.&rdquo; with
          right bleed. Live HowItWorks now matches this exactly.
        </p>
      </div>
      <div className={styles.howStage}>
        <div className="container">
          <div className={styles.howHeader}>
            <div>
              <p className="kicker">how it works</p>
              <h2 className={styles.howHeadline}>
                brief monday. working <span className="gr">by friday.</span>
              </h2>
            </div>
            <p className={styles.howTopCopy}>
              Three steps, no recruitment theatre. You&apos;re talking
              to operators we already know within a day.
            </p>
          </div>

          <div className={styles.howGrid}>
            {/* Row 1: paper small + heat big */}
            <div className={styles.howRow}>
              <MockTileRow
                tile={{
                  num: "01",
                  title: (
                    <>
                      tell us <span className="gr">the gap</span>
                    </>
                  ),
                  body: "UA lead for a launch, performance creative for a refresh, a fractional head of growth. Tell us the shape and the timeline.",
                  surface: "paper",
                  align: "left",
                  widthPct: 100,
                }}
              />
              <MockTileRow
                tile={{
                  num: "02",
                  title: "we match.",
                  body: "Vetted roster of senior operators we already know. Shortlist of real people, real availability, fast.",
                  surface: "heat",
                  align: "left",
                  widthPct: 100,
                  pill: "shortlist in 48h",
                }}
              />
            </div>

            {/* Row 2: charcoal full-width with right bleed */}
            <MockTileRow
              tile={{
                num: "03",
                title: "they get to work.",
                body: "You contract and pay them directly. Flat monthly fee for each month they're engaged. Scale up, scale down, stop any time.",
                surface: "charcoal",
                align: "left",
                widthPct: 102,
                bleed: "right",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   STATEMENT VARIANTS · Experiment 04
   Each variant renders just the headline portion of the Statement
   section in a bg-deep slot so we can compare composition without
   the chapters below adding noise.
   ============================================================ */

function StatementSlot({
  label,
  description,
  children,
}: {
  label: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className={styles.stmtSlot}>
      <div className="container">
        <p className={styles.variantLabel}>{label}</p>
        <p className={styles.navStageDesc}>{description}</p>
      </div>
      <div className={styles.stmtStage}>
        <div className="container">{children}</div>
      </div>
    </div>
  );
}

/* Baseline — the current production treatment with progressive
   margin-left indents on each line. */
function StatementCurrent() {
  return (
    <StatementSlot
      label="Baseline · current production (progressive margin-left indents)"
      description="What's on the live Statement section right now. Each line ramps further right by a clamp-based margin-left value. Organic stagger, no grid system underneath."
    >
      <h2 className={styles.stmtHCurrent}>
        <span className={styles.stmtCurrentL1}>hiring</span>
        <span className={styles.stmtCurrentL2}>
          <em>shouldn&apos;t.</em>
        </span>
        <span className={styles.stmtCurrentL3}>
          slow <span className="gr">growth.</span>
        </span>
      </h2>
    </StatementSlot>
  );
}

/* Variant A — light 12-col grid anchoring. Each line anchored to
   a specific column range but the change vs baseline is subtle.
   Feels deliberate without being dramatic. */
function StatementVariantA() {
  return (
    <StatementSlot
      label="Variant A · Light 12-col grid anchor"
      description="Lines anchored to specific columns: 'hiring' col 1-4, 'shouldn't.' col 4-8 (centred-ish indent), 'slow growth.' col 1-10 (spans most of width). Subtle but the underlying grid logic shows."
    >
      <h2 className={styles.stmtHGrid}>
        <span className={styles.stmtAL1}>hiring</span>
        <span className={styles.stmtAL2}>
          <em>shouldn&apos;t.</em>
        </span>
        <span className={styles.stmtAL3}>
          slow <span className="gr">growth.</span>
        </span>
      </h2>
    </StatementSlot>
  );
}

/* Variant B — dramatic Swiss-grid stagger. Bigger column jumps
   between lines, the diagonal flow is the composition. */
function StatementVariantB() {
  return (
    <StatementSlot
      label="Variant B · Dramatic Swiss-grid stagger"
      description="Bigger column jumps: 'hiring' col 1-3, 'shouldn't.' col 6-9 (deep right indent), 'slow growth.' col 2-10. Reads as a deliberate staircase, more confidently asymmetric."
    >
      <h2 className={styles.stmtHGrid}>
        <span className={styles.stmtBL1}>hiring</span>
        <span className={styles.stmtBL2}>
          <em>shouldn&apos;t.</em>
        </span>
        <span className={styles.stmtBL3}>
          slow <span className="gr">growth.</span>
        </span>
      </h2>
    </StatementSlot>
  );
}

/* ============================================================
   v7 DIRECTION — locked. Pumpkin pattern + corrected alignment.
   Headline and body share .lockedColumn with max-width tracked
   to the headline's widest line. Body broken into 3 statements.
   No em-dashes (site-wide rule).
   ============================================================ */

function FullStatementSlot({
  label,
  description,
  children,
}: {
  label: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className={styles.stmtSlot}>
      <div className="container">
        <p className={styles.variantLabel}>{label}</p>
        <p className={styles.navStageDesc}>{description}</p>
      </div>
      <div className={styles.fullStmtStage}>
        <div className="container">{children}</div>
      </div>
    </div>
  );
}

/* K1 · Locked direction with corrected alignment + 3-statement
   structure. Single live variant; v6's J2/J3 directions retired. */
function StatementSectionK1() {
  return (
    <FullStatementSlot
      label="Variant K · Locked direction. Aligned. 3 statements. No em-dashes."
      description={
        "Headline + body share a max-width sized to the headline's widest line ('slow you down.') so left/right edges align. Body restructured to three short statements (setup beats / tension hit / resolution), each with internal line breaks. Period-only punctuation throughout. Copy still placeholder."
      }
    >
      <div className={styles.fullStmtInner}>
        <div className={styles.lockedColumn}>
          <h2 className={`${styles.stmtFlowG} ${styles.stmtCenter}`}>
            don&apos;t let{" "}
            <span className={styles.gradientFill}>hiring</span>
            <br />
            <span className={styles.italicCal}>slow you down</span>.
          </h2>

          <div className={styles.lockedBody}>
            <p className={styles.bigStatement}>
              you ship at speed.
              <br />
              you find what works.
            </p>
            <p className={`${styles.bigStatement} ${styles.statementRight}`}>
              then hiring drags you back to a quarter long crawl.
            </p>
            <p className={`${styles.bigStatement} ${styles.statementCenter}`}>
              we keep the bench warm.
              <br />
              brief monday, shortlist friday, contracts the next week.
              <br />
              growth keeps its pace.
            </p>
          </div>
        </div>
      </div>
    </FullStatementSlot>
  );
}

/* Variant C — mixed alignment. Some lines anchored to the right
   edge of their column span for asymmetric balance. Most editorial
   of the three. */
function StatementVariantC() {
  return (
    <StatementSlot
      label="Variant C · Mixed alignment — line 2 right-anchored"
      description="Lines 1 and 3 stay left-anchored, line 2 ('shouldn't.') anchored to the right edge of its grid span. Creates magazine-style asymmetric balance — the eye moves left → right → left across the lines."
    >
      <h2 className={styles.stmtHGrid}>
        <span className={styles.stmtCL1}>hiring</span>
        <span className={styles.stmtCL2}>
          <em>shouldn&apos;t.</em>
        </span>
        <span className={styles.stmtCL3}>
          slow <span className="gr">growth.</span>
        </span>
      </h2>
    </StatementSlot>
  );
}

/* ============================================================
   NavStage — wraps each nav variant with a label + description
   so Andre can scroll-compare with context.
   ============================================================ */
function NavStage({
  label,
  description,
  children,
}: {
  label: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className={styles.navStageWrap}>
      <div className="container">
        <p className={styles.navStageLabel}>{label}</p>
        <p className={styles.navStageDesc}>{description}</p>
      </div>
      {children}
    </div>
  );
}

/* ============================================================
   Variant shell — provides a compact mock context (hero-ends
   marker → wordmark slot → next-section-starts marker) so Andre
   can see the bleed in its intended position without rendering
   the full hero panel above each variant.
   ============================================================ */
function Variant({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <article className={styles.variant}>
      <div className="container">
        <p className={styles.variantLabel}>{label}</p>
        <div className={styles.heroEnd}>↑ hero panel ends here ↑</div>
      </div>

      {/* The wordmark slot is full-width so the wordmark can actually
          extend past the viewport edge — that's the whole point. */}
      <div className={styles.wordmarkSlot}>{children}</div>

      <div className="container">
        <div className={styles.nextStart}>↓ next section begins here ↓</div>
      </div>
    </article>
  );
}

/* ============================================================
   Wordmark — the bleed element under test.
   ============================================================ */
type WordmarkProps = {
  text: string;
  opacity?: number;
  italic?: boolean;
  gradient?: boolean;
  sizePreset?: "md" | "lg" | "xl";
  tight?: boolean;
};

function HeroV2Mock() {
  return (
    <div className={`heat-glow ${styles.heroV2}`}>
      {/* GLASS FULL-WIDTH NAV
          Logo uses monochrome white — gradient on the hex stroke fought
          the orange BG. Solid white reads clean. */}
      <nav className={styles.glassNav}>
        <div className={styles.glassNavInner}>
          <div className={styles.glassNavLogo}>
            <Logo size={32} monochrome="#fff" />
          </div>
          <ul className={styles.glassNavLinks}>
            <li>the roster</li>
            <li>how it works</li>
            <li>pricing</li>
            <li>about</li>
          </ul>
          <a href="#" className={styles.glassNavCta}>
            book a call
          </a>
        </div>
      </nav>

      {/* HERO CONTENT */}
      <div className={styles.heroV2Inner}>
        <div className={styles.heroV2Top}>
          <p className={styles.heroV2Kicker}>
            <span className={styles.pulseDot} aria-hidden="true" />
            mobile apps &amp; games · EMEA
          </p>

          {/* Top-right minor editorial credit — small magazine-masthead
              detail. Two lines, low-opacity white, tracked uppercase.
              Holds the corner without competing with the headline. */}
          <div className={styles.heroV2Masthead}>
            <span>est. 2026</span>
            <span>a SeedCraft venture</span>
          </div>
        </div>

        {/* MAIN HEADLINE — "growth team contractors. on call." is the
            dominant moment now. Line 1 flush left, line 2 ("on call.")
            offset right and italic-emphasised. The old "you brief it.
            they build it." placeholder dropped. */}
        <div className={styles.heroV2Middle}>
          <h1 className={styles.headlineBig}>
            <span className={styles.headlineLine1}>
              growth team contractors.
            </span>
            <span className={styles.headlineLine2}>on call.</span>
          </h1>
        </div>

        {/* BOTTOM — 4 UNIFORM glass pills + CTAs.
            Previous large-white-card-for-85% broke the rhythm — all
            four pills now share the same glass treatment for
            consistency. */}
        <div className={styles.heroV2Bottom}>
          <div className={styles.glassCards}>
            <div className={styles.glassCard}>
              <span className={styles.pulseDot} aria-hidden="true" />
              32 available now
            </div>
            <div className={styles.glassCard}>85% same-week shortlist</div>
            <div className={styles.glassCard}>EMEA · UK · 8 cities</div>
            <div className={styles.glassCard}>est. 2026 · SeedCraft</div>
          </div>

          <div className={styles.heroV2Cta}>
            <a href="#" className={styles.btnLight}>
              see who&apos;s available →
            </a>
            <a href="#" className={styles.btnGlass}>
              how it works
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   EXPERIMENT 03 · Nav variants
   Andre's call: show options for the nav so we can pick the right
   pattern across all pages (works on gradient AND cream).
   ============================================================ */

function NavVariantA() {
  return (
    <div className={`heat-glow ${styles.navStage}`}>
      <nav className={styles.glassNav}>
        <div className={styles.glassNavInner}>
          <Logo size={32} monochrome="#fff" />
          <ul className={styles.glassNavLinks}>
            <li>the roster</li>
            <li>how it works</li>
            <li>pricing</li>
            <li>about</li>
          </ul>
          <a href="#" className={styles.glassNavCta}>
            book a call
          </a>
        </div>
      </nav>
    </div>
  );
}

function NavVariantB() {
  return (
    <div className={`heat-glow ${styles.navStage}`}>
      <div className={styles.navStageInner}>
        <nav className={styles.pillNav}>
          <Logo size={34} monochrome="#fff" />
          <ul className={styles.pillNavLinks}>
            <li>the roster</li>
            <li>how it works</li>
            <li>pricing</li>
            <li>about</li>
          </ul>
          <a href="#" className={styles.pillNavCta}>
            book a call
          </a>
        </nav>
      </div>
    </div>
  );
}

/* Variant F — invert Variant B v2: white pill background, gradient
   CTA with white text. Because the surface under the logo is now
   white, the logo can sit in its NORMAL colours (gradient hex + ink
   MF + ink wordmark) inside the pill itself. No separate logo card
   needed. */
function NavVariantF() {
  return (
    <div className={`heat-glow ${styles.navStage}`}>
      <div className={styles.navStageInner}>
        <nav className={styles.pillNavWhite}>
          <Logo size={34} />
          <ul className={styles.pillNavWhiteLinks}>
            <li>the roster</li>
            <li>how it works</li>
            <li>pricing</li>
            <li>about</li>
          </ul>
          <a href="#" className={styles.pillNavWhiteCta}>
            book a call
          </a>
        </nav>
      </div>
    </div>
  );
}

/* Variant E — Andre's modified-D direction. Logo gets its own white
   "card" container on the left so it can keep its NORMAL colours
   (gradient hex stroke + ink MF + ink wordmark). Links + CTA sit
   in a separate floating glass pill on the right. Two separated
   elements, like UI chips. */
function NavVariantE() {
  return (
    <div className={`heat-glow ${styles.navStage}`}>
      <nav className={styles.duoNav}>
        <div className={styles.duoNavLogoCard}>
          <Logo size={30} />
        </div>
        <div className={styles.duoNavPill}>
          <ul className={styles.duoNavLinks}>
            <li>the roster</li>
            <li>how it works</li>
            <li>pricing</li>
            <li>about</li>
          </ul>
          <a href="#" className={styles.duoNavCta}>
            book a call
          </a>
        </div>
      </nav>
    </div>
  );
}

function NavVariantC() {
  return (
    <div className={`heat-glow ${styles.navStage}`}>
      <nav className={styles.edgeNav}>
        <div className={styles.edgeNavLogo}>
          <Logo size={32} monochrome="#fff" />
        </div>
        <div className={styles.edgeNavRight}>
          <ul className={styles.edgeNavLinks}>
            <li>the roster</li>
            <li>how it works</li>
            <li>pricing</li>
            <li>about</li>
          </ul>
          <a href="#" className={styles.edgeNavCta}>
            book a call
          </a>
        </div>
      </nav>
    </div>
  );
}

function NavVariantD() {
  return (
    <div className={`heat-glow ${styles.navStage}`}>
      <nav className={styles.splitNav}>
        <div className={styles.splitNavLeft}>
          <Logo size={32} monochrome="#fff" />
        </div>
        <div className={styles.splitNavCenter}>
          <ul>
            <li>the roster</li>
            <li>how it works</li>
            <li>pricing</li>
            <li>about</li>
          </ul>
        </div>
        <div className={styles.splitNavRight}>
          <a href="#">book a call</a>
        </div>
      </nav>
    </div>
  );
}

function Wordmark({
  text,
  opacity = 0.08,
  italic = false,
  gradient = false,
  sizePreset = "lg",
  tight = false,
}: WordmarkProps) {
  const sizes: Record<string, string> = {
    md: "clamp(120px, 18vw, 240px)",
    lg: "clamp(180px, 26vw, 360px)",
    xl: "clamp(220px, 32vw, 460px)",
  };

  const baseStyle: React.CSSProperties = {
    fontSize: sizes[sizePreset],
    letterSpacing: tight ? "-0.07em" : "-0.05em",
    lineHeight: 0.85,
    fontFamily: italic
      ? "var(--font-figtree), Figtree, system-ui, sans-serif"
      : "'Cal Sans', system-ui, sans-serif",
    fontStyle: italic ? "italic" : "normal",
    fontWeight: italic ? 800 : 400,
    whiteSpace: "nowrap",
    display: "inline-block",
    textTransform: text === text.toUpperCase() ? "uppercase" : "lowercase",
    transform: "translateX(20%)",
  };

  if (gradient) {
    return (
      <span
        className={styles.wordmark}
        style={{
          ...baseStyle,
          opacity,
          background: "var(--heat-text)",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          WebkitTextFillColor: "transparent",
          color: "transparent",
        }}
      >
        {text}
      </span>
    );
  }

  return (
    <span
      className={styles.wordmark}
      style={{
        ...baseStyle,
        color: `rgba(14, 15, 17, ${opacity})`,
      }}
    >
      {text}
    </span>
  );
}
