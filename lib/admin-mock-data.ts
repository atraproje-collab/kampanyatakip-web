import { demoCampaign } from "./mock-campaign-data";

export type DonationStatus = "Onaylandı" | "Bekliyor";

export type AdminDonation = {
  id: string;
  date: string;
  donorName: string;
  source: string;
  amount: number;
  currency: "TRY" | "USD" | "EUR";
  status: DonationStatus;
};

export type Volunteer = {
  id: string;
  name: string;
  phone: string;
  role: "Kumbara Sorumlusu" | "Stant Sorumlusu" | "Sosyal Medya" | "Diğer";
  assignedTo: string;
  addedAt: string;
};

export type DailyChartPoint = {
  date: string;
  label: string;
  amountUsd: number;
};

export type PendingTask = {
  id: string;
  title: string;
  description: string;
  type: "match" | "approval" | "verification";
};

export type SystemModule = {
  name: string;
  status: "active" | "passive";
};

export const adminDonations: AdminDonation[] = [
  { id: "D-1042", date: "2026-04-24 14:32", donorName: "K***** Y*****", source: "Banka Havalesi", amount: 500, currency: "TRY", status: "Onaylandı" },
  { id: "D-1041", date: "2026-04-24 14:28", donorName: "A**** D****", source: "Kredi Kartı", amount: 30, currency: "USD", status: "Onaylandı" },
  { id: "D-1040", date: "2026-04-24 14:21", donorName: "M***** T*****", source: "Banka Havalesi", amount: 250, currency: "TRY", status: "Onaylandı" },
  { id: "D-1039", date: "2026-04-24 14:15", donorName: "Ş**** K****", source: "Kredi Kartı", amount: 100, currency: "TRY", status: "Onaylandı" },
  { id: "D-1038", date: "2026-04-24 14:08", donorName: "İsimsiz Bağışçı", source: "Banka Havalesi", amount: 150, currency: "USD", status: "Onaylandı" },
  { id: "D-1037", date: "2026-04-24 13:55", donorName: "E*** A*****", source: "Kredi Kartı", amount: 750, currency: "TRY", status: "Onaylandı" },
  { id: "D-1036", date: "2026-04-24 13:42", donorName: "H***** B*****", source: "Banka Havalesi", amount: 50, currency: "EUR", status: "Bekliyor" },
  { id: "D-1035", date: "2026-04-24 13:30", donorName: "İsimsiz Bağışçı", source: "Banka Havalesi", amount: 300, currency: "USD", status: "Onaylandı" },
  { id: "D-1034", date: "2026-04-24 12:45", donorName: "Z*** Ç*****", source: "Kumbara #12", amount: 300, currency: "TRY", status: "Onaylandı" },
  { id: "D-1033", date: "2026-04-24 12:30", donorName: "M**** K*****", source: "Kredi Kartı", amount: 2000, currency: "TRY", status: "Onaylandı" },
  { id: "D-1032", date: "2026-04-24 11:48", donorName: "D**** G*****", source: "Banka Havalesi", amount: 75, currency: "USD", status: "Onaylandı" },
  { id: "D-1031", date: "2026-04-24 10:55", donorName: "İsimsiz Bağışçı", source: "Kumbara #5", amount: 250, currency: "TRY", status: "Onaylandı" },
  { id: "D-1030", date: "2026-04-24 09:40", donorName: "B**** Y*****", source: "Banka Havalesi", amount: 1000, currency: "TRY", status: "Onaylandı" },
  { id: "D-1029", date: "2026-04-23 22:18", donorName: "İsimsiz Bağışçı", source: "Banka Havalesi", amount: 500, currency: "USD", status: "Onaylandı" },
  { id: "D-1028", date: "2026-04-23 20:05", donorName: "R**** S*****", source: "Kredi Kartı", amount: 100, currency: "EUR", status: "Onaylandı" },
  { id: "D-1027", date: "2026-04-23 18:30", donorName: "F**** O*****", source: "Banka Havalesi", amount: 400, currency: "TRY", status: "Onaylandı" },
  { id: "D-1026", date: "2026-04-23 16:22", donorName: "T**** A*****", source: "Stant #3", amount: 1200, currency: "TRY", status: "Onaylandı" },
  { id: "D-1025", date: "2026-04-23 14:11", donorName: "C*** Y*****", source: "Banka Havalesi", amount: 25, currency: "USD", status: "Onaylandı" },
  { id: "D-1024", date: "2026-04-23 11:48", donorName: "İsimsiz Bağışçı", source: "Banka Havalesi", amount: 1000, currency: "USD", status: "Onaylandı" },
  { id: "D-1023", date: "2026-04-22 20:30", donorName: "S**** K*****", source: "Kumbara #8", amount: 300, currency: "TRY", status: "Onaylandı" },
  { id: "D-1022", date: "2026-04-22 17:15", donorName: "Y***** D*****", source: "Banka Havalesi", amount: 150, currency: "USD", status: "Onaylandı" },
  { id: "D-1021", date: "2026-04-22 14:50", donorName: "G**** E*****", source: "Kredi Kartı", amount: 500, currency: "TRY", status: "Bekliyor" },
];

