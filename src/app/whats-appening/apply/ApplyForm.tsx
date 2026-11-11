"use client";

import { useState } from "react";
import styles from "../appening.module.css";

type Preview = { website: string | null; name: string; publisher: string | null; iconUrl: string | null; genre: string | null; edition: "games" | "apps"; releaseDate: string | null; offRemit: boolean };
const MODELS = ["Free to play", "Premium", "Subscription", "Free"];

/* Put a launch forward (Andre 2026-11-10). Two parts: the basics (paste the
   store link, we fill the rest) and "Sell it" (optional, everything that
   makes a spotlight great). DRAFT copy. */
export function ApplyForm() {
  const [url, setUrl] = useState("");
  const [preview, setPreview] = useState<Preview | null>(null);
  const [looking, setLooking] = useState(false);
  const [edition, setEdition] = useState<"games" | "apps">("games");
  const [releaseDate, setReleaseDate] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [tagline, setTagline] = useState("");
  const [highlights, setHighlights] = useState(["", "", ""]);
  const [trailerUrl, setTrailerUrl] = useState("");
  const [otherStoreUrl, setOtherStoreUrl] = useState("");
  const [model, setModel] = useState("");
  const [markets, setMarkets] = useState("");
  const [team, setTeam] = useState("");
  const [proof, setProof] = useState("");
  const [pitch, setPitch] = useState("");
  const [hiring, setHiring] = useState<boolean | null>(null);
  const [website, setWebsite] = useState("");
  const [studioAbout, setStudioAbout] = useState("");
  const [studioLinkedin, setStudioLinkedin] = useState("");
  const [builders, setBuilders] = useState([{ name: "", role: "", linkedin: "" }]);
  const setBuilder = (n: number, k: "name" | "role" | "linkedin", v: string) => setBuilders((xs) => xs.map((x, i) => (i === n ? { ...x, [k]: v } : x)));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState("");

  const isIos = /apple\.com/.test(url);
  const filled = [tagline, ...highlights, trailerUrl, otherStoreUrl, model, markets, team, proof].filter((x) => x.trim()).length;

  const look = async (u: string) => {
    if (!/^https?:\/\//.test(u.trim())) return;
    setLooking(true);
    setError("");
    const r = await fetch("/api/appening/lookup", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ url: u }) })
      .then((x) => x.json())
      .catch(() => ({ error: "We couldn't check that link. Please try again." }));
    setLooking(false);
    if (r.error) {
      setPreview(null);
      return setError(r.error);
    }
    setPreview(r);
    setEdition(r.edition);
    if (r.releaseDate) setReleaseDate(r.releaseDate);
    if (r.website && !website) setWebsite(r.website);
  };

  if (done)
    return (
      <div className={`${styles.done} ${styles.pop}`}>
        <h2>{done} is in the queue</h2>
        <p>If we pick it, you&apos;ll get the date before it goes out.</p>
      </div>
    );

  return (
    <form
      className={styles.applyWrap}
      onSubmit={async (ev) => {
        ev.preventDefault();
        if (busy) return;
        if (preview?.offRemit) return setError("We don't feature gambling or casino titles, sorry.");
        setBusy(true);
        setError("");
        const r = await fetch("/api/appening/apply", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url, edition, releaseDate, name, email, tagline, highlights, trailerUrl, otherStoreUrl, model, markets, team, proof, pitch, hiring, website, studioAbout, studioLinkedin, builders }),
        })
          .then((x) => x.json())
          .catch(() => ({ error: "That didn't go through. Please try again." }));
        setBusy(false);
        if (r.error) return setError(r.error);
        setDone(r.name);
      }}
    >
      <section className={styles.card}>
        <h2 className={styles.cardHead}>
          <span>1</span> The basics
        </h2>
        <label className={styles.field}>
          <span className={styles.lbl}>App Store or Google Play link</span>
          <input type="url" required placeholder="https://apps.apple.com/…" value={url} onChange={(e) => setUrl(e.target.value)} onBlur={(e) => look(e.target.value)} onPaste={(e) => look(e.clipboardData.getData("text"))} />
          {looking && <span className={styles.hint}>Looking it up…</span>}
        </label>

        {preview && (
          <div className={`${styles.preview} ${styles.pop}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            {preview.iconUrl ? <img src={preview.iconUrl} alt="" /> : <span />}
            <span>
              <b>{preview.name}</b>
              <span>{[preview.publisher, preview.genre].filter(Boolean).join(" · ")}</span>
            </span>
            <span className={styles.chips} role="group" aria-label="Game or app">
              {(["games", "apps"] as const).map((e) => (
                <button key={e} type="button" className={styles.chip} aria-pressed={edition === e} onClick={() => setEdition(e)}>
                  {e === "games" ? "Game" : "App"}
                </button>
              ))}
            </span>
          </div>
        )}

        <div className={styles.two}>
          <label className={styles.field}>
            <span className={styles.lbl}>Release date</span>
            <input type="date" value={releaseDate} onChange={(e) => setReleaseDate(e.target.value)} />
          </label>
          <label className={styles.field}>
            <span className={styles.lbl}>Your name</span>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
          </label>
        </div>
        <label className={styles.field}>
          <span className={styles.lbl}>Email</span>
          <input type="email" required placeholder="you@studio.com" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
        </label>
      </section>

      <section className={styles.card}>
        <h2 className={styles.cardHead}>
          <span>2</span> Sell it <em>Optional · {filled}/10</em>
        </h2>
        <p className={styles.small}>The more you give us, the better your spotlight looks.</p>

        <label className={styles.field}>
          <span className={styles.lbl}>Your one-liner</span>
          <input type="text" maxLength={90} value={tagline} onChange={(e) => setTagline(e.target.value)} placeholder="How you'd describe it in one breath" />
        </label>

        <div className={styles.field}>
          <span className={styles.lbl}>Three things that make it special</span>
          {highlights.map((h, n) => (
            <input key={n} type="text" maxLength={120} value={h} placeholder={`${n + 1}.`} onChange={(e) => setHighlights((x) => x.map((y, i) => (i === n ? e.target.value : y)))} />
          ))}
        </div>

        <div className={styles.two}>
          <label className={styles.field}>
            <span className={styles.lbl}>Trailer</span>
            <input type="url" value={trailerUrl} onChange={(e) => setTrailerUrl(e.target.value)} placeholder="YouTube or Vimeo link" />
          </label>
          <label className={styles.field}>
            <span className={styles.lbl}>Also on {isIos ? "Google Play" : "the App Store"}?</span>
            <input type="url" value={otherStoreUrl} onChange={(e) => setOtherStoreUrl(e.target.value)} placeholder="Store link" />
          </label>
        </div>

        <div className={styles.field}>
          <span className={styles.lbl}>Business model</span>
          <div className={styles.chipsLeft}>
            {MODELS.map((m) => (
              <button key={m} type="button" className={styles.chip} aria-pressed={model === m} onClick={() => setModel(model === m ? "" : m)}>
                {m}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.two}>
          <label className={styles.field}>
            <span className={styles.lbl}>Where it&apos;s live</span>
            <input type="text" maxLength={80} value={markets} onChange={(e) => setMarkets(e.target.value)} placeholder="Worldwide, or soft launch in…" />
          </label>
          <label className={styles.field}>
            <span className={styles.lbl}>The team</span>
            <input type="text" maxLength={80} value={team} onChange={(e) => setTeam(e.target.value)} placeholder="e.g. 12 people, Helsinki" />
          </label>
        </div>

        <label className={styles.field}>
          <span className={styles.lbl}>One thing you&apos;re proud of</span>
          <input type="text" maxLength={120} value={proof} onChange={(e) => setProof(e.target.value)} placeholder="A rating, a soft-launch number, an award…" />
        </label>

      </section>

      <section className={styles.card}>
        <h2 className={styles.cardHead}>
          <span>3</span> Built by <em>Optional</em>
        </h2>
        <p className={styles.small}>Credit the people who made it. They get a mention, and links to their LinkedIn.</p>

        <label className={styles.field}>
          <span className={styles.lbl}>The studio in a line</span>
          <input type="text" maxLength={200} value={studioAbout} onChange={(e) => setStudioAbout(e.target.value)} placeholder="Who you are and what you make" />
        </label>
        <div className={styles.two}>
          <label className={styles.field}>
            <span className={styles.lbl}>Website</span>
            <input type="url" value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="https://" />
          </label>
          <label className={styles.field}>
            <span className={styles.lbl}>Studio LinkedIn</span>
            <input type="url" value={studioLinkedin} onChange={(e) => setStudioLinkedin(e.target.value)} placeholder="https://linkedin.com/company/…" />
          </label>
        </div>

        <div className={styles.field}>
          <span className={styles.lbl}>The builders</span>
          {builders.map((b, n) => (
            <div key={n} className={styles.builderRow}>
              <input type="text" maxLength={60} value={b.name} onChange={(e) => setBuilder(n, "name", e.target.value)} placeholder="Name" aria-label="Name" />
              <input type="text" maxLength={60} value={b.role} onChange={(e) => setBuilder(n, "role", e.target.value)} placeholder="Role, e.g. Co-founder" aria-label="Role" />
              <input type="url" value={b.linkedin} onChange={(e) => setBuilder(n, "linkedin", e.target.value)} placeholder="LinkedIn link" aria-label="LinkedIn" />
            </div>
          ))}
          {builders.length < 4 && (
            <button type="button" className={styles.addBtn} onClick={() => setBuilders((x) => [...x, { name: "", role: "", linkedin: "" }])}>
              + Add someone
            </button>
          )}
        </div>

        <label className={styles.field}>
          <span className={styles.lbl}>Anything else?</span>
          <textarea maxLength={280} value={pitch} onChange={(e) => setPitch(e.target.value)} />
        </label>

        <div className={styles.field}>
          <span className={styles.lbl}>Growing the team after launch?</span>
          <div className={styles.chipsLeft}>
            {([
              [true, "Yes"],
              [false, "Not yet"],
            ] as const).map(([v, l]) => (
              <button key={l} type="button" className={styles.chip} aria-pressed={hiring === v} onClick={() => setHiring(hiring === v ? null : v)}>
                {l}
              </button>
            ))}
          </div>
        </div>
      </section>

      <div className={styles.submitRow}>
        {error && <p className={styles.err}>{error}</p>}
        <button className={`${styles.go} ${styles.goBig}`} disabled={busy}>
          {busy ? "Sending…" : "Put it forward"}
        </button>
        <p className={styles.small}>Free. By sending this you&apos;re happy for us to show your icon, screenshots and trailer.</p>
      </div>
    </form>
  );
}
