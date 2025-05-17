
import { OpenRouterService } from './OpenRouterService';
import { BrowserUseService } from './BrowserUseService';
import { VerificationService } from './VerificationService';
import { PlatformUrlService } from './PlatformUrlService';
import type { 
  ActionVerification,
  BrowserUseAction,
  BrowserUseResponse,
  CommandAnalysisResult,
  OpenRouterResponse
} from './types';

/**
 * Main service for integrating with external APIs
 */
export class ExternalAPIService {
  private openRouterService: OpenRouterService;
  private browserUseService: BrowserUseService;
  private verificationService: VerificationService;
  private offlineMode: boolean = false; // Changed default to false for real operation
  
  constructor() {
    this.openRouterService = new OpenRouterService();
    this.browserUseService = new BrowserUseService();
    this.verificationService = new VerificationService();
  }
  
  // API Key management
  setOpenRouterApiKey(key: string): void {
    this.openRouterService.setApiKey(key);
    localStorage.setItem('openrouter_api_key', key); // Save the API key for persistence
  }
  
  setBrowserUseApiKey(key: string): void {
    this.browserUseService.setApiKey(key);
    localStorage.setItem('browseruse_api_key', key); // Save the API key for persistence
  }
  
  // Offline mode management
  setOfflineMode(enabled: boolean): void {
    this.offlineMode = enabled;
    localStorage.setItem('offline_mode', enabled.toString());
  }
  
  isOfflineMode(): boolean {
    return this.offlineMode;
  }
  
  // Check if API keys are configured
  hasOpenRouterApiKey(): boolean {
    return this.openRouterService.hasApiKey();
  }
  
  hasBrowserUseApiKey(): boolean {
    return this.browserUseService.hasApiKey();
  }
  
  // Initialize API keys from localStorage on startup
  initializeFromStorage(): void {
    // Try to restore API keys from localStorage
    const openRouterKey = localStorage.getItem('openrouter_api_key');
    if (openRouterKey) {
      this.openRouterService.setApiKey(openRouterKey);
    }
    
    const browserUseKey = localStorage.getItem('browseruse_api_key');
    if (browserUseKey) {
      this.browserUseService.setApiKey(browserUseKey);
    }
    
    // Restore offline mode setting
    const offlineMode = localStorage.getItem('offline_mode');
    if (offlineMode) {
      this.offlineMode = offlineMode === 'true';
    }
  }
  
  // OpenRouter API methods
  async sendToOpenRouter(prompt: string, model: string = 'gpt-4'): Promise<OpenRouterResponse | null> {
    if (this.offlineMode) {
      console.log('Offline mode is active. Skipping OpenRouter API call.');
      return null;
    }
    
    if (!this.hasOpenRouterApiKey()) {
      console.error('OpenRouter API key not set');
      throw new Error('API key not configured');
    }
    
    return this.openRouterService.sendToOpenRouter(prompt, model);
  }
  
  // Browser Use API methods
  async executeBrowserAction(action: BrowserUseAction, sessionId?: string): Promise<BrowserUseResponse> {
    if (this.offlineMode) {
      console.log('Offline mode is active. Simulating browser action:', action);
      return {
        success: true,
        sessionId: sessionId || 'offline-session',
        action: action.type,
        result: { status: 'completed', message: 'Action simulated in offline mode' }
      };
    }
    
    if (!this.hasBrowserUseApiKey()) {
      console.error('Browser Use API key not set');
      throw new Error('API key not configured');
    }
    
    return this.browserUseService.executeBrowserAction(action, sessionId);
  }
  
  async createBrowserSession(options?: {
    proxy?: string;
    userAgent?: string;
    viewport?: { width: number; height: number };
  }): Promise<string> {
    if (this.offlineMode) {
      console.log('Offline mode is active. Creating simulated browser session');
      return `offline-session-${Date.now()}`;
    }
    
    if (!this.hasBrowserUseApiKey()) {
      console.error('Browser Use API key not set');
      throw new Error('API key not configured');
    }
    
    return this.browserUseService.createBrowserSession(options);
  }
  
  async registerAccount(platform: string, credentials: {
    email: string;
    username?: string;
    password: string;
    fullName?: string;
  }, sessionId?: string): Promise<BrowserUseResponse> {
    if (this.offlineMode) {
      console.log('Offline mode is active. Simulating account registration for:', platform);
      return {
        success: true,
        sessionId: sessionId || 'offline-session',
        action: 'register',
        result: { 
          status: 'completed', 
          message: `Account registration simulated for ${platform}`,
          data: { email: credentials.email }
        }
      };
    }
    
    const platformUrl = PlatformUrlService.getPlatformUrl(platform);
    return this.browserUseService.registerAccount(platform, credentials, platformUrl, sessionId);
  }
  
