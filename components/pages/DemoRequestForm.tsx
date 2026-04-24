"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { FormField } from "@/components/pages/FormField";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/lib/site-config";

type Step = 1 | 2;

type FormData = {
  fullName: string;
  email: string;
  phone: string;
  organization: string;
  title: string;
  campaignType: string;
  fundraisingGoal: string;
  approvalStatus: string;
  packageInterest: string;
  startDate: string;
  notes: string;
  kvkk: boolean;
};

type Errors = Partial<Record<keyof FormData, string>>;

const CAMPAIGN_TYPES = [
  { value: "sma", label: "SMA Tedavisi" },
  { value: "dmd", label: "DMD Tedavisi" },
  { value: "saglik", label: "Diğer Sağlık Kampanyası" },
  { value: "afet", label: "Afet Yardımı" },
  { value: "egitim", label: "Eğitim Bağışı" },
  { value: "hayir", label: "Dini / Hayır Kampanyası" },
  { value: "diger", label: "Diğer" },
];

const FUNDRAISING_GOALS = [
  { value: "500k-", label: "500.000 TL altı" },
  { value: "500k-5m", label: "500.000 - 5 Milyon TL" },
  { value: "5m-50m", label: "5 - 50 Milyon TL" },
  { value: "50m+", label: "50 Milyon TL üstü" },
  { value: "belirsiz", label: "Henüz belirsiz" },
];

const APPROVAL_OPTIONS: Array<{ value: string; label: string }> = [
  { value: "var", label: "Var (tamamlandı)" },
  { value: "basvuru", label: "Başvuru aşamasında" },
  { value: "yok", label: "Henüz başvurmadık" },
];

const PACKAGE_OPTIONS = [
  { value: "temel", label: "Temel (9.900 TL/ay)" },
  { value: "standart", label: "Standart (17.900 TL/ay)" },
  { value: "premium", label: "Premium (29.900 TL/ay)" },
  { value: "ozel", label: "Özel Paket" },
  { value: "bilmiyorum", label: "Hangisi uygun bilmiyorum" },
];

const START_DATE_OPTIONS = [
  { value: "hemen", label: "Hemen (bu hafta)" },
  { value: "1-2hafta", label: "1-2 hafta içinde" },
  { value: "1ay", label: "1 ay içinde" },
  { value: "3ay", label: "3 ay içinde" },
  { value: "bilgi", label: "Sadece bilgi almak istiyorum" },
];

