import type { Metadata } from "next";
import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import { availability } from "@/lib/onboarding/db";
import { WEEKS } from "@/lib/plans";
import type { Tier } from "@/lib/tier";
import type { Method } from "@/lib/hireTimeline";
import { TimelineResult } from "../../TimelineResult";
import styles from "../../../compare/compare.module.css";

export const metadata: Metadata = { title: "Your hire timeline · MakersForge", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

/* The timeline the email links to: /hire-timeline/r/<lid>, read from the saved request. */
export default async function TimelinePage({ params }: { params: Promise<{ lid: string }> }) {
  const { lid } = await params;
  const db = createAdminClient();
  const { data: row } = /^[a-f0-9]{10}$/.test(lid)
    ? await db.from("timeline_requests").select("lid, title, tier, country, method, need_by, created_at, opened_at").eq("lid", lid).maybeSingle()
    : { data: null };
  if (!row) {
    return (
      <section className={styles.wrap}>
        <div className="container">
          <h1 className={styles.h1}>This timeline link has expired</h1>
          <p className={styles.lede}>
            <Link href="/hire-timeline">Make a new one →</Link>
          </p>
        </div>
      </section>
    );
  }
  if (!row.opened_at) await db.from("timeline_requests").update({ opened_at: new Date().toISOString() }).eq("lid", lid);
  // Live search-week calendar; the mock calendar if the database can't be reached.
  const weeks = await availability().catch(() => WEEKS);
  const next = weeks.find((w) => w.open > 0);
  const month = next?.start.slice(0, 7);
  const left = weeks.filter((w) => w.start.slice(0, 7) === month).reduce((n, w) => n + w.open, 0);
  return (
    <TimelineResult
      lid={row.lid}
      input={{ title: row.title, tier: row.tier as Tier, country: row.country, method: row.method as Method, needBy: row.need_by ?? undefined, nextWeek: next?.start, today: new Date().toISOString() }}
      slots={{ left, month: next ? new Date(next.start + "T00:00:00").toLocaleDateString("en-GB", { month: "long" }) : "" }}
    />
  );
}
