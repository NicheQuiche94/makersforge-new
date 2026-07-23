import styles from "./LogoWall.module.css";

/**
 * Logo wall — the studios / apps Andre has personally placed growth
 * hires at. Static even grid of six white chips (the marquee looked
 * like it was ending rather than looping with so few logos, Andre
 * 2026-07-19).
 *
 * Chips normalise the mixed source backgrounds (Yallaplay ships
 * white-on-black, Playsome is a colour JPG on white) into one clean
 * shelf; `invert` flips Yallaplay to dark-on-light. Logos are sized by
 * max-height so the compact marks read as large as Lessmore's wide
 * wordmark. Swap any `src` for a transparent/mono version anytime.
 */
type Logo = { name: string; src: string; invert?: boolean };

const HOME_LOGOS: Logo[] = [
  { name: "Lessmore", src: "/logos/lessmore.png" },
  { name: "Seven Stars", src: "/logos/seven-stars.png" },
  { name: "Yallaplay", src: "/logos/yallaplay.png", invert: true },
  { name: "Skunkworks", src: "/logos/skunkworks.png" },
  { name: "Playsome", src: "/logos/playsome.jpg" },
  { name: "Triple Tap", src: "/logos/TTG.png" },
];

export function LogoWall() {
  if (HOME_LOGOS.length === 0) return null;

  return (
    <section className={styles.section}>
      <div className="container">
        <p className={styles.cap}>Where we placed growth hires</p>
        <div className={styles.row}>
          {HOME_LOGOS.map((logo) => (
            <span key={logo.name} className={styles.chip}>
              {/* eslint-disable-next-line @next/next/no-img-element -- static brand marks */}
              <img
                src={logo.src}
                alt={logo.name}
                className={`${styles.logo} ${logo.invert ? styles.invert : ""}`}
              />
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
