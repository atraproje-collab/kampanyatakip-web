import type { Metadata } from "next";
import { CampaignProvider } from "@/components/campaign/CampaignContext";
import { ApiErrorBanner } from "@/components/campaign/ApiErrorBanner";
import { DemoBanner } from "@/components/campaign/DemoBanner";
import { CampaignHero } from "@/components/campaign/CampaignHero";
import { CampaignTabs } from "@/components/campaign/CampaignTabs";
import { RecentDonorsFeed } from "@/components/campaign/RecentDonorsFeed";
import { DonationToast } from "@/components/campaign/DonationToast";
import { TrustPanel } from "@/components/campaign/TrustPanel";
import { FollowSocialButtons } from "@/components/campaign/FollowSocialButtons";
import { SystemAttribution } from "@/components/campaign/SystemAttribution";
import { demoCampaign } from "@/lib/mock-campaign-data";

export const metadata: Metadata = {
  title: "Minik Defne'ye Umut Ol · Demo Kampanya",
  description:
    "SMA Tip 1 hastası Defne bebeğin Zolgensma tedavisi için toplanan bağışların şeffaf takibi. Bu bir demo kampanyadır — KAMPANYATAKİP altyapısı üzerinde örnek gösterim.",
  robots: { index: false, follow: false },
  openGraph: {
    title: "Minik Defne'ye Umut Ol (Demo)",
    description:
      "KAMPANYATAKİP altyapısı üzerinde şeffaf bağış takipli demo kampanya.",
    type: "website",
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "FundraisingCampaign",
  name: demoCampaign.title,
  description: demoCampaign.subtitle,
  url: "/kampanya/demo",
  creator: {
    "@type": "Organization",
    name: "KAMPANYATAKİP",
    url: "https://kampanyatakip.com",
  },
  startDate: demoCampaign.createdAt,
  recipient: {
    "@type": "Person",
    name: "Minik Defne (demo)",
  },
};

export default function CampaignDemoPage() {
  return (
    <CampaignProvider campaign={demoCampaign}>
      <div className="min-h-screen flex flex-col bg-surface">
        <DemoBanner />
        <ApiErrorBanner />

        <CampaignHero />

        {/* Body layout: main + sticky feed */}
        <div className="flex-1">
          <div className="mx-auto max-w-7xl px-4 md:px-6 py-10 md:py-14">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              <div className="lg:col-span-2 min-w-0">
                <CampaignTabs />
              </div>
              <div className="lg:col-span-1">
                <RecentDonorsFeed />
              </div>
            </div>
          </div>
        </div>

        {/* Trust panel */}
        <section className="border-t border-outline-variant bg-surface-container-lowest py-14 md:py-16">
          <div className="mx-auto max-w-7xl px-4 md:px-6">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <span className="text-[12px] font-semibold text-secondary uppercase tracking-[0.14em]">
                Güvence
              </span>
              <h2 className="mt-2 text-[24px] md:text-[30px] font-semibold text-primary-container tracking-[-0.02em]">
                Güven Paneli
              </h2>
              <p className="mt-2 text-[14px] leading-[22px] text-on-surface-variant">
                Bu kampanyayı güvence altına alan denetim katmanları — kart
                başlıklarına tıklayın.
              </p>
            </div>
            <TrustPanel
              approvalAuthority={demoCampaign.provinceApproval.authority}
              approvalNumber={demoCampaign.provinceApproval.decisionNumber}
              approvalDate={demoCampaign.provinceApproval.approvalDate}
            />
          </div>
        </section>

        {/* Follow on social media */}
        <section className="border-t border-outline-variant bg-surface-container-lowest py-10 md:py-12">
          <div className="mx-auto max-w-7xl px-4 md:px-6 flex flex-col items-center gap-5">
            <FollowSocialButtons />
            <a
              href="/kampanya/demo/seffaflik"
              className="inline-flex items-center gap-1.5 rounded-full border border-outline-variant bg-white text-primary-container px-3.5 py-1.5 text-[12px] font-semibold hover:border-primary-container hover:bg-surface-container-low transition-colors"
            >
              🔒 Şeffaflık Merkezi
            </a>
          </div>
        </section>

        <SystemAttribution />

        <DonationToast />

        {/* Structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </div>
    </CampaignProvider>
  );
}
