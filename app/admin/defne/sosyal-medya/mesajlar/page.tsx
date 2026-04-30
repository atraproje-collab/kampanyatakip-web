"use client";

import { useMemo, useState } from "react";
import {
  Bot,
  Camera,
  Clock,
  Eye,
  Globe,
  Hash,
  Inbox,
  MessageSquare,
  Music2,
  PlayCircle,
  Send,
  Sparkles,
  User as UserIcon,
} from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/Button";
import { FormField, Modal, PanelCard, StatCard, inputClass } from "@/components/admin/AdminUI";
import {
  dmStats,
  socialMessages as initial,
  type ChatBubble,
  type SocialMessage,
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

export default function MessagesPage() {
  const [list, setList] = useState<SocialMessage[]>(initial);
  const [platformFilter, setPlatformFilter] = useState<SocialPlatform | "all">("all");
  const [statusFilter, setStatusFilter] = useState<SocialMessage["status"] | "all">("all");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [open, setOpen] = useState<SocialMessage | null>(null);
  const [reply, setReply] = useState("");

  const filtered = useMemo(() => {
    return list.filter((m) => {
      if (platformFilter !== "all" && m.platform !== platformFilter) return false;
      if (statusFilter !== "all" && m.status !== statusFilter) return false;
      if (start && m.date < start) return false;
      if (end && m.date > end) return false;
      return true;
    });
  }, [list, platformFilter, statusFilter, start, end]);

  const handleSend = () => {
    if (!open || !reply.trim()) return;
    const bubble: ChatBubble = {
      role: "agent",
      text: reply.trim(),
      time: new Date().toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" }),
    };
    setList((prev) =>
      prev.map((m) =>
        m.id === open.id
          ? { ...m, status: "Yanıtlandı", thread: [...m.thread, bubble] }
          : m,
      ),
    );
    setOpen({ ...open, status: "Yanıtlandı", thread: [...open.thread, bubble] });
    setReply("");
  };

  return (
    <AdminLayout
      title="Mesajlar"
      subtitle={`${filtered.length} mesaj görüntüleniyor • ${list.filter((m) => m.status === "Manuel Bekleniyor").length} manuel yanıt bekliyor`}
    >
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <StatCard
          label="Toplam Gelen"
          value={dmStats.totalThisMonth.toLocaleString("tr-TR")}
          hint="Bu ay tüm platformlardan"
          icon={<Inbox className="w-5 h-5" />}
          accent="primary"
        />
        <StatCard
          label="Otomatik Yanıt"
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

      {/* Filters */}
      <PanelCard title="Filtreler" className="mt-6 mb-4">
        <div className="p-5 grid grid-cols-1 md:grid-cols-4 gap-3">
          <FormField label="Platform">
            <select
              className={inputClass}
              value={platformFilter}
              onChange={(e) => setPlatformFilter(e.target.value as SocialPlatform | "all")}
            >
              <option value="all">Tümü</option>
              <option value="facebook">Facebook</option>
              <option value="instagram">Instagram</option>
              <option value="youtube">YouTube</option>
              <option value="tiktok">TikTok</option>
              <option value="twitter">X / Twitter</option>
            </select>
          </FormField>
          <FormField label="Durum">
            <select
              className={inputClass}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as SocialMessage["status"] | "all")}
            >
              <option value="all">Tümü</option>
              <option value="Otomatik Yanıtlandı">Otomatik Yanıtlandı</option>
              <option value="Manuel Bekleniyor">Manuel Bekleniyor</option>
              <option value="Yanıtlandı">Yanıtlandı</option>
            </select>
          </FormField>
          <FormField label="Başlangıç">
            <input type="date" className={inputClass} value={start} onChange={(e) => setStart(e.target.value)} />
          </FormField>
          <FormField label="Bitiş">
            <input type="date" className={inputClass} value={end} onChange={(e) => setEnd(e.target.value)} />
          </FormField>
        </div>
      </PanelCard>

      {/* List */}
      <PanelCard
        title={`Mesaj Listesi (${filtered.length})`}
        description="Platformdan bağımsız tek noktadan yönetim"
      >
        {filtered.length === 0 ? (
          <div className="px-5 py-12 text-center text-on-surface-variant text-body-sm">
            Bu filtrelere uyan mesaj bulunamadı.
          </div>
        ) : (
          <ul className="divide-y divide-outline-variant">
            {filtered.map((m) => {
              const Icon = PLATFORM_ICON[m.platform];
              return (
                <li
                  key={m.id}
                  className="px-5 py-3 flex items-start gap-3 hover:bg-surface-container-low transition cursor-pointer"
                  onClick={() => setOpen(m)}
                >
                  <div
                    className={cn(
                      "w-9 h-9 rounded-lg flex items-center justify-center bg-gradient-to-br text-white shrink-0",
                      PLATFORM_TINT[m.platform],
                    )}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <p className="text-label-md font-semibold text-on-surface truncate">
                        {m.sender}
                      </p>
                      <span className="text-label-sm text-on-surface-variant tabular-nums shrink-0">
                        {m.date} · {m.time}
                      </span>
                    </div>
                    <p className="text-body-sm text-on-surface-variant truncate mt-0.5">
                      {m.preview.slice(0, 60)}{m.preview.length > 60 ? "…" : ""}
                    </p>
                    <div className="flex items-center justify-between gap-2 mt-1.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-label-sm text-on-surface-variant">
                          {PLATFORM_LABELS[m.platform]}
                        </span>
                        <MessageStatusPill status={m.status} />
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpen(m);
                        }}
                        className="inline-flex items-center gap-1 text-secondary hover:text-on-secondary-container text-label-md font-medium"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        Görüntüle
                      </button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </PanelCard>

      {/* Detail modal */}
      <Modal
        open={open !== null}
        onClose={() => {
          setOpen(null);
          setReply("");
        }}
        title={open ? `${open.sender} • ${PLATFORM_LABELS[open.platform]}` : ""}
        description={open ? `${open.id} • ${open.date} ${open.time}` : ""}
        size="lg"
      >
        {open && (
          <div className="space-y-4">
            <div className="rounded-lg bg-surface-container-low border border-outline-variant p-3 space-y-3 max-h-80 overflow-y-auto">
              {open.thread.map((b, i) => {
                const isUser = b.role === "user";
                const isAssistant = b.role === "assistant";
                return (
                  <div
                    key={i}
                    className={cn("flex gap-2", isUser ? "justify-start" : "justify-end")}
                  >
                    {isUser && (
                      <div className="w-7 h-7 rounded-full bg-primary text-on-primary text-label-sm font-bold flex items-center justify-center shrink-0">
                        <UserIcon className="w-3.5 h-3.5" />
                      </div>
                    )}
                    <div
                      className={cn(
                        "max-w-[75%] rounded-2xl px-3 py-2 text-body-sm",
                        isUser
                          ? "bg-surface-container-lowest border border-outline-variant rounded-tl-sm text-on-surface"
                          : isAssistant
                            ? "bg-secondary-container/40 border border-secondary/20 rounded-tr-sm text-on-secondary-container"
                            : "bg-primary text-on-primary rounded-tr-sm",
                      )}
                    >
                      <div className="flex items-center gap-1.5 mb-0.5 text-label-sm font-semibold opacity-80">
                        {isUser ? (
                          <>Bağışçı</>
                        ) : isAssistant ? (
                          <>
                            <Bot className="w-3 h-3" /> AI Asistan
                          </>
                        ) : (
                          <>Saha Ekibi</>
                        )}
                        <span className="opacity-60 font-normal ml-1">{b.time}</span>
                      </div>
                      <p className="whitespace-pre-line">{b.text}</p>
                    </div>
                    {!isUser && (
                      <div
                        className={cn(
                          "w-7 h-7 rounded-full text-label-sm font-bold flex items-center justify-center shrink-0",
                          isAssistant ? "bg-secondary text-on-secondary" : "bg-primary text-on-primary",
                        )}
                      >
                        {isAssistant ? <Bot className="w-3.5 h-3.5" /> : "S"}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between gap-2 flex-wrap">
              <MessageStatusPill status={open.status} />
              <span className="text-label-sm text-on-surface-variant">
                Yanıt göndermek bu mesajın durumunu “Yanıtlandı” olarak işaretler.
              </span>
            </div>

            <FormField label="Manuel Yanıt" hint="Yanıt göndermeden önce platformun mesajlaşma kurallarına uyduğunuzdan emin olun.">
              <textarea
                rows={4}
                className={inputClass}
                placeholder="Yanıt mesajınızı buraya yazın…"
                value={reply}
                onChange={(e) => setReply(e.target.value)}
              />
            </FormField>

            <div className="flex justify-end gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setOpen(null);
                  setReply("");
                }}
              >
                Kapat
              </Button>
              <Button variant="primary" size="sm" onClick={handleSend} disabled={!reply.trim()}>
                <Send className="w-4 h-4" />
                Gönder
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </AdminLayout>
  );
}

function MessageStatusPill({ status }: { status: SocialMessage["status"] }) {
  const map = {
    "Otomatik Yanıtlandı": {
      cls: "bg-secondary-container/40 text-on-secondary-container border-secondary/30",
      dot: "bg-secondary",
    },
    "Manuel Bekleniyor": {
      cls: "bg-amber-50 text-amber-700 border-amber-200",
      dot: "bg-amber-500 animate-pulse",
    },
    Yanıtlandı: {
      cls: "bg-emerald-50 text-emerald-700 border-emerald-200",
      dot: "bg-emerald-500",
    },
  } as const;
  const m = map[status];
  return (
    <span className={cn("inline-flex items-center gap-1 px-2 py-0.5 rounded-md border text-label-sm font-medium", m.cls)}>
      <span className={cn("w-1.5 h-1.5 rounded-full", m.dot)} />
      {status}
    </span>
  );
}
