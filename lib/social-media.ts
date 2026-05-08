// Kampanya Takip - resmi sosyal medya hesapları
// Yeni hesap eklendiğinde buradan değiştirilir.

export const SOCIAL_MEDIA = {
  facebook: "https://www.facebook.com/profile.php?id=61589243289036",
  instagram: "https://www.instagram.com/sma.dmd.kampanyatakip/",
  youtube: "https://www.youtube.com/@Kampanya-Takip",
  tiktok: null as string | null,
  twitter: null as string | null,
} as const;

export const SOCIAL_MEDIA_HANDLES = {
  facebook: "Kampanya Takip",
  instagram: "@sma.dmd.kampanyatakip",
  youtube: "@Kampanya-Takip",
  tiktok: null as string | null,
  twitter: null as string | null,
} as const;

export type SocialPlatformKey = keyof typeof SOCIAL_MEDIA;
