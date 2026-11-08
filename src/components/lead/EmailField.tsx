"use client";

import { useEffect } from "react";
import { useLead } from "@/lib/lead";

/**
 * The email box on every free tool (Andre 2026-11-08). For someone we
 * already know it collapses to "Sending to you@studio.com · Not you?", so
 * they don't type it twice. Renders the parent's own input otherwise.
 */
export function EmailField({ value, onChange, children, className }: { value: string; onChange: (v: string) => void; children: React.ReactNode; className?: string }) {
  const { lead, forget } = useLead();
  useEffect(() => {
    if (lead && !value) onChange(lead.email);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lead]);

  if (!lead || value !== lead.email) return <>{children}</>;
  return (
    <p className={className} style={{ margin: 0, fontSize: 14.5, color: "var(--dim)" }}>
      Sending to <b style={{ color: "var(--ink)" }}>{lead.email}</b> ·{" "}
      <button
        type="button"
        onClick={() => {
          forget();
          onChange("");
        }}
        style={{ border: 0, background: "none", padding: 0, font: "inherit", fontWeight: 700, color: "var(--dim)", textDecoration: "underline", cursor: "pointer" }}
      >
        Not you?
      </button>
    </p>
  );
}
