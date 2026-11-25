import { BOOKING_URL } from "@/lib/site";
import Link from "next/link";
import { Logo } from "@/components/atoms/Logo";
import { CookieSettingsLink } from "@/components/consent/Consent";
import styles from "./Footer.module.css";

/* 2026-11-25 (Andre): the footer only links to the current site, the same
   pages as the nav. The old segment pages (/games, /apps), /talent, the jobs
   board and "How it works" were retired and redirect elsewhere. */
const COMPANY_LINKS = [
  { href: "/pricing", label: "Plans & pricing" },
  { href: "/start", label: "Get started" },
  { href: BOOKING_URL, label: "Book a call" },
  { href: "/account", label: "Client login" },
];

const RESOURCE_LINKS = [
  { href: "/resources", label: "Free resources" },
  { href: "/compare", label: "Design your hiring route" },
  { href: "/job-ad-grading-tool", label: "Job ad grading tool" },
];

const ROSTER_LINKS = [
  { href: "/line-up", label: "Browse the directory" },
  { href: "/#proof", label: "Case study" },
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
              Hiring the teams behind mobile games and consumer apps.
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
            <h5>For companies</h5>
            <ul>
              {COMPANY_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.col}>
            <h5>Free resources</h5>
            <ul>
              {RESOURCE_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.col}>
            <h5>Talent directory</h5>
            <ul>
              {ROSTER_LINKS.map((link) => (
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
            <span className={styles.dim}>· hiring the teams behind games and apps.</span>
          </span>
          <span className={styles.legal}>
            <Link href="/legal/privacy">Privacy</Link>
            <Link href="/legal/terms">Terms</Link>
            <Link href="/unsubscribe">Unsubscribe</Link>
            <CookieSettingsLink className={styles.legalBtn} />
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
