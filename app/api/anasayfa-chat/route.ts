/**
 * Server-side proxy: /api/anasayfa-chat → n8n anasayfa-chat webhook
 *
 *   POST → n8n /webhook/anasayfa-chat
 *   Body: { message, sessionId }
 *   Response: { reply, success }
 *
 * Same-origin proxy — istemci doğrudan n8n'e konuşmaz, CORS yok,
 * n8n URL'si tarayıcıya sızmaz, log/observability tek noktada.
 */

const N8N_URL = "https://n8n.srv1587680.hstgr.cloud/webhook/anasayfa-chat";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
} as const;

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json(
      { success: false, error: "Invalid JSON body" },
      { status: 400, headers: CORS_HEADERS },
    );
  }

  try {
    const upstream = await fetch(N8N_URL, {
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
      return Response.json(data ?? { success: upstream.ok }, {
        status: upstream.status,
        headers: CORS_HEADERS,
      });
    }

    // Plain-text yanıtı { reply } şeklinde sarmalayalım — istemci tek kontrat.
    const text = await upstream.text();
    if (text) {
      return Response.json(
        { success: upstream.ok, reply: text },
        { status: upstream.status, headers: CORS_HEADERS },
      );
    }
    return Response.json(
      { success: upstream.ok },
      { status: upstream.status, headers: CORS_HEADERS },
    );
  } catch (e) {
    console.error(`[proxy] anasayfa-chat POST failed:`, e);
    return Response.json(
      {
        success: false,
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
