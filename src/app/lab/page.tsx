import type { Metadata } from "next";
import { Logo } from "@/components/atoms/Logo";
import styles from "./lab.module.css";

export const metadata: Metadata = {
  title: "Design Lab — MakersForge",
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
