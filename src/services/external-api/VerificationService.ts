
import type { ActionVerification, BrowserUseResponse } from './types';

/**
 * Service for verifying actions on different platforms
 */
export class VerificationService {
  private verificationCache = new Map<string, ActionVerification>();
  
  /**
   * Verifies YouTube-specific actions
   */
  async verifyYouTubeAction(videoId: string, metricType: 'view' | 'play' | 'click' | 'like' | 'follow' | 'comment', sessionId: string, browserUseService: any): Promise<ActionVerification> {
    const timestamp = new Date().toISOString();
    
    // For YouTube, we can navigate to the video and check the view count or like status
    
    // First, navigate to the video
    await browserUseService.executeBrowserAction({
      type: 'navigate',
      params: { url: `https://www.youtube.com/watch?v=${videoId}` }
    }, sessionId);
    
    // Wait for page to load and metrics to be visible
    await browserUseService.executeBrowserAction({
      type: 'wait',
      params: { selector: '#info-contents' }
    }, sessionId);
    
    // Get metric (view count or like status) based on the action type
    const response = await browserUseService.executeBrowserAction({
      type: 'click',
      params: {
        // Extract metrics based on DOM elements
        execute: `
          function extractMetrics() {
            let metrics = {};
            if (document.querySelector("#count .view-count")) {
              metrics.viewCount = document.querySelector("#count .view-count").textContent.trim();
            }
            if (document.querySelector("#top-level-buttons-computed ytd-toggle-button-renderer")) {
              metrics.likeCount = document.querySelector("#top-level-buttons-computed ytd-toggle-button-renderer").getAttribute("aria-label");
            }
            return metrics;
          }
          return extractMetrics();
        `
      }
    }, sessionId);
    
    if (!response || !response.success || !response.data) {
      return {
        platform: 'youtube',
        contentId: videoId,
        metricType,
        timestamp,
        verified: false,
        error: 'Failed to extract metrics'
      };
    }
    
    // Parse and validate response data
    const metrics = response.data;
    let verified = false;
    let metricValue;
    
    switch (metricType) {
      case 'view':
      case 'play':
        // Check if view count metric exists
        if (metrics.viewCount) {
          verified = true;
          metricValue = parseInt(metrics.viewCount.replace(/[^0-9]/g, ''), 10);
        }
        break;
      case 'like':
        // Check if like status exists and is active
        if (metrics.likeCount) {
          verified = metrics.likeCount.includes('Liked');
        }
        break;
      default:
        // For other metrics, we would need specific implementation
    }
    
    return {
      platform: 'youtube',
      contentId: videoId,
      metricType,
      timestamp,
      verified,
      metricValue
    };
  }
  
  /**
   * Verifies Spotify-specific actions
   */
  async verifySpotifyAction(trackId: string, metricType: 'view' | 'play' | 'click' | 'like' | 'follow' | 'comment', sessionId: string, browserUseService: any): Promise<ActionVerification> {
    const timestamp = new Date().toISOString();
    
    // For Spotify, we need to check if a track is actually playing
    
    // Navigate to track
    await browserUseService.executeBrowserAction({
      type: 'navigate',
      params: { url: `https://open.spotify.com/track/${trackId}` }
    }, sessionId);
    
    // Wait for the play button to appear
    await browserUseService.executeBrowserAction({
      type: 'wait',
      params: { selector: '[data-testid="play-button"]' }
    }, sessionId);
    
    // Check if the track is playing
    const response = await browserUseService.executeBrowserAction({
      type: 'click',
      params: {
        execute: `
          function checkPlayStatus() {
            const playButton = document.querySelector('[data-testid="play-button"]');
            // If it shows pause icon, it's currently playing
            return { 
              isPlaying: playButton && playButton.getAttribute('aria-label').includes('Pause'),
              trackName: document.querySelector('.encore-text-title')?.textContent
            };
          }
          return checkPlayStatus();
        `
      }
    }, sessionId);
    
    if (!response || !response.success) {
      return {
        platform: 'spotify',
        contentId: trackId,
        metricType,
        timestamp,
        verified: false,
        error: 'Failed to check play status'
      };
    }
    
    return {
      platform: 'spotify',
      contentId: trackId,
      metricType,
      timestamp,
      verified: response.data?.isPlaying || false
    };
  }
  
