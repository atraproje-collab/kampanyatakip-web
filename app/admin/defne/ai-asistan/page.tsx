"use client";

import { useState } from "react";
import {
  Bot,
  CheckCircle2,
  Clock,
  Eye,
  Languages,
  MessageCircle,
  Pencil,
  Plus,
  Power,
  Sparkles,
  Timer,
  Trash2,
  TrendingUp,
} from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/Button";
import {
  FormField,
  Modal,
  PanelCard,
  StatCard,
  inputClass,
} from "@/components/admin/AdminUI";
import {
  assistantStatus,
  assistantTemplates as initialTemplates,
  defaultAssistantSettings,
  recentAssistantConversations,
  topFaqs,
  type AssistantLanguage,
  type AssistantTemplate,
  type AssistantTone,
} from "@/lib/admin-mock-data";
import { cn } from "@/lib/utils";

const LANGS: { code: AssistantLanguage; label: string; flag: string }[] = [
  { code: "TR", label: "Türkçe", flag: "🇹🇷" },
  { code: "EN", label: "English", flag: "🇬🇧" },
  { code: "AR", label: "العربية", flag: "🇸🇦" },
  { code: "DE", label: "Deutsch", flag: "🇩🇪" },
  { code: "FR", label: "Français", flag: "🇫🇷" },
];

const TONES: AssistantTone[] = ["Resmi", "Samimi", "Kısa"];

