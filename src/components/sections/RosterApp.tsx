"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/atoms/Button";
import { Logo } from "@/components/atoms/Logo";
import { ROSTER, BUDGET_LABELS, type Profile } from "@/data/roster";
import styles from "./RosterApp.module.css";

/* ============================================================
   Filter shape
   ============================================================ */

type Discipline = "all" | "ua" | "creative" | "aso";

type FilterState = {
  industry: Set<string>;
  gamesCat: Set<string>;
  appsCat: Set<string>;
  genre: Set<string>;
  location: Set<string>;
  monetisation: Set<string>;
  channels: Set<string>;
  budget: Set<string>;
  formats: Set<string>;
  expertise: Set<string>;
  rateband: Set<string>;
};

const emptyFilters = (): FilterState => ({
  industry: new Set(),
  gamesCat: new Set(),
  appsCat: new Set(),
  genre: new Set(),
  location: new Set(),
  monetisation: new Set(),
  channels: new Set(),
  budget: new Set(),
  formats: new Set(),
  expertise: new Set(),
  rateband: new Set(),
});

const LOCATIONS: { value: string; label: string }[] = [
  { value: "uk", label: "uk" },
  { value: "eu", label: "eu · remote" },
  { value: "berlin", label: "berlin" },
  { value: "helsinki", label: "helsinki" },
  { value: "telaviv", label: "tel aviv" },
  { value: "istanbul", label: "istanbul" },
  { value: "lisbon", label: "lisbon" },
  { value: "warsaw", label: "warsaw" },
  { value: "prague", label: "prague" },
];

/* ============================================================
   Component
   ============================================================ */