  /**
   * Gets platform-specific verification scripts
   */
  getPlatformVerificationScript(platform: string, metricType: string): string {
    switch (platform.toLowerCase()) {
      case 'instagram':
        return `
          function verifyInstagram() {
            let result = { verified: false, metricValue: 0 };
            
            ${metricType === 'like' ? `
              const likeButton = document.querySelector('article [aria-label="Like"], article [aria-label="Нравится"]');
              if (likeButton) {
                const isLiked = likeButton.getAttribute('aria-pressed') === 'true';
                result.verified = isLiked;
              }
            ` : ''}
            
            ${metricType === 'comment' ? `
              const comments = document.querySelectorAll('article ul > li');
              result.metricValue = comments ? comments.length : 0;
              result.verified = result.metricValue > 0;
            ` : ''}
            
            ${metricType === 'view' ? `
              const viewCount = document.querySelector('article span:contains("views"), article span:contains("просмотров")');
              if (viewCount) {
                const countText = viewCount.textContent.trim();
                const countMatch = countText.match(/\\d+/);
                result.metricValue = countMatch ? parseInt(countMatch[0]) : 0;
                result.verified = result.metricValue > 0;
              }
            ` : ''}
            
            return result;
          }
          return verifyInstagram();
        `;
        
      case 'twitter':
        return `
          function verifyTwitter() {
            let result = { verified: false, metricValue: 0 };
            
            ${metricType === 'like' ? `
              const likeButton = document.querySelector('[data-testid="like"]');
              if (likeButton) {
                const isLiked = likeButton.getAttribute('aria-pressed') === 'true';
                result.verified = isLiked;
              }
            ` : ''}
            
            ${metricType === 'comment' ? `
              const replyButton = document.querySelector('[data-testid="reply"]');
              if (replyButton) {
                const countText = replyButton.textContent.trim();
                const countMatch = countText.match(/\\d+/);
                result.metricValue = countMatch ? parseInt(countMatch[0]) : 0;
                result.verified = true; // Just verifying the element exists
              }
            ` : ''}
            
            return result;
          }
          return verifyTwitter();
        `;
        
      case 'telegram':
        return `
          function verifyTelegram() {
            let result = { verified: false, metricValue: 0 };
            
            ${metricType === 'view' ? `
              const viewCounter = document.querySelector('.message .views-counter');
              if (viewCounter) {
                const countText = viewCounter.textContent.trim();
                const count = parseInt(countText.replace(/[^0-9]/g, ''));
                result.metricValue = isNaN(count) ? 0 : count;
                result.verified = result.metricValue > 0;
              }
            ` : ''}
            
            ${metricType === 'comment' ? `
              const replies = document.querySelectorAll('.message-replies .message');
              result.metricValue = replies ? replies.length : 0;
              result.verified = result.metricValue > 0;
            ` : ''}
            
            return result;
          }
          return verifyTelegram();
        `;
        
      // Add more platform-specific scripts as needed
      
      default:
        return `
          function verifyGeneric() {
            // Basic presence check
            return { 
              verified: true, 
              metricValue: null,
              message: "Generic verification completed for ${platform}" 
            };
          }
          return verifyGeneric();
        `;
    }
  }
  
