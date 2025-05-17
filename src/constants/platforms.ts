
import { Facebook, Instagram, Spotify, Telegram, Twitter, Youtube } from "lucide-react";

export interface Platform {
  id: string;
  name: string;
  icon: React.ElementType;
  available: boolean;
}

// Единый список всех поддерживаемых платформ
export const SUPPORTED_PLATFORMS: Platform[] = [
  { id: "youtube", name: "YouTube", icon: Youtube, available: true },
  { id: "spotify", name: "Spotify", icon: Spotify, available: true },
  { id: "instagram", name: "Instagram", icon: Instagram, available: true },
  { id: "tiktok", name: "TikTok", icon: Youtube, available: true }, // Lucide не имеет TikTok иконку, используем YouTube как временную замену
  { id: "facebook", name: "Facebook", icon: Facebook, available: false }, // Не активна
  { id: "twitter", name: "Twitter", icon: Twitter, available: false }, // Не активна
  { id: "telegram", name: "Telegram", icon: Telegram, available: false }, // Не активна
];

// Получение только активных платформ
export const getActivePlatforms = (): Platform[] => {
  return SUPPORTED_PLATFORMS.filter(platform => platform.available);
};

// Получение платформы по ID
export const getPlatformById = (id: string): Platform | undefined => {
  return SUPPORTED_PLATFORMS.find(platform => platform.id === id);
};

// Проверка доступности платформы
export const isPlatformAvailable = (id: string): boolean => {
  const platform = getPlatformById(id);
  return platform?.available || false;
};
