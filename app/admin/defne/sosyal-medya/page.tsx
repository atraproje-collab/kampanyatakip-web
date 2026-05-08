"use client";

import { useMemo, useState } from "react";
import {
  CalendarPlus,
  Camera,
  CheckCircle2,
  Clock,
  ExternalLink,
  Globe,
  Hash,
  Inbox,
  MessageSquare,
  Music2,
  PlayCircle,
  PlugZap,
  Plus,
  Sparkles,
  Unplug,
} from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/Button";
import { FormField, Modal, PanelCard, StatCard, inputClass } from "@/components/admin/AdminUI";
import {
  dmStats,
  scheduledPosts as initialPosts,
  socialAccounts as initialAccounts,
  type ScheduledPost,
  type SocialAccount,
  type SocialPlatform,
} from "@/lib/admin-mock-data";
import { cn } from "@/lib/utils";

const PLATFORM_ICON: Record<SocialPlatform, typeof Globe> = {
  facebook: Globe,
  instagram: Camera,
  youtube: PlayCircle,
  tiktok: Music2,
  twitter: Hash,
};

const PLATFORM_TINT: Record<SocialPlatform, string> = {
  facebook: "from-blue-500 to-blue-600",
  instagram: "from-pink-500 to-rose-500",
  youtube: "from-red-500 to-red-600",
  tiktok: "from-slate-800 to-slate-900",
  twitter: "from-sky-500 to-sky-600",
};

const PLATFORM_LABELS: Record<SocialPlatform, string> = {
  facebook: "Facebook",
  instagram: "Instagram",
  youtube: "YouTube",
  tiktok: "TikTok",
  twitter: "X / Twitter",
};

