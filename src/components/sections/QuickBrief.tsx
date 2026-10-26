"use client";

import { BOOKING_URL } from "@/lib/site";
import { useRef, useState, type DragEvent, type FormEvent } from "react";
import { Button } from "@/components/atoms/Button";
import proof from "./ProofSections.module.css";
import styles from "./QuickBrief.module.css";

/**
 * Free candidates form (2026-10-27) — replaces the five-field quick brief.
 * Andre's offer: drop in a job spec (or a few lines about the role) and we
 * send 3 anonymised profiles, free, no obligation to interview. Only name +
 * work email are required, plus EITHER the text box or a file.
 * Posts multipart to /api/brief, which emails Andre with the file attached.
 */
const MAX_MB = 4;

export function QuickBrief({ industry }: { industry?: "games" | "apps" }) {
  const [state, setState] = useState<"idle" | "sending" | "done">("idle");
  const [error, setError] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  function pick(f: File | null | undefined) {
    if (!f) return;
    if (f.size > MAX_MB * 1024 * 1024) {
      setError(`That file is over ${MAX_MB}MB. Paste the spec into the box instead.`);
      return;
    }
    setError(null);
    setFile(f);
  }

  function onDrop(e: DragEvent<HTMLLabelElement>) {
    e.preventDefault();
    setDragging(false);
    pick(e.dataTransfer.files?.[0]);
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    fd.delete("spec");
    if (file) fd.set("spec", file);
    if (!((fd.get("details") as string) || "").trim() && !file) {
      setError("Tell us a little about the role, or attach a job spec.");
      return;
    }
    setState("sending");
    setError(null);
    try {
      const res = await fetch("/api/brief", { method: "POST", body: fd });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Something went wrong. Try again, or email andre@makersforge.gg.");
        setState("idle");
        return;
      }
      setState("done");
    } catch {
      setError("Something went wrong. Try again, or email andre@makersforge.gg.");
      setState("idle");
    }
  }

  return (
    <section className={proof.section} id="brief">
      <div className={`container ${proof.contentAbove}`}>
        <header className={`reveal ${proof.header}`}>
          <p className="kicker">Try us first</p>
          <h2 className={proof.h2}>See 3 candidates before you sign anything.</h2>
          <p className={proof.lede}>
            Send us the role or a job spec and we&apos;ll send 3 anonymised
            profiles from people we&apos;ve already interviewed, free. Like what
            you see? Agree terms and we run the full search on top: 5 more
            candidates in 5 working days.
          </p>
        </header>

        <div className={`reveal d1 card-shadow ${styles.card}`}>
          {state === "done" ? (
            <div className={styles.done}>
              <p className={styles.doneTitle}>Thanks, that&apos;s with us.</p>
              <p>We&apos;ll be in touch shortly with your 3 anonymised profiles.</p>
            </div>
          ) : (
            <form className={styles.form} onSubmit={onSubmit}>
              <label className={styles.field}>
                <span className={styles.label}>Tell us about the role</span>
                <textarea
                  className={styles.textarea}
                  name="details"
                  rows={6}
                  placeholder="A few lines, the whole spec, or just the job title. Anything that matters: seniority, remote or on-site, budget, timing."
                />
              </label>

              <label
                className={`${styles.drop} ${dragging ? styles.dropOn : ""} ${file ? styles.dropHasFile : ""}`}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragging(true);
                }}
                onDragLeave={() => setDragging(false)}
                onDrop={onDrop}
              >
                <input
                  ref={fileInput}
                  className={styles.fileInput}
                  type="file"
                  name="spec"
                  accept=".pdf,.doc,.docx,.txt,.rtf,.odt,.pages"
                  onChange={(e) => pick(e.target.files?.[0])}
                />
                {file ? (
                  <span className={styles.fileChip}>
                    <span className={styles.fileName}>{file.name}</span>
                    <button
                      type="button"
                      className={styles.fileRemove}
                      onClick={(e) => {
                        e.preventDefault();
                        setFile(null);
                        if (fileInput.current) fileInput.current.value = "";
                      }}
                      aria-label="Remove file"
                    >
                      ×
                    </button>
                  </span>
                ) : (
                  <>
                    <span className={styles.dropTitle}>
                      Drop a job spec here, or <u>browse</u>
                    </span>
                    <span className={styles.dropHint}>PDF or Word, up to {MAX_MB}MB. Optional.</span>
                  </>
                )}
              </label>

              <div className={styles.row}>
                <label className={styles.field}>
                  <span className={styles.label}>Your name</span>
                  <input className={styles.input} name="name" required autoComplete="name" />
                </label>
                <label className={styles.field}>
                  <span className={styles.label}>Work email</span>
                  <input className={styles.input} name="email" type="email" required autoComplete="email" />
                </label>
              </div>

              {industry ? <input type="hidden" name="industry" value={industry} /> : null}
              {error ? <p className={styles.error}>{error}</p> : null}

              <div className={styles.foot}>
                <p className={styles.note}>
                  No terms and no obligation to interview.
                </p>
                <Button type="submit" variant="primary" arrow disabled={state === "sending"}>
                  {state === "sending" ? "Sending…" : "Send me 3 free profiles"}
                </Button>
              </div>
            </form>
          )}
        </div>

        <p className={styles.alt}>
          Rather talk first? <a href={BOOKING_URL}>Book a 15-minute call</a>
        </p>
      </div>
    </section>
  );
}