export const adminVolunteers: Volunteer[] = [
  { id: "V-01", name: "Ahmet Yıldız", phone: "+90 532 *** **41", role: "Kumbara Sorumlusu", assignedTo: "Kumbara #12 (Kadıköy)", addedAt: "2026-02-14" },
  { id: "V-02", name: "Mehmet Kara", phone: "+90 533 *** **18", role: "Kumbara Sorumlusu", assignedTo: "Kumbara #13 (Bakırköy)", addedAt: "2026-02-18" },
  { id: "V-03", name: "Zeynep Aslan", phone: "+90 534 *** **72", role: "Stant Sorumlusu", assignedTo: "Stant #3 (İstinye Park)", addedAt: "2026-03-02" },
  { id: "V-04", name: "Murat Kılıç", phone: "+90 535 *** **05", role: "Stant Sorumlusu", assignedTo: "Stant #4 (Zorlu Center)", addedAt: "2026-03-10" },
  { id: "V-05", name: "Deniz Bulut", phone: "+90 536 *** **63", role: "Stant Sorumlusu", assignedTo: "Stant #5 (Palladium AVM)", addedAt: "2026-03-22" },
  { id: "V-06", name: "Elif Şahin", phone: "+90 537 *** **88", role: "Sosyal Medya", assignedTo: "Genel", addedAt: "2026-04-01" },
];

export const dailyDonationChart: DailyChartPoint[] = [
  { date: "2026-04-18", label: "Cmt", amountUsd: 6420 },
  { date: "2026-04-19", label: "Paz", amountUsd: 5180 },
  { date: "2026-04-20", label: "Pzt", amountUsd: 9240 },
  { date: "2026-04-21", label: "Sal", amountUsd: 7350 },
  { date: "2026-04-22", label: "Çar", amountUsd: 11200 },
  { date: "2026-04-23", label: "Per", amountUsd: 6890 },
  { date: "2026-04-24", label: "Cum", amountUsd: 8450 },
];

export const pendingTasks: PendingTask[] = [
  {
    id: "T-01",
    title: "Canlı yayın geliri eşleşmesi bekliyor",
    description: "20.04.2026 yayın geliri (₺45.600) — banka mutabakatı için onay gerekli.",
    type: "match",
  },
  {
    id: "T-02",
    title: "Kumbara #16 açılış belgesi yüklenmedi",
    description: "Eminönü Rıhtım kumbarası dün açıldı, fotoğraf eksik.",
    type: "verification",
  },
  {
    id: "T-03",
    title: "Bekleyen 2 bağış manuel onay bekliyor",
    description: "EFT mutabakatı tamamlanmadı (toplam ₺550).",
    type: "approval",
  },
];

