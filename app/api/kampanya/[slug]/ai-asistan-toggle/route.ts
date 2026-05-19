/**
 * Proxy: /api/kampanya/[slug]/ai-asistan-toggle → n8n (POST)
 */
const N8N_BASE = "https://n8n.srv1587680.hstgr.cloud/webhook/kampanya";
const CORS = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "POST, OPTIONS", "Access-Control-Allow-Headers": "Content-Type" } as const;
export const dynamic = "force-dynamic";

export async function POST(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let body: unknown;
  try { body = await request.json(); } catch { return Response.json({ error: "Invalid JSON" }, { status: 400, headers: CORS }); }
  try {
    const r = await fetch(`${N8N_BASE}/${encodeURIComponent(slug)}/ai-asistan-toggle`, {
      method: "POST", cache: "no-store",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(body),
    });
    const ct = r.headers.get("content-type") ?? "";
    if (ct.includes("application/json")) return Response.json(await r.json().catch(() => ({ ok: r.ok })), { status: r.status, headers: CORS });
    return Response.json({ ok: r.ok }, { status: r.status, headers: CORS });
  } catch (e) {
    console.error(`[proxy:ai-asistan-toggle] ${slug}:`, e);
    return Response.json({ error: "Proxy fetch failed", message: e instanceof Error ? e.message : "unknown" }, { status: 500, headers: CORS });
  }
}
export async function OPTIONS() { return new Response(null, { status: 204, headers: CORS }); }
