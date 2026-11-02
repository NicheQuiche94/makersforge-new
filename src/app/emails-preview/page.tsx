"use client";

/**
 * Email review (PROTOTYPE 2026-11-02, not linked from the site). Every client
 * email, rendered as it will land, with sample details, for Andre to sign off
 * before anything is wired to send.
 */
import { useState } from "react";
import { clientEmails } from "@/lib/clientEmails";
import styles from "./emails.module.css";

const SAMPLE = {
  company: "Northwind Games",
  legal: "Northwind Games Ltd",
  number: "12345678",
  address: "1 Example Street, London EC1A 1AA",
  vat: "GB123456789",
  contact: "Sam Patel",
  first: "Sam",
  email: "sam@northwind.com",
  accounts: "accounts@northwind.com",
  plan: "Batch of 3 roles · retained",
  roles: ["Senior UA Manager", "Creative Strategist", "Product Manager, LiveOps"],
  week: "9 to 13 Nov",
  weekStart: "Mon 9 Nov",
  shortlist: "Mon 16 Nov",
  retainer: "£9,400",
  signedBy: "Sam Patel, Head of Growth",
  signedAt: "2 Nov 2026, 10:42",
  ukClient: true,
  schedule: [
    ["Senior UA Manager", "9 to 13 Nov", "Mon 16 Nov"],
    ["Creative Strategist", "9 to 13 Nov", "Mon 16 Nov"],
    ["Product Manager, LiveOps", "16 to 20 Nov", "Mon 23 Nov"],
  ] as [string, string, string][],
};

export default function EmailsPreview() {
  const emails = clientEmails(SAMPLE);
  const [id, setId] = useState(emails[0].id);
  const e = emails.find((x) => x.id === id)!;
  return (
    <div className={styles.page}>
      <p className={styles.proto}>Prototype · emails for sign-off · nothing is sent</p>
      <div className={styles.layout}>
        <nav className={styles.list}>
          {emails.map((x) => (
            <button key={x.id} type="button" className={x.id === id ? styles.on : ""} onClick={() => setId(x.id)}>
              {x.label}
            </button>
          ))}
        </nav>
        <section className={styles.view}>
          <dl className={styles.meta}>
            <dt>To</dt>
            <dd>{e.to}</dd>
            <dt>Subject</dt>
            <dd>
              <strong>{e.subject}</strong>
            </dd>
          </dl>
          <iframe title={e.subject} srcDoc={e.html} className={styles.frame} />
        </section>
      </div>
    </div>
  );
}