export const systemModules: SystemModule[] = [
  { name: "Bağış Toplama", status: "active" },
  { name: "Kumbara Yönetimi", status: "active" },
  { name: "Stant Yönetimi", status: "active" },
  { name: "Bildirim Sistemi", status: "active" },
  { name: "Banka Mutabakatı", status: "active" },
  { name: "Belge Arşivi", status: "active" },
];

export const notificationSettings = [
  { id: "n1", label: "Yeni bağış geldiğinde bildirim al", enabled: true },
  { id: "n2", label: "Günlük özet raporu (her akşam 21:00)", enabled: true },
  { id: "n3", label: "Yeni kumbara açılışı kaydedildiğinde", enabled: true },
  { id: "n4", label: "Yeni gider eklendiğinde", enabled: false },
  { id: "n5", label: "Haftalık rapor (Pazartesi 09:00)", enabled: true },
  { id: "n6", label: "Hedefin %10'u tamamlandığında", enabled: true },
];

// ============ Social Media ============

export type SocialPlatform = "facebook" | "instagram" | "youtube" | "tiktok" | "twitter";

export type SocialAccount = {
  platform: SocialPlatform;
  label: string;
  handle: string;
  connected: boolean;
  followers: number;
  postsThisMonth: number;
  lastPost: string;
};

export const socialAccounts: SocialAccount[] = [
  { platform: "facebook", label: "Facebook", handle: "/minikdefnekampanya", connected: true, followers: 8420, postsThisMonth: 14, lastPost: "2026-04-23" },
  { platform: "instagram", label: "Instagram", handle: "@minikdefne", connected: true, followers: 24560, postsThisMonth: 22, lastPost: "2026-04-24" },
  { platform: "youtube", label: "YouTube", handle: "Minik Defne Kampanyası", connected: true, followers: 1840, postsThisMonth: 4, lastPost: "2026-04-21" },
  { platform: "tiktok", label: "TikTok", handle: "@minikdefne", connected: true, followers: 56200, postsThisMonth: 31, lastPost: "2026-04-24" },
  { platform: "twitter", label: "X / Twitter", handle: "@minikdefne", connected: false, followers: 0, postsThisMonth: 0, lastPost: "—" },
];

export type ScheduledPost = {
  id: string;
  date: string;
  time: string;
  platforms: SocialPlatform[];
  content: string;
  status: "Planlandı" | "Yayınlandı" | "Başarısız";
};

export const scheduledPosts: ScheduledPost[] = [
  {
    id: "P-2031",
    date: "2026-04-25",
    time: "10:00",
    platforms: ["instagram", "facebook"],
    content: "Defne'nin son hastane kontrolünden mutlu kareler. Bağışlarınız sayesinde tedaviye her gün biraz daha yaklaşıyoruz.",
    status: "Planlandı",
  },
  {
    id: "P-2030",
    date: "2026-04-25",
    time: "18:30",
    platforms: ["tiktok"],
    content: "Bu hafta İstinye Park'taki standımızda 87.500 ₺ topladık — gönüllülerimize teşekkürler!",
    status: "Planlandı",
  },
  {
    id: "P-2029",
    date: "2026-04-26",
    time: "12:00",
    platforms: ["youtube", "facebook"],
    content: "Haftalık şeffaflık raporu — Nisan ayı 3. hafta gelir/gider özeti.",
    status: "Planlandı",
  },
  {
    id: "P-2028",
    date: "2026-04-24",
    time: "09:00",
    platforms: ["instagram", "tiktok"],
    content: "Günaydın! Bağış sayacımız bu sabah $1.247.500'ü geçti. Hedefin %59'u tamamlandı.",
    status: "Yayınlandı",
  },
  {
    id: "P-2027",
    date: "2026-04-23",
    time: "20:00",
    platforms: ["facebook"],
    content: "Akşam canlı yayına katılan herkese teşekkürler — birlikte güzel bir akşam geçirdik.",
    status: "Yayınlandı",
  },
  {
    id: "P-2026",
    date: "2026-04-22",
    time: "15:30",
    platforms: ["twitter"],
    content: "Kampanya güncellemesi (otomatik denendi).",
    status: "Başarısız",
  },
];

