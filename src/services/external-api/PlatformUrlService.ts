
import { SUPPORTED_PLATFORMS } from "@/constants/platforms";
import type { PlatformUrlMap } from './types';

/**
 * Service for handling platform-specific URLs
 */
export class PlatformUrlService {
  private static platforms: PlatformUrlMap = Object.fromEntries(
    SUPPORTED_PLATFORMS.map(platform => [
      platform.id,
      platform.id === 'youtube' ? 'https://www.youtube.com' :
      platform.id === 'spotify' ? 'https://www.spotify.com/signup' :
      platform.id === 'instagram' ? 'https://www.instagram.com/accounts/emailsignup/' :
      platform.id === 'tiktok' ? 'https://www.tiktok.com/signup' :
      platform.id === 'facebook' ? 'https://www.facebook.com/r.php' :
      platform.id === 'twitter' ? 'https://twitter.com/i/flow/signup' :
      platform.id === 'telegram' ? 'https://my.telegram.org/auth' :
      `https://www.${platform.id}.com`
    ])
  );

  /**
   * Get the URL for a specific platform
   */
  static getPlatformUrl(platform: string): string {
    return this.platforms[platform.toLowerCase()] || platform;
  }
}