  // Command analysis
  async analyzeCommand(command: string): Promise<CommandAnalysisResult> {
    if (this.offlineMode) {
      console.log('Offline mode is active. Using simple command analysis');
      // Implement basic command analysis
      const result: CommandAnalysisResult = {
        platform: '',
        action: '',
        count: 0,
        url: undefined
      };
      
      // Basic platform detection
      const platforms = ['youtube', 'spotify', 'instagram', 'tiktok', 'twitter', 'facebook'];
      for (const platform of platforms) {
        if (command.toLowerCase().includes(platform)) {
          result.platform = platform;
          break;
        }
      }
      
      // Basic action detection
      if (command.toLowerCase().includes('view') || command.toLowerCase().includes('watch')) {
        result.action = 'view';
      } else if (command.toLowerCase().includes('like')) {
        result.action = 'like';
      } else if (command.toLowerCase().includes('comment')) {
        result.action = 'comment';
      } else if (command.toLowerCase().includes('follow') || command.toLowerCase().includes('subscribe')) {
        result.action = 'follow';
      } else if (command.toLowerCase().includes('listen') || command.toLowerCase().includes('play')) {
        result.action = 'listen';
      }
      
      // Extract numbers for count
      const numbers = command.match(/\d+/);
      if (numbers) {
        result.count = parseInt(numbers[0]);
      } else {
        result.count = 100; // Default
      }
      
      // Extract URLs
      const urlMatch = command.match(/(https?:\/\/[^\s]+)/);
      if (urlMatch) {
        result.url = urlMatch[0];
      }
      
      return result;
    }
    
    return this.openRouterService.analyzeCommand(command);
  }

  // Verification methods
  async verifyAction(platform: string, contentId: string, metricType: 'view' | 'play' | 'click' | 'like' | 'follow' | 'comment', sessionId?: string): Promise<ActionVerification> {
    const timestamp = new Date().toISOString();
    
    if (this.offlineMode) {
      console.log('Offline mode is active. Simulating verification for:', platform, metricType);
      return {
        platform,
        contentId,
        metricType,
        timestamp,
        verified: true,
        metrics: {
          before: Math.floor(Math.random() * 1000),
          after: Math.floor(Math.random() * 1000) + 1
        }
      };
    }
    
    try {
      // If no session provided, one needs to be created
      const session = sessionId || await this.createBrowserSession();
      
      let result: ActionVerification;

      // Different verification methods for different platforms
      switch (platform.toLowerCase()) {
        case 'youtube':
          result = await this.verificationService.verifyYouTubeAction(contentId, metricType, session, this.browserUseService);
          break;
        case 'spotify':
          result = await this.verificationService.verifySpotifyAction(contentId, metricType, session, this.browserUseService);
          break;
        default:
          result = await this.verificationService.verifySocialMediaAction(platform, contentId, metricType, session, this.browserUseService);
      }
      
      // Cache the verification result
      this.verificationService.cacheVerificationResult(result);
      
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
      
      this.verificationService.cacheVerificationResult(errorResult);
      return errorResult;
    }
  }
  
  getVerificationHistory(platform: string, contentId: string, metricType?: 'view' | 'play' | 'click' | 'like' | 'follow' | 'comment'): ActionVerification[] {
    return this.verificationService.getVerificationHistory(platform, contentId, metricType);
  }
  
  getVerificationSuccessRate(platform: string, contentId: string, metricType: 'view' | 'play' | 'click' | 'like' | 'follow' | 'comment'): number {
    return this.verificationService.getVerificationSuccessRate(platform, contentId, metricType);
  }

  /**
   * Generate audio based on the provided parameters
   */
  async generateAudio(params: AudioGenerationParams): Promise<{ url: string }> {
    try {
      // In a real implementation, we would call an actual text-to-speech API
      console.log("Generating audio with params:", params);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Demo audio URLs
      const demoAudios = [
        "https://actions.google.com/sounds/v1/alarms/digital_watch_alarm_long.ogg",
        "https://actions.google.com/sounds/v1/ambiences/forest_ambience.ogg",
        "https://actions.google.com/sounds/v1/cartoon/cartoon_boing.ogg",
        "https://actions.google.com/sounds/v1/water/bubbling_stream.ogg"
      ];
      
      // Select a random audio
      const selectedAudio = demoAudios[Math.floor(Math.random() * demoAudios.length)];
      
      return { url: selectedAudio };
    } catch (error) {
      console.error("Error in audio generation:", error);
      throw new Error("Failed to generate audio");
    }
  }

}

// Create a singleton instance
export const externalAPIService = new ExternalAPIService();
// Initialize from storage
externalAPIService.initializeFromStorage();

// Re-export types for convenience
export type { 
  OpenRouterResponse, 
  BrowserUseAction, 
  BrowserUseResponse, 
  ActionVerification, 
  CommandAnalysisResult 
};