export const dmStats = {
  totalThisMonth: 1284,
  autoReplied: 942,
  awaitingManual: 38,
  averageReplyMinutes: 12,
};

// ============ Social DM Messages ============

export type MessageStatus = "Otomatik Yanıtlandı" | "Manuel Bekleniyor" | "Yanıtlandı";

export type ChatBubble = {
  role: "user" | "assistant" | "agent";
  text: string;
  time: string;
};

export type SocialMessage = {
  id: string;
  platform: SocialPlatform;
  sender: string;
  preview: string;
  date: string;
  time: string;
  status: MessageStatus;
  thread: ChatBubble[];
};

export const socialMessages: SocialMessage[] = [
  {
    id: "M-2401",
    platform: "instagram",
    sender: "K***** Y*****",
    preview: "Merhaba, kampanyaya nasıl bağış yapabilirim?",
    date: "2026-04-24",
    time: "14:32",
    status: "Otomatik Yanıtlandı",
    thread: [
      { role: "user", text: "Merhaba, kampanyaya nasıl bağış yapabilirim?", time: "14:32" },
      {
        role: "assistant",
        text: "Merhaba 👋 Defne için 3 farklı para biriminde bağış yapabilirsiniz: Banka havalesi (TL/USD/EUR IBAN'larımız profilimizde), kredi kartı veya saha kumbaraları. Tüm bağışlar gerçek zamanlı olarak şeffaflık panelinde görüntülenir.",
        time: "14:32",
      },
    ],
  },
  {
    id: "M-2400",
    platform: "tiktok",
    sender: "A**** D****",
    preview: "Tedavi hangi hastanede yapılacak?",
    date: "2026-04-24",
    time: "13:48",
    status: "Otomatik Yanıtlandı",
    thread: [
      { role: "user", text: "Tedavi hangi hastanede yapılacak?", time: "13:48" },
      {
        role: "assistant",
        text: "Defne'nin Zolgensma gen tedavisi Boston Children's Hospital'da uygulanacak. Hastane tarafından düzenlenen onay belgesi ve ön ödeme dekontu yönetim panelimizdeki Belgeler bölümünde mevcut.",
        time: "13:48",
      },
    ],
  },
  {
    id: "M-2399",
    platform: "facebook",
    sender: "M***** T*****",
    preview: "Ne kadar toplandı şimdiye kadar?",
    date: "2026-04-24",
    time: "12:11",
    status: "Otomatik Yanıtlandı",
    thread: [
      { role: "user", text: "Ne kadar toplandı şimdiye kadar?", time: "12:11" },
      {
        role: "assistant",
        text: "Bu mesaj yazıldığı anda toplam $1.247.500 USD (≈ ₺42.4M) toplandı. Hedefimiz $2.100.000 — yani %59'u tamamlandı. 12.847 bağışçımız var. Canlı sayaç anasayfada.",
        time: "12:11",
      },
    ],
  },
  {
    id: "M-2398",
    platform: "instagram",
    sender: "Ş**** K****",
    preview: "Bağışın gerçekten Defne'ye gittiğinden nasıl emin olabilirim?",
    date: "2026-04-24",
    time: "11:25",
    status: "Manuel Bekleniyor",
    thread: [
      {
        role: "user",
        text: "Bağışın gerçekten Defne'ye gittiğinden nasıl emin olabilirim? Bu konuda biraz şüpheciyim, daha önce kötü deneyimlerim oldu.",
        time: "11:25",
      },
    ],
  },
  {
    id: "M-2397",
    platform: "youtube",
    sender: "İsimsiz Bağışçı",
    preview: "EUR cinsinden bağış yapabilir miyim?",
    date: "2026-04-24",
    time: "10:48",
    status: "Otomatik Yanıtlandı",
    thread: [
      { role: "user", text: "EUR cinsinden bağış yapabilir miyim? Almanya'dan yazıyorum.", time: "10:48" },
      {
        role: "assistant",
        text: "Tabii — Ziraat Bankası EUR hesabımız: TR22 0006 2000 0000 0062 9562 42 (SWIFT: TCZBTR2A). Hesap adı: Defne Yardım Hesabı. Havale ulaştığında otomatik olarak panele yansır.",
        time: "10:48",
      },
    ],
  },
  {
    id: "M-2396",
    platform: "tiktok",
    sender: "E*** A*****",
    preview: "Valilik onayı gerçek mi?",
    date: "2026-04-24",
    time: "09:30",
    status: "Otomatik Yanıtlandı",
    thread: [
      { role: "user", text: "Valilik onayı gerçek mi?", time: "09:30" },
      {
        role: "assistant",
        text: "Evet — İstanbul Valiliği onayımız var, karar no 2026/4521, tarih 25.01.2026. 5072 Sayılı Yardım Toplama Kanunu kapsamında düzenlendi. Onay belgesini Belgeler bölümünden inceleyebilirsiniz.",
        time: "09:30",
      },
    ],
  },
  {
    id: "M-2395",
    platform: "facebook",
    sender: "H***** B*****",
    preview: "Kumbara nereye koyabilirim?",
    date: "2026-04-23",
    time: "22:15",
    status: "Yanıtlandı",
    thread: [
      { role: "user", text: "Kumbara nereye koyabilirim? Mahallemizde dağıtılıyor mu?", time: "22:15" },
      {
        role: "assistant",
        text: "Şu an İstanbul'da 5 lokasyonda kumbaramız var (Kadıköy, Bakırköy, Üsküdar, Beşiktaş, Eminönü). Yeni lokasyon talebiniz için iletişim sayfasından bize ulaşırsanız, gönüllü ekibimiz dönüş yapacak.",
        time: "22:16",
      },
      { role: "user", text: "Acıbadem'de bir mağazam var, koyabilir miyim?", time: "22:18" },
      {
        role: "agent",
        text: "Merhaba, koordinatör Mehmet konuşuyor — kesinlikle olur, yarın 14:00 civarı sizinle iletişime geçeceğim.",
        time: "22:32",
      },
    ],
  },
  {
    id: "M-2394",
    platform: "instagram",
    sender: "Z*** Ç*****",
    preview: "Bağış makbuzu alabilir miyim?",
    date: "2026-04-23",
    time: "19:42",
    status: "Otomatik Yanıtlandı",
    thread: [
      { role: "user", text: "Bağış makbuzu alabilir miyim? Vergi indirimi için.", time: "19:42" },
      {
        role: "assistant",
        text: "Bağışınız sonrası kayıt ID'nizi paneldeki 'Bağış Sorgula' bölümünden girerseniz, makbuzu PDF olarak indirebilirsiniz. Detaylı vergi dekontu için iletişim formundan yazabilirsiniz.",
        time: "19:42",
      },
    ],
  },
  {
    id: "M-2393",
    platform: "tiktok",
    sender: "M**** K*****",
    preview: "Zolgensma'nın yan etkileri nedir?",
    date: "2026-04-23",
    time: "18:11",
    status: "Manuel Bekleniyor",
    thread: [
      {
        role: "user",
        text: "Zolgensma'nın yan etkileri nedir? Defne'nin bunu alması güvenli mi?",
        time: "18:11",
      },
    ],
  },
  {
    id: "M-2392",
    platform: "facebook",
    sender: "D**** G*****",
    preview: "Toplantıya nasıl katılabilirim?",
    date: "2026-04-23",
    time: "16:50",
    status: "Yanıtlandı",
    thread: [
      { role: "user", text: "Gönüllü toplantısına nasıl katılabilirim?", time: "16:50" },
      {
        role: "assistant",
        text: "Gönüllülerimizle haftalık toplantı yapıyoruz. Katılım için iletişim sayfasındaki başvuru formunu doldurabilir veya WhatsApp grubumuza katılabilirsiniz.",
        time: "16:51",
      },
    ],
  },
  {
    id: "M-2391",
    platform: "instagram",
    sender: "B**** Y*****",
    preview: "Standlarınızda gönüllü olabilir miyim?",
    date: "2026-04-23",
    time: "14:28",
    status: "Manuel Bekleniyor",
    thread: [
      { role: "user", text: "Standlarınızda gönüllü olabilir miyim? İstanbul'da yaşıyorum.", time: "14:28" },
    ],
  },
  {
    id: "M-2390",
    platform: "youtube",
    sender: "R**** S*****",
    preview: "Stant nerede?",
    date: "2026-04-23",
    time: "11:05",
    status: "Otomatik Yanıtlandı",
    thread: [
      { role: "user", text: "Stant nerede?", time: "11:05" },
      {
        role: "assistant",
        text: "Şu an 3 AVM standımız aktif: İstinye Park, Zorlu Center, Palladium AVM. Hafta sonları 11:00–22:00 arası açık.",
        time: "11:05",
      },
    ],
  },
  {
    id: "M-2389",
    platform: "tiktok",
    sender: "F**** O*****",
    preview: "Bağış geri ödenebilir mi?",
    date: "2026-04-22",
    time: "23:18",
    status: "Otomatik Yanıtlandı",
    thread: [
      { role: "user", text: "Bağış geri ödenebilir mi?", time: "23:18" },
      {
        role: "assistant",
        text: "Bağışlar amacına ulaştığı için iade edilemez. Ancak bağış kaydında bir hata olduğunu düşünüyorsanız iletişim formundan ulaştığınızda yardımcı olabiliriz.",
        time: "23:18",
      },
    ],
  },
  {
    id: "M-2388",
    platform: "facebook",
    sender: "T**** A*****",
    preview: "Hesap detayları için yazıyorum",
    date: "2026-04-22",
    time: "20:42",
    status: "Manuel Bekleniyor",
    thread: [
      {
        role: "user",
        text: "Şirketimiz adına kurumsal bağış yapmak istiyoruz, hesap detayları için yazıyorum.",
        time: "20:42",
      },
    ],
  },
  {
    id: "M-2387",
    platform: "instagram",
    sender: "C*** Y*****",
    preview: "Çok güzel iş yapıyorsunuz, başarılar.",
    date: "2026-04-22",
    time: "18:30",
    status: "Otomatik Yanıtlandı",
    thread: [
      { role: "user", text: "Çok güzel iş yapıyorsunuz, başarılar.", time: "18:30" },
      {
        role: "assistant",
        text: "Çok teşekkür ederiz 💙 Her destek bizim için çok kıymetli. İyi dileklerinizi ailemize iletiyorum.",
        time: "18:30",
      },
    ],
  },
];