const initialData: FormData = {
  fullName: "",
  email: "",
  phone: "",
  organization: "",
  title: "",
  campaignType: "",
  fundraisingGoal: "",
  approvalStatus: "",
  packageInterest: "",
  startDate: "",
  notes: "",
  kvkk: false,
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function DemoRequestForm() {
  const [step, setStep] = useState<Step>(1);
  const [data, setData] = useState<FormData>(initialData);
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const update = <K extends keyof FormData>(key: K, value: FormData[K]) => {
    setData((d) => ({ ...d, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const validateStep1 = (): boolean => {
    const e: Errors = {};
    if (!data.fullName.trim()) e.fullName = "Ad soyad zorunludur.";
    if (!data.email.trim()) e.email = "E-posta zorunludur.";
    else if (!EMAIL_RE.test(data.email))
      e.email = "Geçerli bir e-posta adresi girin.";
    if (!data.phone.trim()) e.phone = "Telefon zorunludur.";
    if (!data.organization.trim()) e.organization = "Kuruluş adı zorunludur.";
    if (!data.title.trim()) e.title = "Unvan zorunludur.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateStep2 = (): boolean => {
    const e: Errors = {};
    if (!data.campaignType) e.campaignType = "Kampanya türü seçin.";
    if (!data.fundraisingGoal) e.fundraisingGoal = "Bağış hedefi seçin.";
    if (!data.approvalStatus)
      e.approvalStatus = "Valilik onay durumu seçin.";
    if (!data.startDate) e.startDate = "Başlangıç zamanı seçin.";
    if (!data.kvkk) e.kvkk = "KVKK onayı zorunludur.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => {
    if (validateStep1()) setStep(2);
  };

  const back = () => setStep(1);

  const handleSubmit = async (evt: React.FormEvent) => {
    evt.preventDefault();
    setSubmitError("");
    if (!validateStep2()) return;

    setLoading(true);
    try {
      // TODO: n8n webhook to send to CRM / email
      console.log("Demo request:", data);
      await new Promise((r) => setTimeout(r, 2000));
      setSuccess(true);
    } catch {
      setSubmitError(
        "Talebiniz gönderilirken bir sorun oluştu. Lütfen tekrar deneyin.",
      );
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
        className="rounded-2xl border border-outline-variant bg-white p-8 md:p-10 text-center"
      >
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary/10 text-secondary mb-5">
          <CheckCircle2 size={32} strokeWidth={2} />
        </div>
        <h2 className="text-[26px] md:text-[30px] font-bold text-primary-container tracking-[-0.02em]">
          Demo Talebiniz Alındı!
        </h2>
        <p className="mt-3 text-[15px] leading-[24px] text-on-surface-variant max-w-md mx-auto">
          Size 1 iş günü içinde dönüş yapacağız ve size uygun bir zamanda demo
          ayarlayacağız.
        </p>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
          <div className="rounded-xl border border-outline-variant bg-surface-container-low p-5">
            <div className="text-[12px] font-bold text-secondary uppercase tracking-widest mb-1.5">
              Sonraki Adım
            </div>
            <p className="text-[14px] leading-[20px] text-on-surface-variant">
              E-posta ve WhatsApp üzerinden dönüş yapacağız.
            </p>
          </div>
          <div className="rounded-xl border border-outline-variant bg-surface-container-low p-5">
            <div className="text-[12px] font-bold text-secondary uppercase tracking-widest mb-1.5">
              Hazırlık
            </div>
            <p className="text-[14px] leading-[20px] text-on-surface-variant">
              Kampanya bilgilerinizi hazırlayın.
            </p>
          </div>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/">
            <Button variant="outline-navy" size="lg" className="w-full sm:w-auto">
              Ana Sayfaya Dön
            </Button>
          </Link>
          <Link href={siteConfig.urls.faq}>
            <Button variant="primary" size="lg" className="w-full sm:w-auto">
              SSS&apos;i İncele
            </Button>
          </Link>
        </div>
      </motion.div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="rounded-2xl border border-outline-variant bg-white p-6 md:p-8"
    >
      {/* Progress */}
      <StepIndicator step={step} />

      <AnimatePresence mode="wait">
        {step === 1 ? (
          <motion.div
            key="step-1"
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="mt-8"
          >
            <h3 className="text-[18px] font-semibold text-primary-container tracking-[-0.01em] mb-1">
              Kişisel Bilgiler
            </h3>
            <p className="text-[13px] text-on-surface-variant mb-6">
              Size dönüş yapabilmemiz için iletişim bilgilerinizi paylaşın.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <FormField
                label="Ad Soyad"
                name="fullName"
                required
                autoComplete="name"
                placeholder="Adınız Soyadınız"
                value={data.fullName}
                onChange={(v) => update("fullName", v)}
                error={errors.fullName}
              />
              <FormField
                label="E-posta"
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="ornek@email.com"
                value={data.email}
                onChange={(v) => update("email", v)}
                error={errors.email}
              />
              <FormField
                label="Telefon / WhatsApp"
                name="phone"
                type="tel"
                required
                autoComplete="tel"
                placeholder="0 5XX XXX XX XX"
                value={data.phone}
                onChange={(v) => update("phone", v)}
                error={errors.phone}
              />
              <FormField
                label="Kuruluş Adı"
                name="organization"
                required
                placeholder="Dernek / Vakıf / Komisyon"
                value={data.organization}
                onChange={(v) => update("organization", v)}
                error={errors.organization}
              />
              <div className="md:col-span-2">
                <FormField
                  label="Unvan / Pozisyon"
                  name="title"
                  required
                  placeholder="Örn: Yönetim Kurulu Başkanı"
                  value={data.title}
                  onChange={(v) => update("title", v)}
                  error={errors.title}
                />
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <Button
                type="button"
                variant="primary"
                size="lg"
                onClick={next}
                className="group/btn"
              >
                İleri
                <ArrowRight
                  size={16}
                  className="transition-transform duration-250 group-hover/btn:translate-x-1"
                />
              </Button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="step-2"
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="mt-8"
          >
            <h3 className="text-[18px] font-semibold text-primary-container tracking-[-0.01em] mb-1">
              Kampanya Detayları
            </h3>
            <p className="text-[13px] text-on-surface-variant mb-6">
              Size özel bir demo için kampanyanız hakkında birkaç soru.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <FormField
                label="Kampanya Türü"
                name="campaignType"
                type="select"
                required
                placeholder="Seçin"
                options={CAMPAIGN_TYPES}
                value={data.campaignType}
                onChange={(v) => update("campaignType", v)}
                error={errors.campaignType}
              />
              <FormField
                label="Tahmini Bağış Hedefi"
                name="fundraisingGoal"
                type="select"
                required
                placeholder="Seçin"
                options={FUNDRAISING_GOALS}
                value={data.fundraisingGoal}
                onChange={(v) => update("fundraisingGoal", v)}
                error={errors.fundraisingGoal}
              />

              <div className="md:col-span-2 flex flex-col gap-1.5">
                <span className="text-[14px] font-semibold text-on-surface">
                  Valilik Onayı Durumu
                  <span className="text-error ml-1">*</span>
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-1">
                  {APPROVAL_OPTIONS.map((opt) => {
                    const checked = data.approvalStatus === opt.value;
                    return (
                      <label
                        key={opt.value}
                        className={cn(
                          "flex items-center gap-3 rounded-lg border px-4 py-3 cursor-pointer transition-all",
                          checked
                            ? "bg-secondary/10 border-secondary"
                            : "bg-white border-outline-variant hover:border-primary-container",
                        )}
                      >
                        <input
                          type="radio"
                          name="approvalStatus"
                          value={opt.value}
                          checked={checked}
                          onChange={(e) =>
                            update("approvalStatus", e.target.value)
                          }
                          className="sr-only"
                        />
                        <span
                          className={cn(
                            "h-4 w-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors",
                            checked
                              ? "border-secondary"
                              : "border-outline",
                          )}
                          aria-hidden
                        >
                          {checked && (
                            <span className="h-2 w-2 rounded-full bg-secondary" />
                          )}
                        </span>
                        <span className="text-[14px] font-medium text-on-surface">
                          {opt.label}
                        </span>
                      </label>
                    );
                  })}
                </div>
                {errors.approvalStatus && (
                  <p className="text-[12px] font-medium text-error" role="alert">
                    {errors.approvalStatus}
                  </p>
                )}
              </div>

              <FormField
                label="İlgilendiğiniz Paket"
                name="packageInterest"
                type="select"
                placeholder="Opsiyonel"
                options={PACKAGE_OPTIONS}
                value={data.packageInterest}
                onChange={(v) => update("packageInterest", v)}
                error={errors.packageInterest}
              />
              <FormField
                label="Ne Zaman Başlamak İstiyorsunuz?"
                name="startDate"
                type="select"
                required
                placeholder="Seçin"
                options={START_DATE_OPTIONS}
                value={data.startDate}
                onChange={(v) => update("startDate", v)}
                error={errors.startDate}
              />

              <div className="md:col-span-2">
                <FormField
                  label="Ek Notlar"
                  name="notes"
                  type="textarea"
                  placeholder="Özel talepleriniz veya eklemek istedikleriniz..."
                  maxLength={500}
                  showCounter
                  rows={4}
                  value={data.notes}
                  onChange={(v) => update("notes", v)}
                  error={errors.notes}
                />
              </div>
            </div>

            <label
              className={`mt-6 flex items-start gap-3 text-[13px] leading-[20px] cursor-pointer ${
                errors.kvkk ? "text-error" : "text-on-surface-variant"
              }`}
            >
              <input
                type="checkbox"
                checked={data.kvkk}
                onChange={(e) => update("kvkk", e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-outline-variant accent-secondary cursor-pointer"
                aria-invalid={Boolean(errors.kvkk)}
              />
              <span>
                Kişisel verilerimin KVKK kapsamında işlenmesini kabul ediyorum.{" "}
                <Link
                  href={siteConfig.urls.kvkk}
                  className="text-secondary underline underline-offset-2 hover:text-on-secondary-container"
                >
                  Aydınlatma metni
                </Link>
                .
              </span>
            </label>

            {submitError && (
              <p className="mt-4 text-[13px] text-error" role="alert">
                {submitError}
              </p>
            )}

            <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:justify-between">
              <Button
                type="button"
                variant="outline-navy"
                size="lg"
                onClick={back}
                disabled={loading}
                className="order-2 sm:order-1"
              >
                <ArrowLeft size={16} />
                Geri
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="lg"
                disabled={loading}
                className="order-1 sm:order-2 group/btn"
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Gönderiliyor...
                  </>
                ) : (
                  <>
                    Demo Talep Et
                    <ArrowRight
                      size={16}
                      className="transition-transform duration-250 group-hover/btn:translate-x-1"
                    />
                  </>
                )}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </form>
  );
}

function StepIndicator({ step }: { step: Step }) {
  const steps = [
    { n: 1, label: "Kişisel Bilgiler" },
    { n: 2, label: "Kampanya Detayları" },
  ];

  return (
    <div className="flex items-center gap-3">
      {steps.map((s, i) => {
        const isDone = step > s.n;
        const isActive = step === s.n;
        return (
          <div key={s.n} className="flex items-center gap-3 flex-1">
            <div
              className={cn(
                "flex items-center gap-3 shrink-0",
                isActive || isDone
                  ? "text-primary-container"
                  : "text-on-surface-variant",
              )}
            >
              <span
                className={cn(
                  "inline-flex h-8 w-8 items-center justify-center rounded-full text-[13px] font-bold transition-all",
                  isDone
                    ? "bg-secondary text-on-secondary"
                    : isActive
                      ? "bg-secondary text-on-secondary shadow-[0_0_0_4px_rgba(0,103,127,0.15)]"
                      : "bg-surface-container text-on-surface-variant",
                )}
              >
                {isDone ? <Check size={14} strokeWidth={3} /> : s.n}
              </span>
              <span className="text-[13px] font-semibold hidden sm:inline">
                {s.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className="flex-1 h-[2px] bg-outline-variant relative overflow-hidden rounded-full">
                <div
                  className={cn(
                    "absolute inset-y-0 left-0 bg-secondary transition-all duration-500",
                    isDone ? "w-full" : "w-0",
                  )}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
