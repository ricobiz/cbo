import type { PlatformUrlMap } from './types';

/**
 * Service for managing platform URLs
 */
export class PlatformUrlService {
  private static platformUrls: PlatformUrlMap = {
    'youtube': 'https://www.youtube.com',
    'spotify': 'https://www.spotify.com',
    'instagram': 'https://www.instagram.com',
    'facebook': 'https://www.facebook.com',
    'twitter': 'https://twitter.com',
    'tiktok': 'https://www.tiktok.com',
    'telegram': 'https://telegram.org',
    'reddit': 'https://www.reddit.com'
  };

  /**
   * Get the URL for a given platform
   * @param platform The platform to get the URL for
   * @returns The URL for the platform
   */
  static getPlatformUrl(platform: string): string {
    const url = PlatformUrlService.platformUrls[platform.toLowerCase()];
    if (!url) {
      console.warn(`No URL found for platform: ${platform}`);
      return 'https://www.google.com'; // Default URL
    }
    return url;
  }

  /**
   * Add or update a platform URL
   * @param platform The platform to add or update
   * @param url The URL for the platform
   */
  static setPlatformUrl(platform: string, url: string): void {
    PlatformUrlService.platformUrls[platform.toLowerCase()] = url;
  }

  /**
   * Remove a platform URL
   * @param platform The platform to remove
   */
  static removePlatformUrl(platform: string): void {
    delete PlatformUrlService.platformUrls[platform.toLowerCase()];
  }
}
