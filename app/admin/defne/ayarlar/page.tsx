"use client";

import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  Bell,
  Calendar,
  CheckCircle2,
  Eye,
  EyeOff,
  FileCheck,
  Hash,
  Landmark,
  Lock,
  Save,
  Target,
  Type,
} from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/Button";
import { FormField, PanelCard, inputClass } from "@/components/admin/AdminUI";
import { notificationSettings } from "@/lib/admin-mock-data";
import { demoCampaign } from "@/lib/mock-campaign-data";
import {
  computeDaysLeft,
  defaultCampaignSettings,
  fetchCampaignSettings,
  formatRemaining,
  formatTrDate,
  notifyCampaignSettingsChanged,
  saveCampaignSettings,
  type CampaignSettings,
} from "@/lib/campaign-settings";
import { cn } from "@/lib/utils";

const CURRENCY_SYMBOL: Record<CampaignSettings["goalCurrency"], string> = {
  USD: "$",
  EUR: "€",
  TRY: "₺",
};

export default function SettingsPage() {
  const [notif, setNotif] = useState(notificationSettings);

  // Şifre — auth sistemi gelene kadar localStorage / mock akışta.
  const [oldPwd, setOldPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [pwdMsg, setPwdMsg] = useState<{ kind: "ok" | "err"; text: string } | null>(null);

  // Kampanya formu durumu
  const [campaignForm, setCampaignForm] = useState<CampaignSettings>(
    defaultCampaignSettings,
  );
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [formErr, setFormErr] = useState<string | null>(null);

  // Ayarları proxy üzerinden çek; mount'ta ve save sonrası kullanılır.
  const loadAyarlar = async () => {
    const result = await fetchCampaignSettings();
    setCampaignForm(result.settings);
    setLoadError(result.ok ? null : result.error ?? "API'ye bağlanılamadı");
    return result;
  };

  // İlk yükleme.
  useEffect(() => {
    let mounted = true;
    (async () => {
      const result = await fetchCampaignSettings();
      if (!mounted) return;
      setCampaignForm(result.settings);
      setLoadError(result.ok ? null : result.error ?? "API'ye bağlanılamadı");
      setLoading(false);
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const updateField = <K extends keyof CampaignSettings>(
    key: K,
    value: CampaignSettings[K],
  ) => {
    setCampaignForm((prev) => ({ ...prev, [key]: value }));
    setFormErr(null);
    setSavedAt(null);
    setSaveError(null);
  };

  const remainingText = useMemo(
    () => formatRemaining(campaignForm.endDate),
    [campaignForm.endDate],
  );
  const remainingExpired = useMemo(
    () => computeDaysLeft(campaignForm.endDate) < 0,
    [campaignForm.endDate],
  );

  const toggleNotif = (id: string) => {
    setNotif((prev) =>
      prev.map((n) => (n.id === id ? { ...n, enabled: !n.enabled } : n)),
    );
  };

  const validateCampaignForm = (): string | null => {
    if (!campaignForm.title.trim()) return "Kampanya adı boş olamaz.";
    if (!Number.isFinite(campaignForm.goalAmount) || campaignForm.goalAmount <= 0) {
      return "Hedef tutar 0'dan büyük olmalı.";
    }
    if (!campaignForm.startDate) return "Başlangıç tarihi gerekli.";
    if (!campaignForm.endDate) return "Bitiş tarihi gerekli.";
    if (campaignForm.endDate < campaignForm.startDate) {
      return "Bitiş tarihi başlangıçtan önce olamaz.";
    }
    if (!campaignForm.approvalDate) return "Onay tarihi gerekli.";
    if (!campaignForm.decisionNumber.trim()) return "Onay numarası boş olamaz.";
    if (!campaignForm.authority.trim()) return "Onay veren kurum boş olamaz.";
    return null;
  };

  const handleSave = async () => {
    setPwdMsg(null);
    setSaveError(null);

    const campaignErr = validateCampaignForm();
    if (campaignErr) {
      setFormErr(campaignErr);
      return;
    }

    // Şifre değişikliği — mock akış (auth sistemi gelene kadar).
    if (oldPwd || newPwd || confirmPwd) {
      if (oldPwd !== "demo2026") {
        setPwdMsg({ kind: "err", text: "Eski şifre hatalı." });
        return;
      }
      if (newPwd.length < 6) {
        setPwdMsg({ kind: "err", text: "Yeni şifre en az 6 karakter olmalı." });
        return;
      }
      if (newPwd !== confirmPwd) {
        setPwdMsg({ kind: "err", text: "Şifre onayı eşleşmiyor." });
        return;
      }
      setPwdMsg({ kind: "ok", text: "Şifre başarıyla güncellendi (demo)." });
      setOldPwd("");
      setNewPwd("");
      setConfirmPwd("");
    }

    setSaving(true);
    const result = await saveCampaignSettings(campaignForm);

    if (!result.ok) {
      setSaving(false);
      setSaveError(result.error ?? "Kayıt sırasında hata oluştu");
      return;
    }

    // Server'dan dönen güncel kayıt — anlık state güncellemesi
    setCampaignForm(result.settings);

    // Eventual consistency için GET ile yeniden çek (DB'den taze veri)
    const reloaded = await loadAyarlar();
    const finalSettings = reloaded.ok ? reloaded.settings : result.settings;

    notifyCampaignSettingsChanged(finalSettings);
    setSaving(false);

    const now = new Date().toLocaleTimeString("tr-TR", {
      hour: "2-digit",
      minute: "2-digit",
    });
    setSavedAt(now);
  };

  return (
    <AdminLayout
      title="Ayarlar"
      subtitle="Kampanya bilgileri, hesap ayarları ve bildirim tercihleri"
      actions={
        <Button
          variant="primary"
          size="sm"
          onClick={handleSave}
          disabled={loading || saving}
        >
          <Save className="w-4 h-4" />
          {saving ? "Kaydediliyor…" : "Değişiklikleri Kaydet"}
        </Button>
      }
    >
      {savedAt && (
        <div className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-body-sm text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          Ayarlar kaydedildi — {savedAt}
        </div>
      )}

      {loadError && !loading && (
        <div className="mb-4 rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-body-sm text-amber-900 flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
          <div className="min-w-0">
            <p className="font-semibold">
              Ayarlar yüklenemedi — varsayılan değerler gösteriliyor.
            </p>
            <p className="text-label-sm text-amber-800 mt-0.5 break-all">
              {loadError}. Form kaydedildiğinde yeni değerler API'ye yazılır.
            </p>
          </div>
        </div>
      )}

      {saveError && (
        <div className="mb-4 rounded-lg border border-rose-300 bg-rose-50 px-4 py-3 text-body-sm text-rose-900 flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
          <div className="min-w-0">
            <p className="font-semibold">Kayıt başarısız</p>
            <p className="text-label-sm text-rose-800 mt-0.5 break-all">
              {saveError}
            </p>
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-4">
        {/* Campaign info — editable */}
        <PanelCard
          title="Kampanya Bilgileri"
          description="Kampanyanın temel bilgilerini buradan düzenleyin"
          className="lg:col-span-2"
        >
          {loading ? (
            <CampaignFormSkeleton />
          ) : (
            <div className="px-5 py-4 space-y-4">
              {formErr && (
                <div className="rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-body-sm text-red-700">
                  {formErr}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField label="Kampanya Adı" required>
                  <div className="relative">
                    <Type className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant pointer-events-none" />
                    <input
                      className={`${inputClass} pl-9`}
                      value={campaignForm.title}
                      onChange={(e) => updateField("title", e.target.value)}
                      placeholder="Örn: Minik Defne'ye Umut Ol"
                    />
                  </div>
                </FormField>

                <FormField label="Hedef Tutar" required>
                  <div className="flex gap-2">
                    <div className="relative flex-1 min-w-0">
                      <Target className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant pointer-events-none" />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-label-sm font-semibold text-on-surface-variant pointer-events-none">
                        {CURRENCY_SYMBOL[campaignForm.goalCurrency]}
                      </span>
                      <input
                        type="number"
                        min={0}
                        step={1}
                        className={cn(inputClass, "pl-9 pr-8")}
                        value={
                          Number.isFinite(campaignForm.goalAmount)
                            ? campaignForm.goalAmount
                            : ""
                        }
                        onChange={(e) =>
                          updateField("goalAmount", Number(e.target.value) || 0)
                        }
                        placeholder="2100000"
                      />
                    </div>
                    <select
                      className={cn(inputClass, "w-24 shrink-0")}
                      value={campaignForm.goalCurrency}
                      onChange={(e) =>
                        updateField(
                          "goalCurrency",
                          e.target.value as CampaignSettings["goalCurrency"],
                        )
                      }
                    >
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                      <option value="TRY">TRY</option>
                    </select>
                  </div>
                </FormField>

                <FormField
                  label="Başlangıç Tarihi"
                  required
                  hint={
                    campaignForm.startDate
                      ? formatTrDate(campaignForm.startDate)
                      : undefined
                  }
                >
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant pointer-events-none" />
                    <input
                      type="date"
                      className={`${inputClass} pl-9`}
                      value={campaignForm.startDate}
                      onChange={(e) => updateField("startDate", e.target.value)}
                    />
                  </div>
                </FormField>

                <FormField
                  label="Bitiş Tarihi"
                  required
                  hint={
                    campaignForm.endDate
                      ? formatTrDate(campaignForm.endDate)
                      : undefined
                  }
                >
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant pointer-events-none" />
                    <input
                      type="date"
                      className={`${inputClass} pl-9`}
                      value={campaignForm.endDate}
                      min={campaignForm.startDate || undefined}
                      onChange={(e) => updateField("endDate", e.target.value)}
                    />
                  </div>
                </FormField>

                <FormField
                  label="Kalan Süre"
                  hint="Bitiş tarihinden otomatik hesaplanır"
                >
                  <div
                    className={cn(
                      "h-10 px-3 rounded-lg border flex items-center text-body-sm font-semibold tabular-nums",
                      remainingExpired
                        ? "border-rose-300 bg-rose-50 text-rose-700"
                        : "border-outline-variant bg-surface-container-low text-on-surface",
                    )}
                    aria-live="polite"
                  >
                    {remainingText}
                  </div>
                </FormField>

                <FormField
                  label="Onay Tarihi"
                  required
                  hint={
                    campaignForm.approvalDate
                      ? formatTrDate(campaignForm.approvalDate)
                      : undefined
                  }
                >
                  <div className="relative">
                    <FileCheck className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant pointer-events-none" />
                    <input
                      type="date"
                      className={`${inputClass} pl-9`}
                      value={campaignForm.approvalDate}
                      onChange={(e) =>
                        updateField("approvalDate", e.target.value)
                      }
                    />
                  </div>
                </FormField>

                <FormField
                  label="Valilik Onay Numarası"
                  required
                  hint="Format: 2026/4521"
                >
                  <div className="relative">
                    <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant pointer-events-none" />
                    <input
                      className={`${inputClass} pl-9`}
                      value={campaignForm.decisionNumber}
                      onChange={(e) =>
                        updateField("decisionNumber", e.target.value)
                      }
                      placeholder="2026/4521"
                    />
                  </div>
                </FormField>

                <FormField label="Onay Veren Kurum" required>
                  <input
                    className={inputClass}
                    value={campaignForm.authority}
                    onChange={(e) => updateField("authority", e.target.value)}
                    placeholder="İstanbul Valiliği"
                  />
                </FormField>
              </div>
            </div>
          )}
        </PanelCard>

        {/* Bank accounts */}
        <PanelCard
          title="Banka Hesapları"
          description="IBAN listesi — değişiklik için destek talep edin"
        >
          <div className="divide-y divide-outline-variant">
            {demoCampaign.bankAccounts.map((b) => (
              <div key={b.iban} className="px-5 py-3 flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-primary-fixed text-primary flex items-center justify-center shrink-0">
                  <Landmark className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-label-md font-semibold text-on-surface">
                      {b.bank} • {b.currency}
                    </p>
                    <span className="text-label-sm text-on-surface-variant">
                      {b.swift}
                    </span>
                  </div>
                  <p className="text-label-sm text-on-surface-variant">
                    {b.accountName}
                  </p>
                  <p className="text-body-sm font-mono text-on-surface mt-0.5 break-all">
                    {b.iban}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </PanelCard>

        {/* Notifications */}
        <PanelCard
          title="Bildirim Ayarları"
          description="Hangi olaylar için bildirim alacağınızı seçin"
        >
          <ul className="divide-y divide-outline-variant">
            {notif.map((n) => (
              <li
                key={n.id}
                className="px-5 py-3 flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-secondary-container/40 text-secondary flex items-center justify-center shrink-0">
                    <Bell className="w-4 h-4" />
                  </div>
                  <span className="text-body-sm text-on-surface">{n.label}</span>
                </div>
                <button
                  onClick={() => toggleNotif(n.id)}
                  role="switch"
                  aria-checked={n.enabled}
                  className={cn(
                    "relative w-11 h-6 rounded-full transition-colors shrink-0",
                    n.enabled ? "bg-secondary" : "bg-surface-container-high",
                  )}
                >
                  <span
                    className={cn(
                      "absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform",
                      n.enabled && "translate-x-5",
                    )}
                  />
                </button>
              </li>
            ))}
          </ul>
        </PanelCard>

        {/* Password change — auth sistemi gelene kadar mock */}
        <PanelCard
          title="Şifre Değiştir"
          description="Hesap güvenliği için şifrenizi düzenli aralıklarla yenileyin"
          className="lg:col-span-2"
        >
          <div className="px-5 py-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField label="Eski Şifre">
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant pointer-events-none" />
                <input
                  type={showOld ? "text" : "password"}
                  className={`${inputClass} pl-9 pr-9`}
                  value={oldPwd}
                  onChange={(e) => setOldPwd(e.target.value)}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowOld((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface"
                  aria-label="Göster/gizle"
                >
                  {showOld ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </FormField>
            <FormField label="Yeni Şifre">
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant pointer-events-none" />
                <input
                  type={showNew ? "text" : "password"}
                  className={`${inputClass} pl-9 pr-9`}
                  value={newPwd}
                  onChange={(e) => setNewPwd(e.target.value)}
                  placeholder="En az 6 karakter"
                />
                <button
                  type="button"
                  onClick={() => setShowNew((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface"
                  aria-label="Göster/gizle"
                >
                  {showNew ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </FormField>
            <FormField label="Yeni Şifre (Tekrar)">
              <input
                type="password"
                className={inputClass}
                value={confirmPwd}
                onChange={(e) => setConfirmPwd(e.target.value)}
                placeholder="Tekrar girin"
              />
            </FormField>
          </div>
          {pwdMsg && (
            <div className="px-5 pb-4">
              <div
                className={cn(
                  "rounded-lg px-3 py-2 text-body-sm border",
                  pwdMsg.kind === "ok"
                    ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                    : "bg-error-container text-on-error-container border-error/20",
                )}
              >
                {pwdMsg.text}
              </div>
            </div>
          )}
        </PanelCard>
      </div>
    </AdminLayout>
  );
}

function CampaignFormSkeleton() {
  return (
    <div className="px-5 py-4 grid grid-cols-1 md:grid-cols-2 gap-4 animate-pulse">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i}>
          <div className="h-3 w-28 rounded bg-surface-container mb-2" />
          <div className="h-10 w-full rounded-lg bg-surface-container" />
        </div>
      ))}
    </div>
  );
}
