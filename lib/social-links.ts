// Kampanya Takip - resmi sosyal medya bağlantıları
// Vanity URL alındığında tek satırda değiştirilebilir
export const FACEBOOK_URL = "https://www.facebook.com/profile.php?id=61589243289036";
export const FACEBOOK_PAGE_NAME = "Kampanya Takip";

export type SocialLink = {
  url: string | null;
  name: string | null;
  connected: boolean;
};

export const SOCIAL_LINKS: Record<"facebook" | "instagram" | "youtube" | "tiktok", SocialLink> = {
  facebook: { url: FACEBOOK_URL, name: FACEBOOK_PAGE_NAME, connected: true },
  instagram: { url: null, name: null, connected: false },
  youtube: { url: null, name: null, connected: false },
  tiktok: { url: null, name: null, connected: false },
};
