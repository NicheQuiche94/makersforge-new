import type { Metadata } from "next";
import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import { boardScores } from "@/lib/adGraderBench";
import type { Result } from "@/lib/adGrader";
import { AdResult } from "../../AdResult";
import styles from "../../grader.module.css";

export const metadata: Metadata = {
  title: "Your job ad analysis · MakersForge",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";

/* The analysis the email links to (Andre 2026-11-08). */
export default async function AnalysisPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ rewrite?: string }> }) {
  const { id } = await params;
  const { rewrite } = await searchParams;
  const { data: row } = /^[a-f0-9]{10}$/.test(id)
    ? await createAdminClient().from("ad_grades").select("id, title, result, rewrite_requested_at").eq("id", id).maybeSingle()
    : { data: null };

  return (
    <section className={styles.wrap}>
      <div className="container">
        {row ? (
          <>
            <header className={styles.head}>
              <h1 className={styles.display}>
                Your job ad, <span className="gr">graded</span>
              </h1>
            </header>
            <AdResult result={row.result as Result} bench={boardScores().bench} id={row.id} title={row.title ?? undefined} requested={!!row.rewrite_requested_at} autoRewrite={rewrite === "1"} />
          </>
        ) : (
          <header className={styles.head}>
            <h1 className={styles.display}>We couldn&apos;t find that analysis</h1>
            <p className={styles.lede}>
              <Link href="/job-ad-grading-tool">Grade a job ad →</Link>
            </p>
          </header>
        )}
      </div>
    </section>
  );
}
