
import type { PlatformUrlMap } from './types';

/**
 * Service for handling platform-specific URLs
 */
export class PlatformUrlService {
  private static platforms: PlatformUrlMap = {
    'spotify': 'https://www.spotify.com/signup',
    'youtube': 'https://www.youtube.com',
    'instagram': 'https://www.instagram.com/accounts/emailsignup/',
    'tiktok': 'https://www.tiktok.com/signup',
    'facebook': 'https://www.facebook.com/r.php',
    'twitter': 'https://twitter.com/i/flow/signup',
    'telegram': 'https://my.telegram.org/auth',
    'reddit': 'https://www.reddit.com/register/',
    'pinterest': 'https://www.pinterest.com/signup/',
    'linkedin': 'https://www.linkedin.com/signup',
    'twitch': 'https://www.twitch.tv/signup',
    'discord': 'https://discord.com/register',
  };

  /**
   * Get the URL for a specific platform
   */
  static getPlatformUrl(platform: string): string {
    return this.platforms[platform.toLowerCase()] || platform;
  }
}
