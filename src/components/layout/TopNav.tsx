import Link from "next/link";
import { Logo } from "@/components/atoms/Logo";
import styles from "./TopNav.module.css";

const LINKS = [
  { href: "/roster", label: "the roster" },
  { href: "/#how", label: "how it works" },
  { href: "/pricing", label: "pricing" },
  { href: "/#about", label: "about" },
];

/**
 * Site nav — Variant F per Andre's call:
 *   - Single condensed white pill, centered floating
 *   - Logo in normal colours (gradient hex + ink MF + ink wordmark)
 *     because the pill is white (no need for monochrome)
 *   - Ink-coloured links at 0.7 opacity, full ink on hover
 *   - Gradient CTA with white text — the brand moment that lives
 *     at the top of every page
 *   - Works on both gradient hero AND cream sections (the border-
 *     alpha gives the white pill enough definition on cream too)
 */
export function TopNav({ activeHref }: { activeHref?: string }) {
  return (
    <div className={styles.wrap}>
      <nav className={styles.nav} aria-label="Primary">
        <Link href="/" className={styles.logoLink} aria-label="MakersForge home">
          <Logo size={34} />
        </Link>

        <ul className={styles.links}>
          {LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={activeHref === link.href ? styles.activeLink : ""}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <Link href="#" className={styles.cta}>
          book a call
        </Link>
      </nav>
    </div>
  );
}
