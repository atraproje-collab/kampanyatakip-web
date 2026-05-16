"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { FormField } from "@/components/pages/FormField";
import { KvkkModal } from "@/components/pages/KvkkModal";

type FormData = {
  fullName: string;
  email: string;
  phone: string;
  organization: string;
  subject: string;
  message: string;
  kvkk: boolean;
};

type Errors = Partial<Record<keyof FormData, string>>;

const SUBJECT_OPTIONS = [
  { value: "genel", label: "Genel Bilgi" },
  { value: "demo", label: "Demo Talebi" },
  { value: "paket", label: "Paket Bilgisi" },
  { value: "destek", label: "Teknik Destek" },
  { value: "isbirligi", label: "İş Birliği" },
  { value: "basin", label: "Basın" },
  { value: "diger", label: "Diğer" },
];

const MAX_MESSAGE = 1000;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const initialData: FormData = {
  fullName: "",
  email: "",
  phone: "",
  organization: "",
  subject: "",
  message: "",
  kvkk: false,
};

export function ContactForm() {
  const [data, setData] = useState<FormData>(initialData);
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [kvkkModalOpen, setKvkkModalOpen] = useState(false);

  const update = <K extends keyof FormData>(key: K, value: FormData[K]) => {
    setData((d) => ({ ...d, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const validate = (): boolean => {
    const e: Errors = {};
    if (!data.fullName.trim()) e.fullName = "Ad soyad zorunludur.";
    if (!data.email.trim()) e.email = "E-posta zorunludur.";
    else if (!EMAIL_RE.test(data.email))
      e.email = "Geçerli bir e-posta adresi girin.";
    if (!data.subject) e.subject = "Konu seçimi zorunludur.";
    if (!data.message.trim()) e.message = "Mesaj zorunludur.";
    else if (data.message.trim().length < 10)
      e.message = "Mesaj en az 10 karakter olmalı.";
    if (!data.kvkk) e.kvkk = "KVKK onayı zorunludur.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (evt: React.FormEvent) => {
    evt.preventDefault();
    setSubmitError("");
    if (!validate()) return;

    setLoading(true);
    try {
      // API'nin beklediği alan adlarıyla map'le.
      const konuLabel =
        SUBJECT_OPTIONS.find((o) => o.value === data.subject)?.label ??
        data.subject;
      const payload = {
        ad: data.fullName,
        email: data.email,
        telefon: data.phone,
        konu: konuLabel,
        mesaj: data.message,
        kurulus: data.organization,
      };

      const res = await fetch("/api/iletisim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (!res.ok || !result.success) {
        throw new Error(result.message || "Bir hata oluştu");
      }

      setSuccess(true);
      setData(initialData);
    } catch (e) {
      setSubmitError(
        e instanceof Error && e.message
          ? e.message
          : "Mesajınız gönderilirken bir sorun oluştu. Lütfen tekrar deneyin.",
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
        transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
        className="rounded-2xl border border-outline-variant bg-white p-10 text-center"
      >
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary/10 text-secondary mb-5">
          <CheckCircle2 size={32} strokeWidth={2} />
        </div>
        <h3 className="text-[22px] font-semibold text-primary-container tracking-[-0.01em]">
          Mesajınız Alındı!
        </h3>
        <p className="mt-2 text-[15px] leading-[24px] text-on-surface-variant max-w-md mx-auto">
          1 iş günü içinde size dönüş yapacağız.
        </p>
        <div className="mt-6">
          <Button
            variant="outline-navy"
            size="md"
            onClick={() => setSuccess(false)}
          >
            Yeni Mesaj Gönder
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <>
    <form
      onSubmit={handleSubmit}
      noValidate
      className="rounded-2xl border border-outline-variant bg-white p-6 md:p-8"
    >
      <h2 className="text-[20px] md:text-[22px] font-semibold text-primary-container tracking-[-0.01em] mb-1">
        Bize Yazın
      </h2>
      <p className="text-[14px] text-on-surface-variant mb-6">
        Form üzerinden ulaşırsanız 1 iş günü içinde dönüş yapıyoruz.
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
          label="Telefon"
          name="phone"
          type="tel"
          autoComplete="tel"
          placeholder="0 5XX XXX XX XX"
          value={data.phone}
          onChange={(v) => update("phone", v)}
          error={errors.phone}
        />
        <FormField
          label="Kuruluş"
          name="organization"
          placeholder="Dernek / Vakıf adı"
          value={data.organization}
          onChange={(v) => update("organization", v)}
          error={errors.organization}
        />
        <div className="md:col-span-2">
          <FormField
            label="Konu"
            name="subject"
            type="select"
            required
            placeholder="Konu seçin"
            options={SUBJECT_OPTIONS}
            value={data.subject}
            onChange={(v) => update("subject", v)}
            error={errors.subject}
          />
        </div>
        <div className="md:col-span-2">
          <FormField
            label="Mesaj"
            name="message"
            type="textarea"
            required
            placeholder="Mesajınızı yazın..."
            maxLength={MAX_MESSAGE}
            showCounter
            rows={6}
            value={data.message}
            onChange={(v) => update("message", v)}
            error={errors.message}
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
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              setKvkkModalOpen(true);
            }}
            className="text-secondary underline underline-offset-2 hover:text-on-secondary-container cursor-pointer"
          >
            Aydınlatma metni
          </button>
          .
        </span>
      </label>

      {submitError && (
        <p className="mt-4 text-[13px] text-error" role="alert">
          {submitError}
        </p>
      )}

      <Button
        type="submit"
        variant="primary"
        size="lg"
        disabled={loading}
        className="mt-6 w-full group/btn"
      >
        {loading ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            Gönderiliyor...
          </>
        ) : (
          <>
            Mesajı Gönder
            <ArrowRight
              size={16}
              className="transition-transform duration-250 group-hover/btn:translate-x-1"
            />
          </>
        )}
      </Button>
    </form>

    <KvkkModal
      open={kvkkModalOpen}
      onClose={() => setKvkkModalOpen(false)}
    />
    </>
  );
}
