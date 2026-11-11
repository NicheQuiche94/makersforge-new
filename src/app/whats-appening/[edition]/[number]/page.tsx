import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { allIssues, getSettings, type IssueWithEntries } from "@/lib/appening/data";
import { EDITION_NAME, niceDate, plan } from "@/lib/appening/schedule";
import { issuePath, issueTitle } from "@/lib/appening/emails";
import { SubscribeForm } from "../../SubscribeForm";
import { Trailer } from "../../Motion";
import { art } from "@/lib/appening/store";
import styles from "../../appening.module.css";

/* One issue: 3 spotlights + "Also new". Live once published; previews and
   local dev also show drafts (with a note) so Andre can check them. */
export const revalidate = 600;
const showDrafts = () => process.env.VERCEL_ENV !== "production";

async function find(edition: string, number: string) {
  if (edition !== "games" && edition !== "apps") return null;
  const issues = await allIssues();
  const i = issues.find((x) => x.edition === edition && x.number === Number(number));
  if (!i || (!i.published_on && !showDrafts())) return null;
  return { i, issues };
}

export async function generateMetadata({ params }: { params: Promise<{ edition: string; number: string }> }): Promise<Metadata> {
  const { edition, number } = await params;
  const f = await find(edition, number);
  if (!f) return {};
  const names = f.i.spotlights.map((e) => e.name).join(", ");
  return {
    title: `${issueTitle(f.i)}: ${names} · MakersForge`,
    description: `New mobile ${f.i.edition} worth knowing: ${names}.`,
    alternates: { canonical: issuePath(f.i) },
  };
}

/** The official store badges (Apple / Google artwork in /public/images/badges). */
function StoreBadge({ store, url }: { store: string; url: string }) {
  return (
    <a href={url} target="_blank" rel="noopener" className={store === "ios" ? styles.badgeIos : styles.badgePlay}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={store === "ios" ? "/images/badges/app-store.svg" : "/images/badges/google-play.png"} alt={store === "ios" ? "Download on the App Store" : "Get it on Google Play"} />
    </a>
  );
}

