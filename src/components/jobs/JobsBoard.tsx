"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  type Job,
  type Region,
  type JobCategory,
  type SizeBucket,
  CATEGORY_ORDER,
  CATEGORY_LABELS,
  SECTOR_LABELS,
  REMOTE_LABELS,
  REGION_LABELS,
  sizeBucketOf,
} from "@/lib/jobs";
import { JobCard } from "./JobCard";
import { AlertForm } from "./AlertForm";
import styles from "./JobsBoard.module.css";

/**
 * The board, all live jobs plus client-side facet filters.
 *
 * Renders EVERY live job on the server (this is a client component, but it's
 * still statically pre-rendered to HTML at build), so the full list is in the
 * static HTML for SEO with no data fetching (brief §8.6). Filtering happens
 * in the browser.
 *
 * Deliberately avoids `useSearchParams()`, that hook forces the subtree into
 * a client-only Suspense boundary, which would replace the pre-rendered cards
 * with a loading fallback in the static HTML. Instead we read the query string
 * once after mount and sync changes with history.replaceState, so filtered
 * views stay shareable while the initial paint keeps every card.
 */

type FilterState = {
  category: string | null;
  company: string | null;
  sector: string | null;
  remote: string | null;
  region: string | null;
  size: string | null;
  stage: string | null;
};

const EMPTY: FilterState = {
  category: null,
  company: null,
  sector: null,
  remote: null,
  region: null,
  size: null,
  stage: null,
};

const KEYS = ["category", "company", "sector", "remote", "region", "size", "stage"] as const;
const REMOTE_OPTIONS = ["remote", "hybrid", "onsite"] as const;
const PER_PAGE = 25;

export function JobsBoard({
  jobs,
  regions,
  sizes,
  stages,
}: {
  jobs: Job[];
  regions: Region[];
  sizes: { key: SizeBucket; label: string }[];
  stages: string[];
}) {
  const [filters, setFilters] = useState<FilterState>(EMPTY);
  const [page, setPage] = useState(1);
  const topRef = useRef<HTMLDivElement>(null);

  // Hydrate filters from the URL once, after mount (client-only). Reading the
  // URL during initial render would diverge from the server's all-cards render
  // and break hydration, so we intentionally set state in the effect instead.
  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- post-mount URL sync, hydration-safe
    setFilters({
      category: p.get("category"),
      company: p.get("company"),
      sector: p.get("sector"),
      remote: p.get("remote"),
      region: p.get("region"),
      size: p.get("size"),
      stage: p.get("stage"),
    });
  }, []);

  const syncUrl = (next: FilterState) => {
    const p = new URLSearchParams(window.location.search);
    for (const k of KEYS) {
      if (next[k]) p.set(k, next[k]!);
      else p.delete(k);
    }
    const qs = p.toString();
    window.history.replaceState(
      null,
      "",
      qs ? `${window.location.pathname}?${qs}` : window.location.pathname,
    );
  };

  const set = (key: keyof FilterState, value: string | null) => {
    setPage(1); // any filter change returns to the first page
    setFilters((prev) => {
      const next = { ...prev, [key]: value || null };
      syncUrl(next);
      return next;
    });
  };

  const clearAll = () => {
    setPage(1);
    setFilters(EMPTY);
    syncUrl(EMPTY);
  };

  // Every company with its total live-role count, most roles first — used for
  // the company facet, "Name (n)" (Andre 2026-07-20 UX ask).
  const companyOptions = useMemo(() => {
    const map = new Map<string, { name: string; count: number }>();
    for (const j of jobs) {
      const e = map.get(j.company.slug) ?? { name: j.company.name, count: 0 };
      e.count += 1;
      map.set(j.company.slug, e);
    }
    return [...map.entries()]
      .sort((a, b) => b[1].count - a[1].count || a[1].name.localeCompare(b[1].name))
      .map(([slug, { name, count }]) => [slug, `${name} (${count})`] as [string, string]);
  }, [jobs]);

  const filtered = useMemo(
    () =>
      jobs.filter(
        (j) =>
          (!filters.category || j.category === filters.category) &&
          (!filters.company || j.company.slug === filters.company) &&
          (!filters.sector || j.company.sector === filters.sector) &&
          (!filters.remote || j.remote === filters.remote) &&
          (!filters.region || (j.region ?? "global") === filters.region) &&
          (!filters.size || sizeBucketOf(j.company.size) === filters.size) &&
          (!filters.stage || j.company.stage === filters.stage),
      ),
    [jobs, filters],
  );

  const anyActive = KEYS.some((k) => filters[k]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const current = Math.min(page, pageCount);
  const visible = filtered.slice((current - 1) * PER_PAGE, current * PER_PAGE);
  const start = filtered.length === 0 ? 0 : (current - 1) * PER_PAGE + 1;
  const end = Math.min(current * PER_PAGE, filtered.length);

  const goToPage = (n: number) => {
    setPage(Math.min(Math.max(1, n), pageCount));
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className={styles.board} ref={topRef}>
      <div className={styles.filters}>
        <SelectFacet
          label="Category"
          allLabel="All categories"
          value={filters.category}
          options={CATEGORY_ORDER.map((c) => [c, CATEGORY_LABELS[c]])}
          onChange={(v) => set("category", v)}
        />
        <SelectFacet
          label="Company"
          allLabel={`All companies (${companyOptions.length})`}
          value={filters.company}
          options={companyOptions}
          onChange={(v) => set("company", v)}
        />
        <SelectFacet
          label="Sector"
          allLabel="Games & apps"
          value={filters.sector}
          options={[
            ["games", SECTOR_LABELS.games],
            ["apps", SECTOR_LABELS.apps],
          ]}
          onChange={(v) => set("sector", v)}
        />
        <SelectFacet
          label="Location"
          allLabel="Anywhere"
          value={filters.remote}
          options={REMOTE_OPTIONS.map((r) => [r, REMOTE_LABELS[r]])}
          onChange={(v) => set("remote", v)}
        />
        {regions.length > 1 && (
          <SelectFacet
            label="Region"
            allLabel="All regions"
            value={filters.region}
            options={regions.map((r) => [r, REGION_LABELS[r]])}
            onChange={(v) => set("region", v)}
          />
        )}
        {sizes.length > 1 && (
          <SelectFacet
            label="Company size"
            allLabel="Any size"
            value={filters.size}
            options={sizes.map((s) => [s.key, s.label])}
            onChange={(v) => set("size", v)}
          />
        )}
        {stages.length > 1 && (
          <SelectFacet
            label="Funding stage"
            allLabel="Any stage"
            value={filters.stage}
            options={stages.map((s) => [s, s])}
            onChange={(v) => set("stage", v)}
          />
        )}
      </div>

      <div className={styles.resultBar}>
        <span className={styles.count}>
          {filtered.length === 0
            ? "No roles"
            : `Showing ${start}–${end} of ${filtered.length}`}
          {anyActive ? " in this slice" : " live"}
        </span>
        {anyActive && (
          <button type="button" className={styles.clear} onClick={clearAll}>
            Clear filters ✕
          </button>
        )}
      </div>

      {filtered.length > 0 ? (
        <>
          <div className={styles.grid}>
            {visible.map((job) => (
              <JobCard key={job.slug} job={job} />
            ))}
          </div>
          {pageCount > 1 && (
            <Pager page={current} pageCount={pageCount} onPage={goToPage} />
          )}
        </>
      ) : (
        <div className={styles.empty}>
          <div className={styles.emptyCopy}>
            <h2 className={styles.emptyH}>Nothing live in this slice right now</h2>
            <p className={styles.emptySub}>
              Get alerted the moment something lands, we source new roles
              every week.
            </p>
          </div>
          <div className={styles.emptyForm}>
            <AlertForm
              source={`empty:${
                KEYS.map((k) => filters[k]).filter(Boolean).join("+") || "all"
              }`}
              presetCategory={(filters.category as JobCategory) ?? undefined}
              compact
            />
          </div>
        </div>
      )}
    </div>
  );
}

