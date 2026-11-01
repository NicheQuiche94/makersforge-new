"use client";

/**
 * Cookie consent (2026-10-30). Google Analytics and Apollo's visitor
 * tracker only load after a visitor accepts; until then neither runs. The
 * choice is remembered in localStorage, and the footer's "cookie settings"
 * link reopens the banner (it dispatches OPEN_EVENT).
 */
import { useEffect, useState } from "react";
import Link from "next/link";
import Script from "next/script";
import styles from "./Consent.module.css";

const KEY = "mf-consent";
const OPEN_EVENT = "mf:cookie-settings";
type Choice = "granted" | "denied";

function readChoice(): Choice | null {
  try {
    const v = localStorage.getItem(KEY);
    return v === "granted" || v === "denied" ? v : null;
  } catch {
    return null;
  }
}

export function Consent() {
  const [choice, setChoice] = useState<Choice | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const c = readChoice();
    setChoice(c);
    setOpen(c === null);
    const reopen = () => setOpen(true);
    window.addEventListener(OPEN_EVENT, reopen);
    return () => window.removeEventListener(OPEN_EVENT, reopen);
  }, []);

  const decide = (c: Choice) => {
    try {
      localStorage.setItem(KEY, c);
    } catch {}
    // Withdrawing consent after the scripts have loaded needs a reload to unload them.
    if (choice === "granted" && c === "denied") window.location.reload();
    setChoice(c);
    setOpen(false);
  };

  return (
    <>
      {choice === "granted" && (
        <>
          <Script src="https://www.googletagmanager.com/gtag/js?id=G-N2YM0TCEXQ" strategy="afterInteractive" />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-N2YM0TCEXQ');
            `}
          </Script>
          <Script id="apollo-tracker" strategy="afterInteractive">
            {`function initApollo(){var n=Math.random().toString(36).substring(7),o=document.createElement("script");o.src="https://assets.apollo.io/micro/website-tracker/tracker.iife.js?nocache="+n,o.async=!0,o.defer=!0,o.onload=function(){window.trackingFunctions.onLoad({appId:"6a5c8f7c1a24a200202b16d8"})},document.head.appendChild(o)}initApollo();`}
          </Script>
        </>
      )}

      {open && (
        <div className={styles.banner} role="dialog" aria-live="polite" aria-label="Cookie choices">
          <p className={styles.text}>
            We&apos;d like to use cookies to understand how you use our site and improve it. Nothing loads
            unless you accept.{" "}
            <Link href="/legal/privacy#cookies" className={styles.link}>
              Privacy policy
            </Link>
          </p>
          <div className={styles.actions}>
            <button type="button" className={styles.decline} onClick={() => decide("denied")}>
              Decline
            </button>
            <button type="button" className={styles.accept} onClick={() => decide("granted")}>
              Accept
            </button>
          </div>
        </div>
      )}
    </>
  );
}

/** Footer link that reopens the banner so a visitor can change their choice. */
export function CookieSettingsLink({ className }: { className?: string }) {
  return (
    <button type="button" className={className} onClick={() => window.dispatchEvent(new Event(OPEN_EVENT))}>
      cookie settings
    </button>
  );
}
