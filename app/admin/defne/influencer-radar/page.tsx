"use client";

import {
  Radar,
  Search,
  MessageCircle,
  TrendingUp,
  Users,
} from "lucide-react";
import { ComingSoonPage } from "@/components/admin/ComingSoonPage";

export default function InfluencerRadarPage() {
  return (
    <ComingSoonPage
      title="Influencer Radar"
      tagline="Sosyal medyada kampanyanızla ilgili içerik üreten influencer'ları bulma ve iletişime geçme (Premium)"
      heroIcon={Radar}
      gradient="from-purple-600 to-fuchsia-700"
      premium
      features={[
        {
          icon: Search,
          title: "Otomatik İçerik Tarama",
          description:
            "Instagram, TikTok, YouTube ve X'te kampanya hashtag'leri + anahtar kelimeleri taranır; ilgili içerik üreten profiller listelenir.",
        },
        {
          icon: TrendingUp,
          title: "Etki Skoru & Erişim Tahmini",
          description:
            "Takipçi, etkileşim oranı ve son içerik performansına göre her influencer için kampanya potansiyeli skoru.",
        },
        {
          icon: MessageCircle,
          title: "Tek Tıkla Outreach",
          description:
            "Hazır şablonlarla DM/mail gönderimi, yanıtların tek panelden takibi, kampanya komisyon kuralları.",
        },
        {
          icon: Users,
          title: "Mikro & Makro Segmentasyon",
          description:
            "Bölge, dil, niche ve takipçi aralığına göre influencer havuzunu segmente edin; küçük ölçekli sahici sesleri öne çıkarın.",
        },
      ]}
    />
  );
}