// ============ AI Assistant ============

export type AssistantTone = "Resmi" | "Samimi" | "Kısa";
export type AssistantLanguage = "TR" | "EN" | "AR" | "DE" | "FR";

export type AssistantSettings = {
  enabled: boolean;
  languages: AssistantLanguage[];
  tone: AssistantTone;
  /** Saniye — readonly demoda */
  debounceSeconds: number;
};

export const defaultAssistantSettings: AssistantSettings = {
  enabled: true,
  languages: ["TR", "EN"],
  tone: "Samimi",
  debounceSeconds: 5,
};

export type FaqEntry = {
  id: string;
  question: string;
  count: number;
};

export const topFaqs: FaqEntry[] = [
  { id: "FAQ-01", question: "Ne kadar toplandı?", count: 234 },
  { id: "FAQ-02", question: "IBAN nedir?", count: 189 },
  { id: "FAQ-03", question: "Valilik onayı var mı?", count: 156 },
  { id: "FAQ-04", question: "Tedavi nerede yapılacak?", count: 142 },
  { id: "FAQ-05", question: "Bağış makbuzu alabilir miyim?", count: 118 },
];

export type AssistantTemplate = {
  id: string;
  trigger: string;
  response: string;
};

export const assistantTemplates: AssistantTemplate[] = [
  {
    id: "TPL-01",
    trigger: "ne kadar / toplandı / hedef",
    response:
      "Şu an toplam $1.247.500 toplandı (hedefin %59'u). 12.847 bağışçımız var. Anlık sayaç anasayfada gösteriliyor.",
  },
  {
    id: "TPL-02",
    trigger: "IBAN / hesap / havale",
    response:
      "Banka hesaplarımız (Ziraat Bankası): TL TR98 0006 2000 0000 0062 9562 28 • USD TR45 0006 2000 0000 0062 9562 35 • EUR TR22 0006 2000 0000 0062 9562 42 — hesap adı: Defne Yardım Hesabı.",
  },
  {
    id: "TPL-03",
    trigger: "valilik / onay / izin",
    response:
      "İstanbul Valiliği onayımız mevcut, karar no 2026/4521, 25.01.2026. 5072 Sayılı Yardım Toplama Kanunu kapsamındadır. Onay belgesi paneldeki Belgeler bölümünden incelenebilir.",
  },
  {
    id: "TPL-04",
    trigger: "kumbara / nerede / lokasyon",
    response:
      "İstanbul'da 5 lokasyonda kumbaramız var: Kadıköy Meydan, Bakırköy Pazar, Üsküdar Çarşı, Beşiktaş İskele, Eminönü Rıhtım.",
  },
  {
    id: "TPL-05",
    trigger: "stant",
    response:
      "Stantlarımız: İstinye Park, Zorlu Center, Palladium AVM. Hafta sonları 11:00–22:00 arası açık.",
  },
  {
    id: "TPL-06",
    trigger: "tedavi / hastane / Zolgensma",
    response:
      "Zolgensma gen tedavisi Boston Children's Hospital'da uygulanacak. Tedavi tarihi Mayıs 2026 olarak planlandı, ön ödemesi yapıldı (175.000 USD).",
  },
];

