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
          EXPERIMENT 01 · Bleed wordmark below the hero
          ============================================================ */}
      <section className={styles.experiment}>
        <div className="container">
          <header className={styles.expHeader}>
            <p className={`kicker ${styles.expKicker}`}>
              Experiment 01 · Bleed wordmark
            </p>
            <h2 className={styles.expH2}>
              a typographic moment that bleeds off the page edge.
            </h2>
            <p className={styles.expCopy}>
              Inspired by Kinetic Studio. The wordmark sits below the hero,
              extends past the right page edge, very low opacity. Makes the
              page feel <strong>branded</strong> without being a literal
              logo — closer to a magazine masthead. Six variants below:
              word, weight, style, position, opacity.
            </p>
          </header>
        </div>

        <Variant label="Variant A · ‘makersforge’ lowercase Cal Sans · 0.07 · right bleed">
          <Wordmark text="makersforge" opacity={0.07} />
        </Variant>

        <Variant label="Variant B · ‘growth’ single value word · 0.09 · larger · right bleed">
          <Wordmark text="growth" opacity={0.09} sizePreset="xl" />
        </Variant>

        <Variant label="Variant C · ‘on call.’ short phrase · 0.11 · italic · right bleed">
          <Wordmark text="on call." opacity={0.11} italic sizePreset="md" />
        </Variant>

        <Variant label="Variant D · ‘the roster’ product callout · 0.08 · right bleed">
          <Wordmark text="the roster" opacity={0.08} />
        </Variant>

        <Variant label="Variant E · ‘makersforge’ gradient text-fill · 0.18 · right bleed">
          <Wordmark text="makersforge" gradient opacity={0.18} />
        </Variant>

        <Variant label="Variant F · ‘ROSTER’ uppercase, tightest tracking · 0.07 · right bleed">
          <Wordmark text="ROSTER" opacity={0.07} sizePreset="xl" tight />
        </Variant>
      </section>

      {/* Placeholder for future experiments */}
      <section className={styles.experiment}>
        <div className="container">
          <header className={styles.expHeader}>
            <p className={`kicker ${styles.expKicker}`}>
              Queued · future experiments
            </p>
            <h2 className={styles.expH2}>more layout moves coming.</h2>
            <ul className={styles.queue}>
              <li>02 · Statement headline anchored to deliberate grid columns (vs. progressive indents)</li>
              <li>03 · HowItWorks bento with dramatic mixed sizes + one tile bleeding off-page</li>
              <li>04 · Floating contextual UI badges in hero corners (replacing the simple text meta)</li>
              <li>05 · Editorial sidebar/margin labels (vertical chapter markers)</li>
            </ul>
            <p className={styles.expCopy}>
              Order driven by which moves Andre confirms after each round.
            </p>
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
