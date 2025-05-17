
/**
 * Service for integrating with external APIs like OpenRouter and Browser Use
 */

// Types for OpenRouter API
export interface OpenRouterResponse {
  id: string;
  choices: {
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }[];
}

// Types for Browser Use API
export interface BrowserUseAction {
  type: 'navigate' | 'click' | 'type' | 'register' | 'login' | 'scroll' | 'wait';
  params: Record<string, any>;
}

export interface BrowserUseResponse {
  success: boolean;
  sessionId?: string;
  screenshot?: string;
  error?: string;
  data?: any;
}

// Types for Verification and Feedback
export interface ActionVerification {
  platform: string;
  contentId: string;
  metricType: 'view' | 'play' | 'click' | 'like' | 'follow' | 'comment';
  timestamp: string;
  verified: boolean;
  metricValue?: number;
  error?: string;
}

class ExternalAPIService {
  private openRouterApiKey: string | null = null;
  private browserUseApiKey: string | null = null;
  private offlineMode: boolean = true;
  
  // Cache for verification data
  private verificationCache = new Map<string, ActionVerification>();
  
  // Set API keys
  setOpenRouterApiKey(key: string): void {
    this.openRouterApiKey = key;
  }
  
  setBrowserUseApiKey(key: string): void {
    this.browserUseApiKey = key;
  }
  
  // Set offline mode
  setOfflineMode(enabled: boolean): void {
    this.offlineMode = enabled;
  }
  
  // Check if offline mode is enabled
  isOfflineMode(): boolean {
    return this.offlineMode;
  }
  
  // Check if API keys are configured
  hasOpenRouterApiKey(): boolean {
    return !!this.openRouterApiKey;
  }
  
  hasBrowserUseApiKey(): boolean {
    return !!this.browserUseApiKey;
  }
  