export const assistantStatus = {
  active: true,
  repliedToday: 127,
  averageReplySeconds: 3,
  successRate: 94,
};

export const recentAssistantConversations: Array<{
  id: string;
  sender: string;
  platform: SocialPlatform;
  question: string;
  answer: string;
  type: "auto" | "manual";
  time: string;
}> = [
  {
    id: "C-901",
    sender: "K***** Y*****",
    platform: "instagram",
    question: "Bağış nasıl yapılır?",
    answer: "Banka havalesi, kredi kartı veya saha kumbaraları üzerinden bağış yapabilirsiniz. IBAN bilgileri profilimizde.",
    type: "auto",
    time: "3 dakika önce",
  },
  {
    id: "C-900",
    sender: "A**** D****",
    platform: "tiktok",
    question: "Tedavi nerede?",
    answer: "Boston Children's Hospital'da, Mayıs 2026'da uygulanacak.",
    type: "auto",
    time: "12 dakika önce",
  },
  {
    id: "C-899",
    sender: "Ş**** K****",
    platform: "instagram",
    question: "Bağışın gerçekten Defne'ye gittiğine nasıl emin olabilirim?",
    answer: "(Manuel ekip yanıtı) Şeffaflık paneline her bağış ve harcama anında işleniyor — değiştirilemez kayıt sisteminde.",
    type: "manual",
    time: "1 saat önce",
  },
  {
    id: "C-898",
    sender: "M***** T*****",
    platform: "facebook",
    question: "Ne kadar toplandı?",
    answer: "Toplam $1.247.500 toplandı, hedefin %59'u.",
    type: "auto",
    time: "2 saat önce",
  },
  {
    id: "C-897",
    sender: "İsimsiz",
    platform: "youtube",
    question: "EUR ile bağış olur mu?",
    answer: "Evet — Ziraat Bankası EUR hesabımız: TR22 0006 2000 0000 0062 9562 42.",
    type: "auto",
    time: "3 saat önce",
  },
];

