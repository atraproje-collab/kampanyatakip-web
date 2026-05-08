// Geriye dönük uyumluluk için — yeni kod lib/social-media.ts'i kullanmalı.
import { SOCIAL_MEDIA, SOCIAL_MEDIA_HANDLES } from "./social-media";

export const FACEBOOK_URL = SOCIAL_MEDIA.facebook;
export const FACEBOOK_PAGE_NAME = SOCIAL_MEDIA_HANDLES.facebook;

export type SocialLink = {
  url: string | null;
  name: string | null;
  connected: boolean;
};

export const SOCIAL_LINKS: Record<"facebook" | "instagram" | "youtube" | "tiktok", SocialLink> = {
  facebook: {
    url: SOCIAL_MEDIA.facebook,
    name: SOCIAL_MEDIA_HANDLES.facebook,
    connected: true,
  },
  instagram: {
    url: SOCIAL_MEDIA.instagram,
    name: SOCIAL_MEDIA_HANDLES.instagram,
    connected: true,
  },
  youtube: {
    url: SOCIAL_MEDIA.youtube,
    name: SOCIAL_MEDIA_HANDLES.youtube,
    connected: true,
  },
  tiktok: { url: null, name: null, connected: false },
};
