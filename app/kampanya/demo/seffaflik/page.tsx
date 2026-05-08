import type { Metadata } from "next";
import { TransparencyClient } from "@/components/transparency/TransparencyClient";
import { demoCampaign } from "@/lib/mock-campaign-data";

const CAMPAIGN_TITLE = demoCampaign.title;

export const metadata: Metadata = {
  title: `Şeffaflık Merkezi | ${CAMPAIGN_TITLE} | KAMPANYATAKİP`,
  description: `${CAMPAIGN_TITLE} kampanyasının tüm gelir-gider kayıtları açık ve denetlenebilir. KVK Madde 10 ve 5072 Sayılı Yardım Toplama Kanunu uyarınca şeffaflık merkezi.`,
  robots: { index: true, follow: true },
  openGraph: {
    title: `Şeffaflık Merkezi · ${CAMPAIGN_TITLE}`,
    description: `${CAMPAIGN_TITLE} — tüm bağış ve gider kayıtları şeffaflık merkezinde.`,
    type: "website",
    siteName: "KAMPANYATAKİP",
  },
  twitter: {
    card: "summary_large_image",
    title: `Şeffaflık Merkezi · ${CAMPAIGN_TITLE}`,
    description: `${CAMPAIGN_TITLE} — şeffaf bağış takibi.`,
  },
};

export default function SeffaflikPage() {
  return <TransparencyClient slug="demo-defne" />;
}