// ============ Live Stream Income ============

export type LiveStreamPlatform = "TikTok" | "Instagram" | "YouTube";

export type LiveStreamRecord = {
  id: string;
  date: string;
  platform: LiveStreamPlatform;
  durationMinutes: number;
  coins: number;
  /** TL eşdeğeri (1 elmas = 0.05 TL ile hesaplanmış) */
  amountTry: number;
  bankRef: string | null;
  status: "Eşleşti" | "Bekleniyor" | "Uyarı";
  alertSent?: boolean;
};

export const COIN_TO_TRY = 0.05;

export const liveStreamRecords: LiveStreamRecord[] = [
  {
    id: "LS-1042",
    date: "2026-04-21",
    platform: "TikTok",
    durationMinutes: 142,
    coins: 912000,
    amountTry: 45600,
    bankRef: "TX-88412",
    status: "Eşleşti",
  },
  {
    id: "LS-1041",
    date: "2026-04-23",
    platform: "Instagram",
    durationMinutes: 95,
    coins: 248000,
    amountTry: 12400,
    bankRef: null,
    status: "Bekleniyor",
  },
  {
    id: "LS-1040",
    date: "2026-04-24",
    platform: "TikTok",
    durationMinutes: 68,
    coins: 164000,
    amountTry: 8200,
    bankRef: null,
    status: "Bekleniyor",
  },
  {
    id: "LS-1039",
    date: "2026-04-15",
    platform: "TikTok",
    durationMinutes: 110,
    coins: 156000,
    amountTry: 7800,
    bankRef: null,
    status: "Uyarı",
    alertSent: true,
  },
  {
    id: "LS-1038",
    date: "2026-04-12",
    platform: "YouTube",
    durationMinutes: 58,
    coins: 84000,
    amountTry: 4200,
    bankRef: "TX-88340",
    status: "Eşleşti",
  },
  {
    id: "LS-1037",
    date: "2026-04-10",
    platform: "TikTok",
    durationMinutes: 76,
    coins: 122000,
    amountTry: 6100,
    bankRef: null,
    status: "Uyarı",
    alertSent: false,
  },
];

