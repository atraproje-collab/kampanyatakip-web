import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("n8n ye gönderilen paket body:", JSON.stringify(body));

    const res = await fetch(
      "https://n8n.srv1587680.hstgr.cloud/webhook/master/paket-guncelle",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        cache: "no-store",
      },
    );

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error("paket-guncelle hata:", err);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