/** Compact page window: 1 … around-current … last (no gaps for small counts). */
function pageWindow(page: number, total: number): (number | "…")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const out: (number | "…")[] = [1];
  const from = Math.max(2, page - 1);
  const to = Math.min(total - 1, page + 1);
  if (from > 2) out.push("…");
  for (let n = from; n <= to; n++) out.push(n);
  if (to < total - 1) out.push("…");
  out.push(total);
  return out;
}

function Pager({
  page,
  pageCount,
  onPage,
}: {
  page: number;
  pageCount: number;
  onPage: (n: number) => void;
}) {
  return (
    <nav className={styles.pager} aria-label="Pagination">
      <button
        type="button"
        className={styles.pageBtn}
        onClick={() => onPage(page - 1)}
        disabled={page === 1}
      >
        ← Prev
      </button>
      {pageWindow(page, pageCount).map((n, i) =>
        n === "…" ? (
          <span key={`gap-${i}`} className={styles.pageGap}>
            …
          </span>
        ) : (
          <button
            key={n}
            type="button"
            className={styles.pageBtn}
            data-on={n === page ? "true" : "false"}
            onClick={() => onPage(n)}
            aria-current={n === page ? "page" : undefined}
          >
            {n}
          </button>
        ),
      )}
      <button
        type="button"
        className={styles.pageBtn}
        onClick={() => onPage(page + 1)}
        disabled={page === pageCount}
      >
        Next →
      </button>
    </nav>
  );
}

function SelectFacet({
  label,
  allLabel,
  value,
  options,
  onChange,
}: {
  label: string;
  allLabel: string;
  value: string | null;
  options: [string, string][];
  onChange: (value: string | null) => void;
}) {
  return (
    <label className={styles.facet} data-active={value ? "true" : "false"}>
      <span className={styles.facetLabel}>{label}</span>
      <div className={styles.selectWrap}>
        <select
          className={styles.select}
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value || null)}
        >
          <option value="">{allLabel}</option>
          {options.map(([v, text]) => (
            <option key={v} value={v}>
              {text}
            </option>
          ))}
        </select>
        <span className={styles.chevron} aria-hidden="true">
          ▾
        </span>
      </div>
    </label>
  );
}
