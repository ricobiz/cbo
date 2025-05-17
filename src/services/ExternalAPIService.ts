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
  
  // Check if API keys are configured
  hasOpenRouterApiKey(): boolean {
    return !!this.openRouterApiKey;
  }
  
  hasBrowserUseApiKey(): boolean {
    return !!this.browserUseApiKey;
  }
  
  // Offline mode settings
  setOfflineMode(value: boolean): void {
    this.offlineMode = value;
  }
  
  isOfflineMode(): boolean {
    return this.offlineMode;
  }
  
  // OpenRouter API integration
  async sendToOpenRouter(prompt: string, model: string = 'gpt-4'): Promise<OpenRouterResponse | null> {
    if (this.offlineMode) {
      return this.simulateAIResponse(prompt);
    }
    
    if (!this.hasOpenRouterApiKey()) {
      console.error('OpenRouter API key not set');
      return null;
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
      return null;
    }
  }
  
  // Simulate AI responses in offline mode
  private simulateAIResponse(prompt: string): OpenRouterResponse {
    console.log("Simulating AI response for:", prompt);
    
    // Extract potential information from the prompt
    const lowercasePrompt = prompt.toLowerCase();
    
    // Pattern matching for platform
    let platform = "";
    if (lowercasePrompt.includes("spotify")) platform = "spotify";
    else if (lowercasePrompt.includes("youtube")) platform = "youtube";
    else if (lowercasePrompt.includes("instagram")) platform = "instagram";
    else if (lowercasePrompt.includes("tiktok")) platform = "tiktok";
    else if (lowercasePrompt.includes("facebook")) platform = "facebook";
    else if (lowercasePrompt.includes("twitter")) platform = "twitter";
    else platform = "youtube"; // Default platform
    
    // Pattern matching for action
    let action = "";
    if (lowercasePrompt.includes("слушать") || lowercasePrompt.includes("прослушивани")) action = "listen";
    else if (lowercasePrompt.includes("просмотр") || lowercasePrompt.includes("смотреть")) action = "view";
    else if (lowercasePrompt.includes("лайк")) action = "like";
    else if (lowercasePrompt.includes("коммент")) action = "comment";
    else if (lowercasePrompt.includes("подпис")) action = "follow";
    else action = "view"; // Default action
    
    // Extract number from prompt (default to 100)
    let count = 100;
    const numberMatch = prompt.match(/\d+/);
    if (numberMatch) {
      count = parseInt(numberMatch[0]);
    }
    
    // URL extraction (or empty if none)
    let url = "";
    const urlMatch = prompt.match(/(https?:\/\/[^\s]+)/);
    if (urlMatch) {
      url = urlMatch[0];
    }
    
    // Create simulated JSON response
    const simulatedResponseContent = JSON.stringify({
      platform: platform,
      action: action,
      count: count,
      url: url || undefined,
      additionalParams: {}
    }, null, 2);
    
    return {
      id: `simulated-${Date.now()}`,
      choices: [
        {
          message: {
            role: "assistant",
            content: simulatedResponseContent
          },
          finish_reason: "stop"
        }
      ]
    };
  }
  
  // Browser Use API integration
  async executeBrowserAction(action: BrowserUseAction, sessionId?: string): Promise<BrowserUseResponse | null> {
    if (this.offlineMode) {
      return this.simulateBrowserAction(action);
    }
    
    if (!this.hasBrowserUseApiKey()) {
      console.error('Browser Use API key not set');
      return null;
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
      return null;
    }
  }
  
  // Simulate browser actions in offline mode
  private simulateBrowserAction(action: BrowserUseAction): BrowserUseResponse {
    console.log("Simulating browser action:", action);
    
    let simulatedResponse: BrowserUseResponse = {
      success: true
    };
    
    switch (action.type) {
      case 'navigate':
        simulatedResponse.data = {
          url: action.params.url,
          title: `Simulated page for ${action.params.url}`,
          status: 200
        };
        break;
        
      case 'click':
        if (action.params.execute) {
          // Simulate executing some JavaScript
          simulatedResponse.data = {
            viewCount: "1,234 просмотров",
            likeCount: "56 лайков",
            isPlaying: true
          };
        } else {
          simulatedResponse.data = { clicked: true };
        }
        break;
        
      case 'wait':
        simulatedResponse.data = { waited: true, selector: action.params.selector };
        break;
        
      case 'type':
        simulatedResponse.data = { typed: action.params.text || "" };
        break;
        
      case 'register':
      case 'login':
        simulatedResponse.data = { 
          success: true, 
          user: {
            username: action.params.credentials?.username || "user123",
            email: action.params.credentials?.email || "user@example.com"
          }
        };
        break;
        
      default:
        simulatedResponse.data = { message: "Action simulated" };
    }
    
    return simulatedResponse;
  }
  
  // Create a new browser session
  async createBrowserSession(options?: {
    proxy?: string;
    userAgent?: string;
    viewport?: { width: number; height: number };
  }): Promise<string | null> {
    if (this.offlineMode) {
      return `simulated-session-${Date.now()}`;
    }
    
    if (!this.hasBrowserUseApiKey()) {
      console.error('Browser Use API key not set');
      return null;
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
      return null;
    }
  }
  
  // Register an account using Browser Use API
  async registerAccount(platform: string, credentials: {
    email: string;
    username?: string;
    password: string;
    fullName?: string;
  }, sessionId?: string): Promise<BrowserUseResponse | null> {
    // Create a new session if none provided
    const session = sessionId || await this.createBrowserSession();
    if (!session) return null;
    
    // Navigate to the platform
    await this.executeBrowserAction({
      type: 'navigate',
      params: { url: this.getPlatformUrl(platform) }
    }, session);
    
    // Find registration form and fill it
    // This is simplified - in reality, would need more complex logic to detect and fill forms
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
  } | null> {
    if (this.offlineMode) {
      // In offline mode, use simple pattern matching
      return this.analyzeCommandOffline(command);
    }
    
    const prompt = `
      Analyze the following command and extract structured information:
      
      Command: "${command}"
      
      Extract the following information (if present):
      1. Platform (e.g., Spotify, YouTube, Instagram)
      2. Action type (listen, view, like, comment, follow)
      3. Target count (number)
      4. Target URL (if any)
      5. Any additional parameters
      
      Format the output as JSON.
    `;
    
    const response = await this.sendToOpenRouter(prompt);
    if (!response || !response.choices || !response.choices[0]?.message?.content) {
      return null;
    }
    
    try {
      // Try to parse the AI response as JSON
      const jsonMatch = response.choices[0].message.content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      return null;
    } catch (error) {
      console.error('Error parsing AI response:', error);
      return null;
    }
  }
  
  // Simple offline command analysis using pattern matching
  private analyzeCommandOffline(command: string): {
    platform?: string;
    action?: string;
    count?: number;
    url?: string;
  } {
    const lowercaseCommand = command.toLowerCase();
    
    // Find platform
    let platform = "";
    if (lowercaseCommand.includes("spotify")) platform = "spotify";
    else if (lowercaseCommand.includes("youtube") || lowercaseCommand.includes("ютуб")) platform = "youtube";
    else if (lowercaseCommand.includes("instagram") || lowercaseCommand.includes("инстаграм")) platform = "instagram";
    else if (lowercaseCommand.includes("tiktok") || lowercaseCommand.includes("тикток")) platform = "tiktok";
    else if (lowercaseCommand.includes("facebook") || lowercaseCommand.includes("фейсбук")) platform = "facebook";
    else if (lowercaseCommand.includes("twitter") || lowercaseCommand.includes("твиттер")) platform = "twitter";
    else platform = "youtube"; // Default to YouTube
    
    // Find action
    let action = "";
    if (lowercaseCommand.includes("прослушива") || lowercaseCommand.includes("слушать")) {
      action = "listen";
    } else if (lowercaseCommand.includes("просмотр") || lowercaseCommand.includes("смотреть")) {
      action = "view";
    } else if (lowercaseCommand.includes("лайк") || lowercaseCommand.includes("нравится")) {
      action = "like";
    } else if (lowercaseCommand.includes("коммент")) {
      action = "comment";
    } else if (lowercaseCommand.includes("подпис") || lowercaseCommand.includes("фоллов")) {
      action = "follow";
    } else {
      // Default actions based on platform
      action = platform === "spotify" ? "listen" : "view";
    }
    
    // Find count
    const numberMatch = command.match(/\d+/);
    const count = numberMatch ? parseInt(numberMatch[0]) : 100;
    
    // Find URL
    const urlMatch = command.match(/(https?:\/\/[^\s]+)/);
    const url = urlMatch ? urlMatch[0] : undefined;
    
    return {
      platform,
      action,
      count,
      url
    };
  }

  // NEW METHODS FOR VERIFICATION AND FEEDBACK

  /**
   * Verifies if an action (view, play, etc) was actually counted by the platform.
   * This can be used to confirm that bot interactions are being registered.
   */
  async verifyAction(platform: string, contentId: string, metricType: 'view' | 'play' | 'click' | 'like' | 'follow' | 'comment', sessionId?: string): Promise<ActionVerification> {
    const timestamp = new Date().toISOString();
    const verificationKey = `${platform}:${contentId}:${metricType}:${timestamp}`;
    
    // In offline mode, always return simulated verification
    if (this.offlineMode) {
      const simulatedVerification: ActionVerification = {
        platform,
        contentId,
        metricType,
        timestamp,
        verified: true,
        metricValue: metricType === 'view' ? 1234 : metricType === 'like' ? 56 : 10
      };
      this.verificationCache.set(verificationKey, simulatedVerification);
      return simulatedVerification;
    }
    
    try {
      // If no session provided, one needs to be created
      const session = sessionId || await this.createBrowserSession();
      if (!session) {
        throw new Error('Failed to create or use browser session');
      }
      
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
    // This is a simplified implementation
    
    // First, check the initial count
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
        // This would need to be customized based on the metric type
        // In reality, we would extract view count, like status, etc.
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
    
    // We would typically perform the action (like, comment, etc.) here
    // Then check again to verify the action was registered
    
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
    // This is a simplified implementation
    
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
              trackName: document.querySelector('.encore-text-title').textContent
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
    // This would be implemented specifically for each social platform
    // For now, we'll return a placeholder implementation
    
    return {
      platform,
      contentId,
      metricType,
      timestamp: new Date().toISOString(),
      verified: false,
      error: 'Social media verification not fully implemented'
    };
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
