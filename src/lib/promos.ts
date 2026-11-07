/**
 * Reskinnable offers (Andre 2026-11-07, after Hormozi: "frat boys never need
 * a reason to party, they make one up"). The /compare gift box is one
 * mechanic wearing a seasonal skin: a Christmas gift, an Easter egg, a
 * Halloween pumpkin, a Hump Day special. Switch ACTIVE (or add a skin) and
 * the box, its colours, its words, its odds and its code prefix all follow.
 *
 * Two tiers: everyone who books before `until` gets the standard box;
 * hires needed by `special.needBy` get the special box: better odds plus
 * priority search, capped at `special.cap` (Andre: 3 is what he can fit).
 */
export type Drop = { pct: number; rarity: string; odds: number; color: string };
export type Promo = {
  id: string;
  name: string; // "Christmas gift"
  item: string; // what they open: "gift box", "Easter egg"
  emoji: string;
  until: string; // yyyy-mm-dd: book a search week by this day
  codePrefix: string; // XMAS → XMAS10-AB12C
  colors: { box: string; boxDark: string; ribbon: string; glow: string };
  standard: { teaser: string; drops: Drop[] };
  special: { needBy: string; cap: number; teaser: string; perk: string; drops: Drop[] };
};

const COMMON = "#ffb347";
const RARE = "#ff5d00";
const LEGENDARY = "#ffd700";

export const PROMOS: Record<string, Promo> = {
  christmas: {
    id: "christmas",
    name: "Christmas gift",
    item: "gift box",
    emoji: "🎁",
    until: "2026-12-24",
    codePrefix: "XMAS",
    colors: { box: "#ff7a2b", boxDark: "#c72e00", ribbon: "#ffd36b", glow: "#ff5d00" },
    standard: {
      teaser: "Book a search week before Christmas and open it for money off your first hire.",
      drops: [
        { pct: 5, rarity: "Common", odds: 70, color: COMMON },
        { pct: 10, rarity: "Rare", odds: 25, color: RARE },
        { pct: 15, rarity: "Legendary", odds: 5, color: LEGENDARY },
      ],
    },
    special: {
      needBy: "2026-12-24",
      cap: 3,
      teaser: "You need this hire before Christmas, so you get priority on our next search week, plus a gift box with better odds.",
      perk: "Your search goes into our first available week, and we'll put every effort into getting your hire made before 24 December.",
      drops: [
        { pct: 5, rarity: "Common", odds: 40, color: COMMON },
        { pct: 10, rarity: "Rare", odds: 40, color: RARE },
        { pct: 15, rarity: "Legendary", odds: 20, color: LEGENDARY },
      ],
    },
  },
  // Ready to switch on (dates to set when we run them).
  easter: {
    id: "easter",
    name: "Easter egg",
    item: "Easter egg",
    emoji: "🥚",
    until: "2027-04-02",
    codePrefix: "EGG",
    colors: { box: "#f7b2d9", boxDark: "#b0569a", ribbon: "#ffe58a", glow: "#ec4899" },
    standard: { teaser: "Book a search week before Easter and crack it open for money off.", drops: [] },
    special: { needBy: "2027-04-02", cap: 3, teaser: "Hiring before Easter? Priority search, plus an egg with better odds.", perk: "Your search goes into our first available week.", drops: [] },
  },
  halloween: {
    id: "halloween",
    name: "Halloween pumpkin",
    item: "pumpkin",
    emoji: "🎃",
    until: "2027-10-31",
    codePrefix: "BOO",
    colors: { box: "#ff8a00", boxDark: "#7a2e00", ribbon: "#3a1d4d", glow: "#ff8a00" },
    standard: { teaser: "Book a search week before Halloween and smash it for money off.", drops: [] },
    special: { needBy: "2027-10-31", cap: 3, teaser: "Hiring before Halloween? Priority search, plus a pumpkin with better odds.", perk: "Your search goes into our first available week.", drops: [] },
  },
  humpday: {
    id: "humpday",
    name: "Hump Day special",
    item: "Hump Day box",
    emoji: "🐪",
    until: "",
    codePrefix: "HUMP",
    colors: { box: "#d9a066", boxDark: "#8a5a2b", ribbon: "#ffd36b", glow: "#ff8a00" },
    standard: { teaser: "It's Wednesday. That's reason enough: open your Hump Day box for money off a search week booked today.", drops: [] },
    special: { needBy: "", cap: 3, teaser: "Hump Day special: priority search, plus a box with better odds.", perk: "Your search goes into our first available week.", drops: [] },
  },
};

/** The offer running now. Change this one line to reskin the whole thing. */
export const ACTIVE: string | null = "christmas";

export const activePromo = (now = Date.now()): Promo | null => {
  const p = ACTIVE ? PROMOS[ACTIVE] : null;
  if (!p || !p.standard.drops.length) return null;
  return !p.until || now <= Date.parse(p.until + "T23:59:59") ? p : null;
};
/** Do they qualify for the special tier (hire needed by the special date)? */
export const isSpecial = (p: Promo | null, needBy?: string) => !!p && !!needBy && !!p.special.needBy && needBy <= p.special.needBy;
export const dropsFor = (p: Promo, special: boolean) => (special ? p.special.drops : p.standard.drops);
export const dropFor = (p: Promo, special: boolean, pct: number) => dropsFor(p, special).find((d) => d.pct === pct) ?? dropsFor(p, special)[0];
