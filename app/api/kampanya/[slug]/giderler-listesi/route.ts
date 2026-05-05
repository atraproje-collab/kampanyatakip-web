/**
 * Server-side proxy: /api/kampanya/[slug]/giderler-listesi → n8n webhook
 * Next.js 16 — `params` is a Promise (must be awaited).
 */

const N8N_BASE = "https://n8n.srv1587680.hstgr.cloud/webhook/kampanya";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
} as const;

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const targetUrl = `${N8N_BASE}/${encodeURIComponent(slug)}/giderler-listesi`;

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
    console.error(`[proxy] giderler-listesi fetch failed for ${slug}:`, e);
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
