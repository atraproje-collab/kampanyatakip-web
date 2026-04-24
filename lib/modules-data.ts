import {
  BarChart3,
  Bell,
  CreditCard,
  Database,
  EyeOff,
  FileText,
  Globe,
  HardDrive,
  MessageCircle,
  Palette,
  Phone,
  QrCode,
  Radio,
  Receipt,
  Server,
  Shield,
  Store,
  Users,
  type LucideIcon,
} from "lucide-react";

export interface ModuleHowToStep {
  title: string;
  description: string;
}

export interface ModuleData {
  slug: string;
  title: string;
  shortTitle: string;
  description: string;
  icon: LucideIcon;
  heroText: string;
  features: string[];
  howItWorks: ModuleHowToStep[];
  benefits: string[];
  technicalDetails: string[];
  relatedModules: string[];
}

export const MODULES: ModuleData[] = [
  {
    slug: "para-takibi",
    shortTitle: "Para Takibi",
    title: "Para Takibi ve Anlık Bildirim",
    description:
      "Banka hesabına gelen her bağış saniyeler içinde otomatik kayda alınır, kampanya yöneticisine anlık bildirim düşer.",
    icon: CreditCard,
    heroText:
      "Para takibi KAMPANYATAKİP'in kalbidir. Banka hesabına gelen her EFT, havale ve FAST ödemesi saniyeler içinde otomatik olarak değiştirilemez kayıt sistemine işlenir. Tutar, gönderen adı ve açıklama alanı analiz edilir; bağış kaynağı kategorize edilir; kampanya yöneticisine anlık mesaj bildirimi düşer. Mükerrer kayıt koruması sayesinde aynı işlem iki kez yazılmaz.",
    features: [
      "Banka bildirimlerinden otomatik bağış kaydı",
      "Gönderen ve tutar bilgisi otomatik çıkarılır",
      "Değiştirilemez kayıt sistemine anlık işlenir",
      "Mükerrer kayıt koruması (aynı işlem ikilenmez)",
      "Kampanya yöneticisine anlık mesajlaşma bildirimi",
      "Şeffaflık merkezinde saniyeler içinde görünür",
    ],
    howItWorks: [
      {
        title: "Banka bildirimi alınır",
        description:
          "Hesaba gelen her bağış için banka bildirimi sistem tarafından yakalanır.",
      },
      {
        title: "Veri çıkarılır",
        description:
          "Tutar, gönderen adı ve referans açıklama otomatik ayrıştırılır.",
      },
      {
        title: "Değiştirilemez kayda işlenir",
        description:
          "Kayıt append-only veritabanına zaman damgasıyla yazılır, silinemez.",
      },
      {
        title: "Yönetici bilgilendirilir",
        description:
          "Kampanya sorumlusuna bağışın detayı anlık olarak mesaj üzerinden iletilir.",
      },
    ],
    benefits: [
      "Manuel veri girişi ortadan kalkar",
      "Bağışçıya dakikalar içinde teşekkür edebilirsiniz",
      "Günlük mutabakat süresi sıfıra yaklaşır",
      "Hiçbir bağış gözden kaçmaz",
    ],
    technicalDetails: [
      "Banka webhook / API entegrasyonu ile gerçek zamanlı tetikleme",
      "Tutar ve gönderen için regex + dil modeli eşleştirme",
      "İmzalı append-only kayıt deposu",
    ],
    relatedModules: ["seffaflik-merkezi", "otomatik-raporlama", "onemli-olay-bildirimleri"],
  },
  {
    slug: "kumbara-takip",
    shortTitle: "Kumbara Takip",
    title: "Kumbara Takip Sistemi",
    description:
      "Her kumbara benzersiz numarayla sisteme kayıtlı; teslim, açılış ve sayım tutanakları fotoğrafla belgelenir.",
    icon: QrCode,
    heroText:
      "Her kumbara benzersiz bir numara ve QR kod ile sisteme tanımlanır. Teslim adresi, sorumlu kişi, teslim tutanağı ve kurulum fotoğrafı kayıt altına alınır. Açılışta sayım tutanağı ve fotoğraf mesaj üzerinden gönderildiğinde sistem yapay zeka ile görüntüyü okur, tutarı çıkarır ve kumbara geliri olarak ayrı kategoride kayda geçirir.",
    features: [
      "Benzersiz QR kod ile kumbara tanımlama",
      "Teslim adresi, sorumlu kişi, teslim fotoğrafı",
      "Açılış sayım tutanağı ve fotoğraf zorunlu",
      "AI ile fotoğraftan tutar okuma (OCR)",
      "Kumbara geliri ayrı kategoride raporlama",
      "Tüm geçmiş işlemler kumbara bazında listelenir",
    ],
    howItWorks: [
      {
        title: "Kumbara tanımlanır",
        description:
          "Her kumbara için adres, sorumlu ve teslim fotoğrafı sisteme yüklenir.",
      },
      {
        title: "QR kod üretilir",
        description:
          "Kumbaranın üzerine yapıştırılacak QR kod otomatik oluşturulur.",
      },
      {
        title: "Açılış fotoğrafı gönderilir",
        description:
          "Kumbara açılışında sayım tutanağı ve sayılan para fotoğrafı mesaj yoluyla sisteme iletilir.",
      },
      {
        title: "AI okur ve kaydeder",
        description:
          "Tutar otomatik çıkarılır, kumbara #'sine işlenir, yönetici bilgilendirilir.",
      },
    ],
    benefits: [
      "Saha ekibinin elle giriş yapma yükü biter",
      "Her kumbaranın gelir geçmişi şeffaf ve denetlenebilir",
      "Kayıp kumbara veya eksik tutanak anında tespit edilir",
      "Valilik denetimine hazır dijital arşiv",
    ],
    technicalDetails: [
      "QR kod generator + saha baskı seti",
      "Görüntüden tutar çıkarımı için dil modeli destekli OCR",
      "Her kumbara için versiyonlu işlem geçmişi",
    ],
    relatedModules: ["stant-takip", "gonullu-yonetim", "seffaflik-merkezi"],
  },
  {
    slug: "stant-takip",
    shortTitle: "Stant Takip",
    title: "Stant Takip Sistemi",
    description:
      "AVM ve etkinlik stantları için konum, sorumlu, açılış-kapanış fotoğrafları ve günlük gelir takibi.",
    icon: Store,
    heroText:
      "Saha stantları dijital olarak yönetilir. Her stant benzersiz numara ile tanımlanır; konum, sorumlu gönüllü, açılış-kapanış saatleri ve kurulum fotoğrafı kayıt altına alınır. Günlük kapanışta toplanan tutar mesaj üzerinden sisteme iletilir ve stant geliri olarak ayrı kategoride raporlanır.",
    features: [
      "Her stant için benzersiz numara ve profil",
      "Konum, sorumlu ve açılış-kapanış saati",
      "Kurulum + kapanış fotoğraflarıyla belgeleme",
      "Günlük kapanış tutarı doğrudan mesaj ile girilir",
      "Stant bazlı gelir trendi ve karşılaştırma",
    ],
    howItWorks: [
      {
        title: "Stant açılır",
        description:
          "Kurulum fotoğrafı ve açılış saati sisteme yüklenir, stant aktif hâle gelir.",
      },
      {
        title: "Gün içinde bağışlar toplanır",
        description:
          "Saha ekibi bağışları standart forma yazar veya mobil bağış aparatıyla işler.",
      },
      {
        title: "Kapanış raporu iletilir",
        description:
          "Günün sonunda sayım fotoğrafı + toplam tutar mesaj üzerinden iletilir.",
      },
      {
        title: "Gelir kategorize edilir",
        description:
          "Tutar ayrı kategoride kaydedilir, stant performans panelinde yer alır.",
      },
    ],
    benefits: [
      "Hangi lokasyonun en verimli olduğu anında görünür",
      "Gönüllü-stant eşleşmesi ve vardiya yönetimi kolaylaşır",
      "Günlük kapanış tutanakları denetime hazır",
      "Stant kayıpları erken tespit edilir",
    ],
    technicalDetails: [
      "Coğrafi konum + zaman damgası bazlı aktivite kaydı",
      "Fotoğraflı kapanış tutanağı arşivi",
      "Günlük/haftalık stant performans analitiği",
    ],
    relatedModules: ["kumbara-takip", "gonullu-yonetim", "gelir-gider-seffaflik"],
  },
  {
    slug: "gonullu-yonetim",
    shortTitle: "Gönüllü Yönetimi",
    title: "Gönüllü Yönetim Sistemi",
    description:
      "Kampanyada görev alan her gönüllü sisteme kayıtlı; görev, sorumlu olduğu kumbara ve stantlar takip edilir.",
    icon: Users,
    heroText:
      "Kampanyada rol alan her gönüllü ad, soyad, telefon, görev ve sorumlu olduğu kumbara/stant bilgisiyle sisteme kaydedilir. Ekip koordinasyonu tek ekrandan yapılır; kim nerede, ne yapıyor ve son ne zaman aktif oldu görünür. Gönüllüye özel günlük görev listesi mesaj üzerinden otomatik iletilir.",
    features: [
      "Gönüllü profili: ad, iletişim, görev, bölge",
      "Sorumlu olduğu kumbaralar ve stantlar bağlı",
      "Günlük görev listesi mesaj yoluyla iletilir",
      "Gönüllü aktivite geçmişi ve katkı raporu",
      "Rol tabanlı yetki sistemi",
    ],
    howItWorks: [
      {
        title: "Gönüllü kaydı",
        description:
          "Koordinatör yeni gönüllüyü sisteme ekler; KVKK onayı alınır.",
      },
      {
        title: "Görev ataması",
        description:
          "Gönüllü bir veya daha fazla kumbara, stant veya göreve atanır.",
      },
      {
        title: "Günlük akış",
        description:
          "Gönüllüye günün görev listesi mesaj yoluyla otomatik düşer.",
      },
      {
        title: "Katkı raporlanır",
        description:
          "Gönüllünün yaptığı işler aylık aktivite raporunda özetlenir.",
      },
    ],
    benefits: [
      "Koordinatörler 'kim ne yapıyor?' sorusunu saniyelerde yanıtlar",
      "Gönüllü-görev eşleşmesinde boşluk kalmaz",
      "Aktif olmayan gönüllüler tespit edilir",
      "Aylık gönüllü raporları otomatik hazırlanır",
    ],
    technicalDetails: [
      "Rol tabanlı erişim yetkisi (RBAC)",
      "KVKK uyumlu veri saklama",
      "Mesajlaşma kanalına bağlı görev otomasyonu",
    ],
    relatedModules: ["kumbara-takip", "stant-takip", "otomatik-raporlama"],
  },
  {
    slug: "canli-yayin-gelir-takibi",
    shortTitle: "Canlı Yayın Geliri",
    title: "Canlı Yayın Gelir Takibi",
    description:
      "Kısa video platformlarındaki canlı yayın gelirleri fotoğraftan okunur, banka kaydıyla otomatik eşleştirilir.",
    icon: Radio,
    heroText:
      "Kısa video platformlarında düzenlenen canlı yayın sonrasında yayın özet ekranının fotoğrafı mesaj üzerinden sisteme iletilir. Sistem yapay zeka ile ekrandaki dijital hediye birim sayısını ve TL karşılığını okur. Paranın 1-3 iş günü içinde bankaya yansıması beklenir; para gelince banka kaydıyla otomatik eşleştirilir, gelmez veya tutar uyuşmazsa otomatik uyarı üretilir.",
    features: [
      "Yayın özeti fotoğrafından OCR ile tutar okuma",
      "Platform birimini TL'ye otomatik çeviri",
      "Banka kaydıyla otomatik eşleştirme (1-3 gün)",
      "Eksik/uyuşmazlık durumunda otomatik uyarı",
      "Canlı yayın geliri ayrı kategoride raporlanır",
    ],
    howItWorks: [
      {
        title: "Yayın biter",
        description:
          "Canlı yayın sona erdiğinde özet ekranının fotoğrafı çekilir.",
      },
      {
        title: "Fotoğraf gönderilir",
        description:
          "Mesaj üzerinden KAMPANYATAKİP'e iletilir, AI görüntüyü analiz eder.",
      },
      {
        title: "Gelir beklemeye alınır",
        description:
          "Platform ödemesi için 1-3 iş günü beklenir; sistem takip moduna alır.",
      },
      {
        title: "Banka ile eşleşir",
        description:
          "Banka hareketi geldiğinde otomatik eşleşir, tutar onaylanır.",
      },
    ],
    benefits: [
      "Yayınlardan elde edilen gelir gözden kaçmaz",
      "Platform-banka mutabakatı otomatik",
      "Eksik ödeme tespiti anında yapılır",
      "Bağışçılara şeffaf canlı yayın raporu",
    ],
    technicalDetails: [
      "Görsel hediye birimi tanıma için özel eğitilmiş model",
      "Beklemede kalan yayın kayıtları için eşleştirme kuyruğu",
      "Sapma toleransı: yüzde eşik değerine göre uyarı",
    ],
    relatedModules: ["para-takibi", "gelir-gider-seffaflik", "onemli-olay-bildirimleri"],
  },
  {
    slug: "gelir-gider-seffaflik",
    shortTitle: "Gelir-Gider Şeffaflığı",
    title: "Gelir-Gider Şeffaflık Modülü",
    description:
      "Tüm gelir kaynakları ayrı kategoride; her harcama belgeyle eşleştirilmeden sisteme işlenemez.",
    icon: FileText,
    heroText:
      "Tüm gelir kaynakları ayrı kategorilerde izlenir: banka havalesi, kumbara geliri, stant geliri, canlı yayın geliri ve kurumsal bağışlar birbirinden ayrı tutulur. Belgesiz hiçbir harcama sisteme işlenemez; hastane, ilaç, ulaşım ve reklam giderleri mutlaka fatura veya makbuzla eşleştirilir. Toplam gelir, toplam gider ve kalan bakiye her an anlık görünür.",
    features: [
      "Gelir kaynakları ayrı kategoride (havale, kumbara, stant, yayın, kurumsal)",
      "Belgesiz harcama sistem tarafından engellenir",
      "Her gider için fatura / makbuz / sözleşme zorunlu",
      "Kategori bazlı gider analizi",
      "Toplam gelir - gider - kalan bakiye anlık",
    ],
    howItWorks: [
      {
        title: "Harcama talebi",
        description:
          "Kampanya sorumlusu sisteme yeni harcama talebi girer.",
      },
      {
        title: "Belge yüklenir",
        description:
          "Fatura veya makbuz yüklenmeden işlem tamamlanamaz.",
      },
      {
        title: "Kategori atanır",
        description:
          "Gider türü (tedavi, ulaşım, reklam vb.) kategorize edilir.",
      },
      {
        title: "Şeffaflık merkezine yansır",
        description:
          "Belge ve kategori anında kamu şeffaflık merkezinde görünür.",
      },
    ],
    benefits: [
      "Her kuruşun izi sürülebilir",
      "Denetim raporu anında hazır",
      "Belgesiz işlem riski ortadan kalkar",
      "Bağışçı güveni somut belgelerle kazanılır",
    ],
    technicalDetails: [
      "Dosya depolama + işlem kaydı çapraz referansı",
      "Belge zorunluluğu veritabanı kısıtı ile uygulanır",
      "PDF / JPG / PNG belge formatları desteklenir",
    ],
    relatedModules: ["seffaflik-merkezi", "para-takibi", "otomatik-raporlama"],
  },
  {
    slug: "ai-mesajlasma-asistani",
    shortTitle: "AI Mesajlaşma Asistanı",
    title: "Yapay Zeka Mesajlaşma Asistanı 7/24",
    description:
      "Bağışçı sorularını otomatik yanıtlayan, dekont okuyan, kumbara tutanağı işleyen 7/24 AI asistan.",
    icon: MessageCircle,
    heroText:
      "Yapay zeka destekli asistan bağışçıların sorularını 7 gün 24 saat otomatik yanıtlar. Banka dekontu geldiğinde OCR ile okuyarak kaydeder ve teşekkür mesajı gönderir. Kumbara tutanağı geldiğinde otomatik işler. Kampanya durumu sorulduğunda anlık veriyi bildirir. Aynı kişiden 5 saniye içinde birden fazla mesaj gelirse sistem bunları birleştirerek tek yanıt üretir.",
    features: [
      "7/24 otomatik bağışçı yanıtları",
      "Banka dekontu OCR ile işleme + teşekkür mesajı",
      "Kumbara / stant tutanağı otomatik tanıma",
      "'Kampanya ne durumda?' sorusuna anlık yanıt",
      "Çoklu mesaj birleştirme (5 sn pencere)",
      "Gerekirse insan operatöre devir",
    ],
    howItWorks: [
      {
        title: "Mesaj gelir",
        description:
          "Bağışçı kampanya mesajlaşma numarasına herhangi bir soru yazar.",
      },
      {
        title: "AI analiz eder",
        description:
          "Mesaj sınıflandırılır: dekont, tutanak, bilgi talebi, şikâyet.",
      },
      {
        title: "Otomatik yanıt üretilir",
        description:
          "Veri tabanından güncel bilgi çekilir, Türkçe doğal yanıt yazılır.",
      },
      {
        title: "Gerekirse insana yükselir",
        description:
          "Karmaşık talepler operatöre aktarılır, bağlam korunur.",
      },
    ],
    benefits: [
      "Bağışçılar saniyelerde yanıt alır",
      "Ekip üzerindeki operasyonel yük azalır",
      "Hiçbir mesaj cevapsız kalmaz",
      "Dekont işleme insan emeği olmadan biter",
    ],
    technicalDetails: [
      "Büyük dil modeli + kampanya-özel bilgi tabanı",
      "OCR + tutar/IBAN regex çıkarımı",
      "Rate-limit ve mesaj birleştirme algoritması",
    ],
    relatedModules: ["para-takibi", "sesli-bilgi-hatti", "onemli-olay-bildirimleri"],
  },
  {
    slug: "sesli-bilgi-hatti",
    shortTitle: "Sesli Bilgi Hattı",
    title: "5 Dilde 0850 Sesli Bilgi Hattı",
    description:
      "Kampanyaya özel 0850 numarası; 5 dilde anlık durum, toplanan tutar ve hedef yüzdesi otomatik yanıtlanır.",
    icon: Phone,
    heroText:
      "Kampanyaya özel Türk 0850 numarası tahsis edilir. Bağışçılar arayarak kampanyanın anlık durumunu, toplanan miktarı ve hedef yüzdesini öğrenir. Türkçe, İngilizce, Arapça, Almanca ve Fransızca olmak üzere 5 dilde hizmet verilir. Hat 24 saat açıktır.",
    features: [
      "Kampanyaya özel 0850 numarası",
      "5 dil desteği (TR, EN, AR, DE, FR)",
      "Toplanan tutar / hedef / ilerleme yanıtları",
      "Bağışçının tercih ettiği dili otomatik tanıma",
      "7/24 erişim",
    ],
    howItWorks: [
      {
        title: "Bağışçı arar",
        description:
          "Kampanyaya özel 0850 numarası otomatik karşılar.",
      },
      {
        title: "Dil seçilir",
        description:
          "5 dil seçeneği sunulur veya sesten otomatik algılanır.",
      },
      {
        title: "Soru sorulur",
        description:
          "Bağışçı sesli olarak kampanya hakkında soru sorar.",
      },
      {
        title: "Anlık yanıt",
        description:
          "Veritabanından güncel veri sesli olarak yanıtlanır.",
      },
    ],
    benefits: [
      "Teknolojiye yatkın olmayan bağışçılar için erişilebilirlik",
      "Uluslararası bağışçılar kendi dilinde bilgi alır",
      "Yoğun dönemlerde çağrı merkezi yükünü sıfırlar",
      "Kurumsal bir imaj sağlar",
    ],
    technicalDetails: [
      "IVR sistemi + çok dilli sesli asistan",
      "Gerçek zamanlı veri okuma + sesli sentez",
      "Çağrı kayıtları KVKK uyumlu arşivlenir",
    ],
    relatedModules: ["ai-mesajlasma-asistani", "kampanya-sayfasi", "seffaflik-merkezi"],
  },
  {
    slug: "kampanya-sayfasi",
    shortTitle: "Kampanya Sayfası",
    title: "Kampanya Web Sayfası ve Canlı Sayaç",
    description:
      "Kampanya hikayesi, canlı sayaç, ilerleme çubuğu, son bağışlar ve valilik belgesi tek sayfada.",
    icon: Globe,
    heroText:
      "Kampanya hikayesi, toplanan miktar, hedef, ilerleme çubuğu, bağışçı sayısı ve son bağışlar listesi gerçek zamanlı güncellenen web sayfasında yayınlanır. Valilik izin belgesi sayfada yer alır. Sayfa mobilde kusursuz çalışır; paylaşım için hazır meta etiketler ve görseller içerir.",
    features: [
      "Kampanya hikayesi + galeri + ekip bilgisi",
      "Anlık güncellenen bağış sayacı",
      "İlerleme çubuğu + hedef yüzdesi",
      "Son bağışlar canlı akışı",
      "Valilik belgesi ve trust rozetleri",
      "Paylaşım için hazır OG etiketleri",
    ],
    howItWorks: [
      {
        title: "Kurulum",
        description:
          "Kampanya bilgileri yüklenir, alan adı yapılandırılır, SSL aktif olur.",
      },
      {
        title: "Yayın",
        description:
          "Sayfa canlıya alınır, tüm modüller bağlanır.",
      },
      {
        title: "Canlı güncelleme",
        description:
          "Her bağış ve harcama sayfaya anında yansır.",
      },
      {
        title: "Paylaşım",
        description:
          "Sosyal medya paylaşımları için hazır görsel ve metin şablonları.",
      },
    ],
    benefits: [
      "Tek bir URL ile kampanyanın kamuoyu merkezi",
      "Bağışçılar için güven yaratan profesyonel görünüm",
      "Mobil ziyaretçilerde yüksek dönüşüm",
      "Paylaşım bariyeri düşer",
    ],
    technicalDetails: [
      "Next.js + CDN dağıtımı",
      "SSL + HTTP/2 + önbellek stratejisi",
      "Core Web Vitals standartlarına uyumlu",
    ],
    relatedModules: ["seffaflik-merkezi", "bagisci-gizlilik-maskesi", "para-takibi"],
  },
  {
    slug: "bagisci-gizlilik-maskesi",
    shortTitle: "Gizlilik Maskesi",
    title: "Bağışçı Gizlilik Maskesi",
    description:
      "Bağışçı adları K********* Y********* formatında maskelenir, KVKK uyumlu, tam anonimlik opsiyonu mevcut.",
    icon: EyeOff,
    heroText:
      "Bağışçı adları K********* Y********* formatında maskelenerek gösterilir. Bu yaklaşım hem bağışçının kimliğini korur hem de bağışın gerçekten yapıldığını doğrulanabilir kılar. İsteğe bağlı tam anonimlik seçeneği mevcuttur: bağışçı \"İsimsiz Bağışçı\" olarak listelenebilir. Tüm işleme KVKK uyumludur.",
    features: [
      "Otomatik isim maskeleme (K***** Y*****)",
      "Tam anonimlik opsiyonu",
      "KVKK uyumlu veri işleme",
      "Kurumsal bağışçı için şirket adı yayın izni",
      "Bağışçı isteği üzerine maske kaldırılabilir",
    ],
    howItWorks: [
      {
        title: "Bağış alınır",
        description:
          "Bağışçının adı ve soyadı sisteme kaydedilir.",
      },
      {
        title: "Maske uygulanır",
        description:
          "Sayfada ve raporlarda sadece baş harfler + yıldız karakterleri görünür.",
      },
      {
        title: "Anonim seçeneği",
        description:
          "Bağışçı mesaj yoluyla anonimlik isterse kayıt güncellenir.",
      },
      {
        title: "Kampanya sahibi görür",
        description:
          "Sadece yetkili kampanya yöneticisi gerçek isimleri görür.",
      },
    ],
    benefits: [
      "Bağışçıların kimliği korunur",
      "KVKK cezai riskleri ortadan kalkar",
      "Kurumsal bağışçılar için görünürlük seçeneği",
      "Şeffaflık ile gizlilik dengesi kurulur",
    ],
    technicalDetails: [
      "İsim maskeleme fonksiyonu + veritabanı sütun politikası",
      "KVKK uyumlu saklama süresi (varsayılan 10 yıl)",
      "Veri erişim logları tutulur",
    ],
    relatedModules: ["seffaflik-merkezi", "kampanya-sayfasi", "guvenlik-otomatik-yedek"],
  },
  {
    slug: "seffaflik-merkezi",
    shortTitle: "Şeffaflık Merkezi",
    title: "Şeffaflık Merkezi",
    description:
      "Tüm bağış ve harcamalar zaman damgasıyla değiştirilemez kayıt sisteminde; kamuya açık, denetime hazır.",
    icon: Shield,
    heroText:
      "Tüm bağışlar, kumbara açılışları, stant gelirleri, canlı yayın gelirleri ve giderler zaman damgasıyla değiştirilemez kayıt sistemine işlenir. Sonradan müdahale etmek teknik olarak mümkün değildir: hatalı giriş olursa düzeltme yeni bir kayıt olarak eklenir, orijinal kayıt silinmez. Şeffaflık merkezi kamuya açık yayınlanabilir ve valilik denetimine her an hazırdır.",
    features: [
      "Append-only (sadece ekleme) kayıt yapısı",
      "Her işlem zaman damgalı + imzalı",
      "Düzeltme yeni kayıt olarak eklenir, silme yok",
      "Kamuya açık görüntüleme URL'si",
      "Valilik denetim export'u (Excel / PDF)",
      "Belge ek'leri şeffaflık merkezinde listelenir",
    ],
    howItWorks: [
      {
        title: "İşlem tetiklenir",
        description:
          "Gelir veya gider kaydedildiğinde sistem otomatik çalışır.",
      },
      {
        title: "Kayda yazılır",
        description:
          "Append-only tabloya zaman damgası + imza ile eklenir.",
      },
      {
        title: "Kamuya yansır",
        description:
          "Şeffaflık merkezi URL'sinde saniyeler içinde görünür.",
      },
      {
        title: "Düzeltme gerekirse",
        description:
          "Yeni bir düzeltme kaydı eklenir; orijinal kayıt okunur kalır.",
      },
    ],
    benefits: [
      "Denetim raporu otomatik hazır",
      "Bağışçı güveni somut veriyle desteklenir",
      "Kampanya güvenilirliğini kamuya kanıtlar",
      "Geri dönüşü olmayan kayıt = hile riskini sıfırlar",
    ],
    technicalDetails: [
      "Append-only ilişkisel veritabanı yapısı",
      "Her kayıt için HMAC imza",
      "Kamuya açık okuma URL'si + CSV / Excel export",
    ],
    relatedModules: ["gelir-gider-seffaflik", "para-takibi", "guvenlik-otomatik-yedek"],
  },
  {
    slug: "guvenlik-otomatik-yedek",
    shortTitle: "Güvenlik & Yedek",
    title: "Güvenlik ve Otomatik Yedek",
    description:
      "Günlük otomatik yedek, siber saldırı koruması, hata durumunda anlık servis sağlayıcı uyarısı.",
    icon: HardDrive,
    heroText:
      "Tüm veriler her gün otomatik yedeklenir, yedekler coğrafi olarak ayrı bir depoda soğuk olarak saklanır. Siber saldırılara karşı kurumsal güvenlik katmanı (DDoS koruması, WAF) aktiftir. Herhangi bir hata oluştuğunda servis sağlayıcıya anında mesaj bildirimi gönderilir — kampanya sahibi sorundan önce haberdar olur.",
    features: [
      "Günlük otomatik veritabanı yedeği",
      "Coğrafi olarak ayrı soğuk depo",
      "DDoS koruması + WAF + rate-limit",
      "SSL sertifikası otomatik yenileme",
      "Anomali uyarısı servis sağlayıcıya anında düşer",
    ],
    howItWorks: [
      {
        title: "Yedek alınır",
        description:
          "Her gece belirlenen saatte tam veritabanı yedeği alınır.",
      },
      {
        title: "Uzak depoya taşınır",
        description:
          "Yedek coğrafi olarak ayrı bir güvenlik bölgesine kopyalanır.",
      },
      {
        title: "Saldırı filtrelenir",
        description:
          "Gelen trafiğin zararlı kısmı koruma katmanında engellenir.",
      },
      {
        title: "Hata uyarısı",
        description:
          "Sistem bir anormallik görürse servis sağlayıcıya anlık bildirim gönderir.",
      },
    ],
    benefits: [
      "Veri kaybı riski sıfıra yakın",
      "Saldırı anında kampanya erişilebilir kalır",
      "Sorunlar müşteri fark etmeden çözülür",
      "Yedekten geri dönüş saatler değil, dakikalar sürer",
    ],
    technicalDetails: [
      "PostgreSQL point-in-time recovery",
      "7 günlük artırımlı + 30 günlük tam yedek",
      "Kurumsal güvenlik katmanı (DDoS + WAF)",
    ],
    relatedModules: ["izole-sunucu", "seffaflik-merkezi", "onemli-olay-bildirimleri"],
  },
  {
    slug: "izole-sunucu",
    shortTitle: "İzole Sunucu",
    title: "İzole Kampanya Sunucusu",
    description:
      "Her kampanya için ayrı bir bulut sunucusu tahsis edilir; başka müşterilerle veri paylaşımı yoktur.",
    icon: Server,
    heroText:
      "Her kampanya için izole bir bulut sunucusu tahsis edilir. Veriler başka kampanyalarla hiçbir zaman paylaşılmaz. Bankacılık sektöründe \"single-tenant\" mimarisi olarak bilinen bu yaklaşım, kurumsal yazılımın ulaşabileceği en yüksek güvenlik standardını sunar.",
    features: [
      "Her kampanyaya özel sanal sunucu",
      "Veri ve işlem izolasyonu (single-tenant)",
      "Kaynak rezervasyonu (CPU, RAM)",
      "Özel alan adı + SSL",
      "Kurumsal SLA (üretim paketlerinde)",
    ],
    howItWorks: [
      {
        title: "Sunucu hazırlanır",
        description:
          "Kampanya özelinde bir sanal sunucu ayarlanır, güvenlik politikaları uygulanır.",
      },
      {
        title: "Kurulum yapılır",
        description:
          "Tüm KAMPANYATAKİP modülleri bu sunucuya kurulur.",
      },
      {
        title: "Alan adı bağlanır",
        description:
          "Kampanya alan adı sunucuya yönlendirilir, SSL sertifikası kurulur.",
      },
      {
        title: "Canlıya alınır",
        description:
          "Sunucu üretim trafiğine açılır, izleme başlar.",
      },
    ],
    benefits: [
      "Komşu müşteri kaynak tüketse bile etkilenmezsiniz",
      "Veri sızıntısı riski ortadan kalkar",
      "Kurumsal denetim gereksinimleri karşılanır",
      "Performans öngörülebilir kalır",
    ],
    technicalDetails: [
      "Linux KVM tabanlı sanallaştırma",
      "Özel ağ bölgesi + güvenlik duvarı",
      "İhtiyaca göre dikey ölçekleme",
    ],
    relatedModules: ["guvenlik-otomatik-yedek", "seffaflik-merkezi", "kampanya-sayfasi"],
  },
  {
    slug: "tasarim-araci-hesabi",
    shortTitle: "Tasarım Aracı",
    title: "Profesyonel Tasarım Aracı Hesabı",
    description:
      "Her kampanyaya özel profesyonel tasarım aracı hesabı; ₺240 aylık maliyet pakete dahildir.",
    icon: Palette,
    heroText:
      "Her kampanya için ayrı bir profesyonel tasarım aracı hesabı açılır. Sosyal medya gönderileri, afişler, kumbara etiketleri ve yazdırılabilir formlar bu hesapta hazırlanır, saklanır. Kampanya sahibi hesabı kendisi de kullanabilir, kendi ekibini davet edebilir. ₺240 aylık araç maliyeti tüm paketlere dahildir.",
    features: [
      "Kampanyaya özel hesap (paylaşımlı değil)",
      "Profesyonel tasarım şablonları",
      "Marka kiti: renk, yazı tipi, logo sabit",
      "Kampanya sahibi ekibine davet yetkisi",
      "Tüm tasarımlar ayrı arşivde saklanır",
      "₺240/ay araç maliyeti pakete dahil",
    ],
    howItWorks: [
      {
        title: "Hesap açılır",
        description:
          "Kurulum sırasında kampanyaya özel hesap oluşturulur.",
      },
      {
        title: "Marka kiti yüklenir",
        description:
          "Logo, renk paleti ve yazı tipleri otomatik uygulanır.",
      },
      {
        title: "Şablonlar hazır",
        description:
          "Sosyal medya, afiş ve yazıcı formatlarında hazır şablonlar sağlanır.",
      },
      {
        title: "Ekip davet edilir",
        description:
          "Kampanya gönüllüleri hesaba dahil edilebilir.",
      },
    ],
    benefits: [
      "Profesyonel görünümlü tasarım becerisi gerektirmez",
      "Kampanya boyunca marka tutarlılığı korunur",
      "Tüm görseller tek yerde arşivlenir",
      "Ek araç lisansı satın almanıza gerek yok",
    ],
    technicalDetails: [
      "Kampanya hesabı × paylaşımlı olmayan çalışma alanı",
      "Marka kiti + paylaşılan medya kütüphanesi",
      "Kampanya sonrası arşiv 1 yıl saklanır",
    ],
    relatedModules: ["kampanya-sayfasi", "otomatik-raporlama"],
  },
  {
    slug: "kurumsal-bagis-vergi",
    shortTitle: "Kurumsal Vergi",
    title: "Kurumsal Bağış Vergi Bilgilendirme",
    description:
      "Valilik onaylı kampanyalara kurumsal bağışlar KVK Madde 10 kapsamında vergiden düşülebilir; sistem bunu otomatik bildirir.",
    icon: Receipt,
    heroText:
      "Valilik onaylı kampanyalara yapılan kurumsal bağışların tamamı Kurumlar Vergisi Kanunu Madde 10 kapsamında vergi matrahından düşülebilir. Sistem bu bilgiyi kurumsal bağış tespit ettiğinde otomatik olarak şirkete iletir. Makbuz PDF, takip e-postası ve beyan dönemi hatırlatması paketlere göre devreye alınır.",
    features: [
      "Kurumsal bağış otomatik tespit",
      "KVK Madde 10 bilgilendirme e-postası",
      "Makbuz PDF otomatik üretim",
      "3 gün sonra takip e-postası",
      "Beyan dönemi hatırlatma (Nisan)",
      "Kurumsal bağışçı aylık raporu",
    ],
    howItWorks: [
      {
        title: "Kurumsal bağış algılanır",
        description:
          "Gönderen adı veya vergi numarasından şirket tespit edilir.",
      },
      {
        title: "Bilgilendirme gider",
        description:
          "KVK Madde 10 kapsamında vergi avantajı e-posta ile bildirilir.",
      },
      {
        title: "Makbuz üretilir",
        description:
          "Resmi makbuz PDF otomatik hazırlanır, şirkete iletilir.",
      },
      {
        title: "Hatırlatma gönderilir",
        description:
          "Kurumlar vergisi beyan dönemi yaklaştığında otomatik hatırlatma atılır.",
      },
    ],
    benefits: [
      "Kurumsal bağışçı sayısı ve hacmi artar",
      "Muhasebe süreci yükünüz azalır",
      "Şirketlere profesyonel bir izlenim bırakırsınız",
      "Bağışçı memnuniyeti yüksek kalır",
    ],
    technicalDetails: [
      "Gönderen isim/VKN eşleştirme algoritması",
      "E-posta şablonu + PDF makbuz üretici",
      "Beyan takvimi ile bağlı hatırlatma kuyruğu",
    ],
    relatedModules: ["gelir-gider-seffaflik", "otomatik-raporlama", "para-takibi"],
  },
  {
    slug: "otomatik-raporlama",
    shortTitle: "Otomatik Raporlama",
    title: "Günlük, Haftalık ve Aylık Otomatik Raporlama",
    description:
      "Bağış özetleri, kullanım bilgileri ve kampanya istatistikleri mesaj üzerinden otomatik iletilir.",
    icon: BarChart3,
    heroText:
      "Bağış özetleri, kullanım bilgileri ve kampanya istatistikleri mesaj üzerinden otomatik raporlanır. Günlük kısa özet, haftalık trend raporu ve aylık kapsamlı analiz otomatik hazırlanır ve kampanya sorumlusuna iletilir. Raporlar Excel veya PDF olarak da dışa aktarılabilir.",
    features: [
      "Günlük özet: toplam bağış, kumbara/stant geliri",
      "Haftalık trend: büyüme, kanal kırılımı",
      "Aylık kapsamlı: KPI'lar, hedef ilerlemesi",
      "Excel / PDF dışa aktarım",
      "Özelleştirilebilir rapor zamanı",
      "Paylaşılabilir link üretme",
    ],
    howItWorks: [
      {
        title: "Veri toplanır",
        description:
          "Tüm modüllerden gün içi veriler birleştirilir.",
      },
      {
        title: "Rapor hazırlanır",
        description:
          "Günlük / haftalık / aylık çerçevede otomatik derlenir.",
      },
      {
        title: "Mesajla iletilir",
        description:
          "Belirlenen saatte kampanya sorumlusuna otomatik düşer.",
      },
      {
        title: "Dışa aktarılır",
        description:
          "İstenirse Excel veya PDF olarak indirilebilir.",
      },
    ],
    benefits: [
      "Yönetici her gün kampanyayı tek bakışta görür",
      "Trend ve anomaliler erken fark edilir",
      "Yönetim kuruluna sunum için hazır rapor",
      "Denetim dönemine hazır aylık arşiv",
    ],
    technicalDetails: [
      "Önceden hesaplanmış KPI tabloları",
      "PDF üretici + Excel dışa aktarım motoru",
      "Cron tabanlı zamanlayıcı (kullanıcı ayarlanabilir)",
    ],
    relatedModules: ["gelir-gider-seffaflik", "para-takibi", "onemli-olay-bildirimleri"],
  },
  {
    slug: "onemli-olay-bildirimleri",
    shortTitle: "Olay Bildirimleri",
    title: "Kampanya Sorumlusuna Önemli Olay Bildirimleri",
    description:
      "Büyük bağış, kumbara açılışı, canlı yayın gelir uyarısı ve limit dolması gibi kritik olaylarda anında bildirim.",
    icon: Bell,
    heroText:
      "Her bağışta değil, yalnızca kritik olaylarda bildirim gönderilir. Böylece kampanya sorumlusu sürekli bildirim yağmuruna tutulmaz; gerçekten dikkat gerektiren durumlardan anında haberdar olur. Eşikler kampanyaya göre özelleştirilebilir.",
    features: [
      "Büyük bağış uyarısı (eşik ayarlanabilir)",
      "Kumbara / stant açılış bildirimi",
      "Canlı yayın gelir uyumsuzluk uyarısı",
      "Paket limit %80 uyarısı",
      "Sistem hatası / güvenlik uyarısı",
      "Uyarı geçmişi arşivlenir",
    ],
    howItWorks: [
      {
        title: "Olay tetiklenir",
        description:
          "Kritik bir koşul karşılandığında sistem olay üretir.",
      },
      {
        title: "Kural kontrol edilir",
        description:
          "Kampanyaya özel eşik değerleri değerlendirilir.",
      },
      {
        title: "Bildirim gönderilir",
        description:
          "Kampanya sorumlusuna mesaj üzerinden anlık uyarı düşer.",
      },
      {
        title: "Arşive alınır",
        description:
          "Tüm uyarılar aranabilir bir geçmiş olarak saklanır.",
      },
    ],
    benefits: [
      "Sorumlu sadece gerçekten önemli olaylarda uyarılır",
      "Büyük bağışlara dakikalar içinde teşekkür edilir",
      "Limit aşımı sürpriz fatura yaratmaz",
      "Güvenlik olayları saniyelerde bilinir",
    ],
    technicalDetails: [
      "Kural motoru + eşik yapılandırması",
      "Mesajlaşma kanalı entegrasyonu",
      "Sessiz saat / öncelik tablosu",
    ],
    relatedModules: ["para-takibi", "canli-yayin-gelir-takibi", "guvenlik-otomatik-yedek"],
  },
];

export function getModule(slug: string): ModuleData | undefined {
  return MODULES.find((m) => m.slug === slug);
}

export function getRelatedModules(slug: string): ModuleData[] {
  const module = getModule(slug);
  if (!module) return [];
  return module.relatedModules
    .map((s) => getModule(s))
    .filter((m): m is ModuleData => Boolean(m));
}
