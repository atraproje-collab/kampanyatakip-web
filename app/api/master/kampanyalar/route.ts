/**
 * Server-side proxy: /api/master/kampanyalar → n8n
 *
 * GET → https://n8n.srv1587680.hstgr.cloud/webhook/master/kampanyalar
 */

const N8N_URL = "https://n8n.srv1587680.hstgr.cloud/webhook/master/kampanyalar";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
} as const;

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const upstream = await fetch(N8N_URL, {
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
    console.error("[proxy:master/kampanyalar] fetch failed:", e);
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