export type UnmatchedTransfer = {
  id: string;
  date: string;
  bank: string;
  amountTry: number;
  reference: string;
};

export const unmatchedTransfers: UnmatchedTransfer[] = [
  { id: "UT-301", date: "2026-04-24", bank: "Ziraat Bankası", amountTry: 12400, reference: "TX-88455" },
  { id: "UT-302", date: "2026-04-25", bank: "Ziraat Bankası", amountTry: 8200, reference: "TX-88461" },
  { id: "UT-303", date: "2026-04-19", bank: "Ziraat Bankası", amountTry: 4900, reference: "TX-88401" },
];

export function getLiveStreamSummary(records: LiveStreamRecord[]) {
  const total = records.reduce((s, r) => s + r.amountTry, 0);
  const thisMonth = records
    .filter((r) => r.date.startsWith("2026-04"))
    .reduce((s, r) => s + r.amountTry, 0);
  const pending = records
    .filter((r) => r.status === "Bekleniyor")
    .reduce((s, r) => s + r.amountTry, 0);
  const unmatched = records.filter((r) => r.status === "Uyarı").length;
  return { total, thisMonth, pending, unmatched };
}

export function getCampaignSummary() {
  return {
    title: demoCampaign.title,
    raisedUsd: demoCampaign.raisedUsd,
    raisedTryApprox: Math.round(demoCampaign.raisedUsd * 34),
    todayUsd: 8450,
    activeKumbara: demoCampaign.transparency.kumbaralar.length,
    activeStant: demoCampaign.transparency.stantlar.length,
    donorCount: demoCampaign.donorCount,
  };
}
