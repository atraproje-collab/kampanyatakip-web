/**
 * Server-side proxy: /api/kampanya/[slug]/galeri
 *
 * GET → n8n /webhook/kampanya/[slug]/galeri  (galeri foto listesi)
 *
 * CRUD endpoint'leri ayrı dosyalarda:
 *   - galeri-ekle/  (POST → /galeri-ekle)
 *   - galeri-sil/   (POST → /galeri-sil)
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
  const targetUrl = `${N8N_BASE}/${encodeURIComponent(slug)}/galeri`;

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
    console.error(`[proxy] galeri GET failed for ${slug}:`, e);
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
