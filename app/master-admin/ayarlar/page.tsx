"use client";

import { useState } from "react";
import { Bell, Database, Eye, EyeOff, Lock, Sparkles } from "lucide-react";
import { MasterAdminLayout } from "@/components/master-admin/MasterAdminLayout";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

type NotificationKey =
  | "donation"
  | "limit-warning"
  | "system-error"
  | "backup"
  | "payment";

const NOTIFICATIONS: Array<{
  key: NotificationKey;
  label: string;
  description: string;
  defaultOn: boolean;
}> = [
  {
    key: "donation",
    label: "Yeni bağış geldiğinde",
    description: "Tüm kampanyalardan büyük bağışlar (≥₺500) için uyarı",
    defaultOn: true,
  },
  {
    key: "limit-warning",
    label: "Kullanım limiti %80'i aştığında",
    description: "WhatsApp ve IVR limit yaklaşması",
    defaultOn: true,
  },
  {
    key: "system-error",
    label: "Sistem hatası oluştuğunda",
    description: "Kritik bileşenlerde hata (sunucu, DB, otomasyon)",
    defaultOn: true,
  },
  {
    key: "backup",
    label: "Otomatik yedek tamamlandığında",
    description: "Günlük yedekleme bildirimi",
    defaultOn: false,
  },
  {
    key: "payment",
    label: "Ödeme alındığında",
    description: "Müşteri ödeme bildirimleri",
    defaultOn: true,
  },
];

