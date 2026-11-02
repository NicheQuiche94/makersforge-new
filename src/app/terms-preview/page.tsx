"use client";

/**
 * Terms review (PROTOTYPE 2026-11-02, not linked from the site). Shows the
 * three generated versions of Andre's Terms of Business with sample client
 * details, marking what's his original wording, what's a fixed typo and
 * what's new, so he only has to review the differences.
 */
import { useState } from "react";
import { buildTerms, type Clause, type TermsVariant } from "@/lib/termsOfBusiness";
import styles from "./preview.module.css";

const SAMPLE = {
  date: "2 November 2026",
  client: "Northwind Games Ltd",
  clientNumber: "12345678",
  clientAddress: "1 Example Street, London EC1A 1AA",
  contractFee: "£1,000",
  cancelFee: "£1,500",
  cancelHours: 48,
};

function ClauseView({ c }: { c: Clause }) {
  return (
    <div className={`${styles.clause} ${c.kind === "new" ? styles.new : c.kind === "fixed" ? styles.fixed : ""}`}>
      <p>
        {c.n && <span className={styles.num}>{c.n}</span>}
        {c.text}
      </p>
      {c.note && <p className={styles.note}>{c.kind === "new" ? "New: " : c.kind === "fixed" ? "Fixed: " : "Note: "}{c.note}</p>}
      {c.sub?.map((s, i) => (
        <div key={i} className={styles.subClause}>
          <ClauseView c={s} />
        </div>
      ))}
    </div>
  );
}

export default function TermsPreview() {
  const [variant, setVariant] = useState<TermsVariant>("permanent");
  const [guarantee, setGuarantee] = useState(false);
  const [retained, setRetained] = useState(false);
  const [roles, setRoles] = useState(3);
  const t = buildTerms({ variant, guarantee, retained, roles, ...SAMPLE });
  return (
    <div className={styles.page}>
      <p className={styles.proto}>Prototype · terms review · not linked from the site</p>
      <div className={styles.bar}>
        {(["permanent", "contract", "batch"] as const).map((v) => (
          <button key={v} type="button" className={variant === v ? styles.on : ""} onClick={() => setVariant(v)}>
            {v === "permanent" ? "Permanent hire" : v === "contract" ? "Contractor" : "Batch"}
          </button>
        ))}
        {variant === "batch" && (
          <select className={styles.select} value={roles} onChange={(e) => setRoles(+e.target.value)} aria-label="Roles in the batch">
            {[2, 3, 4, 5].map((r) => (
              <option key={r} value={r}>
                {r} roles
              </option>
            ))}
          </select>
        )}
        {variant !== "contract" && (
          <label className={styles.toggle}>
            <input type="checkbox" checked={retained} onChange={(e) => setRetained(e.target.checked)} /> Retained
          </label>
        )}
        <label className={styles.toggle}>
          <input type="checkbox" checked={guarantee} onChange={(e) => setGuarantee(e.target.checked)} /> Replacement guarantee (negotiated deals only)
        </label>
      </div>
      <p className={styles.legend}>
        <span className={styles.lNew}>New for self-serve</span> <span className={styles.lFixed}>Typo fixed</span> Everything else is your wording, word for word. Sample client details shown.
      </p>
      <article className={styles.doc}>
        {t.parties.map((c, i) => (
          <ClauseView key={i} c={c} />
        ))}
        {t.sections.map((s) => (
          <section key={s.title}>
            <h2>{s.title}</h2>
            {s.clauses.map((c, i) => (
              <ClauseView key={i} c={c} />
            ))}
          </section>
        ))}
        <section className={styles.signed}>
          <p>
            <strong>SIGNED</strong> for and on behalf of <strong>MakersForge Ltd</strong>: Andre Lemaitre, Founder, {SAMPLE.date}
          </p>
          <p>
            <strong>SIGNED</strong> for and on behalf of <strong>{SAMPLE.client}</strong> by: [typed name], [position], {SAMPLE.date}, signed electronically
          </p>
        </section>
      </article>
    </div>
  );
}
