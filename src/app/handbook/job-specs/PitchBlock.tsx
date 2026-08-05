"use client";

import { useState } from "react";
import styles from "./jobspecs.module.css";

/** Renders the verbatim outreach pitch with a one-tap copy button. */
export function PitchBlock({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard blocked — the text is visible to copy manually */
    }
  };
  return (
    <>
      <div className={styles.pitchBar}>
        <span className={styles.pitchLabel}>The message to send</span>
        <button type="button" className={styles.pitchCopy} onClick={copy}>
          {copied ? "Copied ✓" : "Copy pitch"}
        </button>
      </div>
      <div className={styles.pitch}>{text}</div>
    </>
  );
}
