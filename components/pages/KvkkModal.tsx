"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { siteConfig } from "@/lib/site-config";

interface KvkkModalProps {
  open: boolean;
  onClose: () => void;
}

export function KvkkModal({ open, onClose }: KvkkModalProps) {
  // ESC ile kapatma + body scroll kilidi
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="kvkk-modal-title"
          className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-4"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />

          {/* Card */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            className="relative w-full max-w-2xl max-h-[85vh] md:max-h-[80vh] rounded-t-2xl md:rounded-2xl bg-white shadow-[0_20px_50px_rgba(0,24,53,0.25)] border border-outline-variant flex flex-col"
          >
            {/* Header */}
            <header className="flex items-start justify-between gap-3 px-5 md:px-6 py-4 border-b border-outline-variant">
              <div>
                <h2
                  id="kvkk-modal-title"
                  className="text-[18px] md:text-[20px] font-semibold text-primary-container tracking-[-0.01em]"
                >
                  KVKK Aydınlatma Metni
                </h2>
                <p className="mt-0.5 text-[12px] text-on-surface-variant">
                  6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Kapat"
                className="shrink-0 -mr-1 -mt-1 inline-flex items-center justify-center w-9 h-9 rounded-lg text-on-surface-variant hover:bg-surface-container-low hover:text-primary-container transition"
              >
                <X size={20} />
              </button>
            </header>

            {/* Body — scrollable */}
            <div className="flex-1 overflow-y-auto px-5 md:px-6 py-5 text-[13.5px] leading-[22px] text-on-surface space-y-5">
              <p className="text-on-surface-variant">
                Bu metin, 6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK)
                kapsamında veri sorumlusu sıfatıyla KAMPANYATAKİP tarafından
                yürütülen kişisel veri işleme faaliyetlerine ilişkin olarak
                ilgili kişileri bilgilendirmek amacıyla hazırlanmıştır.
              </p>

              <Section number="1" title="Veri Sorumlusu">
                <p>
                  KAMPANYATAKİP, bu metin kapsamındaki kişisel veri işleme
                  faaliyetlerinde KVKK&apos;nın 3. maddesi uyarınca{" "}
                  <strong>veri sorumlusu</strong> sıfatına sahiptir. Platform,
                  valilik onaylı yardım kampanyaları için bağış yönetimi ve
                  şeffaflık altyapısı sağlar.
                </p>
                <p className="mt-2">
                  İletişim:{" "}
                  <a
                    href={`mailto:${siteConfig.contact.email}`}
                    className="text-secondary font-semibold hover:underline"
                  >
                    {siteConfig.contact.email}
                  </a>
                </p>
              </Section>

              <Section number="2" title="İşlenen Kişisel Veri Kategorileri">
                <ul className="list-disc pl-5 space-y-1.5">
                  <li>
                    <strong>Kimlik bilgileri:</strong> ad, soyad, T.C. kimlik
                    numarası (yalnızca kurumsal mutabakat için)
                  </li>
                  <li>
                    <strong>İletişim bilgileri:</strong> e-posta, telefon, KEP,
                    posta adresi
                  </li>
                  <li>
                    <strong>Finansal bilgiler:</strong> bağış miktarı, banka
                    hareketi referansı, IBAN
                  </li>
                  <li>
                    <strong>Müşteri işlem bilgileri:</strong> talep kayıtları,
                    destek yazışmaları
                  </li>
                  <li>
                    <strong>İşlem güvenliği:</strong> IP adresi, oturum bilgileri,
                    erişim logları
                  </li>
                  <li>
                    <strong>Pazarlama tercihleri:</strong> iletişim onayları ve
                    bunun geri çekilmesi
                  </li>
                </ul>
              </Section>

              <Section number="3" title="Kişisel Veri İşleme Amaçları">
                <ul className="list-disc pl-5 space-y-1.5">
                  <li>Valilik onaylı yardım kampanyalarının şeffaf yönetimi</li>
                  <li>
                    Bağış işlemlerinin kayıt altına alınması ve değiştirilemez
                    şeffaflık merkezinde yayımlanması (ad-soyad maskelenerek)
                  </li>
                  <li>Bağışçı, kampanya sorumlusu ve gönüllü iletişimi</li>
                  <li>
                    Hukuki yükümlülüklerin yerine getirilmesi (5072 sayılı
                    Yardım Toplama Kanunu dahil)
                  </li>
                  <li>Valilik denetimlerine cevap verme yükümlülüğü</li>
                  <li>Hizmet kalitesinin iyileştirilmesi ve teknik destek</li>
                  <li>Kurumsal bağış için vergi bilgilendirme</li>
                  <li>Güvenlik izleme ve saldırı önleme</li>
                </ul>
              </Section>

              <Section number="4" title="Hukuki Sebepler">
                <p>
                  Kişisel verileriniz KVKK&apos;nın 5. ve 6. maddelerinde
                  belirtilen aşağıdaki hukuki sebeplere dayanılarak işlenir:
                </p>
                <ul className="list-disc pl-5 space-y-1.5 mt-2">
                  <li>Kanunlarda açıkça öngörülmesi</li>
                  <li>Bir sözleşmenin kurulması veya ifası ile ilgili olması</li>
                  <li>Veri sorumlusunun hukuki yükümlülüğü</li>
                  <li>
                    Temel hak ve özgürlükleri ihlal etmemek kaydıyla meşru
                    menfaat
                  </li>
                  <li>İlgili kişinin açık rızasının bulunması</li>
                </ul>
              </Section>

              <Section number="5" title="Kişisel Veri Toplama Yöntemleri">
                <ul className="list-disc pl-5 space-y-1.5">
                  <li>Kampanya sayfası üzerinden form gönderimleri</li>
                  <li>Bağış için kullanılan banka ve ödeme altyapısı bildirimleri</li>
                  <li>Mesajlaşma, e-posta ve sesli hat iletişimleri</li>
                  <li>Kumbara açılış tutanakları, stant kapanış raporları</li>
                  <li>Çerezler ve benzer takip teknolojileri</li>
                </ul>
              </Section>

              <Section number="6" title="Kişisel Verilerin Aktarımı">
                <p>
                  Verileriniz yalnızca yukarıdaki amaçların gerektirdiği ölçüde
                  ve KVKK&apos;nın 8. ve 9. maddeleri çerçevesinde aşağıdaki
                  taraflarla paylaşılabilir:
                </p>
                <ul className="list-disc pl-5 space-y-1.5 mt-2">
                  <li>Kampanya sahibi dernek / vakıf / komisyon</li>
                  <li>
                    Yetkili kamu kurumları (valilik, Cumhuriyet Başsavcılığı,
                    vergi daireleri)
                  </li>
                  <li>Bulut altyapı sağlayıcısı — veri işleyen sıfatıyla</li>
                  <li>Bankalar ve elektronik ödeme kuruluşları</li>
                  <li>Bağımsız denetim firmaları</li>
                </ul>
                <p className="mt-2">
                  Kişisel verileriniz yurt dışına açık rızanız olmadan
                  aktarılmaz; bulut hizmet sağlayıcımızın sunucuları
                  Türkiye&apos;de konumludur.
                </p>
              </Section>

              <Section number="7" title="Saklama Süreleri">
                <ul className="list-disc pl-5 space-y-1.5">
                  <li>Bağış ve harcama kayıtları: 10 yıl (mali mevzuat)</li>
                  <li>
                    Şeffaflık merkezindeki maskelenmiş kayıtlar: kampanya süresi
                    + 10 yıl (değişmez)
                  </li>
                  <li>İletişim kayıtları: 3 yıl</li>
                  <li>Çerez ve log kayıtları: azami 2 yıl</li>
                  <li>Pazarlama izni geri çekildiğinde derhal silinir</li>
                </ul>
              </Section>

              <Section number="8" title="İlgili Kişinin Hakları (KVKK Md. 11)">
                <ul className="list-disc pl-5 space-y-1.5">
                  <li>Kişisel veri işlenip işlenmediğini öğrenme</li>
                  <li>İşlenmişse buna ilişkin bilgi talep etme</li>
                  <li>İşleme amacını öğrenme</li>
                  <li>
                    Yurt içinde / yurt dışında aktarıldığı üçüncü kişileri bilme
                  </li>
                  <li>Eksik veya yanlış işlenmişse düzeltilmesini isteme</li>
                  <li>Silinmesini veya yok edilmesini isteme</li>
                  <li>
                    Düzeltme / silme işlemlerinin üçüncü kişilere bildirilmesini
                    isteme
                  </li>
                  <li>
                    Otomatik işleme sonucu çıkan aleyhe sonuca itiraz etme
                  </li>
                  <li>Zarar uğramanız hâlinde zararın giderilmesini isteme</li>
                </ul>
              </Section>

              <Section number="9" title="Başvuru Yöntemi">
                <p>
                  Yukarıdaki haklarınızı kullanmak için{" "}
                  <a
                    href={`mailto:${siteConfig.contact.email}`}
                    className="text-secondary font-semibold hover:underline"
                  >
                    {siteConfig.contact.email}
                  </a>{" "}
                  adresine kimliğinizi doğrulayan bilgilerle birlikte yazılı
                  başvuru yapabilirsiniz. Başvurunuz KVKK&apos;nın 13. maddesi
                  uyarınca en geç <strong>30 (otuz) gün</strong> içinde
                  ücretsiz olarak sonuçlandırılır.
                </p>
              </Section>

              <Section number="10" title="Değişiklikler">
                <p>
                  KAMPANYATAKİP, işbu aydınlatma metnini gerektiğinde
                  güncelleyebilir. Güncel metin her zaman{" "}
                  <a
                    href={siteConfig.urls.kvkk}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-secondary font-semibold hover:underline"
                  >
                    kampanyatakip.com/kvkk
                  </a>{" "}
                  adresinde yayımlanır.
                </p>
              </Section>
            </div>

            {/* Footer */}
            <footer className="flex items-center justify-between gap-3 px-5 md:px-6 py-4 border-t border-outline-variant bg-surface-container-lowest">
              <a
                href={siteConfig.urls.kvkk}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[12.5px] text-on-surface-variant hover:text-secondary underline underline-offset-2"
              >
                Tüm metni yeni sekmede aç
              </a>
              <button
                type="button"
                onClick={onClose}
                className="inline-flex items-center justify-center px-5 py-2 rounded-lg bg-secondary text-on-secondary font-semibold text-[13.5px] hover:bg-on-secondary-container transition"
              >
                Anladım, Kapat
              </button>
            </footer>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

function Section({
  number,
  title,
  children,
}: {
  number: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h3 className="text-[14.5px] font-bold text-primary-container tracking-[-0.01em] mb-2">
        <span className="text-secondary mr-1.5">{number}.</span>
        {title}
      </h3>
      <div className="text-on-surface-variant">{children}</div>
    </section>
  );
}