export default function AIAssistantPage() {
  const [enabled, setEnabled] = useState(defaultAssistantSettings.enabled);
  const [languages, setLanguages] = useState<Set<AssistantLanguage>>(
    new Set(defaultAssistantSettings.languages),
  );
  const [tone, setTone] = useState<AssistantTone>(defaultAssistantSettings.tone);
  const [templates, setTemplates] = useState<AssistantTemplate[]>(initialTemplates);
  const [openTpl, setOpenTpl] = useState<AssistantTemplate | "new" | null>(null);
  const [openConv, setOpenConv] = useState<(typeof recentAssistantConversations)[number] | null>(null);
  const [savedAt, setSavedAt] = useState<string | null>(null);

  const [tplTrigger, setTplTrigger] = useState("");
  const [tplResponse, setTplResponse] = useState("");

  const toggleLang = (l: AssistantLanguage) => {
    setLanguages((prev) => {
      const next = new Set(prev);
      if (next.has(l)) next.delete(l);
      else next.add(l);
      return next;
    });
  };

  const handleSaveSettings = () => {
    if (languages.size === 0) {
      alert("En az bir dil seçilmelidir.");
      return;
    }
    setSavedAt(new Date().toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" }));
  };

  const openNewTemplate = () => {
    setTplTrigger("");
    setTplResponse("");
    setOpenTpl("new");
  };

  const openEditTemplate = (t: AssistantTemplate) => {
    setTplTrigger(t.trigger);
    setTplResponse(t.response);
    setOpenTpl(t);
  };

  const handleSaveTemplate = () => {
    if (!tplTrigger.trim() || !tplResponse.trim()) return;
    if (openTpl === "new") {
      const t: AssistantTemplate = {
        id: `TPL-${String(templates.length + 1).padStart(2, "0")}`,
        trigger: tplTrigger.trim(),
        response: tplResponse.trim(),
      };
      setTemplates([t, ...templates]);
    } else if (openTpl) {
      setTemplates((prev) =>
        prev.map((x) =>
          x.id === openTpl.id ? { ...x, trigger: tplTrigger.trim(), response: tplResponse.trim() } : x,
        ),
      );
    }
    setOpenTpl(null);
  };

  const handleDeleteTemplate = (id: string) => {
    if (!confirm("Şablon silinsin mi?")) return;
    setTemplates((prev) => prev.filter((t) => t.id !== id));
  };

  const maxFaq = Math.max(...topFaqs.map((f) => f.count));

  return (
    <AdminLayout
      title="AI Asistan"
      subtitle="Otomatik yanıt motoru — gelen mesajlara hazır yanıtlar verir, manuel ekibi sadece özel durumlara odaklar"
      actions={
        <Button variant="primary" size="sm" onClick={handleSaveSettings}>
          <CheckCircle2 className="w-4 h-4" />
          Ayarları Kaydet
        </Button>
      }
    >
      {savedAt && (
        <div className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-body-sm text-emerald-800">
          Ayarlar kaydedildi — {savedAt}
        </div>
      )}

      {/* Status hero */}
      <div
        className={cn(
          "rounded-xl p-5 mb-6 border bg-gradient-to-br text-white shadow-[0_10px_30px_rgba(0,24,53,0.15)]",
          enabled ? "from-secondary to-on-secondary-container border-secondary/40" : "from-slate-500 to-slate-700 border-slate-500/40",
        )}
      >
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-h3 font-bold">Asistan Durumu</h2>
                <span className={cn(
                  "inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-label-sm font-semibold",
                  enabled ? "bg-emerald-500 text-white" : "bg-white/30 text-white",
                )}>
                  <span className={cn("w-1.5 h-1.5 rounded-full", enabled ? "bg-white animate-pulse" : "bg-white/60")} />
                  {enabled ? "AKTİF" : "PASİF"}
                </span>
              </div>
              <p className="text-body-sm text-white/85 mt-0.5">
                Gelen mesajlara saniyeler içinde yanıt veriyor.
              </p>
            </div>
          </div>
          <button
            onClick={() => setEnabled((v) => !v)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/15 hover:bg-white/25 backdrop-blur text-label-md font-semibold transition border border-white/20"
          >
            <Power className="w-4 h-4" />
            {enabled ? "Asistanı Durdur" : "Asistanı Başlat"}
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <StatCard
          label="Bugün Yanıtlanan"
          value={assistantStatus.repliedToday.toLocaleString("tr-TR")}
          hint="Mesaj sayısı"
          icon={<MessageCircle className="w-5 h-5" />}
          accent="primary"
        />
        <StatCard
          label="Ortalama Yanıt"
          value={`${assistantStatus.averageReplySeconds} sn`}
          hint="Mesaj alımından sonra"
          icon={<Timer className="w-5 h-5" />}
          accent="secondary"
        />
        <StatCard
          label="Başarı Oranı"
          value={`%${assistantStatus.successRate}`}
          hint="Otomatik çözülen sorular"
          icon={<TrendingUp className="w-5 h-5" />}
          accent="success"
        />
        <StatCard
          label="Aktif Diller"
          value={languages.size}
          hint={Array.from(languages).join(" · ")}
          icon={<Languages className="w-5 h-5" />}
          accent="warning"
        />
      </div>

      {/* Settings + FAQ */}
      <div className="grid lg:grid-cols-3 gap-4 mt-6">
        <PanelCard title="Asistan Ayarları" description="Dil, ton ve davranış" className="lg:col-span-2">
          <div className="px-5 py-4 space-y-5">
            <div>
              <label className="block text-label-md font-semibold text-on-surface mb-2">
                Asistan Dili (çoklu seçim)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {LANGS.map((l) => {
                  const checked = languages.has(l.code);
                  return (
                    <button
                      key={l.code}
                      type="button"
                      onClick={() => toggleLang(l.code)}
                      className={cn(
                        "flex flex-col items-center gap-1 px-3 py-3 rounded-lg border text-label-md font-medium transition",
                        checked
                          ? "border-secondary bg-secondary-container/40 text-on-secondary-container"
                          : "border-outline-variant text-on-surface-variant hover:bg-surface-container-low",
                      )}
                    >
                      <span className="text-xl leading-none">{l.flag}</span>
                      <span className="text-label-sm">{l.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-label-md font-semibold text-on-surface mb-2">
                Yanıt Tonu
              </label>
              <div className="grid grid-cols-3 gap-2">
                {TONES.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTone(t)}
                    className={cn(
                      "px-3 py-2.5 rounded-lg border text-label-md font-medium transition",
                      tone === t
                        ? "border-secondary bg-secondary-container/40 text-on-secondary-container"
                        : "border-outline-variant text-on-surface-variant hover:bg-surface-container-low",
                    )}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between gap-3 px-4 py-3 rounded-lg border border-outline-variant bg-surface-container-low">
                <div>
                  <p className="text-label-md font-semibold text-on-surface">Otomatik Yanıt</p>
                  <p className="text-label-sm text-on-surface-variant">
                    Mesaj geldiğinde otomatik cevap ver.
                  </p>
                </div>
                <button
                  onClick={() => setEnabled((v) => !v)}
                  role="switch"
                  aria-checked={enabled}
                  className={cn(
                    "relative w-11 h-6 rounded-full transition-colors shrink-0",
                    enabled ? "bg-secondary" : "bg-surface-container-high",
                  )}
                >
                  <span
                    className={cn(
                      "absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform",
                      enabled && "translate-x-5",
                    )}
                  />
                </button>
              </div>
              <FormField label="Debounce Süresi" hint="Mesaj geldikten sonra yanıt vermeden önce beklenen süre.">
                <input
                  className={cn(inputClass, "tabular-nums")}
                  value={`${defaultAssistantSettings.debounceSeconds} saniye`}
                  readOnly
                  disabled
                />
              </FormField>
            </div>
          </div>
        </PanelCard>

        <PanelCard title="Sık Sorulan Sorular" description="En çok sorulan 5 soru">
          <ul className="divide-y divide-outline-variant">
            {topFaqs.map((f) => {
              const pct = (f.count / maxFaq) * 100;
              return (
                <li key={f.id} className="px-5 py-3">
                  <div className="flex items-center justify-between gap-3 mb-1.5">
                    <p className="text-label-md font-medium text-on-surface truncate">
                      {f.question}
                    </p>
                    <span className="text-label-md font-bold text-on-surface tabular-nums shrink-0">
                      {f.count}
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full bg-surface-container overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-secondary to-secondary-container"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        </PanelCard>
      </div>

      {/* Recent conversations */}
      <PanelCard
        title="Son Konuşmalar"
        description={`Son ${recentAssistantConversations.length} otomatik/manuel yanıt`}
        className="mt-6"
      >
        <ul className="divide-y divide-outline-variant">
          {recentAssistantConversations.map((c) => (
            <li key={c.id} className="px-5 py-3 flex items-start gap-3 hover:bg-surface-container-low transition">
              <div
                className={cn(
                  "w-9 h-9 rounded-lg flex items-center justify-center shrink-0",
                  c.type === "auto"
                    ? "bg-secondary-container/40 text-secondary"
                    : "bg-primary-fixed text-primary",
                )}
              >
                {c.type === "auto" ? <Bot className="w-4 h-4" /> : <MessageCircle className="w-4 h-4" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <p className="text-label-md font-semibold text-on-surface truncate">
                    {c.sender}
                  </p>
                  <span className="text-label-sm text-on-surface-variant shrink-0 tabular-nums">
                    {c.time}
                  </span>
                </div>
                <p className="text-body-sm text-on-surface mt-0.5">
                  <span className="text-on-surface-variant">Soru:</span> {c.question}
                </p>
                <div className="flex items-center justify-between gap-2 mt-1.5">
                  <span
                    className={cn(
                      "inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-label-sm font-medium border",
                      c.type === "auto"
                        ? "bg-secondary-container/40 text-on-secondary-container border-secondary/30"
                        : "bg-primary-fixed text-primary border-primary-fixed-dim/40",
                    )}
                  >
                    {c.type === "auto" ? (
                      <>
                        <Sparkles className="w-3 h-3" /> Otomatik
                      </>
                    ) : (
                      <>Manuel</>
                    )}
                  </span>
                  <button
                    onClick={() => setOpenConv(c)}
                    className="inline-flex items-center gap-1 text-secondary hover:text-on-secondary-container text-label-md font-medium"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    Detay
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </PanelCard>

      {/* Templates */}
      <PanelCard
        title="Yanıt Şablonları"
        description="Asistanın kullanacağı hazır cevaplar"
        actions={
          <Button variant="primary" size="sm" onClick={openNewTemplate}>
            <Plus className="w-3.5 h-3.5" />
            Yeni Şablon
          </Button>
        }
        className="mt-6"
      >
        <ul className="divide-y divide-outline-variant">
          {templates.map((t) => (
            <li key={t.id} className="px-5 py-3 flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-secondary-container/40 text-secondary flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-label-md font-semibold text-on-surface">
                  Tetikleyici: <span className="text-on-surface-variant font-mono text-label-sm">{t.trigger}</span>
                </p>
                <p className="text-body-sm text-on-surface-variant mt-0.5 line-clamp-2">
                  → {t.response}
                </p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => openEditTemplate(t)}
                  className="p-1.5 rounded-md text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
                  aria-label="Düzenle"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDeleteTemplate(t.id)}
                  className="p-1.5 rounded-md text-on-surface-variant hover:bg-error-container hover:text-error"
                  aria-label="Sil"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      </PanelCard>

      {/* Template modal */}
      <Modal
        open={openTpl !== null}
        onClose={() => setOpenTpl(null)}
        title={openTpl === "new" ? "Yeni Şablon" : "Şablonu Düzenle"}
        description="Tetikleyici kelimeleri eşleştiğinde asistan bu yanıtı kullanır."
        size="lg"
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={() => setOpenTpl(null)}>
              İptal
            </Button>
            <Button variant="primary" size="sm" onClick={handleSaveTemplate}>
              Kaydet
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <FormField
            label="Tetikleyici Anahtar Kelimeler"
            required
            hint="Slash veya virgülle ayırarak yazın. Örn: 'IBAN / hesap / havale'"
          >
            <input
              className={inputClass}
              value={tplTrigger}
              onChange={(e) => setTplTrigger(e.target.value)}
              placeholder="kelime1 / kelime2 / kelime3"
            />
          </FormField>
          <FormField label="Yanıt Metni" required>
            <textarea
              rows={6}
              className={inputClass}
              value={tplResponse}
              onChange={(e) => setTplResponse(e.target.value)}
              placeholder="Bu kelimeler geçtiğinde asistanın vereceği yanıt…"
            />
          </FormField>
        </div>
      </Modal>

      {/* Conversation detail */}
      <Modal
        open={openConv !== null}
        onClose={() => setOpenConv(null)}
        title={openConv ? `${openConv.sender} • ${openConv.id}` : ""}
        description={openConv?.time}
        size="lg"
      >
        {openConv && (
          <div className="space-y-3">
            <div className="rounded-lg bg-surface-container-low border border-outline-variant p-4 space-y-3">
              <div className="flex gap-2">
                <div className="w-7 h-7 rounded-full bg-primary text-on-primary flex items-center justify-center shrink-0 text-label-sm font-bold">
                  ?
                </div>
                <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl rounded-tl-sm px-3 py-2 text-body-sm text-on-surface">
                  {openConv.question}
                </div>
              </div>
              <div className="flex gap-2 justify-end">
                <div
                  className={cn(
                    "rounded-2xl rounded-tr-sm px-3 py-2 text-body-sm",
                    openConv.type === "auto"
                      ? "bg-secondary-container/40 border border-secondary/30 text-on-secondary-container"
                      : "bg-primary text-on-primary",
                  )}
                >
                  {openConv.answer}
                </div>
                <div
                  className={cn(
                    "w-7 h-7 rounded-full flex items-center justify-center shrink-0",
                    openConv.type === "auto" ? "bg-secondary text-on-secondary" : "bg-primary text-on-primary",
                  )}
                >
                  {openConv.type === "auto" ? <Bot className="w-3.5 h-3.5" /> : "S"}
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between gap-2 text-label-sm">
              <span
                className={cn(
                  "inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-medium border",
                  openConv.type === "auto"
                    ? "bg-secondary-container/40 text-on-secondary-container border-secondary/30"
                    : "bg-primary-fixed text-primary border-primary-fixed-dim/40",
                )}
              >
                {openConv.type === "auto" ? (
                  <>
                    <Sparkles className="w-3 h-3" /> Otomatik Yanıt
                  </>
                ) : (
                  <>Manuel Saha Yanıtı</>
                )}
              </span>
              <span className="text-on-surface-variant inline-flex items-center gap-1">
                <Clock className="w-3 h-3" /> {openConv.time}
              </span>
            </div>
          </div>
        )}
      </Modal>
    </AdminLayout>
  );
}
