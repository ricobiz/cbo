
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
  private offlineMode: boolean = true;
  
  constructor() {
    this.openRouterService = new OpenRouterService();
    this.browserUseService = new BrowserUseService();
    this.verificationService = new VerificationService();
  }
  
  // API Key management
  setOpenRouterApiKey(key: string): void {
    this.openRouterService.setApiKey(key);
  }
  
  setBrowserUseApiKey(key: string): void {
    this.browserUseService.setApiKey(key);
  }
  
  // Offline mode management
  setOfflineMode(enabled: boolean): void {
    this.offlineMode = enabled;
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
  
  // OpenRouter API methods
  async sendToOpenRouter(prompt: string, model: string = 'gpt-4'): Promise<OpenRouterResponse | null> {
    if (!this.hasOpenRouterApiKey()) {
      console.error('OpenRouter API key not set');
      throw new Error('API key not configured');
    }
    
    return this.openRouterService.sendToOpenRouter(prompt, model);
  }
  
  // Browser Use API methods
  async executeBrowserAction(action: BrowserUseAction, sessionId?: string): Promise<BrowserUseResponse> {
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
    const platformUrl = PlatformUrlService.getPlatformUrl(platform);
    return this.browserUseService.registerAccount(platform, credentials, platformUrl, sessionId);
  }
  
  // Command analysis
  async analyzeCommand(command: string): Promise<CommandAnalysisResult> {
    return this.openRouterService.analyzeCommand(command);
  }

  // Verification methods
  async verifyAction(platform: string, contentId: string, metricType: 'view' | 'play' | 'click' | 'like' | 'follow' | 'comment', sessionId?: string): Promise<ActionVerification> {
    const timestamp = new Date().toISOString();
    
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
}
