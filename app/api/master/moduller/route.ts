/**
 * Server-side proxy: /api/master/moduller → n8n
 *
 * GET ?slug=xxx → https://n8n.srv1587680.hstgr.cloud/webhook/master/moduller?slug=xxx
 */

const N8N_BASE = "https://n8n.srv1587680.hstgr.cloud/webhook/master/moduller";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Cache-Control": "no-store, no-cache, must-revalidate",
  "Pragma": "no-cache",
} as const;

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug")?.trim();
  if (!slug) {
    return Response.json(
      { error: "slug query param required" },
      { status: 400, headers: CORS_HEADERS },
    );
  }

  const targetUrl = `${N8N_BASE}?slug=${encodeURIComponent(slug)}`;
  try {
    const upstream = await fetch(targetUrl, {
      cache: "no-store",
      headers: { Accept: "application/json" },
    });
    if (!upstream.ok) {
      return Response.json(
        {
          error: "Upstream error",
          status: upstream.status,
          statusText: upstream.statusText,
        },
        { status: upstream.status, headers: CORS_HEADERS },
      );
    }
    const data: unknown = await upstream.json();
    return Response.json(data, { status: 200, headers: CORS_HEADERS });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(`[proxy:master/moduller] fetch failed for ${slug}:`, e);
    return Response.json(
      {
        error: "Proxy fetch failed",
        message: e instanceof Error ? e.message : "unknown",
      },
      { status: 500, headers: CORS_HEADERS },
    );
  }
}

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}
