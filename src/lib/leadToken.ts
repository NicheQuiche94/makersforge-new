/**
 * Server side of the known-visitor token (see lib/lead): "<email, base64url>.<id>",
 * where id is an HMAC of the email. The id doubles as a stable visitor ID.
 */
import { createHmac } from "node:crypto";

const secret = () => process.env.LEAD_SECRET || process.env.GIFT_SECRET || process.env.PORTAL_SUPABASE_SERVICE_ROLE_KEY || "mf";

export const leadId = (email: string) =>
  createHmac("sha256", secret()).update(email.trim().toLowerCase()).digest("base64url").replace(/[^A-Za-z0-9]/g, "").slice(0, 12);

export const leadToken = (email: string) => `${Buffer.from(email.trim().toLowerCase()).toString("base64url")}.${leadId(email)}`;

/** Adds the token to a link we email, so opening it on any device knows who they are. */
export const withLead = (link: string, email: string) => `${link}${link.includes("?") ? "&" : "?"}l=${leadToken(email)}`;
