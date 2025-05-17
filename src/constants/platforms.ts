
import { Music, Radio, Video, MessageSquare, Headphones, Send } from "lucide-react";

export interface Platform {
  id: string;
  name: string;
  icon: React.ElementType;
  available: boolean;
}

// Единый список всех поддерживаемых платформ
export const SUPPORTED_PLATFORMS: Platform[] = [
  { id: "youtube", name: "YouTube", icon: Video, available: true },
  { id: "spotify", name: "Spotify", icon: Headphones, available: true }, // Changed from Spotify to Headphones
  { id: "instagram", name: "Instagram", icon: MessageSquare, available: true },
  { id: "tiktok", name: "TikTok", icon: Video, available: true },
  { id: "facebook", name: "Facebook", icon: MessageSquare, available: false }, // Не активна
  { id: "twitter", name: "Twitter", icon: MessageSquare, available: false }, // Не активна
  { id: "telegram", name: "Telegram", icon: Send, available: false }, // Changed from Telegram to Send
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
