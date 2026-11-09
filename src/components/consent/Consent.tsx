"use client";

/**
 * Cookie consent (2026-10-30). Google Analytics, PostHog and Apollo's visitor
 * tracker only load after a visitor accepts; until then neither runs. The
 * choice is remembered in localStorage, and the footer's "cookie settings"
 * link reopens the banner (it dispatches OPEN_EVENT).
 */
import { useEffect, useState } from "react";
import Link from "next/link";
import Script from "next/script";
import { applyInternalFlag, captureAndCleanUtm, currentMailRef, denyAnalytics, grantAnalytics, isInternal, setMailRef } from "@/lib/analytics";
import { captureLeadParam, getLead } from "@/lib/lead";
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
  // The team's own browsers load no trackers (lib/analytics applyInternalFlag).
  const [internal, setInternal] = useState(false);

  useEffect(() => {
    applyInternalFlag();
    captureAndCleanUtm();
    // Someone who's given us their email before (lib/lead): count their visits under it.
    captureLeadParam();
    const lead = getLead();
    if (lead) setTimeout(() => !currentMailRef() && setMailRef(`lead-${lead.id}`), 0);
    setInternal(isInternal());
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
    if (c === "granted") grantAnalytics();
    else denyAnalytics();
    if (choice === "granted" && c === "denied") window.location.reload();
    setChoice(c);
    setOpen(false);
  };

  return (
    <>
      {choice === "granted" && !internal && (
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
          {/* LinkedIn Insight Tag (2026-11-09): ad conversions, retargeting and visitor demographics. Partner 10072226. */}
          <Script id="linkedin-insight" strategy="afterInteractive">
            {`window._linkedin_partner_id="10072226";window._linkedin_data_partner_ids=window._linkedin_data_partner_ids||[];window._linkedin_data_partner_ids.push(window._linkedin_partner_id);(function(l){if(!l){window.lintrk=function(a,b){window.lintrk.q.push([a,b])};window.lintrk.q=[]}var s=document.getElementsByTagName("script")[0];var b=document.createElement("script");b.type="text/javascript";b.async=true;b.src="https://snap.licdn.com/li.lms-analytics/insight.min.js";s.parentNode.insertBefore(b,s)})(window.lintrk);`}
          </Script>
        </>
      )}

      {open && (
        <div className={styles.banner} role="dialog" aria-live="polite" aria-label="Cookie choices">
          <p className={styles.text}>
            We&apos;d like to use cookies to understand how you use our site, improve it and measure our ads. Nothing loads
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
