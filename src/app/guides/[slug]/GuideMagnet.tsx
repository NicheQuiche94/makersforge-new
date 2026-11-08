"use client";

import { useState } from "react";
import type { Magnet } from "@/lib/guides";
import { arrivalUtm } from "@/lib/analytics";
import { setLead } from "@/lib/lead";
import { EmailField } from "@/components/lead/EmailField";
import styles from "../guides.module.css";

/* The takeaway on a guide (Andre 2026-11-08): a blueprint, checklist or
   scorecard drawn from the article, sent by email. One field, one click. */
export function GuideMagnet({ slug, magnet }: { slug: string; magnet: Magnet }) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "sent">("idle");
  const [err, setErr] = useState("");

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");
    setState("sending");
    const r = await fetch("/api/guides/magnet", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug, email, utm: arrivalUtm() ?? null }),
    })
      .then((x) => x.json())
      .catch(() => ({ error: "That didn't go through. Please try again." }));
    if (r.error) {
      setErr(r.error);
      setState("idle");
    } else {
      setLead(r.lead);
      setState("sent");
    }
  };

  return (
    <aside className={styles.magnet}>
      <h2>{magnet.name}</h2>
      <p>{magnet.pitch}</p>
      {state === "sent" ? (
        <p>
          <strong>On its way.</strong> Check your inbox in a minute or two.
        </p>
      ) : (
        <form className={styles.magnetForm} onSubmit={send}>
          <EmailField value={email} onChange={setEmail} className={styles.known}>
            <input type="email" required placeholder="Your work email" value={email} onChange={(e) => setEmail(e.target.value)} aria-label="Your work email" />
          </EmailField>
          <button type="submit" className={styles.go} disabled={state === "sending"}>
            {state === "sending" ? "Sending…" : "Send it to me →"}
          </button>
        </form>
      )}
      {err && <p className={styles.err}>{err}</p>}
      <p className={styles.small}>Free. We&apos;ll email it to you, and you can unsubscribe any time.</p>
    </aside>
  );
}
