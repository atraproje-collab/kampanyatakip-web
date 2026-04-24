export type DonationMethod =
  | "Banka Havalesi"
  | "Kredi Kartı"
  | `Kumbara #${string}`
  | `Stant #${string}`;

export type CurrencyCode = "TRY" | "USD" | "EUR";

export type RecentDonor = {
  id: number;
  name: string;
  amount: number;
  /** Native currency of the donation. New donations default to USD (primary campaign currency). */
  currency: CurrencyCode;
  method: string;
  time: string;
  timestamp?: number;
  isFresh?: boolean;
};

export type BankAccount = {
  currency: CurrencyCode;
  currencyLabel: string;
  bank: string;
  iban: string;
  accountName: string;
  swift: string;
};

export type IncomeRow = {
  date: string;
  source: string;
  amount: number;
  currency: CurrencyCode;
  details: string;
};

export type ExpenseRow = {
  date: string;
  category: string;
  amount: number;
  document: string;
  description: string;
  vendor: string;
};

export type Kumbara = {
  id: string;
  location: string;
  responsible: string;
  total: number;
  lastOpened: string;
};

export type Stant = {
  id: string;
  location: string;
  responsible: string;
  total: number;
  activeDays: number;
};

export type GalleryItem = {
  type: "photo" | "video";
  title: string;
  placeholder:
    | "family"
    | "hospital"
    | "donation-box"
    | "stand"
    | "video"
    | "volunteers"
    | "team"
    | "treatment";
};

export type TeamMember = {
  name: string;
  role: string;
  type: "doctor" | "coordinator" | "legal";
};

export type OfficialDocument = {
  id: string;
  kind: "official" | "medical" | "hospital";
  title: string;
  date: string;
  issuer?: string;
  doctor?: string;
  hospital?: string;
  number?: string;
  diagnosis?: string;
  amount?: string;
  description: string;
  signatory?: string;
  signatoryTitle?: string;
  body?: string[];
};

export type CampaignDocuments = {
  valilik: OfficialDocument;
  doktorRaporlari: OfficialDocument[];
  hastaneBelgeleri: OfficialDocument[];
};

export type CampaignData = {
  slug: string;
  title: string;
  subtitle: string;
  story: string;
  /** Primary currency of this campaign (what the counters lead with). */
  currency: CurrencyCode;
  /** Secondary currency shown under the primary figures for local context. */
  secondaryCurrency: CurrencyCode;
  goalUsd: number;
  raisedUsd: number;
  donorCount: number;
  daysLeft: number;
  createdAt: string;
  provinceApproval: {
    authority: string;
    decisionNumber: string;
    approvalDate: string;
  };
  bankAccounts: BankAccount[];
  recentDonors: RecentDonor[];
  transparency: {
    income: IncomeRow[];
    expenses: ExpenseRow[];
    kumbaralar: Kumbara[];
    stantlar: Stant[];
  };
  gallery: GalleryItem[];
  team: TeamMember[];
  documents: CampaignDocuments;
};

