import type { Metadata } from "next";
import Link from "next/link";
import { JobPostForm } from "@/components/jobs/JobPostForm";
import styles from "./post.module.css";

export const metadata: Metadata = {
  title: "Post a role for free | UA & Growth Jobs in Games & Apps | MakersForge",
  description:
    "Hiring for a UA, growth or marketing-art role in games or apps? Post it free on MakersForge. We review every submission and link candidates straight to your posting.",
  alternates: { canonical: "/jobs/post" },
};

export default function PostJobPage() {
  return (
    <div className={styles.page}>
      <div className="jobs-wrap">
        <nav className={styles.crumbs} aria-label="Breadcrumb">
          <Link href="/jobs">The board</Link>
          <span aria-hidden="true">/</span>
          <span>Post a role</span>
        </nav>

        <header className={styles.head}>
          <p className="kicker">For hiring teams</p>
          <h1 className={styles.title}>Post a role for free</h1>
          <p className={styles.intro}>
            Hiring for UA, growth or marketing art in games or apps? Send it
            over. If it&apos;s in remit we&apos;ll post it free and link
            candidates straight to your own posting. And if the right person
            doesn&apos;t turn up, we&apos;ve a vetted line-up of specialists
            ready to place. Every submission gets a human read.
          </p>
        </header>

        <div className={styles.formWrap}>
          <JobPostForm />
        </div>
      </div>
    </div>
  );
}
