"use client";

import { useEffect, useState } from "react";
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
 * Site nav — Variant E per Andre's call after seeing F live.
 *
 * Structure: two distinct chips edge-anchored.
 *   - Left  : white logo card with normal-colour logo (gradient hex
 *             + ink MF mark + ink wordmark). White surface lets the
 *             logo keep its branded colours instead of going monochrome.
 *   - Right : pill containing links + CTA.
 *
 * The right pill is SCROLL-AWARE — it has two visual modes that
 * swap based on whether the nav is currently floating over a
 * gradient surface (homepage hero) or a cream surface (everywhere
 * else, including homepage after scrolling past the hero):
 *
 *   - "gradient" mode (E original) : glass background +
 *     white links + solid white CTA. Looks E-on-hero.
 *   - "light"    mode (cream-safe) : white pill + ink links +
 *     gradient CTA. Works on cream sections.
 *
 * Detection: HeroPanel marks itself with [data-nav-gradient]. The
 * nav checks whether that element's bottom is still below the
 * pill (~60px from viewport top) on every scroll/resize. When
 * absent (other pages) or scrolled past, light mode kicks in.
 *
 * The logo card on the left stays white in both modes — gives the
 * logo a consistent surface to live on regardless of what's behind.
 */
export function TopNav({ activeHref }: { activeHref?: string }) {
  const [mode, setMode] = useState<"gradient" | "light">("light");

  useEffect(() => {
    if (typeof window === "undefined") return;

    const checkMode = () => {
      const anchor = document.querySelector("[data-nav-gradient]");
      if (!anchor) {
        setMode("light");
        return;
      }
      const rect = anchor.getBoundingClientRect();
      // Nav pill sits at top: 14, pill height ~46px → nav extends to ~60.
      // We're "over" the gradient if the anchor's bottom is still
      // below the nav bottom edge.
      setMode(rect.bottom > 60 ? "gradient" : "light");
    };

    checkMode();
    window.addEventListener("scroll", checkMode, { passive: true });
    window.addEventListener("resize", checkMode);

    return () => {
      window.removeEventListener("scroll", checkMode);
      window.removeEventListener("resize", checkMode);
    };
  }, []);

  return (
    <div
      className={`${styles.wrap} ${
        mode === "gradient" ? styles.modeGradient : styles.modeLight
      }`}
      data-nav-mode={mode}
    >
      <nav className={styles.nav} aria-label="Primary">
        {/* Logo card — always white, normal-colour logo */}
        <div className={styles.logoCard}>
          <Link
            href="/"
            className={styles.logoLink}
            aria-label="MakersForge home"
          >
            <Logo size={30} />
          </Link>
        </div>

        {/* Right pill — adaptive */}
        <div className={styles.rightPill}>
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
        </div>
      </nav>
    </div>
  );
}
