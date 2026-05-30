import type { ReactNode } from "react";
import styles from "./HowItWorksBento.module.css";

/**
 * HowItWorks bento — three-step flow.
 *
 * Layout (locked via lab Experiment 05 v2 / variant L2):
 *   Row 1: paper "01 tell us the gap" + heat "02 we match" side-by-side.
 *   Row 2: charcoal "03 they get to work" full-width, bleeds right.
 *
 * The 4th "terms" tile is dropped — that information lives on the
 * pricing page, no need to duplicate. Bleed implemented via negative
 * right margin on the tile combined with section overflow-x: hidden
 * so the bleed never causes horizontal page scroll.
 */

type Surface = "paper" | "heat" | "charcoal";

type Tile = {
  num: string;
  title: ReactNode;
  body: ReactNode;
  surface: Surface;
  pill?: string;
};

const TILE_01: Tile = {
  num: "01",
  title: (
    <>
      tell us <span className="gr">the gap</span>
    </>
  ),
  body: "UA lead for a launch, performance creative for a refresh, a fractional head of growth. Tell us the shape and the timeline. We push back where it helps.",
  surface: "paper",
};

const TILE_02: Tile = {
  num: "02",
  title: "we match.",
  body: "From a vetted roster of senior operators we already know, not a job-board dragnet. You see a shortlist of real people, with real availability, fast.",
  surface: "heat",
  pill: "shortlist in 48h",
};

const TILE_03: Tile = {
  num: "03",
  title: "they get to work.",
  body: "You contract and pay them directly. You pay us a flat monthly fee for each month they're engaged. Scale up, scale down, stop any time.",
  surface: "charcoal",
};

function BentoTile({
  tile,
  bleed,
  delayClass,
}: {
  tile: Tile;
  bleed?: boolean;
  delayClass?: string;
}) {
  const onDark = tile.surface === "heat" || tile.surface === "charcoal";
  return (
    <article
      className={`reveal ${delayClass ?? ""} ${styles.tile} ${
        styles[`surface-${tile.surface}`]
      } ${tile.surface === "heat" ? "heat-glow" : ""} ${
        bleed ? styles.bleedRight : ""
      }`}
    >
      <span
        className={`${styles.num} ${onDark ? styles.numOnDark : ""}`}
        aria-hidden="true"
      >
        {tile.num}
      </span>

      <div className={styles.content}>
        <h3
          className={`${styles.title} ${onDark ? styles.titleOnDark : ""}`}
        >
          {tile.title}
        </h3>
        <p
          className={`${styles.body} ${onDark ? styles.bodyOnDark : ""}`}
        >
          {tile.body}
        </p>

        {tile.pill && (
          <span className={styles.pillGrad}>
            <span className={styles.pillDot} aria-hidden="true" />
            {tile.pill}
          </span>
        )}
      </div>
    </article>
  );
}

export function HowItWorksBento() {
  return (
    <section className={styles.section} id="how">
      <div className="container">
        <div className={styles.top}>
          <div>
            <p className="kicker">how it works</p>
            <h2 className={styles.headline}>
              brief monday. working <span className="gr">by friday.</span>
            </h2>
          </div>
          <p className={styles.topCopy}>
            Three steps, no recruitment theatre. You&apos;re talking to
            operators we already know within a day.
          </p>
        </div>

        <div className={styles.grid}>
          {/* Row 1: paper small + heat big, side-by-side */}
          <div className={styles.row}>
            <BentoTile tile={TILE_01} />
            <BentoTile tile={TILE_02} delayClass="d1" />
          </div>

          {/* Row 2: charcoal full-width, bleeds right */}
          <BentoTile tile={TILE_03} bleed delayClass="d1" />
        </div>
      </div>
    </section>
  );
}
