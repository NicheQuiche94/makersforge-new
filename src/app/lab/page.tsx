import type { Metadata } from "next";
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

      {/* Placeholder until Andre picks the next direction */}
      <section className={styles.experiment}>
        <div className="container">
          <header className={styles.expHeader}>
            <p className={`kicker ${styles.expKicker}`}>
              Awaiting Andre · next experiment
            </p>
            <h2 className={styles.expH2}>what layout move next?</h2>
            <p className={styles.expCopy}>
              Bleed rejected. Candidates that fit our containerized
              aesthetic:
            </p>
            <ul className={styles.queue}>
              <li><strong>02 · Floating UI badges in hero corners</strong> — layered data inside the existing panel (Kinetic&apos;s &quot;Detailing service&quot; pattern)</li>
              <li><strong>03 · Statement headline anchored to deliberate grid columns</strong> (vs. progressive indents)</li>
              <li><strong>04 · HowItWorks as hairline-ruled magazine rows</strong> (no tiles) — risk: bento was working, this changes direction</li>
              <li><strong>05 · Type composition INSIDE a panel</strong> as a magazine spread — could apply to Statement instead of touching the hero</li>
            </ul>
          </header>
        </div>
      </section>
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
