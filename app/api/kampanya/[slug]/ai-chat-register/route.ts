/**
 * Server-side proxy: /api/kampanya/[slug]/ai-chat-register → n8n AI chat register webhook
 *
 *   POST → n8n /webhook/kampanya/[slug]/ai-chat-register
 *
 * Inline kayıt formu (ad / e-posta / telefon + opsiyonel konu) backend'e iletilir.
 * Same-origin proxy: CORS yok, n8n URL'si istemciye sızmaz.
 *
 * Next.js 16 — `params` is a Promise (must be awaited).
 */

const N8N_BASE = "https://n8n.srv1587680.hstgr.cloud/webhook/kampanya";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
} as const;

export const dynamic = "force-dynamic";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const targetUrl = `${N8N_BASE}/${encodeURIComponent(slug)}/ai-chat-register`;

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
    if (text) {
      return Response.json(
        { ok: upstream.ok, message: text },
        { status: upstream.status, headers: CORS_HEADERS },
      );
    }
    return Response.json(
      { ok: upstream.ok },
      { status: upstream.status, headers: CORS_HEADERS },
    );
  } catch (e) {
    console.error(`[proxy] ai-chat-register POST failed for ${slug}:`, e);
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
