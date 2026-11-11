import { lookupStore, OFF_REMIT } from "@/lib/appening/store";

/** Preview a store link on the apply form (name, icon, studio, game or app). */
export const runtime = "nodejs";

export async function POST(req: Request) {
  const { url } = await req.json().catch(() => ({}));
  const app = await lookupStore(String(url || ""));
  if (!app) return Response.json({ error: "We couldn't find that on the App Store or Google Play. Check the link." }, { status: 404 });
  return Response.json({
    name: app.name,
    publisher: app.publisher,
    iconUrl: app.iconUrl,
    genre: app.genre,
    edition: app.edition,
    releaseDate: app.releaseDate,
    website: app.website,
    offRemit: OFF_REMIT.test(`${app.name} ${app.genre} ${app.storeText?.slice(0, 400)}`),
  });
}
