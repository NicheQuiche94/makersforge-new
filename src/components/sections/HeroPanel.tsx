import Link from "next/link";
import { Button } from "@/components/atoms/Button";
import { Logo } from "@/components/atoms/Logo";
import styles from "./HeroPanel.module.css";

/**
 * Homepage hero — Exp 02 v3 per Andre's call.
 *
 * Full-bleed heat-glow section (no rounded panel container). The
 * heat-glow utility provides the composite: heat-deep gradient base
 * + radial highlights + noise overlay. White typography throughout.
 *
 * Layout:
 *   - Top-left  : kicker with pulse dot
 *   - Top-right : small editorial masthead (est. 2026 / a SeedCraft venture)
 *   - Middle    : main headline "growth team contractors. / on call."
 *                 (both lines Cal Sans white, flush left, same size)
 *   - Bottom    : 4 uniform glass UI pills + dual CTAs
 */
/** The three first-screen doors (Andre 2026-10-23): each buyer gets its own
 *  experience instead of one page trying to speak to everyone. */
const DOORS = [
  {
    href: "/games",
    kicker: "Hiring",
    title: "I'm a mobile game studio",
    sub: "UA, art, Unity, LiveOps",
  },
  {
    href: "/apps",
    kicker: "Hiring",
    title: "I'm a consumer app company",
    sub: "Growth, product, design, iOS & Android",
  },
  {
    href: "/talent",
    kicker: "Get represented",
    title: "I'm talent",
    sub: "Join the lineup or find your next role",
  },
];

type HeroCta = { href: string; label: string };

type HeroPanelProps = {
  /** Pulse-dot kicker top-left (segment pages). */
  kicker?: string;
  headline?: string[];
  lede?: string;
  /** Optional first line of the lede, set larger on its own line. */
  ledeLead?: string;
  /** Two CTAs; without them the hero falls back to the three doors. */
  ctas?: { primary: HeroCta; secondary: HeroCta };
  /** Quiet text links under the CTAs (e.g. studio / apps / talent). */
  links?: HeroCta[];
};

export function HeroPanel({
  kicker,
  headline = ["The home for", "the teams behind", "games and apps."],
  lede = "Growth, product, design, engineering and art for mobile games and consumer apps. Tell us who you are:",
  ledeLead,
  ctas,
  links,
}: HeroPanelProps = {}) {
  return (
    <section className={`heat-glow ${styles.hero}`} data-nav-gradient>
      <div className={styles.inner}>
        {/* Without a kicker the masthead would sit alone above the
            headline as a stray eyebrow (Andre 2026-10-27), so the whole
            top row goes. */}
        {kicker ? (
          <div className={styles.top}>
            <p className={styles.kicker}>
              <span className={styles.pulseDot} aria-hidden="true" />
              {kicker}
            </p>
            <div className={styles.masthead}>
              <span>Est. 2024</span>
              <span>a SeedCraft venture</span>
            </div>
          </div>
        ) : null}

        <div className={styles.main}>
          <h1 className={styles.headline}>
            {headline.map((line) => (
              <span key={line} className={styles.headlineLine}>
                {line}
              </span>
            ))}
          </h1>

          <p className={styles.heroLede}>
            {ledeLead ? <span className={styles.ledeLead}>{ledeLead}</span> : null}
            {lede}
          </p>

          {ctas ? (
            <div className={styles.ctas}>
              <Button href={ctas.primary.href} variant="light" arrow className={styles.spectrumBtn}>
                {ctas.primary.label}
              </Button>
              <Button href={ctas.secondary.href} variant="on-dark">
                {ctas.secondary.label}
              </Button>
              {links?.length ? (
                <nav className={styles.heroLinks} aria-label="More">
                  {links.map((l) => (
                    <Link key={l.href} href={l.href}>
                      {l.label} <span aria-hidden="true">→</span>
                    </Link>
                  ))}
                </nav>
              ) : null}
            </div>
          ) : (
            <nav className={styles.doors} aria-label="Who are you?">
              {DOORS.map((d) => (
                <Link key={d.href} href={d.href} className={styles.door}>
                  <span className={styles.doorKicker}>{d.kicker}</span>
                  <span className={styles.doorTitle}>{d.title}</span>
                  <span className={styles.doorSub}>{d.sub}</span>
                  <span className={styles.doorArrow} aria-hidden="true">
                    →
                  </span>
                </Link>
              ))}
            </nav>
          )}
        </div>

        {/* Ghost MF hex bottom-right. Right edge aligns with the
            nav bar's right edge for balance per follow-up note. */}
        <Logo
          variant="mark"
          size={260}
          monochrome="rgba(255, 255, 255, 0.12)"
          className={styles.heroEmblem}
          title=""
        />
      </div>
    </section>
  );
}
