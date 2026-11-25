"use client";
import { useEffect, useRef, useState } from "react";
import styles from "./unsubscribe.module.css";

type State = "working" | "done" | "undone" | "error";

export function Unsubscribe({ token }: { token: string }) {
  const [state, setState] = useState<State>(token ? "working" : "error");
  const ran = useRef(false);

  const call = async (undo: boolean) => {
    const r = await fetch(`/api/unsubscribe?t=${encodeURIComponent(token)}&page=1${undo ? "&undo=1" : ""}`, { method: "POST" }).catch(() => null);
    return !!r?.ok;
  };

  useEffect(() => {
    if (!token || ran.current) return;
    ran.current = true;
    call(false).then((ok) => setState(ok ? "done" : "error"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  if (state === "working") return <h1 className={styles.h}>One moment…</h1>;
  if (state === "error")
    return (
      <>
        <h1 className={styles.h}>That link didn&apos;t work.</h1>
        <p className={styles.p}>
          Reply &ldquo;stop&rdquo; to any of our emails, or email{" "}
          <a href="mailto:andre@makersforge.gg">andre@makersforge.gg</a>, and we&apos;ll take you off our list.
        </p>
      </>
    );
  if (state === "undone")
    return (
      <>
        <h1 className={styles.h}>You&apos;re back on the list.</h1>
        <p className={styles.p}>We&apos;ll keep sending new tools and guides when they release.</p>
      </>
    );
  return (
    <>
      <h1 className={styles.h}>You&apos;re unsubscribed.</h1>
      <p className={styles.p}>We won&apos;t email you again.</p>
      <button className={styles.undo} onClick={() => call(true).then((ok) => setState(ok ? "undone" : "error"))}>
        Unsubscribed by mistake? Resubscribe
      </button>
    </>
  );
}
