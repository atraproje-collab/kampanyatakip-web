import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/pages/PageHeader";
import {
  LegalArticle,
  LegalSection,
} from "@/components/pages/LegalArticle";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Kullanım Koşulları",
  description:
    "KAMPANYATAKİP platformunun kullanım şartları, abonelik koşulları, fikri mülkiyet, sorumluluk reddi ve uyuşmazlık çözümü.",
};

export default function KullanimKosullariPage() {
  return (
    <>
      <PageHeader
        title="Kullanım Koşulları"
        description="KAMPANYATAKİP hizmetlerini kullanırken geçerli olan şartlar ve koşullar"
        breadcrumb="Kullanım Koşulları"
      />

      <LegalArticle
        lastUpdated="2026-04-24"
        intro={
          <>
            Bu Kullanım Koşulları, KAMPANYATAKİP platformunu (&ldquo;Hizmet&rdquo;)
            kullanımınızı düzenleyen yasal bir sözleşmedir. Hizmeti
            kullanarak bu koşulları kabul etmiş sayılırsınız. Şartları
            kabul etmiyorsanız lütfen Hizmeti kullanmayın.
          </>
        }
      >
        <LegalSection number="1" title="Taraflar ve Tanımlar">
          <ul className="list-disc pl-6 space-y-1.5">
            <li>
              <strong>&ldquo;Platform&rdquo; / &ldquo;Hizmet&rdquo;:</strong>{" "}
              KAMPANYATAKİP altyapısı ve bağlı tüm modüller, web siteleri ve
              mobil arayüzler.
            </li>
            <li>
              <strong>&ldquo;Müşteri&rdquo;:</strong> Platform&apos;a abone
              olan valilik onaylı kampanya düzenleyicisi dernek, vakıf,
              komisyon veya yetkili kuruluş.
            </li>
            <li>
              <strong>&ldquo;Ziyaretçi&rdquo;:</strong> Kampanya sayfalarını
              görüntüleyen ve bağış yapan kullanıcı.
            </li>
            <li>
              <strong>&ldquo;İçerik&rdquo;:</strong> Müşteri tarafından
              platforma yüklenen her türlü veri, metin, görsel, belge ve
              kayıt.
            </li>
          </ul>
        </LegalSection>

        <LegalSection number="2" title="Hizmetin Kapsamı">
          <p>
            KAMPANYATAKİP, 5072 sayılı Yardım Toplama Kanunu kapsamında
            valilik onayı almış kampanyalar için bağış yönetim, takip ve
            şeffaflık altyapısı sunar. Hizmet; para takibi, kumbara/stant
            yönetimi, gönüllü yönetimi, mesajlaşma asistanı, sesli bilgi
            hattı, şeffaflık merkezi ve raporlama modüllerini içerir.
          </p>
          <p>
            Hizmetin ayrıntılı kapsamı için{" "}
            <Link
              href="/moduller"
              className="text-secondary font-semibold hover:underline"
            >
              Modüller
            </Link>{" "}
            sayfasına bakınız.
          </p>
        </LegalSection>

        <LegalSection number="3" title="Ön Koşul: Valilik Onayı">
          <p>
            Platform&apos;dan yararlanabilmek için Müşteri&apos;nin
            kampanyasının il valiliği tarafından onaylanmış olması zorunludur.
            Müşteri, geçerli onay belgesini kurulum aşamasında ibraz etmekle
            yükümlüdür. Onay belgesi olmayan kampanyalar yayına alınmaz.
          </p>
        </LegalSection>

        <LegalSection number="4" title="Müşteri Yükümlülükleri">
          <ul className="list-disc pl-6 space-y-1.5">
            <li>Platform&apos;u yalnızca hukuka uygun amaçlarla kullanmak</li>
            <li>
              Platform&apos;a yüklenen tüm içeriğin doğruluğundan ve hukuki
              uygunluğundan sorumlu olmak
            </li>
            <li>
              Üçüncü kişilerin fikri mülkiyet haklarına, özel hayatın
              gizliliğine ve KVKK&apos;ya aykırı içerik yüklememek
            </li>
            <li>
              Harcamalar için belge yüklemek, belgesiz harcama kaydı
              oluşturmaya çalışmamak
            </li>
            <li>
              Sisteme verilen kullanıcı bilgilerinin gizliliğini korumak
            </li>
            <li>Yetkili kamu kurumlarının taleplerine zamanında cevap vermek</li>
            <li>
              Bağışçı iletişim bilgilerini yalnızca kampanya amacıyla kullanmak,
              ticari pazarlama için kullanmamak
            </li>
          </ul>
        </LegalSection>

        <LegalSection number="5" title="Abonelik ve Ödeme">
          <p>
            Hizmet, aylık abonelik modeli ile sunulur. Abonelik şartları:
          </p>
          <ul className="list-disc pl-6 space-y-1.5">
            <li>Minimum sözleşme süresi yoktur; istenen ay iptal edilebilir.</li>
            <li>Ödeme dönemi başında peşin olarak gerçekleştirilir.</li>
            <li>
              Paket limitlerinizi aştığınız ay için aşım ücretleri dönem
              sonunda faturalanır; tüm kalemler şeffaf biçimde gösterilir.
            </li>
            <li>
              Fiyatlandırma detayları için KAMPANYATAKİP ile iletişime
              geçebilirsiniz.
            </li>
            <li>
              Fiyat değişikliği durumunda mevcut abonelere en az 30 gün
              önceden yazılı bildirim yapılır.
            </li>
          </ul>
        </LegalSection>

        <LegalSection number="6" title="İptal, Fesih ve Veri İadesi">
          <p>
            Müşteri, aboneliğini önceden bildirim olmaksızın herhangi bir zaman
            iptal edebilir. İptal sonrası:
          </p>
          <ul className="list-disc pl-6 space-y-1.5">
            <li>
              Cari dönemin sonuna kadar Hizmet kullanımı devam eder; iade
              yapılmaz.
            </li>
            <li>
              Tüm veriler 30 gün süreyle saklanır ve Müşteri&apos;nin talebi
              üzerine dışa aktarılabilir.
            </li>
            <li>
              30 gün sonunda veriler kalıcı olarak silinir (şeffaflık
              merkezindeki değişmez kayıtlar hariç — bunlar kamuya açık kalmaya
              devam edebilir).
            </li>
          </ul>
          <p>
            KAMPANYATAKİP, Müşteri&apos;nin işbu Koşullara veya yasal
            mevzuata aykırı davranması durumunda Hizmet&apos;i askıya alma
            veya sözleşmeyi feshetme hakkını saklı tutar.
          </p>
        </LegalSection>

        <LegalSection number="7" title="Fikri Mülkiyet">
          <p>
            Platform üzerindeki tüm yazılım, tasarım, logo, marka ve benzer
            unsurların tüm hakları KAMPANYATAKİP&apos;e aittir. Müşteri, Hizmet
            süresince yalnızca kullanım lisansına sahiptir; yazılımı
            kopyalayamaz, tersine mühendislik uygulayamaz veya üçüncü kişilere
            devredemez.
          </p>
          <p>
            Müşteri&apos;nin platforma yüklediği içerik Müşteri&apos;ye ait
            kalır; KAMPANYATAKİP bu içeriği yalnızca Hizmet&apos;in sunulması
            için gerekli olduğu ölçüde işler.
          </p>
        </LegalSection>

        <LegalSection number="8" title="Bağış İşlemlerinin Niteliği">
          <p>
            KAMPANYATAKİP bir ödeme kuruluşu ya da banka değildir. Platform,
            bağışları işlemez; bağışlar doğrudan Müşteri&apos;nin banka
            hesabına yatırılır. KAMPANYATAKİP yalnızca bu bağışların kayıt,
            takip ve raporlanmasından sorumlu bir teknoloji sağlayıcısıdır.
          </p>
        </LegalSection>

        <LegalSection number="9" title="Hizmet Seviyesi ve Kesintiler">
          <p>
            KAMPANYATAKİP, yıllık ortalama <strong>%99,5</strong> kullanılabilirlik
            hedefi ile çalışır. Planlı bakım çalışmaları en az 48 saat önceden
            duyurulur ve mümkün olduğunca düşük yoğunluklu saatlerde yapılır.
            Plansız kesintilerde servis sağlayıcıya anlık bildirim gönderilir
            ve hızlı müdahale edilir.
          </p>
          <p>
            Üst paketlerde (Premium) öncelikli destek ve yükseltilmiş SLA
            taahhütleri uygulanır.
          </p>
        </LegalSection>

        <LegalSection number="10" title="Sorumluluk Sınırlaması">
          <p>
            Yürürlükteki mevzuatın izin verdiği azami ölçüde KAMPANYATAKİP:
          </p>
          <ul className="list-disc pl-6 space-y-1.5">
            <li>
              Müşteri&apos;nin Platform&apos;u mevzuata aykırı veya hatalı
              kullanımından,
            </li>
            <li>
              Müşteri&apos;nin yüklediği içeriğin hukuka aykırılığından,
            </li>
            <li>
              Üçüncü tarafların (banka, ödeme altyapısı, kargo, iletişim
              sağlayıcısı vb.) kusurundan kaynaklanan aksaklıklardan,
            </li>
            <li>
              Dolaylı, arızi veya kâr kaybına yönelik zararlardan,
            </li>
          </ul>
          <p>sorumlu değildir.</p>
          <p>
            KAMPANYATAKİP&apos;in toplam sorumluluğu her durumda ilgili
            olaydan önceki 12 aylık dönemde Müşteri tarafından ödenen toplam
            hizmet bedeli ile sınırlıdır.
          </p>
        </LegalSection>

        <LegalSection number="11" title="Mücbir Sebepler">
          <p>
            Deprem, sel, yangın, salgın, savaş, genel grev, altyapı kesintisi,
            yetkili makam kararları gibi tarafların kontrolü dışında kalan
            mücbir sebep hallerinde, bu sebepten dolayı yerine getirilemeyen
            yükümlülüklerden ötürü taraflar sorumlu tutulamaz.
          </p>
        </LegalSection>

        <LegalSection number="12" title="Gizlilik ve KVKK">
          <p>
            Kişisel verilerinizin işlenmesi hakkında detaylı bilgi için{" "}
            <Link
              href={siteConfig.urls.kvkk}
              className="text-secondary font-semibold hover:underline"
            >
              KVKK Aydınlatma Metni
            </Link>{" "}
            ve{" "}
            <Link
              href={siteConfig.urls.privacy}
              className="text-secondary font-semibold hover:underline"
            >
              Gizlilik Politikası
            </Link>
            &apos;na bakınız.
          </p>
        </LegalSection>

        <LegalSection number="13" title="Değişiklikler">
          <p>
            KAMPANYATAKİP, işbu Kullanım Koşulları&apos;nı zaman zaman
            güncelleyebilir. Önemli değişiklikler Müşterilere e-posta ile en
            az 15 gün önceden bildirilir. Değişikliklerden sonra Hizmet&apos;i
            kullanmaya devam etmeniz güncel koşulları kabul ettiğiniz
            anlamına gelir.
          </p>
        </LegalSection>

        <LegalSection number="14" title="Geçerli Hukuk ve Yetkili Mahkeme">
          <p>
            İşbu Kullanım Koşulları <strong>Türkiye Cumhuriyeti</strong>{" "}
            kanunlarına tabidir. Taraflar arasında bu sözleşmeden doğabilecek
            uyuşmazlıkların çözümünde{" "}
            <strong>İstanbul Merkez Mahkemeleri ve İcra Daireleri</strong>{" "}
            yetkilidir.
          </p>
        </LegalSection>

        <LegalSection number="15" title="İletişim">
          <p>
            Koşullar veya Hizmet hakkında her türlü sorunuz için:
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
            <li>
              İletişim formu:{" "}
              <Link
                href={siteConfig.urls.contact}
                className="text-secondary font-semibold hover:underline"
              >
                {siteConfig.urls.contact}
              </Link>
            </li>
          </ul>
        </LegalSection>
      </LegalArticle>
    </>
  );
}
