import Link from "next/link";
import styles from "./Footer.module.css";

const ROSTER_LINKS = [
  { href: "/roster", label: "all profiles" },
  { href: "/roster?discipline=ua", label: "ua managers" },
  { href: "/roster?discipline=art", label: "marketing artists" },
  { href: "/roster?available=true", label: "available now" },
];

const COMPANY_LINKS = [
  { href: "/#how", label: "how it works" },
  { href: "/pricing", label: "pricing" },
  { href: "https://seedcraft.vc", label: "seedcraft", external: true },
];

export function Footer() {
  return (
    <footer className={styles.foot} id="contact">
      <div className="container">
        <div className={styles.main}>
          <div className={styles.brand}>
            <div className={styles.logo}>
              <span className="hex-mark" aria-hidden="true" />
              <span>makersforge</span>
            </div>
            <p className={styles.tagline}>
              Growth team contractors for mobile apps and games. Flat
              monthly fees, no percentage games. Backed by SeedCraft
              Ventures.
            </p>
            <div className={styles.contact}>
              <a href="mailto:andre@makersforge.gg">andre@makersforge.gg →</a>
              <a href="#">book a 20-min call →</a>
              <a href="#">linkedin →</a>
            </div>
          </div>

          <div className={styles.col}>
            <h5>Roster</h5>
            <ul>
              {ROSTER_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.col}>
            <h5>Company</h5>
            <ul>
              {COMPANY_LINKS.map((link) =>
                link.external ? (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {link.label}
                    </a>
                  </li>
                ) : (
                  <li key={link.href}>
                    <Link href={link.href}>{link.label}</Link>
                  </li>
                ),
              )}
            </ul>
          </div>
        </div>

        <div className={styles.bottom}>
          <span>© {new Date().getFullYear()} MakersForge. A SeedCraft venture.</span>
          <span className={styles.legal}>
            <Link href="/legal/privacy">privacy</Link>
            <span aria-hidden="true">·</span>
            <Link href="/legal/terms">terms</Link>
          </span>
        </div>
      </div>
    </footer>
  );
}
