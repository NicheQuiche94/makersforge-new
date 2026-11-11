import type { Metadata } from "next";
import Link from "next/link";
import { allIssues, publishedIssues } from "@/lib/appening/data";
import { EDITION_NAME, niceDate } from "@/lib/appening/schedule";
import { issuePath } from "@/lib/appening/emails";
import { SubscribeForm } from "./SubscribeForm";
import { art } from "@/lib/appening/store";
import { NotificationStack, type Note } from "./Motion";
import styles from "./appening.module.css";

/* What's Appening landing + archive (Andre 2026-11-10). DRAFT copy. */
export const metadata: Metadata = {
  title: "What's Appening: the newest mobile games and apps · MakersForge",
  description:
    "Showcasing the newest mobile games and apps on the market. Three games one week, three apps the next. Free.",
  alternates: { canonical: "/whats-appening" },
};
export const revalidate = 600;

/* Before the first issue, the hero shows what the format is like. */
const LAUNCH_NOTES: Note[] = [
  {
    title: "What's Appening",
    body: "The newest mobile games and apps, picked by hand.",
    when: "new",
  },
  {
    title: "Games edition",
    body: "Three new games: who made them and why they're worth a look.",
    when: "new",
  },
  {
    title: "Apps edition",
    body: "Three new apps, from the teams that built them.",
    when: "new",
  },
  {
    title: "Launching soon?",
    body: "Put your game or app forward. It's free.",
    when: "new",
  },
];

export default async function AppeningPage({ searchParams }: { searchParams: Promise<{ live?: string }> }) {
  // Previews and local dev also list unpublished issues (marked), so Andre can review them.
  // ?live shows a preview exactly as the live site will look (no drafts).
  const { live } = await searchParams;
  const drafts = process.env.VERCEL_ENV !== "production" && live === undefined;
  const issues = drafts
    ? (await allIssues()).sort(
        (a, b) =>
          (b.published_on ?? "9").localeCompare(a.published_on ?? "9") ||
          b.number - a.number,
      )
    : await publishedIssues();
  const recent = issues
    .slice(0, 3)
    .flatMap((i) => i.spotlights.map((e) => ({ e, i })));
  const notes: Note[] = recent.length
    ? recent.map(({ e, i }) => ({
        icon: art(e.icon_url, 128),
        title: e.name,
        body:
          e.tagline ||
          e.take?.split(". ")[0] ||
          `New in ${EDITION_NAME[i.edition]} #${i.number}`,
        when: i.published_on ? niceDate(i.published_on, false) : "soon",
      }))
    : LAUNCH_NOTES;
  const icons = recent.map(({ e }) => e.icon_url).filter(Boolean) as string[];

  return (
    <>
      <section className={styles.hero}>
        <div className={styles.heroGlow} aria-hidden="true" />
        {/* Floating icons only once there are issues to take them from (Andre 2026-11-11). */}
        {icons.length > 0 && (
          <div className={styles.floaters} aria-hidden="true">
            {Array.from({ length: 8 }, (_, n) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={n} src={art(icons[n % icons.length], 128)} alt="" className={styles.floater} style={{ ["--n" as string]: n }} />
            ))}
          </div>
        )}
        <div className={`container ${styles.heroInner} ${styles.lane}`}>
          <div className={styles.heroCopy}>
            {drafts && (
              <span className={styles.draftNote}>
                Preview: unpublished issues show here, only published ones show
                on the live site
              </span>
            )}
            <p className={styles.kicker}>By MakersForge</p>
            <h1 className={styles.display}>
              What&apos;s <span className="gr">Appening</span>
            </h1>
            <p className={styles.lede}>
              Showcasing the newest mobile games and apps on the market.
            </p>
            <SubscribeForm />
            <Link href="/whats-appening/apply" className={styles.ghost}>
              Launching something? Put it forward →
            </Link>
          </div>
          <NotificationStack notes={notes} />
        </div>
      </section>

      <section className={styles.wrapTight}>
        <div className={`container ${styles.lane}`}>
          <div className={styles.archive}>
            <h2>Issues</h2>
            {issues.length ? (
              issues.map((i) => (
                <Link
                  key={i.id}
                  href={issuePath(i)}
                  className={`${styles.issueLink} reveal`}
                >
                  <span className={styles.icons}>
                    {i.spotlights.map((e) =>
                      e.icon_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img key={e.id} src={art(e.icon_url, 128)} alt="" />
                      ) : null,
                    )}
                  </span>
                  <span>
                    <strong>
                      {EDITION_NAME[i.edition]} #{i.number}
                    </strong>
                    <span>{i.spotlights.map((e) => e.name).join(" · ")}</span>
                  </span>
                  <em>
                    {i.published_on ? niceDate(i.published_on) : "Not out yet"}{" "}
                    →
                  </em>
                </Link>
              ))
            ) : (
              <p className={styles.empty}>
                New issues will feature here. The first ones are being built as
                we speak!
              </p>
            )}
          </div>

          <div className={`${styles.band} ${styles.bandHeat} reveal`}>
            <div>
              <h2>Launching something?</h2>
              <p>
                Put it in front of the people who build games and apps. Free.
              </p>
            </div>
            <Link href="/whats-appening/apply" className={styles.go}>
              Put it forward →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
