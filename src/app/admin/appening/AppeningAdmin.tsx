"use client";

/**
 * What's Appening admin (2026-11-10). Top: launch date, cadence, how far
 * ahead we are. Then per edition: issues (open one to review spotlights,
 * edit takes, approve) and the queue (applied + radar finds, best first).
 */
import { useState, useTransition } from "react";
import Link from "next/link";
import type { Entry, IssueWithEntries } from "@/lib/appening/data";
import { EDITION_NAME, EDITIONS, niceDate, type Settings } from "@/lib/appening/schedule";
import { inWindow, score } from "@/lib/appening/pick";
import type { Edition } from "@/lib/appening/store";
import { addByLink, approve, book, decline, newIssue, redraft, saveIntro, saveSettings, saveTake, unapprove, unbook } from "./actions";
import styles from "./appening-admin.module.css";

type Props = { settings: Settings; issues: IssueWithEntries[]; queue: Entry[]; dates: Record<string, string>; subscribers: number };

export function AppeningAdmin({ settings, issues, queue, dates, subscribers }: Props) {
  const [ed, setEd] = useState<Edition>("games");
  const [open, setOpen] = useState<string | null>(null);
  const [toast, setToast] = useState("");
  const [pending, start] = useTransition();
  const [link, setLink] = useState("");

  const run = (fn: () => Promise<string>) =>
    start(async () => {
      try {
        setToast(await fn());
      } catch (e) {
        setToast(e instanceof Error ? e.message : "Something went wrong");
      }
      setTimeout(() => setToast(""), 3500);
    });

  const mine = issues.filter((i) => i.edition === ed).sort((a, b) => b.number - a.number);
  const upcoming = mine.filter((i) => !i.published_on);
  const target = upcoming.filter((i) => i.status === "draft").sort((a, b) => a.number - b.number)[0];
  const q = queue.filter((e) => e.edition === ed).sort((a, b) => score(b) - score(a));
  const ahead = (e: Edition) => {
    const ready = issues.filter((i) => i.edition === e && i.status === "approved" && !i.published_on);
    const last = ready.map((i) => dates[i.id]).sort().pop();
    return { n: ready.length, last };
  };

  return (
    <div className={styles.page}>
      <header className={styles.top}>
        <Link href="/admin" className={styles.brand}>
          MakersForge admin
        </Link>
        <span className={styles.who}>What&apos;s Appening</span>
      </header>

      <section className={styles.status}>
        <div>
          <span className={styles.k}>Launch</span>
          <input
            type="date"
            defaultValue={settings.launch_on ?? ""}
            onChange={(e) => run(() => saveSettings({ launch_on: e.target.value || null }))}
            disabled={pending}
          />
          <small>{settings.launch_on ? "Issues go out at 07:00 UK on their day" : "Not launched: nothing goes out. Dates below assume next Monday."}</small>
        </div>
        <div>
          <span className={styles.k}>Cadence</span>
          <select defaultValue={settings.cadence} onChange={(e) => run(() => saveSettings({ cadence: e.target.value as Settings["cadence"] }))} disabled={pending}>
            <option value="alternate">Alternate weeks (Mondays)</option>
            <option value="weekly">Both weekly (apps Mon, games Fri)</option>
          </select>
        </div>
        {EDITIONS.map((e) => {
          const a = ahead(e);
          return (
            <div key={e}>
              <span className={styles.k}>{EDITION_NAME[e]} ready</span>
              <strong className={a.n >= 2 ? styles.good : styles.warn}>{a.n} approved</strong>
              <small>{a.last ? `covered until ${niceDate(a.last)}` : "nothing approved yet"}</small>
            </div>
          );
        })}
        <div>
          <span className={styles.k}>Subscribers</span>
          <strong>{subscribers}</strong>
        </div>
      </section>

      <nav className={styles.tabs}>
        {EDITIONS.map((e) => (
          <button key={e} type="button" className={ed === e ? styles.tabOn : ""} onClick={() => setEd(e)}>
            {EDITION_NAME[e]} · {queue.filter((x) => x.edition === e).length} in queue
          </button>
        ))}
      </nav>

      <div className={styles.cols}>
        <section>
          <div className={styles.colHead}>
            <h2>Issues</h2>
            <button type="button" className={styles.cta} disabled={pending} onClick={() => run(() => newIssue(ed))}>
              + New {EDITION_NAME[ed].toLowerCase()} issue
            </button>
          </div>
          {!mine.length && <p className={styles.empty}>No issues yet. Start one and it fills itself from the queue.</p>}
          <ul className={styles.issues}>
            {mine.map((i) => (
              <li key={i.id} className={styles.issue}>
                <button type="button" className={styles.issueRow} onClick={() => setOpen(open === i.id ? null : i.id)}>
                  <strong>
                    {EDITION_NAME[i.edition]} #{i.number}
                  </strong>
                  <span>{i.published_on ? `Out ${niceDate(i.published_on)}` : `${niceDate(dates[i.id])}${settings.launch_on ? "" : " (if launched)"}`}</span>
                  <em className={i.published_on ? styles.pillOut : i.status === "approved" ? styles.pillOk : styles.pillDraft}>
                    {i.published_on ? "Out" : i.status === "approved" ? "Approved" : `Draft · ${i.spotlights.filter((e) => e.take).length}/3 takes`}
                  </em>
                </button>
                {open === i.id && (
                  <div className={styles.issueBody}>
                    <Link href={`/whats-appening/${i.edition}/${i.number}`} target="_blank" className={styles.link}>
                      Preview the page ↗
                    </Link>
                    <label className={styles.field}>
                      <span>Intro (optional, one or two lines)</span>
                      <textarea defaultValue={i.intro ?? ""} onBlur={(e) => e.target.value !== (i.intro ?? "") && run(() => saveIntro(i.id, e.target.value))} disabled={!!i.published_on} />
                    </label>
                    <h3>Spotlights · {i.spotlights.length}/3</h3>
                    {i.spotlights.map((e) => (
                      <Spot key={`${e.id}:${e.take ?? ""}:${e.take_draft ?? ""}`} e={e} locked={!!i.published_on || i.status === "approved"} pending={pending} run={run} />
                    ))}
                    <h3>Also new · {i.list.length}</h3>
                    <ul className={styles.mini}>
                      {i.list.map((e) => (
                        <li key={e.id}>
                          <Icon e={e} small />
                          <span>
                            <b>{e.name}</b> {e.publisher}
                          </span>
                          {!i.published_on && i.status === "draft" && (
                            <>
                              <button type="button" disabled={pending} onClick={() => run(() => book(e.id, i.id, "spotlight"))}>
                                Spotlight
                              </button>
                              <button type="button" disabled={pending} onClick={() => run(() => unbook(e.id))}>
                                Remove
                              </button>
                            </>
                          )}
                        </li>
                      ))}
                    </ul>
                    {!i.published_on && (
                      <div className={styles.approveRow}>
                        {i.status === "draft" ? (
                          <button type="button" className={styles.cta} disabled={pending} onClick={() => run(() => approve(i.id))}>
                            Approve · tells featured studios their date
                          </button>
                        ) : (
                          <button type="button" className={styles.ghostBtn} disabled={pending} onClick={() => run(() => unapprove(i.id))}>
                            Back to draft
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </section>

        <section>
          <div className={styles.colHead}>
            <h2>Queue</h2>
          </div>
          <form
            className={styles.addRow}
            onSubmit={(e) => {
              e.preventDefault();
              run(async () => {
                const m = await addByLink(link);
                setLink("");
                return m;
              });
            }}
          >
            <input type="url" placeholder="Add a store link you spotted" value={link} onChange={(e) => setLink(e.target.value)} />
            <button type="submit" disabled={pending || !link}>
              Add
            </button>
          </form>
          {!target && <p className={styles.hint}>Start a new {ed} issue to book from the queue.</p>}
          <ul className={styles.queue}>
            {q.map((e) => {
              const fits = target ? inWindow(e, dates[target.id]) : true;
              return (
                <li key={e.id} className={fits ? "" : styles.dim}>
                  <Icon e={e} />
                  <div>
                    <b>{e.name}</b>
                    <span className={styles.sub}>{[e.publisher, e.genre, e.release_date && `out ${niceDate(e.release_date, false)}`].filter(Boolean).join(" · ")}</span>
                    <span className={styles.tags}>
                      <i className={e.origin === "applied" ? styles.tagApplied : ""}>{e.origin === "applied" ? "Applied" : e.signal || "Radar"}</i>
                      {e.hiring && <i className={styles.tagHot}>Growing the team</i>}
                      {!fits && <i>Outside the release window</i>}
                    </span>
                    {(e.tagline || e.pitch) && <p className={styles.pitch}>“{e.tagline || e.pitch}”</p>}
                    {e.email && <span className={styles.sub}>{[e.contact_name, e.email].filter(Boolean).join(" · ")}</span>}
                  </div>
                  <div className={styles.acts}>
                    <a href={e.store_url} target="_blank" rel="noopener">
                      Store ↗
                    </a>
                    {target && (
                      <>
                        <button type="button" disabled={pending} onClick={() => run(() => book(e.id, target.id, "spotlight"))}>
                          Spotlight in #{target.number}
                        </button>
                        <button type="button" disabled={pending} onClick={() => run(() => book(e.id, target.id, "list"))}>
                          List in #{target.number}
                        </button>
                      </>
                    )}
                    <button type="button" disabled={pending} onClick={() => run(() => decline(e.id))}>
                      Decline
                    </button>
                  </div>
                </li>
              );
            })}
            {!q.length && <p className={styles.empty}>Queue is empty. Applications and radar finds land here.</p>}
          </ul>
        </section>
      </div>
      {toast && <div className={styles.toast}>{toast}</div>}
    </div>
  );
}

function Icon({ e, small }: { e: Entry; small?: boolean }) {
  // eslint-disable-next-line @next/next/no-img-element
  return e.icon_url ? <img className={small ? styles.iconSm : styles.icon} src={e.icon_url} alt="" /> : <span className={small ? styles.iconSm : styles.icon} />;
}

function Spot({ e, locked, pending, run }: { e: Entry; locked: boolean; pending: boolean; run: (fn: () => Promise<string>) => void }) {
  const [take, setTake] = useState(e.take ?? e.take_draft ?? "");
  const saved = !!e.take && take === e.take;
  const words = take.replace(/\[Check:[\s\S]*\]/, "").split(/\s+/).filter(Boolean).length;
  return (
    <div className={styles.spot}>
      <div className={styles.spotHead}>
        <Icon e={e} />
        <span>
          <b>{e.name}</b>
          <span className={styles.sub}>{[e.publisher, e.genre, e.origin === "applied" ? "applied" : "radar"].filter(Boolean).join(" · ")}</span>
        </span>
        <a href={e.store_url} target="_blank" rel="noopener">
          Store ↗
        </a>
      </div>
      {e.tagline && <p className={styles.pitch}>Their one-liner: “{e.tagline}”</p>}
      {e.highlights.length > 0 && <p className={styles.sub}>Special: {e.highlights.join(" · ")}</p>}
      {[e.model, e.markets, e.team, e.proof, e.trailer_url && "has trailer"].some(Boolean) && <p className={styles.sub}>{[e.model, e.markets, e.team, e.proof && `★ ${e.proof}`, e.trailer_url && "▶ trailer"].filter(Boolean).join(" · ")}</p>}
      {e.pitch && <p className={styles.pitch}>Their note: “{e.pitch}”</p>}
      <textarea value={take} onChange={(x) => setTake(x.target.value)} disabled={locked} rows={3} placeholder="The take: 2 short sentences" />
      <div className={styles.spotActs}>
        <span className={saved ? styles.good : styles.warn}>
          {saved ? "Saved" : e.take ? "Edited, not saved" : take ? "Draft: edit and save" : "No take yet"} · {words} words
        </span>
        {!locked && (
          <>
            <button type="button" disabled={pending || !take.trim() || /\[Check:/.test(take)} title={/\[Check:/.test(take) ? "Remove the [Check: …] note first" : ""} onClick={() => run(() => saveTake(e.id, take))}>
              Save take
            </button>
            <button type="button" disabled={pending} onClick={() => run(() => redraft(e.id))}>
              Redraft
            </button>
            <button type="button" disabled={pending} onClick={() => run(() => unbook(e.id))}>
              Remove
            </button>
          </>
        )}
      </div>
    </div>
  );
}
