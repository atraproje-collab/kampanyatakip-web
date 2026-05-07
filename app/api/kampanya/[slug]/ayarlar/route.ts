/**
 * Server-side proxy: /api/kampanya/[slug]/ayarlar
 *
 *  GET  → n8n /webhook/kampanya/[slug]/ayarlar           (kampanya ayarlarını oku)
 *  POST → n8n /webhook/kampanya/[slug]/ayarlar-guncelle  (ayarları güncelle)
 *
 * Solves CORS by routing browser → Next.js → n8n. The browser only sees a
 * same-origin response, so n8n doesn't need Access-Control-Allow-Origin.
 *
 * Next.js 15 — `params` is a Promise (must be awaited).
 */

const N8N_BASE = "https://n8n.srv1587680.hstgr.cloud/webhook/kampanya";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
} as const;

// Always run dynamically — never cache the proxy response.
export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const targetUrl = `${N8N_BASE}/${encodeURIComponent(slug)}/ayarlar`;

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
    console.error(`[proxy] ayarlar GET failed for ${slug}:`, e);
    return Response.json(
      {
        error: "Proxy fetch failed",
        message: e instanceof Error ? e.message : "unknown",
      },
      { status: 500, headers: CORS_HEADERS },
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  // POST hedefi /ayarlar-guncelle (n8n endpoint adı).
  const targetUrl = `${N8N_BASE}/${encodeURIComponent(slug)}/ayarlar-guncelle`;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json(
      { error: "Invalid JSON body" },
      { status: 400, headers: CORS_HEADERS },
    );
  }

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
    console.error(`[proxy] ayarlar POST failed for ${slug}:`, e);
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