export default async function IssuePage({ params }: { params: Promise<{ edition: string; number: string }> }) {
  const { edition, number } = await params;
  const f = await find(edition, number);
  if (!f) notFound();
  const { i, issues } = f;
  const date = i.published_on || plan(issues, await getSettings()).get(i.id);
  const same = issues.filter((x) => x.edition === i.edition && (x.published_on || showDrafts()));
  const prev = same.find((x) => x.number === i.number - 1);
  const next = same.find((x) => x.number === i.number + 1);
  const link = (x: IssueWithEntries) => `${EDITION_NAME[x.edition]} #${x.number}`;

  return (
    <section className={styles.wrap}>
      <div className="container">
        <article className={styles.issue}>
          {!i.published_on && <span className={styles.draftNote}>Preview: not published yet{i.status === "draft" ? " (draft)" : ""}</span>}
          <Link href="/whats-appening" className={styles.back}>
            ← What&apos;s Appening
          </Link>
          <header className={styles.issueHead}>
            <p className={styles.kicker}>What&apos;s Appening</p>
            <h1>
              {EDITION_NAME[i.edition]} <span className="gr">#{i.number}</span>
            </h1>
            <p className={styles.meta}>{niceDate(date)}</p>
            {i.intro && <p className={styles.intro}>{i.intro}</p>}
          </header>

          <div className={styles.spots}>
            {i.spotlights.map((e) => {
              const applied = e.origin === "applied"; // they agreed to screenshots + trailer on the form
              const meta = [e.model, e.markets, e.team].filter(Boolean) as string[];
              const studioLink = e.studio_linkedin || e.website;
              return (
                <section key={e.id} className={`${styles.s} reveal`}>
                  <header className={styles.sHead}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    {e.icon_url ? <img src={art(e.icon_url, 256)} alt={`${e.name} icon`} /> : <span />}
                    <div>
                      <h2 className={styles.sName}>{e.name}</h2>
                      <p className={styles.sBy}>
                        {e.publisher &&
                          (studioLink ? (
                            <a href={studioLink} target="_blank" rel="noopener">
                              {e.publisher}
                            </a>
                          ) : (
                            <span>{e.publisher}</span>
                          ))}
                        {e.genre && <span>{e.genre}</span>}
                      </p>
                    </div>
                  </header>
                  {e.tagline && <p className={styles.sTag}>{e.tagline}</p>}

                  {applied && e.trailer_url && <Trailer url={e.trailer_url} name={e.name} />}
                  {applied && e.screenshots.length > 0 && (
                    <div className={styles.shots}>
                      {e.screenshots.slice(0, 6).map((src) => (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img key={src} src={art(src, 1080)} alt={`${e.name} screenshot`} loading="lazy" />
                      ))}
                    </div>
                  )}

                  {e.take && (
                    <p className={styles.sTake}>{e.take}</p>
                  )}

                  {e.highlights.length > 0 && (
                    <ul className={styles.sList}>
                      {e.highlights.map((h) => (
                        <li key={h}>{h}</li>
                      ))}
                    </ul>
                  )}

                  <footer className={styles.sFoot}>
                    {(meta.length > 0 || e.proof) && (
                      <p className={styles.sMeta}>
                        {meta.map((m) => (
                          <span key={m}>{m}</span>
                        ))}
                        {e.proof && <span className={styles.sProof}>★ {e.proof}</span>}
                      </p>
                    )}
                    {(e.publisher || e.builders.length > 0) && (
                      <p className={styles.sBuilt}>
                        <b>Built by</b>
                        {e.publisher &&
                          (studioLink ? (
                            <a href={studioLink} target="_blank" rel="noopener">
                              {e.publisher}
                            </a>
                          ) : (
                            <strong>{e.publisher}</strong>
                          ))}
                        {/* Named builders only when the studio chose to credit them. */}
                        {e.builders.map((b) => (
                          <span key={b.name}>
                            {b.linkedin ? (
                              <a href={b.linkedin} target="_blank" rel="noopener">
                                {b.name}
                                <i aria-label="LinkedIn">in</i>
                              </a>
                            ) : (
                              <strong>{b.name}</strong>
                            )}
                            {b.role && <em>{b.role}</em>}
                          </span>
                        ))}
                        {e.studio_about && <small>{e.studio_about}</small>}
                      </p>
                    )}
                    <div className={styles.badges}>
                      <StoreBadge store={e.store} url={e.store_url} />
                      {e.other_store_url && <StoreBadge store={e.store === "ios" ? "android" : "ios"} url={e.other_store_url} />}
                    </div>
                  </footer>
                </section>
              );
            })}
          </div>

          {i.list.length > 0 && (
            <div className={styles.also}>
              <h2>Also new</h2>
              <ul className={styles.alsoList}>
                {i.list.map((e) => (
                  <li key={e.id}>
                    <a href={e.store_url} target="_blank" rel="noopener">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      {e.icon_url ? <img src={art(e.icon_url, 128)} alt="" loading="lazy" /> : <span />}
                      <span>
                        <b>{e.name}</b>
                        <span>{[e.publisher, e.genre].filter(Boolean).join(" · ")}</span>
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className={`${styles.band} ${styles.bandHeat}`}>
            <div>
              <h2>Get the next one</h2>
              <p>Games and apps in alternating weeks. Get either one or both, direct to your inbox.</p>
            </div>
            <SubscribeForm source={`issue-${i.edition}-${i.number}`} cta="Sign up" />
          </div>
          <p style={{ textAlign: "center", marginTop: 18 }}>
            <Link href="/whats-appening/apply" className={styles.ghost}>
              Launching something? Put it forward →
            </Link>
          </p>

          <nav className={styles.pager}>
            {prev ? <Link href={issuePath(prev)}>← {link(prev)}</Link> : <span />}
            {next ? <Link href={issuePath(next)}>{link(next)} →</Link> : <span />}
          </nav>
        </article>
      </div>
    </section>
  );
}