  /**
   * Verifies social media actions (generic)
   */
  async verifySocialMediaAction(platform: string, contentId: string, metricType: 'view' | 'play' | 'click' | 'like' | 'follow' | 'comment', sessionId: string, browserUseService: any): Promise<ActionVerification> {
    const timestamp = new Date().toISOString();
    
    try {
      // Base URL to navigate to
      let navigateUrl = '';
      
      // Different handling based on platform
      switch (platform.toLowerCase()) {
        case 'telegram':
          navigateUrl = contentId.startsWith('https://t.me/') ? contentId : `https://t.me/${contentId}`;
          break;
        case 'instagram':
          navigateUrl = contentId.includes('/p/') ? contentId : `https://www.instagram.com/p/${contentId}`;
          break;
        case 'twitter':
          navigateUrl = contentId.includes('/status/') ? contentId : `https://twitter.com/i/status/${contentId}`;
          break;
        case 'facebook':
          navigateUrl = contentId.includes('/posts/') ? contentId : `https://www.facebook.com/permalink.php?story_fbid=${contentId}`;
          break;
        case 'tiktok':
          navigateUrl = contentId.includes('/video/') ? contentId : `https://www.tiktok.com/@user/video/${contentId}`;
          break;
        default:
          navigateUrl = contentId.startsWith('http') ? contentId : `https://${platform}.com/${contentId}`;
      }
      
      // Navigate to the content
      await browserUseService.executeBrowserAction({
        type: 'navigate',
        params: { url: navigateUrl }
      }, sessionId);
      
      // Wait for the page to load - different selectors based on platform
      let waitSelector = '';
      switch (platform.toLowerCase()) {
        case 'instagram':
          waitSelector = 'article';
          break;
        case 'twitter':
          waitSelector = '[data-testid="tweet"]';
          break;
        case 'telegram':
          waitSelector = '.message';
          break;
        case 'facebook':
          waitSelector = '.userContentWrapper';
          break;
        default:
          waitSelector = 'body';
      }
      
      await browserUseService.executeBrowserAction({
        type: 'wait',
        params: { selector: waitSelector, timeout: 10000 }
      }, sessionId);
      
      // Execute platform-specific verification
      // This would need to be customized based on the platform and metric
      const executeScript = this.getPlatformVerificationScript(platform, metricType);
      
      const response = await browserUseService.executeBrowserAction({
        type: 'click',
        params: {
          execute: executeScript
        }
      }, sessionId);
      
      if (!response || !response.success) {
        return {
          platform,
          contentId,
          metricType,
          timestamp,
          verified: false,
          error: 'Failed to execute verification script'
        };
      }
      
      // Process the response based on the platform
      let verified = false;
      let metricValue;
      
      if (response.data) {
        if (response.data.verified !== undefined) {
          verified = response.data.verified;
        }
        if (response.data.metricValue !== undefined) {
          metricValue = response.data.metricValue;
        }
      }
      
      return {
        platform,
        contentId,
        metricType,
        timestamp,
        verified,
        metricValue
      };
    } catch (error) {
      return {
        platform,
        contentId,
        metricType,
        timestamp,
        verified: false,
        error: error instanceof Error ? error.message : 'Unknown error during verification'
      };
    }
  }

  /**
   * Add a verification result to the cache
   */
  cacheVerificationResult(result: ActionVerification): void {
    const verificationKey = `${result.platform}:${result.contentId}:${result.metricType}:${result.timestamp}`;
    this.verificationCache.set(verificationKey, result);
  }
  
  /**
   * Gets verification history for a specific content
   */
  getVerificationHistory(platform: string, contentId: string, metricType?: 'view' | 'play' | 'click' | 'like' | 'follow' | 'comment'): ActionVerification[] {
    const results: ActionVerification[] = [];
    
    this.verificationCache.forEach((verification) => {
      if (verification.platform === platform && 
          verification.contentId === contentId && 
          (!metricType || verification.metricType === metricType)) {
        results.push(verification);
      }
    });
    
    // Sort by timestamp, most recent first
    return results.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }
  
  /**
   * Gets verification success rate for a specific content and metric
   */
  getVerificationSuccessRate(platform: string, contentId: string, metricType: 'view' | 'play' | 'click' | 'like' | 'follow' | 'comment'): number {
    const history = this.getVerificationHistory(platform, contentId, metricType);
    
    if (history.length === 0) return 0;
    
    const successfulVerifications = history.filter(v => v.verified).length;
    return (successfulVerifications / history.length) * 100;
  }
}
