"use client";

/**
 * Sign in with a 6-digit email code (the same one /start uses). Shown by
 * /account and /admin when nobody's signed in; reloads the page once verified.
 */
import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./SignIn.module.css";

export function SignIn({ title, note }: { title: string; note: string }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const post = async (url: string, body: object) => {
    setBusy(true);
    setError("");
    const r = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    const d = await r.json().catch(() => ({}));
    setBusy(false);
    if (!r.ok) setError(d.error || "Something went wrong. Please try again.");
    return r.ok;
  };

  return (
    <div className={styles.page}>
      <form
        className={`card-shadow ${styles.card}`}
        onSubmit={async (e) => {
          e.preventDefault();
          if (!sent) setSent(await post("/api/onboarding/code", { email, first: "" }));
          else if (await post("/api/onboarding/verify", { email, code })) router.refresh();
        }}
      >
        <h1>{title}</h1>
        <p>{sent ? `We've emailed a 6-digit code to ${email}.` : note}</p>
        {!sent ? (
          <input type="email" required autoFocus placeholder="you@studio.com" value={email} onChange={(e) => setEmail(e.target.value)} />
        ) : (
          <input inputMode="numeric" autoFocus placeholder="123456" className={styles.code} value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))} />
        )}
        {error && <p className={styles.error}>{error}</p>}
        <button type="submit" disabled={busy || (sent && code.length !== 6)}>
          {busy ? "One moment…" : sent ? "Sign in" : "Email me a code"}
        </button>
        {sent && (
          <button type="button" className={styles.link} onClick={() => (setSent(false), setCode(""))}>
            Use a different email
          </button>
        )}
      </form>
    </div>
  );
}
