import Link from "next/link";
import { Logo } from "@/components/atoms/Logo";
import styles from "./Footer.module.css";

const ROSTER_LINKS = [
  { href: "/roster", label: "all profiles" },
  { href: "/roster?discipline=ua", label: "ua managers" },
  { href: "/roster?discipline=art", label: "marketing artists" },
  { href: "/roster?available=true", label: "available now" },
];

const STUDIO_LINKS = [
  { href: "/#how", label: "how it works" },
  { href: "/pricing", label: "pricing" },
  { href: "#", label: "book a call" },
  { href: "mailto:andre@makersforge.gg", label: "andre@makersforge.gg" },
];

const COMPANY_LINKS = [
  { href: "/#about", label: "about" },
  { href: "https://seedcraft.vc", label: "seedcraft ventures", external: true },
];

export function Footer() {
  return (
    <footer className={styles.foot} id="contact">
      <div className="container">
        <div className={styles.main}>
          <div className={styles.brand}>
            <Link href="/" className={styles.logoLink} aria-label="MakersForge home">
              <Logo size={32} />
            </Link>
            <p className={styles.tagline}>
              Growth team contractors for mobile apps and games.
            </p>
            <span className={styles.valuePill}>flat fee, always</span>
            <div className={styles.socials}>
              <a href="#" aria-label="LinkedIn" title="LinkedIn">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3v9zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19a.66.66 0 000 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z" />
                </svg>
              </a>
              <a href="mailto:andre@makersforge.gg" aria-label="Email" title="Email">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              </a>
            </div>
          </div>

          <div className={styles.col}>
            <h5>The roster</h5>
            <ul>
              {ROSTER_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.col}>
            <h5>For studios</h5>
            <ul>
              {STUDIO_LINKS.map((link) => (
                <li key={link.href}>
                  {link.href.startsWith("mailto:") || link.href === "#" ? (
                    <a href={link.href}>{link.label}</a>
                  ) : (
                    <Link href={link.href}>{link.label}</Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.col}>
            <h5>Company</h5>
            <ul>
              {COMPANY_LINKS.map((link) => (
                <li key={link.href}>
                  {link.external ? (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link href={link.href}>{link.label}</Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className={styles.bottom}>
          <span className={styles.copy}>
            © {new Date().getFullYear()} MakersForge{" "}
            <span className={styles.dim}>· growth, on call.</span>
          </span>
          <span className={styles.legal}>
            <Link href="/legal/privacy">privacy</Link>
            <Link href="/legal/terms">terms</Link>
          </span>
        </div>

        <p className={styles.collab}>
          A{" "}
          <a href="https://seedcraft.vc" target="_blank" rel="noopener noreferrer">
            Seedcraft Ventures
          </a>{" "}
          and{" "}
          <a href="#" target="_blank" rel="noopener noreferrer">
            SSG Recruitment Partnerships
          </a>{" "}
          collaboration.
        </p>
      </div>
    </footer>
  );
}
