/**
 * Proxy: /api/kampanya/[slug]/ai-sablonlar → n8n
 */
const N8N_BASE = "https://n8n.srv1587680.hstgr.cloud/webhook/kampanya";
const CORS = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "GET, OPTIONS", "Access-Control-Allow-Headers": "Content-Type" } as const;
export const dynamic = "force-dynamic";

export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  try {
    const r = await fetch(`${N8N_BASE}/${encodeURIComponent(slug)}/ai-sablonlar`, { cache: "no-store", headers: { Accept: "application/json" } });
    if (!r.ok) return Response.json({ error: "Upstream error", status: r.status }, { status: r.status, headers: CORS });
    return Response.json(await r.json(), { status: 200, headers: CORS });
  } catch (e) {
    console.error(`[proxy:ai-sablonlar] ${slug}:`, e);
    return Response.json({ error: "Proxy fetch failed", message: e instanceof Error ? e.message : "unknown" }, { status: 500, headers: CORS });
  }
}
export async function OPTIONS() { return new Response(null, { status: 204, headers: CORS }); }