export default function MasterAdminSettingsPage() {
  const [currentPwd, setCurrentPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [pwdNotice, setPwdNotice] = useState<string | null>(null);
  const [pwdError, setPwdError] = useState<string | null>(null);

  const [notifs, setNotifs] = useState<Record<NotificationKey, boolean>>(
    () =>
      NOTIFICATIONS.reduce(
        (acc, n) => ({ ...acc, [n.key]: n.defaultOn }),
        {} as Record<NotificationKey, boolean>,
      ),
  );

  const submitPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPwdError(null);
    setPwdNotice(null);
    if (newPwd.length < 6) {
      setPwdError("Yeni şifre en az 6 karakter olmalı.");
      return;
    }
    if (newPwd !== confirmPwd) {
      setPwdError("Şifre tekrarı eşleşmiyor.");
      return;
    }
    setPwdNotice(
      "Şifre değiştirme talebi alındı. Backend bağlandığında uygulanacak.",
    );
    setCurrentPwd("");
    setNewPwd("");
    setConfirmPwd("");
  };

  return (
    <MasterAdminLayout
      title="Ayarlar"
      subtitle="Hesap, bildirim ve sistem geneli ayarlar"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section className="rounded-2xl border border-outline-variant bg-surface-container-lowest overflow-hidden">
          <div className="px-5 py-4 border-b border-outline-variant flex items-center gap-2">
            <Lock className="w-5 h-5 text-secondary" />
            <div>
              <h2 className="text-h3 font-semibold text-on-surface">
                Şifre Değiştir
              </h2>
              <p className="text-body-sm text-on-surface-variant">
                Master admin hesabının şifresini güncelle
              </p>
            </div>
          </div>

          <form onSubmit={submitPassword} className="px-5 py-5 space-y-4">
            <PwdField
              id="current"
              label="Mevcut Şifre"
              value={currentPwd}
              onChange={setCurrentPwd}
              show={showPwd}
              onToggle={() => setShowPwd((v) => !v)}
              required
            />
            <PwdField
              id="new"
              label="Yeni Şifre"
              value={newPwd}
              onChange={setNewPwd}
              show={showPwd}
              onToggle={() => setShowPwd((v) => !v)}
              required
            />
            <PwdField
              id="confirm"
              label="Yeni Şifre (tekrar)"
              value={confirmPwd}
              onChange={setConfirmPwd}
              show={showPwd}
              onToggle={() => setShowPwd((v) => !v)}
              required
            />

            {pwdError && (
              <div className="rounded-lg bg-error-container px-3 py-2.5 text-body-sm text-on-error-container border border-error/20">
                {pwdError}
              </div>
            )}
            {pwdNotice && (
              <div className="rounded-lg bg-emerald-50 border border-emerald-200 px-3 py-2.5 text-body-sm text-emerald-800">
                {pwdNotice}
              </div>
            )}

            <Button type="submit" variant="primary" size="md">
              Şifreyi Değiştir
            </Button>
          </form>
        </section>

        <section className="rounded-2xl border border-outline-variant bg-surface-container-lowest overflow-hidden">
          <div className="px-5 py-4 border-b border-outline-variant flex items-center gap-2">
            <Bell className="w-5 h-5 text-secondary" />
            <div>
              <h2 className="text-h3 font-semibold text-on-surface">
                Bildirim Ayarları
              </h2>
              <p className="text-body-sm text-on-surface-variant">
                Hangi olaylarda uyarı almak istediğini seç
              </p>
            </div>
          </div>

          <ul className="divide-y divide-outline-variant">
            {NOTIFICATIONS.map((n) => (
              <li
                key={n.key}
                className="px-5 py-3.5 flex items-center justify-between gap-3"
              >
                <div className="min-w-0">
                  <p className="text-body-md font-medium text-on-surface">
                    {n.label}
                  </p>
                  <p className="text-label-sm text-on-surface-variant">
                    {n.description}
                  </p>
                </div>
                <Toggle
                  checked={notifs[n.key]}
                  onChange={() =>
                    setNotifs((prev) => ({ ...prev, [n.key]: !prev[n.key] }))
                  }
                  label={`${n.label} bildirimi`}
                />
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className="mt-6 rounded-2xl border border-outline-variant bg-surface-container-lowest overflow-hidden">
        <div className="px-5 py-4 border-b border-outline-variant flex items-center gap-2">
          <Database className="w-5 h-5 text-secondary" />
          <div>
            <h2 className="text-h3 font-semibold text-on-surface">
              Sistem Geneli Ayarlar
            </h2>
            <p className="text-body-sm text-on-surface-variant">
              Tüm kampanyalara uygulanacak varsayılan ayarlar
            </p>
          </div>
        </div>
        <ul className="divide-y divide-outline-variant">
          {[
            {
              label: "Otomatik yedekleme saati",
              hint: "Şu an: her gün 03:00 (sunucu saati)",
            },
            {
              label: "Varsayılan onboarding listesi",
              hint: "Yeni kampanyalar için kontrol listesi şablonu",
            },
            {
              label: "Markalama / Logo",
              hint: "Müşteri panellerinde gösterilen logo ve renk",
            },
          ].map((s) => (
            <li
              key={s.label}
              className="px-5 py-3.5 flex items-center justify-between gap-3"
            >
              <div className="min-w-0">
                <p className="text-body-md font-medium text-on-surface">
                  {s.label}
                </p>
                <p className="text-label-sm text-on-surface-variant">
                  {s.hint}
                </p>
              </div>
              <ComingSoonChip />
            </li>
          ))}
        </ul>
      </section>
    </MasterAdminLayout>
  );
}

function PwdField({
  id,
  label,
  value,
  onChange,
  show,
  onToggle,
  required,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  show: boolean;
  onToggle: () => void;
  required?: boolean;
}) {
  return (
    <div>
      <label
        htmlFor={`pwd-${id}`}
        className="block text-label-md text-on-surface mb-1.5"
      >
        {label}
        {required && <span className="text-error ml-0.5">*</span>}
      </label>
      <div className="relative">
        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant pointer-events-none" />
        <input
          id={`pwd-${id}`}
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          autoComplete="off"
          className="w-full pl-10 pr-10 py-2.5 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary"
        />
        <button
          type="button"
          onClick={onToggle}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface"
          aria-label={show ? "Şifreleri gizle" : "Şifreleri göster"}
        >
          {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}

function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={onChange}
      className={cn(
        "relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2",
        checked ? "bg-secondary" : "bg-gray-300",
      )}
    >
      <span
        className={cn(
          "inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform",
          checked ? "translate-x-5" : "translate-x-0.5",
        )}
      />
    </button>
  );
}

function ComingSoonChip() {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md border border-violet-200 bg-violet-50 text-violet-700 text-label-sm font-medium shrink-0">
      <Sparkles className="w-3 h-3" />
      Yakında
    </span>
  );
}
