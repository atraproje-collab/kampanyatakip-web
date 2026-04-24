import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/pages/PageHeader";
import {
  LegalArticle,
  LegalSection,
} from "@/components/pages/LegalArticle";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Gizlilik Politikası",
  description:
    "KAMPANYATAKİP'in kişisel veri işleme, çerez kullanımı ve üçüncü taraf entegrasyonlarına ilişkin gizlilik politikası.",
};

export default function GizlilikPage() {
  return (
    <>
      <PageHeader
        title="Gizlilik Politikası"
        description="Kişisel verileriniz, çerezler ve üçüncü taraf entegrasyonları hakkında"
        breadcrumb="Gizlilik"
      />

      <LegalArticle
        lastUpdated="2026-04-24"
        intro={
          <>
            Bu politika, KAMPANYATAKİP platformunu kullandığınızda topladığımız,
            kullandığımız ve paylaştığımız bilgiler ile bunları nasıl
            koruduğumuzu açıklar. 6698 sayılı KVKK kapsamındaki detaylı
            aydınlatma için{" "}
            <Link
              href={siteConfig.urls.kvkk}
              className="text-secondary font-semibold hover:underline"
            >
              KVKK Aydınlatma Metni
            </Link>
            &apos;ni inceleyin.
          </>
        }
      >
        <LegalSection number="1" title="Topladığımız Bilgiler">
          <p>
            KAMPANYATAKİP aşağıdaki bilgileri toplar:
          </p>
          <p className="font-semibold text-primary-container">
            Sizden doğrudan aldığımız bilgiler
          </p>
          <ul className="list-disc pl-6 space-y-1.5">
            <li>
              Başvuru, demo ve iletişim formlarında paylaştığınız ad, soyad,
              e-posta, telefon, kuruluş bilgileri
            </li>
            <li>
              Kampanya bağışlarında gönderen bilgileri (banka bildirimi
              aracılığıyla)
            </li>
            <li>Destek talepleri, mesaj ve sesli hat iletişimleri</li>
            <li>KVKK onay tercihleri</li>
          </ul>
          <p className="font-semibold text-primary-container mt-4">
            Otomatik olarak topladığımız bilgiler
          </p>
          <ul className="list-disc pl-6 space-y-1.5">
            <li>IP adresi, tarayıcı tipi, cihaz bilgileri</li>
            <li>Ziyaret edilen sayfa, oturum süresi, referrer bilgisi</li>
            <li>Çerezler ve benzer takip teknolojileri</li>
            <li>
              Güvenlik kayıtları (başarısız giriş denemeleri, saldırı filtreleme
              kayıtları)
            </li>
          </ul>
        </LegalSection>

        <LegalSection number="2" title="Bilgileri Nasıl Kullanıyoruz?">
          <ul className="list-disc pl-6 space-y-1.5">
            <li>Kampanyanızı kurmak, yönetmek ve raporlamak</li>
            <li>Bağışları kayda almak ve şeffaflık merkezinde yayımlamak</li>
            <li>Bağışçı, gönüllü ve kampanya ekibi ile iletişim kurmak</li>
            <li>Hizmet kalitesini ve güvenliğini iyileştirmek</li>
            <li>Hukuki ve denetimsel yükümlülükleri yerine getirmek</li>
            <li>Açık rızanızla pazarlama iletişimi göndermek</li>
            <li>
              Analitik için anonim toplam veriyi kullanmak (tekil kullanıcılar
              tanımlanamaz)
            </li>
          </ul>
        </LegalSection>

        <LegalSection number="3" title="Çerezler ve Takip Teknolojileri">
          <p>
            Platformumuz aşağıdaki çerez türlerini kullanabilir:
          </p>
          <ul className="list-disc pl-6 space-y-1.5">
            <li>
              <strong>Zorunlu çerezler:</strong> oturum yönetimi, güvenlik;
              kapatılamaz
            </li>
            <li>
              <strong>Performans çerezleri:</strong> anonim ziyaret ve
              performans analizi; rıza ile aktif
            </li>
            <li>
              <strong>İşlevsellik çerezleri:</strong> dil tercihi, görünüm
              ayarları gibi kullanıcı tercihleri
            </li>
          </ul>
          <p>
            Çerezleri tarayıcı ayarlarınızdan yönetebilir veya silebilirsiniz.
            Zorunlu çerezleri kapatmanız durumunda platformun bazı bölümleri
            beklenen şekilde çalışmayabilir.
          </p>
        </LegalSection>

        <LegalSection number="4" title="Bağışçı Verilerinin Görünürlüğü">
          <p>
            Şeffaflık merkezinde yayımlanan bağış kayıtlarında bağışçı adları
            otomatik olarak maskelenir (ör.{" "}
            <code className="font-mono text-primary-container">K***** Y*****</code>
            ). İsteyen bağışçılar tamamen anonim olarak yer alabilir. İletişim
            bilgileri yalnızca kampanya yöneticisi ile paylaşılır, kamuya
            yayımlanmaz.
          </p>
        </LegalSection>

        <LegalSection number="5" title="Üçüncü Taraflarla Paylaşım">
          <p>
            Kişisel verilerinizi üçüncü taraflarla ancak şu durumlarda
            paylaşırız:
          </p>
          <ul className="list-disc pl-6 space-y-1.5">
            <li>
              Kampanya sahibi dernek / vakıf (bağış detayları ve raporlar)
            </li>
            <li>
              Hizmet aldığımız bulut altyapı ve mesajlaşma sağlayıcıları (veri
              işleyen sıfatıyla, sözleşmesel güvenceler altında)
            </li>
            <li>
              Bankalar ve ödeme altyapısı sağlayıcıları (yalnızca bağış
              işleminin gerçekleştirilmesi için)
            </li>
            <li>
              Yetkili kamu kurumları (yasal zorunluluk veya yetkili merciin
              talebi üzerine)
            </li>
          </ul>
          <p>
            Kişisel verilerinizi hiçbir şekilde ticari amaçla üçüncü kişilere
            satmıyor veya kiralamıyoruz.
          </p>
        </LegalSection>

        <LegalSection number="6" title="Veri Güvenliği">
          <p>
            Verilerinizi korumak için teknik ve idari tedbirler alıyoruz:
          </p>
          <ul className="list-disc pl-6 space-y-1.5">
            <li>İletişimde TLS 1.3 şifreleme</li>
            <li>Her kampanyaya özel izole bulut sunucusu (single-tenant)</li>
            <li>Günlük otomatik yedekleme ve coğrafi yedek</li>
            <li>Kurumsal güvenlik katmanı (DDoS, WAF)</li>
            <li>Erişim logları ve rol tabanlı yetkilendirme</li>
            <li>
              Değiştirilemez (append-only) veritabanı yapısı — işlem kayıtları
              silinemez
            </li>
          </ul>
        </LegalSection>

        <LegalSection number="7" title="Çocukların Gizliliği">
          <p>
            KAMPANYATAKİP platformu 18 yaş altındaki kullanıcılara yönelik
            değildir; çocuklardan bilerek kişisel veri toplamayız. Eğer 18 yaş
            altı bir kullanıcıdan veri topladığımız tespit edilirse bu veri
            derhal silinir.
          </p>
        </LegalSection>

        <LegalSection number="8" title="Haklarınız">
          <p>
            KVKK kapsamındaki haklarınızın detaylı listesi için{" "}
            <Link
              href={siteConfig.urls.kvkk}
              className="text-secondary font-semibold hover:underline"
            >
              KVKK Aydınlatma Metni
            </Link>
            &apos;ni inceleyin. Tüm talepleriniz için{" "}
            <a
              href={`mailto:${siteConfig.contact.email}`}
              className="text-secondary font-semibold hover:underline"
            >
              {siteConfig.contact.email}
            </a>{" "}
            adresine yazabilirsiniz; 30 gün içinde ücretsiz cevaplanır.
          </p>
        </LegalSection>

        <LegalSection number="9" title="Değişiklikler">
          <p>
            Bu politika zaman zaman güncellenebilir. Güncel sürüm her zaman bu
            sayfada yayımlanır. Önemli değişiklikler e-posta ile bildirilir.
          </p>
        </LegalSection>

        <LegalSection number="10" title="İletişim">
          <p>
            Gizlilik konusundaki her türlü sorunuz için:
          </p>
          <ul className="list-disc pl-6 space-y-1.5">
            <li>
              E-posta:{" "}
              <a
                href={`mailto:${siteConfig.contact.email}`}
                className="text-secondary font-semibold hover:underline"
              >
                {siteConfig.contact.email}
              </a>
            </li>
            <li>
              Destek:{" "}
              <a
                href={`mailto:${siteConfig.contact.supportEmail}`}
                className="text-secondary font-semibold hover:underline"
              >
                {siteConfig.contact.supportEmail}
              </a>
            </li>
            <li>Adres: {siteConfig.contact.address}</li>
          </ul>
        </LegalSection>
      </LegalArticle>
    </>
  );
}
