import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { ad, email, telefon, konu, mesaj } = body;

    if (!ad || !email || !mesaj) {
      return NextResponse.json(
        { success: false, message: "Zorunlu alanlar eksik" },
        { status: 400 },
      );
    }

    const n8nRes = await fetch(
      "https://n8n.srv1587680.hstgr.cloud/webhook/iletisim",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ad, email, telefon, konu, mesaj }),
      },
    );

    if (!n8nRes.ok) {
      throw new Error("n8n yanıt vermedi");
    }

    return NextResponse.json({
      success: true,
      message: "Mesajınız alındı. En kısa sürede dönüş yapacağız.",
    });
  } catch (error) {
    console.error("İletişim form hatası:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Mesaj gönderilemedi. Lütfen tekrar deneyin.",
      },
      { status: 500 },
    );
  }
}
