import Link from "next/link";
import styles from "./TopNav.module.css";

const LINKS = [
  { href: "/roster", label: "the roster" },
  { href: "/#how", label: "how it works" },
  { href: "/pricing", label: "pricing" },
  { href: "/#contact", label: "contact" },
];

export function TopNav() {
  return (
    <nav className={styles.nav} aria-label="Primary">
      <Link href="/" className={styles.logo} aria-label="MakersForge home">
        <span className="hex-mark" aria-hidden="true" />
        <span>makersforge</span>
      </Link>

      <ul className={styles.links}>
        {LINKS.map((link) => (
          <li key={link.href}>
            <Link href={link.href}>{link.label}</Link>
          </li>
        ))}
      </ul>

      <Link href="#" className={styles.cta}>
        book a call
      </Link>
    </nav>
  );
}