export default function SocialMediaPage() {
  const [accounts, setAccounts] = useState<SocialAccount[]>(initialAccounts);
  const [posts, setPosts] = useState<ScheduledPost[]>(initialPosts);
  const [openPlan, setOpenPlan] = useState(false);
  const [openDetail, setOpenDetail] = useState<SocialAccount | null>(null);

  const [planDate, setPlanDate] = useState(new Date().toISOString().slice(0, 10));
  const [planTime, setPlanTime] = useState("10:00");
  const [planContent, setPlanContent] = useState("");
  const [planPlatforms, setPlanPlatforms] = useState<Set<SocialPlatform>>(new Set(["facebook"]));

  const togglePlatform = (p: SocialPlatform) => {
    setPlanPlatforms((prev) => {
      const next = new Set(prev);
      if (next.has(p)) next.delete(p);
      else next.add(p);
      return next;
    });
  };

  const handlePlan = () => {
    if (!planContent.trim() || planPlatforms.size === 0) return;
    const post: ScheduledPost = {
      id: `P-${Date.now().toString().slice(-4)}`,
      date: planDate,
      time: planTime,
      platforms: Array.from(planPlatforms),
      content: planContent.trim(),
      status: "Planlandı",
    };
    setPosts([post, ...posts]);
    setOpenPlan(false);
    setPlanContent("");
    setPlanPlatforms(new Set(["facebook"]));
  };

  const toggleConnection = (platform: SocialPlatform) => {
    setAccounts((prev) =>
      prev.map((a) =>
        a.platform === platform ? { ...a, connected: !a.connected } : a,
      ),
    );
  };

  const totalFollowers = useMemo(
    () => accounts.filter((a) => a.connected).reduce((s, a) => s + a.followers, 0),
    [accounts],
  );

  return (
    <AdminLayout
      title="Sosyal Medya"
      subtitle={`${accounts.filter((a) => a.connected).length}/${accounts.length} platform bağlı — ${totalFollowers.toLocaleString("tr-TR")} toplam takipçi`}
      actions={
        <Button variant="primary" size="sm" onClick={() => setOpenPlan(true)}>
          <CalendarPlus className="w-4 h-4" />
          Yeni Paylaşım Planla
        </Button>
      }
    >
      {/* Platform cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {accounts.map((a) => {
          const Icon = PLATFORM_ICON[a.platform];
          return (
            <article
              key={a.platform}
              className="bg-surface-container-lowest rounded-xl border border-outline-variant overflow-hidden hover:shadow-[0_4px_12px_rgba(0,24,53,0.08)] transition flex flex-col"
            >
              <div className={cn("px-4 py-4 bg-gradient-to-br text-white", PLATFORM_TINT[a.platform])}>
                <div className="flex items-center justify-between">
                  <Icon className="w-7 h-7" />
                  {a.connected ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/20 backdrop-blur text-label-sm font-semibold">
                      <CheckCircle2 className="w-3 h-3" /> Bağlı
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/10 text-white/70 text-label-sm font-semibold">
                      <Unplug className="w-3 h-3" /> Yakında
                    </span>
                  )}
                </div>
                <p className="mt-3 text-body-md font-bold leading-tight">{a.label}</p>
                <p className="text-label-sm text-white/80 truncate">{a.handle}</p>
              </div>
              <div className="px-4 py-3 space-y-1.5 text-body-sm flex-1">
                <Row label="Takipçi" value={a.connected ? a.followers.toLocaleString("tr-TR") : "—"} />
                <Row label="Bu ay gönderi" value={a.connected ? `${a.postsThisMonth} adet` : "—"} />
                <Row label="Son paylaşım" value={a.lastPost} />
              </div>
              <div className="px-4 pb-4 pt-1 grid grid-cols-2 gap-2">
                {a.connected && a.url ? (
                  <a
                    href={a.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-outline-variant text-on-surface-variant text-label-md hover:bg-surface-container-low transition"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    Sayfayı Görüntüle
                  </a>
                ) : (
                  <button
                    onClick={() => toggleConnection(a.platform)}
                    className={cn(
                      "inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border text-label-md transition",
                      a.connected
                        ? "border-outline-variant text-on-surface-variant hover:bg-surface-container-low"
                        : "border-secondary bg-secondary text-on-secondary hover:bg-on-secondary-container",
                    )}
                  >
                    <PlugZap className="w-3.5 h-3.5" />
                    {a.connected ? "Bağlantıyı Kes" : "Bağlan"}
                  </button>
                )}
                <button
                  onClick={() => setOpenDetail(a)}
                  className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-primary text-on-primary text-label-md hover:bg-primary-container transition"
                >
                  Detay
                </button>
              </div>
            </article>
          );
        })}
      </div>

      {/* Scheduled posts */}
      <PanelCard
        title="Otomatik Paylaşım Planlaması"
        description={`${posts.filter((p) => p.status === "Planlandı").length} planlı paylaşım — sıradaki paylaşıma kadar`}
        actions={
          <Button variant="primary" size="sm" onClick={() => setOpenPlan(true)}>
            <Plus className="w-3.5 h-3.5" />
            Plan Ekle
          </Button>
        }
        className="mt-6"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-body-sm">
            <thead>
              <tr className="bg-surface-container-low text-label-sm text-on-surface-variant uppercase tracking-wide">
                <th className="text-left px-5 py-3 font-semibold">Tarih / Saat</th>
                <th className="text-left px-5 py-3 font-semibold">Platform</th>
                <th className="text-left px-5 py-3 font-semibold">İçerik</th>
                <th className="text-left px-5 py-3 font-semibold">Durum</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((p, i) => (
                <tr
                  key={p.id}
                  className={`border-t border-outline-variant hover:bg-surface-container-low transition ${i % 2 === 1 ? "bg-surface-container-low/40" : ""}`}
                >
                  <td className="px-5 py-3 whitespace-nowrap">
                    <p className="text-on-surface font-medium tabular-nums">{p.date}</p>
                    <p className="text-label-sm text-on-surface-variant tabular-nums">{p.time}</p>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-1.5">
                      {p.platforms.map((pl) => {
                        const Icon = PLATFORM_ICON[pl];
                        return (
                          <span
                            key={pl}
                            title={PLATFORM_LABELS[pl]}
                            className={cn(
                              "w-7 h-7 rounded-md flex items-center justify-center bg-gradient-to-br text-white",
                              PLATFORM_TINT[pl],
                            )}
                          >
                            <Icon className="w-3.5 h-3.5" />
                          </span>
                        );
                      })}
                    </div>
                  </td>
                  <td className="px-5 py-3 text-on-surface max-w-md">
                    <p className="line-clamp-2">{p.content}</p>
                  </td>
                  <td className="px-5 py-3">
                    <PostStatusPill status={p.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </PanelCard>

      {/* DM stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mt-6">
        <StatCard
          label="Bu Ay Gelen DM"
          value={dmStats.totalThisMonth.toLocaleString("tr-TR")}
          hint="Tüm platformlardan"
          icon={<Inbox className="w-5 h-5" />}
          accent="primary"
        />
        <StatCard
          label="Otomatik Yanıtlanan"
          value={dmStats.autoReplied.toLocaleString("tr-TR")}
          hint={`%${Math.round((dmStats.autoReplied / dmStats.totalThisMonth) * 100)} otomasyon oranı`}
          icon={<Sparkles className="w-5 h-5" />}
          accent="success"
        />
        <StatCard
          label="Manuel Bekleyen"
          value={dmStats.awaitingManual}
          hint="Saha ekibi yanıt bekliyor"
          icon={<MessageSquare className="w-5 h-5" />}
          accent="warning"
        />
        <StatCard
          label="Ortalama Yanıt"
          value={`${dmStats.averageReplyMinutes} dk`}
          hint="Son 30 günlük ortalama"
          icon={<Clock className="w-5 h-5" />}
          accent="secondary"
        />
      </div>

      {/* Plan modal */}
      <Modal
        open={openPlan}
        onClose={() => setOpenPlan(false)}
        title="Yeni Paylaşım Planla"
        description="Birden fazla platforma aynı anda paylaşım planlanabilir"
        size="lg"
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={() => setOpenPlan(false)}>
              İptal
            </Button>
            <Button variant="primary" size="sm" onClick={handlePlan}>
              Planı Kaydet
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <FormField label="Platform Seç" required>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {accounts.map((a) => {
                const checked = planPlatforms.has(a.platform);
                const Icon = PLATFORM_ICON[a.platform];
                return (
                  <button
                    key={a.platform}
                    type="button"
                    onClick={() => togglePlatform(a.platform)}
                    disabled={!a.connected}
                    className={cn(
                      "flex items-center gap-2 px-3 py-2.5 rounded-lg border text-label-md font-medium transition",
                      checked
                        ? "border-secondary bg-secondary-container/30 text-on-secondary-container"
                        : "border-outline-variant text-on-surface-variant hover:bg-surface-container-low",
                      !a.connected && "opacity-40 cursor-not-allowed",
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    {a.label}
                  </button>
                );
              })}
            </div>
          </FormField>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Tarih" required>
              <input
                type="date"
                className={inputClass}
                value={planDate}
                onChange={(e) => setPlanDate(e.target.value)}
              />
            </FormField>
            <FormField label="Saat" required>
              <input
                type="time"
                className={inputClass}
                value={planTime}
                onChange={(e) => setPlanTime(e.target.value)}
              />
            </FormField>
          </div>
          <FormField label="Metin İçerik" required hint={`${planContent.length} karakter`}>
            <textarea
              rows={5}
              className={inputClass}
              placeholder="Paylaşacağınız metni buraya yazın…"
              value={planContent}
              onChange={(e) => setPlanContent(e.target.value)}
            />
          </FormField>
        </div>
      </Modal>

      {/* Detail modal */}
      <Modal
        open={openDetail !== null}
        onClose={() => setOpenDetail(null)}
        title={openDetail ? `${openDetail.label} — Detay` : ""}
        description={openDetail?.handle}
      >
        {openDetail && (
          <div className="space-y-3 text-body-sm">
            <DetailRow
              label="Bağlantı"
              value={openDetail.connected ? "Bağlı" : "Bağlantı Yok / Yakında"}
            />
            {openDetail.connected && openDetail.pageName && (
              <DetailRow label="Sayfa adı" value={openDetail.pageName} />
            )}
            {openDetail.connected && openDetail.url && (
              <div className="flex items-start justify-between gap-3 py-2 border-b border-outline-variant">
                <span className="text-on-surface-variant">URL</span>
                <a
                  href={openDetail.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-primary-container hover:underline text-right break-all"
                >
                  {openDetail.url}
                </a>
              </div>
            )}
            <DetailRow label="Takipçi" value={openDetail.followers.toLocaleString("tr-TR")} />
            <DetailRow label="Bu ay paylaşım" value={`${openDetail.postsThisMonth} adet`} />
            <DetailRow label="Son paylaşım" value={openDetail.lastPost} />
            {openDetail.connected && openDetail.url && (
              <a
                href={openDetail.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary text-on-primary px-4 py-2.5 text-label-md font-semibold hover:bg-primary-container transition"
              >
                <ExternalLink className="w-4 h-4" />
                Sayfayı Görüntüle
              </a>
            )}
            <div className="pt-3 mt-3 border-t border-outline-variant text-label-sm text-on-surface-variant">
              Paylaşım istatistikleri her gece 03:00'te güncellenir.
            </div>
          </div>
        )}
      </Modal>
    </AdminLayout>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-on-surface-variant text-label-sm">{label}</span>
      <span className="text-on-surface font-medium tabular-nums">{value}</span>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 py-2 border-b border-outline-variant last:border-0">
      <span className="text-on-surface-variant">{label}</span>
      <span className="font-medium text-on-surface text-right">{value}</span>
    </div>
  );
}

function PostStatusPill({ status }: { status: ScheduledPost["status"] }) {
  const map = {
    Planlandı: "bg-amber-50 text-amber-700 border-amber-200",
    Yayınlandı: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Başarısız: "bg-rose-50 text-rose-700 border-rose-200",
  } as const;
  const dot = {
    Planlandı: "bg-amber-500",
    Yayınlandı: "bg-emerald-500",
    Başarısız: "bg-rose-500",
  } as const;
  return (
    <span className={cn("inline-flex items-center gap-1 px-2 py-0.5 rounded-md border text-label-sm font-medium", map[status])}>
      <span className={cn("w-1.5 h-1.5 rounded-full", dot[status])} />
      {status}
    </span>
  );
}
