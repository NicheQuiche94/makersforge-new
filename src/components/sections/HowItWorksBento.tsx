import type { ReactNode } from "react";
import styles from "./HowItWorksBento.module.css";

type Surface = "paper" | "heat" | "charcoal" | "card";
type Align = "left" | "right";

type Tile = {
  num: string;
  title: ReactNode;
  body: ReactNode;
  surface: Surface;
  align: Align;
  /** Width as a percent of the container. */
  widthPct: number;
  /** Optional pill — only shown on certain tiles per the brief. */
  pill?: string;
};

const TILES: Tile[] = [
  {
    num: "01",
    title: <>tell us <span className="gr">the gap</span></>,
    body: "UA lead for a launch, performance creative for a refresh, a fractional head of growth. Tell us the shape and the timeline. We push back where it helps.",
    surface: "paper",
    align: "left",
    widthPct: 72,
  },
  {
    num: "02",
    title: "we match.",
    body: "From a vetted roster of senior operators we actually know — not a job-board dragnet. You see a shortlist of real people, with real availability, fast.",
    surface: "heat",
    align: "right",
    widthPct: 80,
    pill: "shortlist in 48h",
  },
  {
    num: "03",
    title: "they get to work.",
    body: "You contract and pay them directly. You pay us a flat monthly fee for each month they're engaged. Scale up, scale down, stop any time.",
    surface: "charcoal",
    align: "left",
    widthPct: 76,
  },
  {
    num: "·",
    title: <>the <span className="gr">terms</span></>,
    body: "Flat monthly fee. No percentage of their pay. No percentage of placement salary. Terms signed up front. Replacement matching included.",
    surface: "card",
    align: "right",
    widthPct: 68,
  },
];

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

        <div className={styles.stack}>
          {TILES.map((tile, i) => (
            <article
              key={tile.num + i}
              className={`reveal ${i > 0 ? "d1" : ""} ${styles.tileWrap} ${tile.align === "right" ? styles.alignRight : styles.alignLeft}`}
            >
              <div
                className={`${styles.tile} ${styles[`surface-${tile.surface}`]} ${tile.surface === "heat" ? "heat-glow" : ""}`}
                style={{ "--w": `${tile.widthPct}%` } as React.CSSProperties}
              >
                <span
                  className={`${styles.num} ${tile.surface === "heat" || tile.surface === "charcoal" ? styles.numOnDark : ""}`}
                  aria-hidden="true"
                >
                  {tile.num}
                </span>

                <div className={styles.content}>
                  <h3
                    className={`${styles.title} ${tile.surface === "heat" || tile.surface === "charcoal" ? styles.titleOnDark : ""}`}
                  >
                    {tile.title}
                  </h3>
                  <p
                    className={`${styles.body} ${tile.surface === "heat" || tile.surface === "charcoal" ? styles.bodyOnDark : ""}`}
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
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