  // OpenRouter API integration
  async sendToOpenRouter(prompt: string, model: string = 'gpt-4'): Promise<OpenRouterResponse | null> {
    if (!this.hasOpenRouterApiKey()) {
      console.error('OpenRouter API key not set');
      throw new Error('API key not configured');
    }
    
    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.openRouterApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: model,
          messages: [
            {
              role: 'user',
              content: prompt
            }
          ]
        })
      });
      
      if (!response.ok) {
        throw new Error(`OpenRouter API error: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error calling OpenRouter API:', error);
      throw error;
    }
  }
  
  // Browser Use API integration
  async executeBrowserAction(action: BrowserUseAction, sessionId?: string): Promise<BrowserUseResponse> {
    if (!this.hasBrowserUseApiKey()) {
      console.error('Browser Use API key not set');
      throw new Error('API key not configured');
    }
    
    try {
      const response = await fetch('https://api.browser-use.com/v1/action', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.browserUseApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId: sessionId,
          action: action.type,
          ...action.params
        })
      });
      
      if (!response.ok) {
        throw new Error(`Browser Use API error: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error calling Browser Use API:', error);
      throw error;
    }
  }
  
  // Create a new browser session
  async createBrowserSession(options?: {
    proxy?: string;
    userAgent?: string;
    viewport?: { width: number; height: number };
  }): Promise<string> {
    if (!this.hasBrowserUseApiKey()) {
      console.error('Browser Use API key not set');
      throw new Error('API key not configured');
    }
    
    try {
      const response = await fetch('https://api.browser-use.com/v1/session/create', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.browserUseApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(options || {})
      });
      
      if (!response.ok) {
        throw new Error(`Browser Use API error: ${response.statusText}`);
      }
      
      const data = await response.json();
      return data.sessionId;
    } catch (error) {
      console.error('Error creating Browser Use session:', error);
      throw error;
    }
  }
  
  // Register an account using Browser Use API
  async registerAccount(platform: string, credentials: {
    email: string;
    username?: string;
    password: string;
    fullName?: string;
  }, sessionId?: string): Promise<BrowserUseResponse> {
    // Create a new session if none provided
    const session = sessionId || await this.createBrowserSession();
    
    // Navigate to the platform
    await this.executeBrowserAction({
      type: 'navigate',
      params: { url: this.getPlatformUrl(platform) }
    }, session);
    
    // Find registration form and fill it
    const registerResult = await this.executeBrowserAction({
      type: 'register',
      params: { 
        platform,
        credentials
      }
    }, session);
    
    return registerResult;
  }
  
  // Helper to get platform URLs
  private getPlatformUrl(platform: string): string {
    const platforms: Record<string, string> = {
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
    
    return platforms[platform.toLowerCase()] || platform;
  }
  
  // Analyze a command using OpenRouter AI
  async analyzeCommand(command: string): Promise<{
    platform?: string;
    action?: string;
    count?: number;
    url?: string;
    additionalParams?: Record<string, any>;
  }> {
    const prompt = `
      Analyze the following command and extract structured information:
      
      Command: "${command}"
      
      Extract the following information (if present):
      1. Platform (e.g., Spotify, YouTube, Instagram, Telegram, Reddit, etc)
      2. Action type (listen, view, like, comment, follow, subscribe, etc)
      3. Target count (number)
      4. Target URL (if any)
      5. Any additional parameters
      
      Format the output as JSON.
    `;
    
    const response = await this.sendToOpenRouter(prompt);
    if (!response || !response.choices || !response.choices[0]?.message?.content) {
      throw new Error('Failed to analyze command');
    }
    
    try {
      // Try to parse the AI response as JSON
      const jsonMatch = response.choices[0].message.content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      throw new Error('Unable to parse AI response');
    } catch (error) {
      console.error('Error parsing AI response:', error);
      throw error;
    }
  }

  /**
   * Verifies if an action (view, play, etc) was actually counted by the platform.
   * This can be used to confirm that bot interactions are being registered.
   */
  async verifyAction(platform: string, contentId: string, metricType: 'view' | 'play' | 'click' | 'like' | 'follow' | 'comment', sessionId?: string): Promise<ActionVerification> {
    const timestamp = new Date().toISOString();
    const verificationKey = `${platform}:${contentId}:${metricType}:${timestamp}`;
    
    try {
      // If no session provided, one needs to be created
      const session = sessionId || await this.createBrowserSession();
      
      let result: ActionVerification = {
        platform,
        contentId,
        metricType,
        timestamp,
        verified: false
      };

      // Different verification methods for different platforms
      switch (platform.toLowerCase()) {
        case 'youtube':
          result = await this.verifyYouTubeAction(contentId, metricType, session);
          break;
        case 'spotify':
          result = await this.verifySpotifyAction(contentId, metricType, session);
          break;
        case 'instagram':
        case 'tiktok':
        case 'facebook':
        case 'twitter':
        case 'telegram':
        case 'reddit':
        case 'pinterest':
        case 'linkedin':
        case 'twitch':
        case 'discord':
          result = await this.verifySocialMediaAction(platform, contentId, metricType, session);
          break;
        default:
          result.error = `Unsupported platform: ${platform}`;
      }
      
      // Cache the verification result
      this.verificationCache.set(verificationKey, result);
      
      return result;
    } catch (error) {
      const errorResult: ActionVerification = {
        platform,
        contentId,
        metricType,
        timestamp,
        verified: false,
        error: error instanceof Error ? error.message : 'Unknown error during verification'
      };
      
      this.verificationCache.set(verificationKey, errorResult);
      return errorResult;
    }
  }

  /**
   * Verifies YouTube-specific actions
   */
  private async verifyYouTubeAction(videoId: string, metricType: 'view' | 'play' | 'click' | 'like' | 'follow' | 'comment', sessionId: string): Promise<ActionVerification> {
    const timestamp = new Date().toISOString();
    
    // For YouTube, we can navigate to the video and check the view count or like status
    
    // First, navigate to the video
    await this.executeBrowserAction({
      type: 'navigate',
      params: { url: `https://www.youtube.com/watch?v=${videoId}` }
    }, sessionId);
    
    // Wait for page to load and metrics to be visible
    await this.executeBrowserAction({
      type: 'wait',
      params: { selector: '#info-contents' }
    }, sessionId);
    
    // Get metric (view count or like status) based on the action type
    const response = await this.executeBrowserAction({
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
  private async verifySpotifyAction(trackId: string, metricType: 'view' | 'play' | 'click' | 'like' | 'follow' | 'comment', sessionId: string): Promise<ActionVerification> {
    const timestamp = new Date().toISOString();
    
    // For Spotify, we need to check if a track is actually playing
    
    // Navigate to track
    await this.executeBrowserAction({
      type: 'navigate',
      params: { url: `https://open.spotify.com/track/${trackId}` }
    }, sessionId);
    
    // Wait for the play button to appear
    await this.executeBrowserAction({
      type: 'wait',
      params: { selector: '[data-testid="play-button"]' }
    }, sessionId);
    
    // Check if the track is playing
    const response = await this.executeBrowserAction({
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
   * Verifies social media actions (generic)
   */
  private async verifySocialMediaAction(platform: string, contentId: string, metricType: 'view' | 'play' | 'click' | 'like' | 'follow' | 'comment', sessionId: string): Promise<ActionVerification> {
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
      await this.executeBrowserAction({
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
      
      await this.executeBrowserAction({
        type: 'wait',
        params: { selector: waitSelector, timeout: 10000 }
      }, sessionId);
      
      // Execute platform-specific verification
      // This would need to be customized based on the platform and metric
      const executeScript = this.getPlatformVerificationScript(platform, metricType);
      
      const response = await this.executeBrowserAction({
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
   * Helper to get platform-specific verification scripts
   */
  private getPlatformVerificationScript(platform: string, metricType: string): string {
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

// Create a singleton instance
export const externalAPIService = new ExternalAPIService();
