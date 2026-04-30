"use client";

import { useState } from "react";
import { Bell, Eye, EyeOff, Landmark, Lock, Save, Sparkles } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/Button";
import { FormField, PanelCard, inputClass } from "@/components/admin/AdminUI";
import { notificationSettings } from "@/lib/admin-mock-data";
import { demoCampaign } from "@/lib/mock-campaign-data";
import { cn } from "@/lib/utils";

export default function SettingsPage() {
  const [notif, setNotif] = useState(notificationSettings);
  const [oldPwd, setOldPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [pwdMsg, setPwdMsg] = useState<{ kind: "ok" | "err"; text: string } | null>(null);
  const [savedAt, setSavedAt] = useState<string | null>(null);

  const toggleNotif = (id: string) => {
    setNotif((prev) =>
      prev.map((n) => (n.id === id ? { ...n, enabled: !n.enabled } : n)),
    );
  };

  const handleSave = () => {
    setPwdMsg(null);
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
    const now = new Date().toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" });
    setSavedAt(now);
  };

  return (
    <AdminLayout
      title="Ayarlar"
      subtitle="Kampanya bilgileri, hesap ayarları ve bildirim tercihleri"
      actions={
        <Button variant="primary" size="sm" onClick={handleSave}>
          <Save className="w-4 h-4" />
          Değişiklikleri Kaydet
        </Button>
      }
    >
      {savedAt && (
        <div className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-body-sm text-emerald-800">
          Değişiklikler kaydedildi — {savedAt}
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-4">
        {/* Campaign info */}
        <PanelCard
          title="Kampanya Bilgileri"
          description="Bu alan sadece okunabilir — değişiklik için destek talep edin"
        >
          <div className="px-5 py-4 space-y-3 text-body-sm">
            <ReadRow label="Kampanya Adı" value={demoCampaign.title} />
            <ReadRow label="Hedef Tutar" value={`$${demoCampaign.goalUsd.toLocaleString("en-US")} USD`} />
            <ReadRow label="Toplam Süre" value={`${demoCampaign.daysLeft} gün kaldı`} />
            <ReadRow label="Başlangıç" value={demoCampaign.createdAt} />
            <ReadRow
              label="Onay"
              value={`${demoCampaign.provinceApproval.authority} — ${demoCampaign.provinceApproval.decisionNumber}`}
            />
            <ReadRow label="Onay Tarihi" value={demoCampaign.provinceApproval.approvalDate} />
          </div>
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
                    <span className="text-label-sm text-on-surface-variant">{b.swift}</span>
                  </div>
                  <p className="text-label-sm text-on-surface-variant">{b.accountName}</p>
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
          className="lg:col-span-2"
        >
          <ul className="divide-y divide-outline-variant">
            {notif.map((n) => (
              <li key={n.id} className="px-5 py-3 flex items-center justify-between gap-3">
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

        {/* Password change */}
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
                  {showOld ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
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
                  {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
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
          <div className="px-5 pb-4 flex items-start gap-2 text-label-sm text-on-surface-variant">
            <Sparkles className="w-3.5 h-3.5 mt-0.5 shrink-0" />
            <span>
              Demo modunda şifre değişikliği kalıcı değildir. Eski şifre olarak{" "}
              <span className="font-semibold text-on-surface">demo2026</span> kullanın.
            </span>
          </div>
        </PanelCard>
      </div>
    </AdminLayout>
  );
}

function ReadRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 py-1.5 border-b border-outline-variant last:border-0">
      <span className="text-on-surface-variant">{label}</span>
      <span className="font-medium text-on-surface text-right">{value}</span>
    </div>
  );
}