export const demoCampaign: CampaignData = {
  slug: "minik-defne",
  title: "Minik Defne'ye Umut Ol",
  subtitle: "8 Aylık Defne Bebek · SMA Tip 1 · Zolgensma Tedavisi",

  story: `8 aylık minik Defne bebeğimiz, Spinal Musküler Atrofi Tip 1 hastası olarak dünyaya geldi. SMA, bebeklerin kas kontrolünü yitirdiği, tedavi edilmezse yaşam beklentisinin 2 yaşına kadar düştüğü genetik bir hastalıktır.

Defne için tek umut: Zolgensma gen tedavisi. Tek doz, tek şans. Amerika'da üretilen bu ilaç, Türkiye'de henüz SGK kapsamında değil.

Tedavinin toplam maliyeti: 60.000.000 TL. Zamanla yarışıyoruz — Defne 2 yaşına girmeden tedaviyi almalı.

İstanbul Valiliği onayıyla açtığımız bu kampanya, KAMPANYATAKİP platformu üzerinden şeffaf şekilde yürütülmektedir. Her bağış anında kayıt altına alınır, her harcama belgelendirilir.`,

  currency: "USD",
  secondaryCurrency: "TRY",
  goalUsd: 2_100_000,
  raisedUsd: 1_247_500,
  donorCount: 12847,
  daysLeft: 87,
  createdAt: "2026-01-27",

  provinceApproval: {
    authority: "İstanbul Valiliği",
    decisionNumber: "2026/4521",
    approvalDate: "2026-01-25",
  },

  bankAccounts: [
    {
      currency: "TRY",
      currencyLabel: "Türk Lirası (TL)",
      bank: "Ziraat Bankası",
      iban: "TR98 0006 2000 0000 0062 9562 28",
      accountName: "Defne Yardım Hesabı",
      swift: "TCZBTR2A",
    },
    {
      currency: "USD",
      currencyLabel: "Amerikan Doları (USD)",
      bank: "Ziraat Bankası",
      iban: "TR45 0006 2000 0000 0062 9562 35",
      accountName: "Defne Yardım Hesabı",
      swift: "TCZBTR2A",
    },
    {
      currency: "EUR",
      currencyLabel: "Euro (EUR)",
      bank: "Ziraat Bankası",
      iban: "TR22 0006 2000 0000 0062 9562 42",
      accountName: "Defne Yardım Hesabı",
      swift: "TCZBTR2A",
    },
  ],

  recentDonors: [
    { id: 1, name: "K***** Y*****", amount: 500, currency: "TRY", method: "Banka Havalesi", time: "2 dakika önce" },
    { id: 2, name: "A**** D****", amount: 30, currency: "USD", method: "Kredi Kartı", time: "5 dakika önce" },
    { id: 3, name: "M***** T*****", amount: 250, currency: "TRY", method: "Banka Havalesi", time: "8 dakika önce" },
    { id: 4, name: "Ş**** K****", amount: 100, currency: "TRY", method: "Kredi Kartı", time: "12 dakika önce" },
    { id: 5, name: "İsimsiz Bağışçı", amount: 150, currency: "USD", method: "Banka Havalesi", time: "15 dakika önce" },
    { id: 6, name: "E*** A*****", amount: 750, currency: "TRY", method: "Kredi Kartı", time: "22 dakika önce" },
    { id: 7, name: "H***** B*****", amount: 50, currency: "EUR", method: "Banka Havalesi", time: "31 dakika önce" },
    { id: 8, name: "İsimsiz Bağışçı", amount: 300, currency: "USD", method: "Banka Havalesi", time: "45 dakika önce" },
    { id: 9, name: "Z*** Ç*****", amount: 300, currency: "TRY", method: "Kumbara #12 (Kadıköy)", time: "1 saat önce" },
    { id: 10, name: "M**** K*****", amount: 2000, currency: "TRY", method: "Kredi Kartı", time: "1 saat önce" },
    { id: 11, name: "D**** G*****", amount: 75, currency: "USD", method: "Banka Havalesi", time: "2 saat önce" },
    { id: 12, name: "İsimsiz Bağışçı", amount: 250, currency: "TRY", method: "Kumbara #5 (Şişli)", time: "3 saat önce" },
    { id: 13, name: "B**** Y*****", amount: 1000, currency: "TRY", method: "Banka Havalesi", time: "4 saat önce" },
    { id: 14, name: "İsimsiz Bağışçı", amount: 500, currency: "USD", method: "Banka Havalesi", time: "5 saat önce" },
    { id: 15, name: "R**** S*****", amount: 100, currency: "EUR", method: "Kredi Kartı", time: "6 saat önce" },
    { id: 16, name: "F**** O*****", amount: 400, currency: "TRY", method: "Banka Havalesi", time: "8 saat önce" },
    { id: 17, name: "T**** A*****", amount: 1200, currency: "TRY", method: "Stant #3 (İstinye Park)", time: "10 saat önce" },
    { id: 18, name: "C*** Y*****", amount: 25, currency: "USD", method: "Banka Havalesi", time: "14 saat önce" },
    { id: 19, name: "İsimsiz Bağışçı", amount: 1000, currency: "USD", method: "Banka Havalesi", time: "20 saat önce" },
    { id: 20, name: "S**** K*****", amount: 300, currency: "TRY", method: "Kumbara #8 (Beşiktaş)", time: "1 gün önce" },
  ],

  transparency: {
    income: [
      { date: "2026-04-24", source: "Banka Havalesi Toplamı (₺)", amount: 852340, currency: "TRY", details: "Bugünkü toplam (437 bağış)" },
      { date: "2026-04-24", source: "Kurumsal Bağış (USD)", amount: 15000, currency: "USD", details: "Uluslararası kurumsal destek" },
      { date: "2026-04-23", source: "Kredi Kartı Toplamı", amount: 324500, currency: "TRY", details: "Dünkü toplam (189 bağış)" },
      { date: "2026-04-23", source: "Almanya Diaspora Havalesi", amount: 500, currency: "EUR", details: "Münih KAMPANYA grubu" },
      { date: "2026-04-23", source: "Kumbara #12 (Kadıköy Meydan)", amount: 3450, currency: "TRY", details: "Açılış tutanağı mevcut" },
      { date: "2026-04-22", source: "Stant #3 (İstinye Park)", amount: 12850, currency: "TRY", details: "Günlük kapanış raporu" },
      { date: "2026-04-22", source: "Banka Havalesi Toplamı (₺)", amount: 678900, currency: "TRY", details: "432 bağış" },
      { date: "2026-04-21", source: "Canlı Yayın Geliri", amount: 45600, currency: "TRY", details: "Sosyal medya canlı yayını (20.04.2026)" },
      { date: "2026-04-20", source: "Kurumsal Bağış", amount: 1000000, currency: "TRY", details: "X Holding A.Ş." },
      { date: "2026-04-19", source: "ABD Havalesi", amount: 5000, currency: "USD", details: "New York bağışçı grubu" },
      { date: "2026-04-19", source: "Banka Havalesi Toplamı (₺)", amount: 543200, currency: "TRY", details: "298 bağış" },
      { date: "2026-04-18", source: "Banka Havalesi (₺)", amount: 5000, currency: "TRY", details: "Bireysel bağış" },
    ],
    expenses: [
      { date: "2026-04-22", category: "Tedavi Ön Ödeme", amount: 5000000, document: "#", description: "Zolgensma rezervasyon ücreti", vendor: "Novartis Pharma" },
      { date: "2026-04-20", category: "Hastane Transfer", amount: 12500, document: "#", description: "İlk muayene ve testler", vendor: "Amerikan Hastanesi" },
      { date: "2026-04-18", category: "Tıbbi Malzeme", amount: 3450, document: "#", description: "Genetik test kiti", vendor: "Genomed Lab" },
      { date: "2026-04-15", category: "Ulaşım", amount: 8900, document: "#", description: "Aile için uçak bileti (tedavi için ABD)", vendor: "Turkish Airlines" },
      { date: "2026-04-10", category: "Banka İşlem Ücreti", amount: 2400, document: "#", description: "Uluslararası havale komisyonu", vendor: "Ziraat Bankası" },
    ],
    kumbaralar: [
      { id: "12", location: "Kadıköy Meydan", responsible: "Ahmet Y.", total: 23450, lastOpened: "2026-04-23" },
      { id: "13", location: "Bakırköy Pazar", responsible: "Mehmet K.", total: 18650, lastOpened: "2026-04-22" },
      { id: "14", location: "Üsküdar Çarşı", responsible: "Zeynep A.", total: 15200, lastOpened: "2026-04-21" },
      { id: "15", location: "Beşiktaş İskele", responsible: "Fatma T.", total: 12800, lastOpened: "2026-04-20" },
      { id: "16", location: "Eminönü Rıhtım", responsible: "Hasan D.", total: 9450, lastOpened: "2026-04-19" },
    ],
    stantlar: [
      { id: "3", location: "İstinye Park AVM", responsible: "Zeynep A.", total: 87500, activeDays: 12 },
      { id: "4", location: "Zorlu Center", responsible: "Murat K.", total: 65200, activeDays: 8 },
      { id: "5", location: "Palladium AVM", responsible: "Deniz B.", total: 42800, activeDays: 6 },
    ],
  },

  gallery: [
    { type: "photo", title: "Defne ailesiyle", placeholder: "family" },
    { type: "photo", title: "Hastane muayenesi", placeholder: "hospital" },
    { type: "photo", title: "Kumbara dağıtımı", placeholder: "donation-box" },
    { type: "photo", title: "İstinye Park standı", placeholder: "stand" },
    { type: "video", title: "Annenin çağrısı", placeholder: "video" },
    { type: "photo", title: "Gönüllü ekibi", placeholder: "volunteers" },
    { type: "photo", title: "Tedavi süreci", placeholder: "treatment" },
    { type: "photo", title: "Kampanya ekibi", placeholder: "team" },
  ],

  team: [
    { name: "Dr. Ayşe Demir", role: "Pediatrik Nöroloji Uzmanı", type: "doctor" },
    { name: "Mehmet Yılmaz", role: "Kampanya Koordinatörü", type: "coordinator" },
    { name: "Zeynep Kaya", role: "Hukuki Danışman", type: "legal" },
  ],

  documents: {
    valilik: {
      id: "valilik-001",
      kind: "official",
      title: "Valilik Yardım Toplama İzni",
      issuer: "İstanbul Valiliği",
      date: "2026-01-25",
      number: "2026/4521",
      description:
        "5072 Sayılı Yardım Toplama Kanunu kapsamında, Defne Yılmaz adına SMA Tip 1 tedavisi için yardım toplama izni.",
      signatory: "İstanbul Valisi Yardımcısı",
      signatoryTitle: "Resmi yetkili imza",
      body: [
        "5072 Sayılı Yardım Toplama Kanunu ve ilgili yönetmelik hükümleri incelenmiştir. Defne Yılmaz (T.C. Kimlik No: *** ** *** ** **) adına açılması talep edilen yardım toplama kampanyasının, kampanya süresi boyunca KAMPANYATAKİP altyapısı üzerinden şeffaflık standartları dâhilinde yürütülmesi kaydıyla açılmasına izin verilmiştir.",
        "Kampanya kapsamında toplanacak bağışlar, yalnızca beyan edilen tedavi ve refakat giderleri için kullanılacaktır. Toplanan her bağış ve yapılan her harcama, değiştirilemez kayıt altında tutulacak, talep hâlinde denetime açık tutulacaktır.",
        "İşbu karar tebliğ tarihinden itibaren 180 (yüz seksen) gün süreyle geçerlidir. Süre sonunda yenileme talebi yapılabilir.",
      ],
    },
    doktorRaporlari: [
      {
        id: "dr-001",
        kind: "medical",
        title: "Pediatrik Nöroloji Uzman Raporu",
        doctor: "Dr. Ayşe Demir",
        hospital: "Hacettepe Üniversitesi Hastanesi",
        date: "2026-01-10",
        diagnosis: "SMA Tip 1 (Werdnig-Hoffmann Hastalığı)",
        description:
          "Genetik test ile SMN1 gen mutasyonu doğrulanmıştır. Zolgensma gen tedavisi endikasyonu bulunmaktadır. Tedavi en geç 2 yaş öncesi uygulanmalıdır.",
        signatory: "Dr. Ayşe Demir",
        signatoryTitle: "Pediatrik Nöroloji Uzmanı",
        body: [
          "Hasta, 8 aylıkken ailesi tarafından gelişim geriliği, kas güçsüzlüğü ve başını dik tutamama şikâyetleri ile tarafımıza başvurmuştur. Yapılan muayenede motor nöron fonksiyonlarında belirgin azalma saptanmıştır.",
          "EMG ve genetik inceleme sonucunda SMN1 geninde homozigot delesyon tespit edilmiş, SMA Tip 1 (Werdnig-Hoffmann) tanısı kesinleşmiştir. SMN2 kopya sayısı 2 olarak raporlanmıştır.",
          "Tedavi seçenekleri değerlendirildiğinde, hastanın yaşı ve klinik tablosu göz önüne alınarak en uygun seçenek olarak Zolgensma (onasemnogene abeparvovec-xioi) gen tedavisi belirlenmiştir. Tedavinin en geç 2 yaş öncesi uygulanması, geri dönüşsüz motor nöron hasarının sınırlanması için kritiktir.",
        ],
      },
      {
        id: "dr-002",
        kind: "medical",
        title: "Tedavi Protokolü Onay Raporu",
        doctor: "Prof. Dr. Mehmet Kaya",
        hospital: "Boston Children's Hospital",
        date: "2026-02-15",
        description:
          "Zolgensma (onasemnogene abeparvovec-xioi) tedavisi için uygunluk değerlendirmesi tamamlanmıştır. Tedavi tarihi 2026 Mayıs olarak planlanmıştır.",
        signatory: "Prof. Dr. Mehmet Kaya",
        signatoryTitle: "Pediatric Neurology Department Head",
        body: [
          "Türkiye'den iletilen genetik test ve klinik raporlar tarafımızca incelenmiştir. Hasta, Zolgensma uygulaması için gerekli kriterlerin tamamını karşılamaktadır.",
          "Tedavi planı: Mayıs 2026'da tek seans intravenöz uygulama. Ön hazırlık olarak bağışıklık baskılayıcı ilaç kullanımı, uygulama sonrası 4 haftalık yakın takip protokolü öngörülmektedir.",
          "Tedaviye başlangıç için gerekli ön ödeme (175.000 USD) ve toplam maliyet (2.100.000 USD) hakkında aile bilgilendirilmiş, rıza belgesi alınmıştır.",
        ],
      },
    ],
    hastaneBelgeleri: [
      {
        id: "hsp-001",
        kind: "hospital",
        title: "Tedavi Maliyet Onay Belgesi",
        hospital: "Boston Children's Hospital",
        date: "2026-02-20",
        amount: "$2,100,000 USD (~60.000.000 ₺)",
        description:
          "Zolgensma ilaç maliyeti + hastane tedavi giderleri + hasta refakat giderleri toplam maliyeti.",
        signatory: "Financial Services Office",
        signatoryTitle: "Billing Department",
        body: [
          "Zolgensma İlaç Bedeli: $2,000,000 USD",
          "Hastane Tedavi Giderleri: $75,000 USD (yatış, laboratuvar, izlem)",
          "Hasta ve Refakat Giderleri: $25,000 USD (konaklama, transfer, tercüme)",
          "TOPLAM: $2,100,000 USD — ödeme planı, 175.000 USD rezervasyon ön ödemesi ve 1.925.000 USD tedavi öncesi bakiye olarak iki taksitte yapılacaktır.",
        ],
      },
      {
        id: "hsp-002",
        kind: "hospital",
        title: "Rezervasyon Ön Ödeme Dekontu",
        hospital: "Boston Children's Hospital",
        date: "2026-04-22",
        amount: "$175,000 USD (5.000.000 ₺)",
        description:
          "Tedavi rezervasyonu ön ödemesi yapılmıştır. Ödeme referansı KAMPANYATAKİP değişmez veritabanına işlenmiştir.",
        signatory: "Treasury Office",
        signatoryTitle: "Payment Reference: BCH-2026-04-RES-8841",
        body: [
          "22.04.2026 tarihinde uluslararası havale yoluyla $175,000 USD rezervasyon ön ödemesi alınmıştır.",
          "Bu ödeme, tedavi tarihinin kesinleşmesi ve ilaç rezervasyonu için gereklidir.",
          "Bakiye ($1,925,000 USD) tedavi başlangıç tarihinden en geç 14 gün önce ödenmelidir.",
        ],
      },
    ],
  },
};

export const formatTRY = (n: number): string =>
  new Intl.NumberFormat("tr-TR", { maximumFractionDigits: 0 }).format(n);

export const DONATION_NAMES = [
  "K***** Y*****",
  "A**** D****",
  "M***** T*****",
  "Ş**** K****",
  "E*** A*****",
  "H***** B*****",
  "Z*** Ç*****",
  "M**** K*****",
  "D**** G*****",
  "B**** Y*****",
  "R**** S*****",
  "F**** O*****",
  "T**** A*****",
  "C*** Y*****",
  "S**** K*****",
  "Y***** D*****",
  "G**** E*****",
  "N**** İ*****",
  "İsimsiz Bağışçı",
  "İsimsiz Bağışçı",
];

/** USD-denominated values used for live mock donation ticks. */
export const DONATION_AMOUNTS_USD = [
  15, 25, 30, 50, 50, 75, 100, 100, 150, 200, 250, 300, 500, 1000,
];

export const DONATION_METHODS = [
  "Banka Havalesi",
  "Banka Havalesi",
  "Banka Havalesi",
  "Kredi Kartı",
  "Kredi Kartı",
  "Kumbara #12 (Kadıköy)",
  "Stant #3 (İstinye Park)",
];
