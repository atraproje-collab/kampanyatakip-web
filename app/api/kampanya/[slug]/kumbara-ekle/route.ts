/**
 * Server-side proxy: /api/kampanya/[slug]/kumbara-ekle → n8n webhook
 *
 * Forwards POST body to:
 *   https://n8n.srv1587680.hstgr.cloud/webhook/kampanya/{slug}/kumbara-ekle
 *
 * Next.js 15 — `params` is a Promise (must be awaited).
 */

const N8N_BASE = "https://n8n.srv1587680.hstgr.cloud/webhook/kampanya";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
} as const;

// Always run dynamically — never cache the proxy response.
export const dynamic = "force-dynamic";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const targetUrl = `${N8N_BASE}/${encodeURIComponent(slug)}/kumbara-ekle`;

  // 1) Parse incoming JSON body
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json(
      { error: "Invalid JSON body" },
      { status: 400, headers: CORS_HEADERS },
    );
  }

  // 2) Forward to n8n
  try {
    const upstream = await fetch(targetUrl, {
      method: "POST",
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(body),
    });

    // 3) Forward upstream response — try JSON, fall back to text
    const contentType = upstream.headers.get("content-type") ?? "";
    if (contentType.includes("application/json")) {
      const data: unknown = await upstream.json().catch(() => null);
      return Response.json(data ?? { ok: upstream.ok }, {
        status: upstream.status,
        headers: CORS_HEADERS,
      });
    }

    const text = await upstream.text();
    return new Response(text || JSON.stringify({ ok: upstream.ok }), {
      status: upstream.status,
      headers: {
        ...CORS_HEADERS,
        "Content-Type": text ? "text/plain; charset=utf-8" : "application/json",
      },
    });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(`[proxy] kumbara-ekle POST failed for ${slug}:`, e);
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
  return new Response(null, {
    status: 204,
    headers: CORS_HEADERS,
  });
}