export function RosterApp() {
  const router = useRouter();
  const searchParams = useSearchParams();

  /* `role` replaces the old `discipline` filter — Andre's call: filter
     by the actual titles in the lineup so the dropdown options track
     what we represent, not a hardcoded UA/Creative/ASO split. The
     value is the literal role string from a Profile, or "all". The
     conditional filter rows (channels for UA, formats for creative,
     etc) still need to know which discipline they're operating in,
     so we derive that from whichever Profile matches the selected
     role below. */
  const [role, setRole] = useState<string>("all");
  const [availOnly, setAvailOnly] = useState(false);
  const [filters, setFilters] = useState<FilterState>(emptyFilters);
  const [panelOpen, setPanelOpen] = useState(false);
  const [modalProfile, setModalProfile] = useState<Profile | null>(null);

  // Unique roles in ROSTER, with counts — feeds the dropdown options.
  // Recomputed only when ROSTER changes (which is at build time, but
  // useMemo guards us in case data ever becomes dynamic).
  const roleOptions = useMemo(() => {
    const counts = new Map<string, number>();
    ROSTER.forEach((p) => counts.set(p.role, (counts.get(p.role) ?? 0) + 1));
    return Array.from(counts.entries())
      .map(([value, count]) => ({ value, count }))
      .sort((a, b) => a.value.localeCompare(b.value));
  }, []);

  // Discipline of whichever role is selected — drives which conditional
  // filter rows show (UA-specific vs creative-specific). "all" when no
  // role chosen, so all conditional rows render.
  const derivedDiscipline: Discipline = useMemo(() => {
    if (role === "all") return "all";
    return (ROSTER.find((p) => p.role === role)?.discipline ?? "all") as Discipline;
  }, [role]);

  // Read URL on mount for deep-linking (role + availability).
  // Legacy ?discipline= URLs from before the role refactor are ignored
  // gracefully (just lands on the default "all" view).
  useEffect(() => {
    const r = searchParams.get("role");
    if (r) setRole(r);
    if (searchParams.get("available") === "true") setAvailOnly(true);
    // We only want this on mount, not on every re-render
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Push URL when role/availability changes
  const updateURL = useCallback(
    (r: string, a: boolean) => {
      const p = new URLSearchParams();
      if (r !== "all") p.set("role", r);
      if (a) p.set("available", "true");
      const qs = p.toString();
      router.replace(qs ? `/roster?${qs}` : "/roster", { scroll: false });
    },
    [router],
  );

  // Role switch — clear filters that no longer apply to the derived
  // discipline (e.g. channels filter doesn't apply once you've picked
  // a creative-discipline role, so clearing prevents stale active
  // filters reading as "active" in the count).
  const onRoleChange = (next: string) => {
    setRole(next);
    const nextDiscipline: Discipline =
      next === "all"
        ? "all"
        : ((ROSTER.find((p) => p.role === next)?.discipline ?? "all") as Discipline);
    setFilters((prev) => {
      const copy: FilterState = {
        industry: new Set(prev.industry),
        gamesCat: new Set(prev.gamesCat),
        appsCat: new Set(prev.appsCat),
        genre: new Set(prev.genre),
        location: new Set(prev.location),
        monetisation: new Set(prev.monetisation),
        channels: new Set(prev.channels),
        budget: new Set(prev.budget),
        formats: new Set(prev.formats),
        expertise: new Set(prev.expertise),
        rateband: new Set(prev.rateband),
      };
      if (nextDiscipline === "ua") {
        copy.formats.clear();
      } else if (nextDiscipline === "creative") {
        copy.monetisation.clear();
        copy.channels.clear();
        copy.budget.clear();
      } else if (nextDiscipline === "aso") {
        copy.formats.clear();
        copy.monetisation.clear();
        copy.channels.clear();
        copy.budget.clear();
      }
      return copy;
    });
    updateURL(next, availOnly);
  };

  const onAvail = (next: boolean) => {
    setAvailOnly(next);
    updateURL(role, next);
  };

  const toggleFilter = (key: keyof FilterState, value: string) => {
    setFilters((prev) => {
      const next: FilterState = {
        ...prev,
        [key]: new Set(prev[key]),
      };
      if (next[key].has(value)) next[key].delete(value);
      else next[key].add(value);
      return next;
    });
  };

  const clearAll = () => {
    setFilters(emptyFilters());
    setAvailOnly(false);
    updateURL(role, false);
  };

  const activeCount = useMemo(() => {
    let n = 0;
    Object.values(filters).forEach((s) => (n += s.size));
    if (availOnly) n++;
    return n;
  }, [filters, availOnly]);

  const matches = useCallback(
    (p: Profile) => {
      if (role !== "all" && p.role !== role) return false;
      if (availOnly && !p.available) return false;
      if (filters.industry.size && ![...filters.industry].some((v) => p.industries.includes(v as "games" | "apps"))) return false;
      if (filters.gamesCat.size && ![...filters.gamesCat].some((v) => (p.gamesCat as string[]).includes(v))) return false;
      if (filters.appsCat.size && ![...filters.appsCat].some((v) => (p.appsCat as string[]).includes(v))) return false;
      if (filters.genre.size && ![...filters.genre].some((v) => (p.genre as string[]).includes(v))) return false;
      if (filters.location.size && !filters.location.has(p.location.code)) return false;
      if (filters.monetisation.size && !(p.monetisation && [...filters.monetisation].some((v) => p.monetisation!.includes(v as "iap" | "iaa" | "hybrid")))) return false;
      if (filters.channels.size && !(p.channels && [...filters.channels].some((v) => p.channels!.includes(v as Profile["channels"] extends (infer U)[] | undefined ? U : never)))) return false;
      if (filters.budget.size && !(p.budget !== undefined && filters.budget.has(String(p.budget)))) return false;
      if (filters.formats.size && !(p.formats && [...filters.formats].some((v) => p.formats!.includes(v as "video" | "playable" | "static" | "ugc" | "motion")))) return false;
      if (filters.expertise.size && ![...filters.expertise].some((v) => (p.expertise as string[]).includes(v))) return false;
      if (filters.rateband.size && !filters.rateband.has(String(p.dayRateBand))) return false;
      return true;
    },
    [role, availOnly, filters],
  );

  const visible = useMemo(() => ROSTER.filter(matches), [matches]);

  const showGamesCat = filters.industry.has("games") || filters.industry.size === 0;
  const showAppsCat = filters.industry.has("apps") || filters.industry.size === 0;
  const showGenre = filters.industry.has("games") || filters.industry.size === 0;

  return (
    <>
      {/* Sticky controls */}
      <div className={styles.controls}>
        <div className="container">
          <div className={styles.quickbar}>
            <span className={styles.qbLabel}>Role</span>
            <RoleDropdown
              value={role}
              options={roleOptions}
              totalCount={ROSTER.length}
              onChange={onRoleChange}
            />

            <span className={styles.qbDivider} />

            <Toggle on={availOnly} onClick={() => onAvail(!availOnly)} />

            <div className={styles.qbRight}>
              <FiltersBtn open={panelOpen} count={activeCount} onClick={() => setPanelOpen((x) => !x)} />
            </div>
          </div>

          {/* Filter panel */}
          <div className={`${styles.panel} ${panelOpen ? styles.panelOpen : ""}`}>
            <div className={styles.panelInner}>
              <FRow label="Industry" hint="Pick one or both">
                <ChipGroup
                  values={["games", "apps"]}
                  labels={["Games", "Apps"]}
                  active={filters.industry}
                  onToggle={(v) => toggleFilter("industry", v)}
                />
              </FRow>

              {showGamesCat && (
                <FRow label="Games category" hint="Complexity">
                  <ChipGroup
                    values={["hypercasual", "hybridcasual", "casual", "midcore", "hardcore"]}
                    labels={["Hypercasual", "Hybrid casual", "Casual", "Midcore", "Hardcore"]}
                    active={filters.gamesCat}
                    onToggle={(v) => toggleFilter("gamesCat", v)}
                  />
                </FRow>
              )}

              {showAppsCat && (
                <FRow label="Apps category" hint="Vertical">
                  <ChipGroup
                    values={["health", "dating", "finance", "social", "education", "entertainment", "productivity", "shopping", "lifestyle", "photo"]}
                    labels={["Health & fitness", "Dating", "Finance", "Social", "Education", "Entertainment", "Productivity", "Shopping", "Lifestyle", "Photo & video"]}
                    active={filters.appsCat}
                    onToggle={(v) => toggleFilter("appsCat", v)}
                  />
                </FRow>
              )}

              {showGenre && (
                <FRow label="Genre" hint="Games">
                  <ChipGroup
                    values={["puzzle", "rpg", "strategy", "casino", "simulation", "sports", "action", "cards"]}
                    labels={["Puzzle", "RPG", "Strategy", "Casino", "Simulation", "Sports/racing", "Action", "Tabletop/cards"]}
                    active={filters.genre}
                    onToggle={(v) => toggleFilter("genre", v)}
                  />
                </FRow>
              )}

              <FRow label="Location">
                <ChipGroup
                  values={LOCATIONS.map((l) => l.value)}
                  labels={LOCATIONS.map((l) => l.label)}
                  active={filters.location}
                  onToggle={(v) => toggleFilter("location", v)}
                />
              </FRow>

              {(derivedDiscipline === "all" || derivedDiscipline === "ua") && (
                <>
                  <FRow label="Monetisation" hint="IAP / IAA">
                    <ChipGroup
                      values={["iap", "iaa", "hybrid"]}
                      labels={["IAP", "IAA", "Hybrid"]}
                      active={filters.monetisation}
                      onToggle={(v) => toggleFilter("monetisation", v)}
                    />
                  </FRow>
                  <FRow label="Channels" hint="UA expertise">
                    <ChipGroup
                      values={["meta", "google", "tiktok", "asa", "programmatic", "influencer"]}
                      labels={["Meta", "Google", "TikTok", "ASA", "Programmatic", "Influencer"]}
                      active={filters.channels}
                      onToggle={(v) => toggleFilter("channels", v)}
                    />
                  </FRow>
                  <FRow label="Monthly budget managed">
                    <ChipGroup
                      values={["0", "1", "2", "3"]}
                      labels={[...BUDGET_LABELS]}
                      active={filters.budget}
                      onToggle={(v) => toggleFilter("budget", v)}
                    />
                  </FRow>
                </>
              )}

              {(derivedDiscipline === "all" || derivedDiscipline === "creative") && (
                <FRow label="Creative formats" hint="Marketing art">
                  <ChipGroup
                    values={["video", "playable", "static", "ugc", "motion"]}
                    labels={["Video", "Playables", "Static", "UGC", "Motion"]}
                    active={filters.formats}
                    onToggle={(v) => toggleFilter("formats", v)}
                  />
                </FRow>
              )}

              <FRow label="Special expertise">
                <ChipGroup
                  values={["incrementality", "skan", "scaling", "liveops", "reactivation", "audience"]}
                  labels={["Incrementality", "SKAN / measurement", "Creative scaling", "LiveOps", "Reactivation", "Audience strategy"]}
                  active={filters.expertise}
                  onToggle={(v) => toggleFilter("expertise", v)}
                />
              </FRow>

              <FRow label="Day rate band">
                <ChipGroup
                  values={["0", "1", "2"]}
                  labels={["< £500", "£500–700", "£700+"]}
                  active={filters.rateband}
                  onToggle={(v) => toggleFilter("rateband", v)}
                />
              </FRow>

              <div className={styles.panelFooter}>
                <button type="button" className={styles.clearBtn} onClick={clearAll}>
                  Clear all filters
                </button>
                <span className={styles.applyHint}>
                  <strong>{visible.length}</strong> profiles match
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Results + grid */}
      <div className="container">
        <div className={styles.resultsRow}>
          <p className={styles.resultsText}>
            Showing <strong className="gr">{visible.length}</strong>{" "}
            {role === "all"
              ? visible.length === 1
                ? "profile"
                : "profiles"
              : visible.length === 1
                ? role.toLowerCase()
                : `${role.toLowerCase()}s`}
            {availOnly && " · available"}
          </p>
          <Link href="/apply" className={styles.applyCta}>
            Join the lineup <span aria-hidden="true">→</span>
          </Link>
        </div>

        {visible.length === 0 ? (
          <div className={styles.empty}>
            <span className={styles.emptyH}>The lineup is still being built.</span>
            Real profiles arrive shortly. In the meantime, brief us directly and we&apos;ll
            shortlist by hand from our existing network.
          </div>
        ) : (
          <div className={styles.list}>
            {visible.map((p) => (
              <ProfileRow
                key={p.id}
                p={p}
                onClick={() => setModalProfile(p)}
              />
            ))}
          </div>
        )}
      </div>

      {modalProfile && (
        <ProfileModal profile={modalProfile} onClose={() => setModalProfile(null)} />
      )}
    </>
  );
}

/* ============================================================
   Sub-components
   ============================================================ */

/* Role dropdown — replaces the old discipline chip row. Options are
   inferred from ROSTER (unique role strings + counts), styled to
   match the site UI rather than the browser-native select (Andre
   previously rejected the native select on this same surface). */
function RoleDropdown({
  value,
  options,
  totalCount,
  onChange,
}: {
  value: string;
  options: { value: string; count: number }[];
  totalCount: number;
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onEsc);
    };
  }, [open]);

  const currentLabel = value === "all" ? "All roles" : value;

  const pick = (v: string) => {
    onChange(v);
    setOpen(false);
  };

  return (
    <div className={styles.roleDropdown} ref={ref}>
      <button
        type="button"
        className={`${styles.roleTrigger} ${open ? styles.roleTriggerOpen : ""}`}
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className={styles.roleTriggerLabel}>{currentLabel}</span>
        <span className={styles.roleChev} aria-hidden="true">▼</span>
      </button>
      {open && (
        <ul role="listbox" className={styles.roleMenu}>
          <li
            role="option"
            aria-selected={value === "all"}
            className={`${styles.roleOption} ${value === "all" ? styles.roleOptionActive : ""}`}
            onClick={() => pick("all")}
          >
            <span>All roles</span>
            <span className={styles.roleCount}>{totalCount}</span>
          </li>
          {options.map((opt) => (
            <li
              key={opt.value}
              role="option"
              aria-selected={value === opt.value}
              className={`${styles.roleOption} ${value === opt.value ? styles.roleOptionActive : ""}`}
              onClick={() => pick(opt.value)}
            >
              <span>{opt.value}</span>
              <span className={styles.roleCount}>{opt.count}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Toggle({ on, onClick }: { on: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      className={`${styles.qtoggle} ${on ? styles.qtoggleOn : ""}`}
      onClick={onClick}
      aria-pressed={on}
    >
      <span className={styles.track}>
        <span className={styles.knob} />
      </span>
      Available only
    </button>
  );
}

function FiltersBtn({ open, count, onClick }: { open: boolean; count: number; onClick: () => void }) {
  return (
    <button
      type="button"
      className={`${styles.qfilters} ${open ? styles.qfiltersOpen : ""}`}
      onClick={onClick}
      aria-expanded={open}
    >
      Filters{" "}
      {count > 0 && <span className={styles.count}>{count}</span>}
      <span className={styles.chev} aria-hidden="true">▼</span>
    </button>
  );
}

function FRow({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <div className={styles.filterRow}>
      <p className={styles.frLabel}>
        {label}
        {hint && <span className={styles.frHint}>{hint}</span>}
      </p>
      <div className={styles.fchips}>{children}</div>
    </div>
  );
}

function ChipGroup({
  values,
  labels,
  active,
  onToggle,
}: {
  values: string[];
  labels?: readonly string[];
  active: Set<string>;
  onToggle: (v: string) => void;
}) {
  return (
    <>
      {values.map((v, i) => (
        <button
          key={v}
          type="button"
          className={`${styles.fchip} ${active.has(v) ? styles.fchipActive : ""}`}
          onClick={() => onToggle(v)}
        >
          {labels?.[i] ?? v}
        </button>
      ))}
    </>
  );
}

/* Banner row (per Andre 2026-05-30): switched from the tiger-stripe
   grid of cards to full-width list-style rows. Tiger-stripe rhythm
   carries over (every other row is gradient). Each row has a
   click-through to open the detail modal, plus a separate
   "request info" CTA on the right that goes to /enquire with the
   codename pre-attached. */
function ProfileRow({ p, onClick }: { p: Profile; onClick: () => void }) {
  /* Third meta row picks the most commercially load-bearing fact for
     the discipline at hand: budget managed for UA people, annual
     salary for the rest. Formats were removed from quick info per
     Andre — they're filter-side data, not at-a-glance commercial. */
  const thirdRow =
    p.discipline === "ua" && p.budget !== undefined
      ? { k: "Budget", v: BUDGET_LABELS[p.budget] }
      : p.salaryAnnualLabel
        ? { k: "Annual salary", v: p.salaryAnnualLabel }
        : null;

  return (
    <article className={styles.prow}>
      <button type="button" className={styles.prowMain} onClick={onClick}>
        <div className={styles.prowLeft}>
          <span className={styles.prowMono}>{p.codename}</span>
          <div className={styles.prowLeftBody}>
            <h3 className={styles.prowName}>{p.role}</h3>
            <p className={styles.prowRole}>{p.background}</p>
          </div>
          <div className={styles.prowInd}>
            {p.industries.map((i) => (
              <span key={i} className={`${styles.indBadge} ${styles[`ind${i}`]}`}>
                {i}
              </span>
            ))}
          </div>
        </div>
        <div className={styles.prowMid}>
          <MetaRow k="Location" v={p.location.label} />
          <MetaRow k="Day rate" v={p.dayRateLabel} />
          {thirdRow && <MetaRow k={thirdRow.k} v={thirdRow.v} />}
        </div>
        <div className={styles.prowStatusWrap}>
          <span
            className={`${styles.pcStatus} ${p.available ? styles.pcStatusAv : styles.pcStatusCt}`}
          >
            <span className={styles.pcDot} />
            {p.available ? "available" : "in contract"}
          </span>
        </div>
        <Logo
          variant="mark"
          size={18}
          monochrome="currentColor"
          className={styles.brandStamp}
          title=""
        />
      </button>
      <Link
        href={`/enquire?profile=${encodeURIComponent(p.codename)}`}
        className={styles.prowCta}
      >
        request info <span aria-hidden="true">→</span>
      </Link>
    </article>
  );
}

function MetaRow({ k, v }: { k: string; v: string }) {
  return (
    <div className={styles.pcMetaRow}>
      <span className={styles.pcK}>{k}</span>
      <span className={styles.pcV}>{v}</span>
    </div>
  );
}

function ProfileModal({ profile, onClose }: { profile: Profile; onClose: () => void }) {
  // Close on escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    // Prevent body scroll while open
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = original;
    };
  }, [onClose]);

  const cats = [...(profile.gamesCat ?? []), ...(profile.appsCat ?? [])];

  return (
    <div className={styles.modalOverlay} onClick={(e) => e.target === e.currentTarget && onClose()} role="dialog" aria-modal="true">
      <div className={styles.modal}>
        <div className={styles.modalHead}>
          <button type="button" className={styles.modalClose} onClick={onClose} aria-label="Close">
            ×
          </button>
          <div className={styles.modalHeadTop}>
            <span className={styles.pcMono} style={{ color: "rgba(255,255,255,0.7)" }}>
              {profile.codename}
            </span>
            <span className={styles.modalStatus}>
              <span className={styles.pcDot} style={{ background: "#fff" }} />
              {profile.available ? "available now" : "in contract"}
            </span>
          </div>
          <h2 className={styles.modalH}>{profile.role}</h2>
          <p className={styles.modalRole}>
            {profile.background} · {profile.location.label}
          </p>
          {profile.availableFor.length > 0 && (
            <div className={styles.openToRow}>
              <span className={styles.openToLabel}>Open to</span>
              {profile.availableFor.map((kind) => (
                <span key={kind} className={styles.openToPill}>
                  {kind}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className={styles.modalBody}>
          <div className={`${styles.modalSection} ${styles.modalSummary}`}>
            <h4 className={styles.modalH4}>summary</h4>
            <p className={styles.modalSummaryBody}>
              {profile.summary ??
                `A handwritten summary about ${profile.codename}. Andre writes these per profile. Context on their wins, the kinds of teams they thrive in, what they're best known for. A short paragraph that goes beyond the structured filters and gives the specialist some life on the page.`}
            </p>
          </div>

          {profile.skills && profile.skills.length > 0 && (
            <ModalSec h="skills">{profile.skills.join(" · ")}</ModalSec>
          )}

          {profile.experience && profile.experience.length > 0 && (
            <ModalParas h="experience" paras={profile.experience} bullet />
          )}

          {profile.motivations && (
            <ModalSec h="motivations">{profile.motivations}</ModalSec>
          )}

          {profile.recruiterNotes && profile.recruiterNotes.length > 0 && (
            <ModalParas h="recruiter notes" paras={profile.recruiterNotes} />
          )}

          {cats.length > 0 && (
            <ModalSec h="industry & categories">
              {cats.join(" · ")}
            </ModalSec>
          )}
          {profile.genre.length > 0 && (
            <ModalSec h="genres">{profile.genre.join(" · ")}</ModalSec>
          )}
          {profile.discipline === "ua" ? (
            <>
              {profile.channels && profile.channels.length > 0 && (
                <ModalSec h="channels">{profile.channels.join(" · ")}</ModalSec>
              )}
              {profile.monetisation && profile.monetisation.length > 0 && (
                <ModalSec h="monetisation">{profile.monetisation.join(" · ").toUpperCase()}</ModalSec>
              )}
            </>
          ) : (
            profile.formats &&
            profile.formats.length > 0 && (
              <ModalSec h="creative formats">{profile.formats.join(" · ")}</ModalSec>
            )
          )}
          <ModalSec h="special expertise">{profile.expertise.join(" · ")}</ModalSec>

          <ModalRow k="day rate" v={profile.dayRateLabel} />
          {profile.salaryAnnualLabel && (
            <ModalRow k="annual salary" v={profile.salaryAnnualLabel} />
          )}
          {profile.discipline === "ua" && profile.budget !== undefined && (
            <ModalRow k="budget managed" v={BUDGET_LABELS[profile.budget]} />
          )}

          <div className={styles.modalCta}>
            <Button
              href={`/enquire?profile=${encodeURIComponent(profile.codename)}`}
              variant="primary"
              arrow
            >
              Enquire about {profile.codename}
            </Button>
            <Button
              href={`/roster/${profile.id}/spec`}
              variant="ghost"
              external
            >
              Download spec
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ModalSec({ h, children }: { h: string; children: ReactNode }) {
  return (
    <div className={styles.modalSection}>
      <h4 className={styles.modalH4}>{h}</h4>
      <p className={styles.modalP}>{children}</p>
    </div>
  );
}

/* Multi-paragraph section — used for the experience and recruiter
   notes blocks where the intake doc is long-form. With `bullet`,
   each paragraph renders as a list item under a single heat-coloured
   bullet (Andre asked for experience as bullets so the career history
   scans line-by-line). Without `bullet`, each paragraph gets its own
   <p> with consistent spacing — used for the recruiter notes block. */
function ModalParas({
  h,
  paras,
  bullet,
}: {
  h: string;
  paras: string[];
  bullet?: boolean;
}) {
  return (
    <div className={styles.modalSection}>
      <h4 className={styles.modalH4}>{h}</h4>
      {bullet ? (
        <ul className={styles.modalBullets}>
          {paras.map((para, i) => (
            <li key={i} className={styles.modalP}>
              {para}
            </li>
          ))}
        </ul>
      ) : (
        paras.map((para, i) => (
          <p
            key={i}
            className={styles.modalP}
            style={{ marginBottom: i < paras.length - 1 ? 10 : 0 }}
          >
            {para}
          </p>
        ))
      )}
    </div>
  );
}

function ModalRow({ k, v }: { k: string; v: string }) {
  return (
    <div className={`${styles.modalSection} ${styles.modalRow}`}>
      <h4 className={styles.modalH4} style={{ margin: 0 }}>{k}</h4>
      <p className={styles.modalP} style={{ fontWeight: 600, textAlign: "right" }}>{v}</p>
    </div>
  );
}
