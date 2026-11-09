/**
 * GET → { country }: the visitor's country from Vercel's edge header, used
 * once per browser to pick a default currency (lib/currency). Nothing stored.
 */
export const dynamic = "force-dynamic";

export function GET(req: Request) {
  const country = req.headers.get("x-vercel-ip-country") || null;
  return Response.json({ country }, { headers: { "Cache-Control": "no-store" } });
}
