import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/pages/PageHeader";
import {
  LegalArticle,
  LegalSection,
} from "@/components/pages/LegalArticle";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "KVKK Aydınlatma Metni",
  description:
    "6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında KAMPANYATAKİP tarafından yürütülen kişisel veri işleme faaliyetlerine ilişkin aydınlatma metni.",
};

export default function KvkkPage() {
  return (
    <>
      <PageHeader
        title="KVKK Aydınlatma Metni"
        description="6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında aydınlatma"
        breadcrumb="KVKK"
      />

      <LegalArticle
        lastUpdated="2026-04-24"
        intro={
          <>
            Bu metin, 6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK)
            kapsamında veri sorumlusu sıfatıyla KAMPANYATAKİP tarafından
            yürütülen kişisel veri işleme faaliyetlerine ilişkin olarak ilgili
            kişileri bilgilendirmek amacıyla hazırlanmıştır.
          </>
        }
      >
        <LegalSection number="1" title="Veri Sorumlusu">
          <p>
            KAMPANYATAKİP, bu metin kapsamındaki kişisel veri işleme
            faaliyetlerinde KVKK&apos;nın 3. maddesi uyarınca{" "}
            <strong className="text-primary-container">veri sorumlusu</strong>{" "}
            sıfatına sahiptir. Platform, valilik onaylı yardım kampanyaları için
            bağış yönetimi ve şeffaflık altyapısı sağlar.
          </p>
          <p>
            İletişim için:{" "}
            <a
              href={`mailto:${siteConfig.contact.email}`}
              className="text-secondary font-semibold hover:underline"
            >
              {siteConfig.contact.email}
            </a>
          </p>
        </LegalSection>

        <LegalSection number="2" title="İşlenen Kişisel Veri Kategorileri">
          <p>
            Hizmet kapsamında aşağıdaki kategorilerde kişisel veriler
            işlenmektedir:
          </p>
          <ul className="list-disc pl-6 space-y-1.5">
            <li>
              <strong>Kimlik bilgileri:</strong> ad, soyad, T.C. kimlik numarası
              (yalnızca kurumsal mutabakat gerektiren durumlarda)
            </li>
            <li>
              <strong>İletişim bilgileri:</strong> e-posta adresi, telefon
              numarası, KEP adresi, posta adresi
            </li>
            <li>
              <strong>Finansal bilgiler:</strong> bağışın miktarı, banka
              hareketi referansı, IBAN (sadece banka bildirimindeki görünür
              kısmı)
            </li>
            <li>
              <strong>Müşteri işlem bilgileri:</strong> talep kayıtları, destek
              yazışmaları, çağrı kayıtları
            </li>
            <li>
              <strong>İşlem güvenliği:</strong> IP adresi, oturum bilgileri,
              erişim logları
            </li>
            <li>
              <strong>Pazarlama tercihleri:</strong> iletişim onayları ve bunun
              geri çekilmesi
            </li>
          </ul>
        </LegalSection>

        <LegalSection number="3" title="Kişisel Veri İşleme Amaçları">
          <p>Kişisel verileriniz aşağıdaki amaçlarla işlenmektedir:</p>
          <ul className="list-disc pl-6 space-y-1.5">
            <li>
              Valilik onaylı yardım kampanyalarının şeffaf yönetimi ve takibi
            </li>
            <li>
              Bağış işlemlerinin kayıt altına alınması ve değiştirilemez
              şeffaflık merkezinde yayımlanması (ad-soyad maskelenerek)
            </li>
            <li>Bağışçı, kampanya sorumlusu ve gönüllü iletişimi</li>
            <li>
              Hukuki yükümlülüklerin yerine getirilmesi (5072 sayılı Yardım
              Toplama Kanunu dahil)
            </li>
            <li>Valilik denetimlerine cevap verme yükümlülüğü</li>
            <li>Hizmet kalitesinin iyileştirilmesi ve teknik destek</li>
            <li>Kurumsal bağış için vergi bilgilendirme</li>
            <li>Güvenlik izleme ve saldırı önleme</li>
          </ul>
        </LegalSection>

        <LegalSection number="4" title="Hukuki Sebepler">
          <p>
            Kişisel verileriniz KVKK&apos;nın 5. ve 6. maddelerinde belirtilen
            aşağıdaki hukuki sebeplere dayanılarak işlenir:
          </p>
          <ul className="list-disc pl-6 space-y-1.5">
            <li>Kanunlarda açıkça öngörülmesi</li>
            <li>
              Bir sözleşmenin kurulması veya ifası ile doğrudan ilgili olması
            </li>
            <li>Veri sorumlusunun hukuki yükümlülüğünü yerine getirmesi</li>
            <li>Temel hak ve özgürlükleri ihlal etmemek kaydıyla meşru menfaat</li>
            <li>
              İlgili kişinin açık rızasının bulunması (pazarlama iletişimi,
              isteğe bağlı işlemler için)
            </li>
          </ul>
        </LegalSection>

        <LegalSection number="5" title="Kişisel Veri Toplama Yöntemleri">
          <p>Kişisel verileriniz aşağıdaki kanallardan toplanmaktadır:</p>
          <ul className="list-disc pl-6 space-y-1.5">
            <li>Kampanya sayfası üzerinden form gönderimleri</li>
            <li>Bağış için kullanılan banka ve ödeme altyapısı bildirimleri</li>
            <li>Mesajlaşma, e-posta ve sesli hat iletişimleri</li>
            <li>
              Kumbara açılış tutanakları, stant kapanış raporları (fotoğraf ve
              metin)
            </li>
            <li>Çerezler ve benzer takip teknolojileri (bkz. Gizlilik Politikası)</li>
          </ul>
        </LegalSection>

        <LegalSection number="6" title="Kişisel Verilerin Aktarımı">
          <p>
            Kişisel verileriniz; yalnızca yukarıda belirtilen amaçların
            gerektirdiği ölçüde ve KVKK&apos;nın 8. ve 9. maddelerinde
            belirtilen şartlara uygun olarak aşağıdaki taraflarla
            paylaşılabilir:
          </p>
          <ul className="list-disc pl-6 space-y-1.5">
            <li>
              Kampanya sahibi dernek / vakıf / komisyon (bağış detayları ve
              raporlar)
            </li>
            <li>
              Yetkili kamu kurumları (valilik, Cumhuriyet Başsavcılığı, vergi
              daireleri) — hukuki yükümlülük çerçevesinde
            </li>
            <li>Hizmet aldığımız bulut altyapı sağlayıcısı — veri işleyen</li>
            <li>Bankalar ve elektronik ödeme kuruluşları</li>
            <li>Bağımsız denetim firmaları — sadece ilgili denetim süresince</li>
          </ul>
          <p>
            Kişisel verileriniz yurt dışına açık rızanız olmadan aktarılmaz;
            bulut hizmet sağlayıcımızın sunucuları Türkiye&apos;de konumludur.
          </p>
        </LegalSection>

        <LegalSection number="7" title="Saklama Süreleri">
          <p>
            Kişisel veriler, ilgili mevzuatın öngördüğü süre boyunca ve/veya
            işleme amacının gerekli kıldığı süre boyunca saklanır:
          </p>
          <ul className="list-disc pl-6 space-y-1.5">
            <li>
              Bağış ve harcama kayıtları: ilgili mali mevzuat gereği 10 yıl
            </li>
            <li>
              Kampanya şeffaflık merkezindeki maskelenmiş kayıtlar: kampanya
              süresi + 10 yıl (değişmez)
            </li>
            <li>İletişim kayıtları: 3 yıl</li>
            <li>Çerez ve log kayıtları: azami 2 yıl</li>
            <li>
              Pazarlama izni geri çekildiğinde ilgili veriler derhal silinir
            </li>
          </ul>
        </LegalSection>

        <LegalSection number="8" title="İlgili Kişinin Hakları (KVKK Md. 11)">
          <p>
            KVKK&apos;nın 11. maddesi uyarınca kişisel verileriniz ile ilgili
            olarak:
          </p>
          <ul className="list-disc pl-6 space-y-1.5">
            <li>Kişisel veri işlenip işlenmediğini öğrenme</li>
            <li>İşlenmişse buna ilişkin bilgi talep etme</li>
            <li>İşlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme</li>
            <li>Yurt içinde ve yurt dışında aktarıldığı üçüncü kişileri bilme</li>
            <li>Eksik veya yanlış işlenmişse düzeltilmesini isteme</li>
            <li>
              KVKK&apos;nın 7. maddesi çerçevesinde silinmesini veya yok
              edilmesini isteme
            </li>
            <li>Düzeltme / silme / yok etme işlemlerinin üçüncü kişilere bildirilmesini isteme</li>
            <li>
              Otomatik işleme yoluyla analiz edilmesi sonucu aleyhinize çıkan
              bir sonuca itiraz etme
            </li>
            <li>Kanuna aykırı işleme sebebiyle zarar uğramanız hâlinde zararın giderilmesini talep etme</li>
          </ul>
        </LegalSection>

        <LegalSection number="9" title="Başvuru Yöntemi">
          <p>
            Yukarıdaki haklarınızı kullanmak için{" "}
            <a
              href={`mailto:${siteConfig.contact.email}`}
              className="text-secondary font-semibold hover:underline"
            >
              {siteConfig.contact.email}
            </a>{" "}
            adresine kimliğinizi doğrulayan bilgilerle birlikte yazılı başvuru
            yapabilirsiniz. Başvurunuz KVKK&apos;nın 13. maddesi uyarınca en
            geç <strong>30 (otuz) gün</strong> içinde ücretsiz olarak
            sonuçlandırılır.
          </p>
          <p>
            Başvurunuzun Veri Sorumlusuna Başvuru Usul ve Esasları Hakkında
            Tebliğ&apos;de belirtilen asgari bilgileri içermesi gerekmektedir.
          </p>
        </LegalSection>

        <LegalSection number="10" title="Değişiklikler">
          <p>
            KAMPANYATAKİP, işbu aydınlatma metnini gerektiğinde güncelleyebilir.
            Güncel metin her zaman{" "}
            <Link
              href={siteConfig.urls.kvkk}
              className="text-secondary font-semibold hover:underline"
            >
              kampanyatakip.com/kvkk
            </Link>{" "}
            adresinde yayımlanır. Önemli değişiklikler kullanıcılara e-posta
            yoluyla bildirilir.
          </p>
        </LegalSection>
      </LegalArticle>
    </>
  );
}
