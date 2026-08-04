"use client";

import { useState, type FormEvent } from "react";
import styles from "./login.module.css";

export function LoginForm() {
  const [pw, setPw] = useState("");
  const [error, setError] = useState(false);
  const [busy, setBusy] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(false);
    try {
      const res = await fetch("/api/handbook-auth", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ password: pw }),
      });
      if (res.ok) {
        const next = new URLSearchParams(window.location.search).get("next");
        window.location.href = next && next.startsWith("/handbook") ? next : "/handbook";
        return;
      }
      setError(true);
      setBusy(false);
    } catch {
      setError(true);
      setBusy(false);
    }
  };

  return (
    <div className={styles.wrap}>
      <form className={styles.card} onSubmit={onSubmit}>
        <p className={styles.kicker}>MakersForge · Team</p>
        <h1 className={styles.title}>The handbook</h1>
        <p className={styles.sub}>Enter the team password to continue.</p>

        <input
          type="password"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          placeholder="Password"
          autoFocus
          autoComplete="current-password"
          className={styles.input}
          aria-label="Handbook password"
          aria-invalid={error}
        />
        {error && <p className={styles.error}>That password isn&apos;t right. Try again.</p>}

        <button
          type="submit"
          className={`btn btn-primary ${styles.submit}`}
          disabled={busy || !pw}
        >
          <span className="btn-label">{busy ? "Checking…" : "Enter"}</span>
          {!busy && (
            <span className="btn-arrow" aria-hidden="true">
              →
            </span>
          )}
        </button>

        <p className={styles.footnote}>Private to the MakersForge team.</p>
      </form>
    </div>
  );
}
