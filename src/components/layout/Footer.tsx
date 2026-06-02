import Link from "next/link";
import { Logo } from "@/components/atoms/Logo";
import styles from "./Footer.module.css";

const ROSTER_LINKS = [
  { href: "/roster", label: "All profiles" },
  { href: "/roster?discipline=ua", label: "UA managers" },
  { href: "/roster?discipline=art", label: "Marketing artists" },
  { href: "/roster?available=true", label: "Available now" },
  { href: "/apply", label: "Join the lineup" },
];

/* Per cofounder pass FT1–FT4:
   - "Book a call" now points to /enquire (was the dead # placeholder).
   - Contact email removed from the For studios column; lives with the
     socials only (and is visible as plain text below the icon row).
   - About removed from the Company column (the link went to /#about
     which doesn't exist; if we want a real About page, that's a
     separate build).
   - Seedcraft Ventures removed from the Company column — the link
     already appears in the bottom collab line, having it twice felt
     off. */
const STUDIO_LINKS = [
  { href: "/#how", label: "How it works" },
  { href: "/pricing", label: "Pricing" },
  { href: "/enquire", label: "Book a call" },
];

const COMPANY_LINKS = [
  { href: "/talent", label: "For talent" },
];

export function Footer() {
  return (
    <footer className={styles.foot} id="contact">
      <div className="container">
        <div className={styles.main}>
          <div className={styles.brand}>
            <Link href="/" className={styles.logoLink} aria-label="MakersForge home">
              <Logo size={52} />
            </Link>
            <p className={styles.tagline}>
              Growth team specialists for mobile apps and games.
            </p>
            <div className={styles.socials}>
              <a
                href="https://www.linkedin.com/company/makers-forge"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="MakersForge on LinkedIn"
                title="LinkedIn"
              >
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3v9zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19a.66.66 0 000 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z" />
                </svg>
              </a>
              <a href="mailto:andre@makersforge.gg" aria-label="Email Andre at MakersForge" title="Email">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              </a>
            </div>
            {/* Plain-text address under the socials per cofounder pass
                FT2 — the email used to live as a column link which
                read as a separate page. Sits with the brand block now. */}
            <a className={styles.emailLine} href="mailto:andre@makersforge.gg">
              andre@makersforge.gg
            </a>
          </div>

          <div className={styles.col}>
            <h5>The lineup</h5>
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
                  <Link href={link.href}>{link.label}</Link>
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
          <a href="https://seedcraft.co" target="_blank" rel="noopener noreferrer">
            Seedcraft Ventures
          </a>{" "}
          and{" "}
          <a
            href="https://ssgpartnerships.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            SSG Recruitment Partnerships
          </a>{" "}
          collaboration.
        </p>
      </div>
    </footer>
  );
}
