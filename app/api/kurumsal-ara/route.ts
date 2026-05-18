/**
 * Server-side proxy: /api/kurumsal-ara → n8n kurumsal-ara webhook
 *
 *   POST → n8n /webhook/kampanya/demo-defne/kurumsal-ara
 *   Body: { sehir, ilce, sektor, kampanya_slug }
 *   Response: { success, kaynak, data: [...] }
 *
 * Same-origin proxy: CORS yok, n8n URL'si istemciye sızmaz, log tek noktada.
 */

const N8N_URL =
  "https://n8n.srv1587680.hstgr.cloud/webhook/kampanya/demo-defne/kurumsal-ara";

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

    const text = await upstream.text();
    return Response.json(
      { success: upstream.ok, raw: text },
      { status: upstream.status, headers: CORS_HEADERS },
    );
  } catch (e) {
    console.error("[proxy] kurumsal-ara POST failed:", e);
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
