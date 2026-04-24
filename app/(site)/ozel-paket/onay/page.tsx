"use client";

import { Suspense, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { Container } from "@/components/Container";
import { PageHeader } from "@/components/pages/PageHeader";
import { FormField } from "@/components/pages/FormField";
import { Button } from "@/components/ui/Button";
import {
  calculateTotal,
  customPackageConfig,
  getSelectedModules,
  type Selection,
} from "@/lib/custom-package-config";
import { siteConfig } from "@/lib/site-config";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type FormData = {
  name: string;
  email: string;
  phone: string;
  organization: string;
  notes: string;
  kvkk: boolean;
};

type Errors = Partial<Record<keyof FormData, string>>;

const initialData: FormData = {
  name: "",
  email: "",
  phone: "",
  organization: "",
  notes: "",
  kvkk: false,
};

function OzelPaketOnayContent() {
  const searchParams = useSearchParams();

  const selections: Selection = useMemo(() => {
    try {
      const raw = searchParams.get("selections");
      if (!raw) return {};
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === "object") return parsed as Selection;
      return {};
    } catch {
      return {};
    }
  }, [searchParams]);

  const total = useMemo(() => calculateTotal(selections), [selections]);
  const selectedModules = useMemo(
    () => getSelectedModules(selections),
    [selections],
  );

  const [data, setData] = useState<FormData>(initialData);
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const update = <K extends keyof FormData>(key: K, value: FormData[K]) => {
    setData((d) => ({ ...d, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const validate = (): boolean => {
    const e: Errors = {};
    if (!data.name.trim()) e.name = "Ad soyad zorunludur.";
    if (!data.email.trim()) e.email = "E-posta zorunludur.";
    else if (!EMAIL_RE.test(data.email))
      e.email = "Geçerli bir e-posta adresi girin.";
    if (!data.phone.trim()) e.phone = "Telefon zorunludur.";
    if (!data.organization.trim()) e.organization = "Kuruluş adı zorunludur.";
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
      // TODO: Connect to n8n webhook / CRM
      console.log("Özel paket talebi:", {
        form: data,
        selections,
        total,
        selectedModules,
      });
      await new Promise((r) => setTimeout(r, 1500));
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
      <>
        <PageHeader
          title="Talebiniz Alındı"
          description="Ekibimiz en kısa sürede sizinle iletişime geçecek"
          breadcrumb="Özel Paket"
        />
        <section className="py-16 md:py-24">
          <Container>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
              className="max-w-xl mx-auto text-center rounded-2xl bg-white border border-outline-variant p-10 md:p-12"
            >
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-secondary/10 text-secondary mb-6">
                <CheckCircle2 size={40} strokeWidth={2} />
              </div>
              <h2 className="text-[26px] md:text-[30px] font-bold text-primary-container tracking-[-0.02em]">
                Özel Paket Talebiniz Alındı!
              </h2>
              <p className="mt-3 text-[15px] leading-[24px] text-on-surface-variant">
                Seçimleriniz ve iletişim bilgileriniz ekibimize iletildi. 1 iş
                günü içinde size dönüş yapacağız.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/">
                  <Button
                    variant="outline-navy"
                    size="lg"
                    className="w-full sm:w-auto"
                  >
                    <ArrowLeft size={16} />
                    Ana Sayfa
                  </Button>
                </Link>
                <Link href={siteConfig.urls.faq}>
                  <Button variant="primary" size="lg" className="w-full sm:w-auto">
                    SSS&apos;i İncele
                  </Button>
                </Link>
              </div>
            </motion.div>
          </Container>
        </section>
      </>
    );
  }

  return (
    <>
      <PageHeader
        title="Özel Paketinizi Onaylayın"
        description="Seçimlerinizi kontrol edin ve iletişim bilgilerinizi ekleyin"
        breadcrumb="Özel Paket"
      />

      <section className="py-14 md:py-20">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
            {/* Summary */}
            <aside className="lg:col-span-2 lg:sticky lg:top-24 self-start">
              <div className="rounded-2xl bg-white border border-outline-variant p-6 md:p-7">
                <h3 className="text-[18px] font-semibold text-primary-container tracking-[-0.01em]">
                  Paket Özetiniz
                </h3>

                <div className="mt-5 pb-5 border-b border-outline-variant">
                  <div>
                    <p className="text-[14.5px] font-semibold text-primary-container">
                      {customPackageConfig.base.name}
                    </p>
                    <p className="mt-0.5 text-[12.5px] text-on-surface-variant">
                      Zorunlu taban paket
                    </p>
                  </div>
                </div>

                {selectedModules.length > 0 ? (
                  <div className="mt-5 pb-5 border-b border-outline-variant">
                    <p className="text-[11px] font-bold text-on-surface-variant uppercase tracking-[0.14em] mb-3">
                      Seçili Ek Modüller ({selectedModules.length})
                    </p>
                    <ul className="space-y-2.5">
                      {selectedModules.map((m) => (
                        <li
                          key={m.id}
                          className="flex items-start gap-2 text-[13.5px]"
                        >
                          <span className="text-on-surface">
                            {m.name}
                            {m.quantity > 1 && (
                              <span className="text-on-surface-variant">
                                {" "}(×{m.quantity})
                              </span>
                            )}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <div className="mt-5 pb-5 border-b border-outline-variant">
                    <p className="text-[13px] text-on-surface-variant italic">
                      Ek modül seçimi yapmadınız — sadece taban paketle devam
                      ediyorsunuz.
                    </p>
                  </div>
                )}

                <Link
                  href="/#pricing"
                  className="mt-5 inline-flex items-center gap-1.5 text-[13px] font-semibold text-secondary hover:text-on-secondary-container transition-colors"
                >
                  <ArrowLeft size={14} />
                  Seçimleri Düzenle
                </Link>
              </div>
            </aside>

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              noValidate
              className="lg:col-span-3 rounded-2xl bg-white border border-outline-variant p-6 md:p-8"
            >
              <h3 className="text-[20px] md:text-[22px] font-semibold text-primary-container tracking-[-0.01em]">
                İletişim Bilgileri
              </h3>
              <p className="mt-1.5 text-[13.5px] text-on-surface-variant">
                Bu bir ön taleptir. Demo ve fiyat onayı için sizinle iletişime
                geçeceğiz.
              </p>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-5">
                <FormField
                  label="Ad Soyad"
                  name="name"
                  required
                  autoComplete="name"
                  placeholder="Adınız Soyadınız"
                  value={data.name}
                  onChange={(v) => update("name", v)}
                  error={errors.name}
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
                    label="Ek Notlar"
                    name="notes"
                    type="textarea"
                    placeholder="Özel talepleriniz veya eklemek istedikleriniz..."
                    maxLength={500}
                    showCounter
                    rows={4}
                    value={data.notes}
                    onChange={(v) => update("notes", v)}
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
                  Kişisel verilerimin KVKK kapsamında işlenmesini kabul
                  ediyorum.{" "}
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
                    Talebimi Gönder
                    <ArrowRight
                      size={16}
                      className="transition-transform duration-250 group-hover/btn:translate-x-1"
                    />
                  </>
                )}
              </Button>
            </form>
          </div>
        </Container>
      </section>
    </>
  );
}

export default function OzelPaketOnayPage() {
  return (
    <Suspense
      fallback={
        <div className="py-32 text-center text-on-surface-variant">
          Yükleniyor...
        </div>
      }
    >
      <OzelPaketOnayContent />
    </Suspense>
  );
}
