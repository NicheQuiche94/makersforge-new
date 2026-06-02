import type { ReactNode } from "react";
import styles from "./HowItWorksBento.module.css";

/**
 * HowItWorks bento — three-step flow.
 *
 * v3 (Andre 2026-05-30 v4):
 *   - Headline reframed: "brief monday, working by friday" dropped
 *     because we can't promise that.
 *   - Hierarchy fix: title is now BIGGEST per tile, then number,
 *     then body. The big Cal Sans numeral previously dominated.
 *   - Tile bodies upscaled to 17px and given a soft drop shadow.
 *   - "Shortlist in 48h" pill on tile 02 removed (prior pass).
 *   - Headline + subhead now Figtree mixed-weight sentence case to
 *     match the new Statement section above it.
 *
 * Layout (locked at L2): paper "01 Tell us the gap" + heat "02 We
 * match" side-by-side; charcoal "03 They get to work" full-width
 * with right bleed.
 */

type Surface = "paper" | "heat" | "charcoal";

type Tile = {
  num: string;
  title: ReactNode;
  body: ReactNode;
  surface: Surface;
};

const TILE_01: Tile = {
  num: "01",
  title: "Tell us the gap",
  body: "UA lead for a launch, performance creative for a refresh, a fractional head of growth. Send the shape and the timeline. We push back when it helps.",
  surface: "paper",
};

const TILE_02: Tile = {
  num: "02",
  title: "We match",
  body: "From the lineup we already represent. Not a stack of job-board CVs. The shortlist is real people, with real availability.",
  surface: "heat",
};

const TILE_03: Tile = {
  num: "03",
  title: "They get to work",
  body: "Contract direct with the specialist. They get paid. We invoice you a flat monthly fee. Scale up, scale down, stop any time.",
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
      <p
        className={`${styles.num} ${onDark ? styles.numOnDark : ""}`}
        aria-hidden="true"
      >
        {tile.num}
      </p>
      <h3
        className={`${styles.title} ${onDark ? styles.titleOnDark : ""}`}
      >
        {tile.title}
      </h3>
      <div className={styles.content}>
        <p
          className={`${styles.body} ${onDark ? styles.bodyOnDark : ""}`}
        >
          {tile.body}
        </p>
      </div>
    </article>
  );
}

export function HowItWorksBento() {
  return (
    <section className={styles.section} id="how">
      <div className="container">
        <header className={styles.top}>
          <p className="kicker">How it works</p>
          <h2 className={styles.headline}>
            <span className="gr">How a hire actually happens.</span>
          </h2>
          <p className={styles.subhead}>
            Three steps. No CV stack to wade through.
          </p>
        </header>

        <div className={styles.grid}>
          <div className={styles.row}>
            <BentoTile tile={TILE_01} />
            <BentoTile tile={TILE_02} delayClass="d1" />
          </div>
          <BentoTile tile={TILE_03} bleed delayClass="d1" />
        </div>
      </div>
    </section>
  );
}
