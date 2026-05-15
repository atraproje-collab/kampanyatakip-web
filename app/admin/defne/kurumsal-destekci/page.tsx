"use client";

import {
  Briefcase,
  MapPin,
  Mail,
  Building2,
  TrendingUp,
} from "lucide-react";
import { ComingSoonPage } from "@/components/admin/ComingSoonPage";

export default function KurumsalDestekciPage() {
  return (
    <ComingSoonPage
      title="Kurumsal Destekçi"
      tagline="İlçe ve sektör bazlı kurumsal firma arama, otomatik mail gönderme, lead takibi"
      heroIcon={Briefcase}
      gradient="from-indigo-600 to-blue-700"
      features={[
        {
          icon: MapPin,
          title: "İlçe ve Sektör Bazlı Arama",
          description:
            "Ticaret odası ve sektör veri tabanlarından ilçe + sektör filtresiyle hedef firmaları otomatik listeleyin.",
        },
        {
          icon: Mail,
          title: "Otomatik Mail Gönderimi",
          description:
            "Seçilen firmalara kampanya tanıtım mailini özelleştirilmiş şablonla, takip parametreleriyle birlikte yollayın.",
        },
        {
          icon: TrendingUp,
          title: "Lead Takibi & Skorlama",
          description:
            "Açılma, tıklama ve geri dönüş davranışına göre kurumsal lead'leri sıcaklık seviyesine ayırın, ekibinize ata.",
        },
        {
          icon: Building2,
          title: "Vergi Avantajı Bildirimi",
          description:
            "KVK Madde 10 kapsamında bağışın gider yazılmasıyla ilgili otomatik bilgilendirme + makbuz şablonu.",
        },
      ]}
    />
  );
}
