"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Logo } from "@/components/atoms/Logo";
import { menuResources } from "@/lib/resources";
import styles from "./TopNav.module.css";

const LINKS = [
  { href: "/#how", label: "How it works" },
  { href: "/#proof", label: "Case study" },
  { href: "/line-up", label: "Talent directory" },
  { href: "/pricing", label: "Plans & pricing" },
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
  // Resources menu (Andre 2026-11-08): the free tools and guides under one item.
  const [open, setOpen] = useState(false);
  const menu = useRef<HTMLLIElement>(null);
  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent | KeyboardEvent) => {
      if (e instanceof KeyboardEvent ? e.key === "Escape" : !menu.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", close);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", close);
    };
  }, [open]);
  const resources = menuResources();
  const inResources = !!activeHref && (activeHref === "/resources" || resources.some((r) => r.href === activeHref));

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
            <Logo size={38} />
          </Link>
        </div>

        {/* Right cluster. The standalone Job board pill (.jobsPill) is pulled
            while the board is reworked (Andre 2026-10-23); its styles are
            kept in the CSS module for when it comes back. */}
        <div className={styles.rightCluster}>
          {/* Main nav pill — adaptive */}
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
              <li ref={menu} className={styles.menuItem} onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
                <button type="button" className={`${styles.menuBtn} ${inResources ? styles.activeLink : ""}`} aria-expanded={open} onClick={() => setOpen(!open)}>
                  Resources <span aria-hidden="true">▾</span>
                </button>
                {open && (
                  <div className={styles.menu}>
                    {resources.map((r) => (
                      <Link key={r.href} href={r.href} className={styles.menuLink} onClick={() => setOpen(false)}>
                        <strong>{r.title}</strong>
                        <span>{r.blurb}</span>
                      </Link>
                    ))}
                    <Link href="/resources" className={styles.menuAll} onClick={() => setOpen(false)}>All resources →</Link>
                  </div>
                )}
              </li>
            </ul>
            {/* The way back into the client portal (Andre 2026-11-04); stays visible on phones. */}
            <Link href="/account" className={`${styles.login} ${activeHref === "/account" ? styles.activeLink : ""}`}>
              Client login
            </Link>
            {/* Self-onboarding is the nav action (Andre 2026-11-02). */}
            <Link href="/start" className={styles.cta}>
              Get started
            </Link>
          </div>
        </div>
      </nav>
    </div>
  );
}
