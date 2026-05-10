/**
 * Server-side proxy: /api/kampanya/[slug]/galeri-ekle
 *  POST → n8n /webhook/kampanya/[slug]/galeri-ekle
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
  const targetUrl = `${N8N_BASE}/${encodeURIComponent(slug)}/galeri-ekle`;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json(
      { error: "Invalid JSON body" },
      { status: 400, headers: CORS_HEADERS },
    );
  }

  // Debug: proxy'ye gelen body — kategori field'ı dahil mi?
  // eslint-disable-next-line no-console
  console.log(`[proxy:galeri-ekle/${slug}] forwarding →`, {
    targetUrl,
    body,
    hasKategori:
      typeof body === "object" && body !== null && "kategori" in body,
  });

  try {
    const forwardBody = JSON.stringify(body);
    const upstream = await fetch(targetUrl, {
      method: "POST",
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: forwardBody,
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
    console.error(`[proxy] galeri-ekle POST failed for ${slug}:`, e);
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
