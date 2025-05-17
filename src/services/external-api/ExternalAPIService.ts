
import { OpenRouterService } from "./OpenRouterService";
import { BrowserUseService } from "./BrowserUseService";
import { ImageGenerationService } from "./ImageGenerationService";
import { VerificationService } from "./VerificationService";
import { PlatformUrlService } from "./PlatformUrlService";
import { 
  OpenRouterResponse, 
  CommandAnalysisResult, 
  BrowserUseAction, 
  BrowserUseResponse,
  ImageGenerationParams,
  ImageGenerationResult,
  AudioGenerationParams,
  AudioGenerationResult,
  ApiResponse
} from "./types";

const LOCAL_STORAGE_KEYS = {
  OPEN_ROUTER_API_KEY: 'openrouter_api_key',
  BROWSER_USE_API_KEY: 'browser_use_api_key',
  OFFLINE_MODE: 'offline_mode',
};

/**
 * Service that aggregates all external API interactions
 */
export class ExternalAPIService {
  private openRouterService: OpenRouterService;
  private browserUseService: BrowserUseService;
  private imageGenerationService: ImageGenerationService;
  private verificationService: VerificationService;
  private platformUrlService: PlatformUrlService;
  private offlineMode: boolean = true;

  constructor() {
    this.openRouterService = new OpenRouterService();
    this.browserUseService = new BrowserUseService();
    this.imageGenerationService = new ImageGenerationService();
    this.verificationService = new VerificationService();
    this.platformUrlService = new PlatformUrlService();
    
    // Initialize from localStorage if available
    this.initializeFromStorage();
  }
  
  /**
   * Make an API request to backend
   */
  async makeRequest<T>(
    endpoint: string, 
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET', 
    data?: any
  ): Promise<T> {
    const baseUrl = 'http://localhost:8000'; // Should be configurable
    const url = `${baseUrl}${endpoint}`;
    
    const options: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
      }
    };
    
    if (data && (method === 'POST' || method === 'PUT')) {
      options.body = JSON.stringify(data);
    }
    
    const response = await fetch(url, options);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }
    
    return await response.json();
  }
  
  /**
   * Initialize services from local storage
   */
  initializeFromStorage(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      // Load API keys from localStorage
      const openRouterApiKey = localStorage.getItem(LOCAL_STORAGE_KEYS.OPEN_ROUTER_API_KEY);
      if (openRouterApiKey) {
        this.openRouterService.setApiKey(openRouterApiKey);
      }
      
      const browserUseApiKey = localStorage.getItem(LOCAL_STORAGE_KEYS.BROWSER_USE_API_KEY);
      if (browserUseApiKey) {
        this.browserUseService.setApiKey(browserUseApiKey);
      }
      
      // Load offline mode setting
      const offlineMode = localStorage.getItem(LOCAL_STORAGE_KEYS.OFFLINE_MODE);
      if (offlineMode !== null) {
        this.offlineMode = offlineMode === 'true';
      }
    }
  }
  
  /**
   * Check if OpenRouter API key is set
   */
  hasOpenRouterApiKey(): boolean {
    return this.openRouterService.hasApiKey();
  }
  
  /**
   * Check if BrowserUse API key is set
   */
  hasBrowserUseApiKey(): boolean {
    return this.browserUseService.hasApiKey();
  }
  
  /**
   * Check if offline mode is enabled
   */
  isOfflineMode(): boolean {
    return this.offlineMode;
  }
  
  /**
   * Set offline mode
   */
  setOfflineMode(enabled: boolean): void {
    this.offlineMode = enabled;
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(LOCAL_STORAGE_KEYS.OFFLINE_MODE, String(enabled));
    }
  }
  
  /**
   * Set OpenRouter API key
   */
  setOpenRouterApiKey(key: string): void {
    this.openRouterService.setApiKey(key);
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(LOCAL_STORAGE_KEYS.OPEN_ROUTER_API_KEY, key);
    }
  }
  
  /**
   * Set BrowserUse API key
   */
  setBrowserUseApiKey(key: string): void {
    this.browserUseService.setApiKey(key);
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(LOCAL_STORAGE_KEYS.BROWSER_USE_API_KEY, key);
    }
  }
  
  /**
   * Send a prompt to OpenRouter API
   */
  async sendToOpenRouter(prompt: string, model?: string): Promise<OpenRouterResponse | null> {
    if (this.offlineMode) {
      console.log("Running in offline mode. Returning mock OpenRouter response.");
      return this.getMockOpenRouterResponse(prompt);
    }
    
    try {
      return await this.openRouterService.sendToOpenRouter(prompt, model);
    } catch (error) {
      console.error("Error in OpenRouter API call:", error);
      return this.getMockOpenRouterResponse(prompt);
    }
  }
  
  /**
   * Analyze a command using OpenRouter AI
   */
  async analyzeCommand(command: string): Promise<CommandAnalysisResult | null> {
    if (this.offlineMode) {
      console.log("Running in offline mode. Returning mock command analysis.");
      return this.getMockCommandAnalysis(command);
    }
    
    try {
      return await this.openRouterService.analyzeCommand(command);
    } catch (error) {
      console.error("Error analyzing command:", error);
      return this.getMockCommandAnalysis(command);
    }
  }
  
  /**
   * Execute a browser action through Browser Use API
   */
  async executeBrowserAction(action: BrowserUseAction, sessionId?: string): Promise<BrowserUseResponse> {
    if (this.offlineMode) {
      console.log("Running in offline mode. Returning mock browser action response.");
      return this.getMockBrowserResponse();
    }
    
    return this.browserUseService.executeBrowserAction(action, sessionId);
  }
  
  /**
   * Create a browser session
   */
  async createBrowserSession(options?: {
    proxy?: string;
    userAgent?: string;
    viewport?: { width: number; height: number };
  }): Promise<string> {
    if (this.offlineMode) {
      console.log("Running in offline mode. Returning mock session ID.");
      return `offline-session-${Date.now()}`;
    }
    
    return this.browserUseService.createBrowserSession(options);
  }
  
  /**
   * Generate image using AI
   */
  async generateImage(params: ImageGenerationParams): Promise<ImageGenerationResult | null> {
    if (this.offlineMode) {
      console.log("Running in offline mode. Returning mock image generation result.");
      return this.getMockImageGenerationResult();
    }
    
    return ImageGenerationService.generateImage(params);
  }
  
  /**
   * Generate audio using AI
   */
  async generateAudio(params: AudioGenerationParams): Promise<AudioGenerationResult | null> {
    if (this.offlineMode) {
      console.log("Running in offline mode. Returning mock audio generation result.");
      return this.getMockAudioGenerationResult();
    }
    
    return this.getMockAudioGenerationResult(); // Replace with actual implementation when available
  }
  
  /**
   * Mock responses for offline mode
   */
  private getMockOpenRouterResponse(prompt: string): OpenRouterResponse {
    return {
      id: `mock-${Date.now()}`,
      choices: [
        {
          index: 0,
          message: {
            role: "assistant",
            content: `This is a mock response for: ${prompt}\n\nOffline mode is enabled. Please configure API keys in settings to use real AI services.`
          },
          finish_reason: "stop"
        }
      ],
      created: Date.now(),
      model: "mock-model"
    };
  }
  
  private getMockCommandAnalysis(command: string): CommandAnalysisResult {
    const lowercaseCommand = command.toLowerCase();
    
    // Extract platform from command
    let platform = "unknown";
    if (lowercaseCommand.includes("instagram")) platform = "instagram";
    else if (lowercaseCommand.includes("youtube")) platform = "youtube";
    else if (lowercaseCommand.includes("spotify")) platform = "spotify";
    else if (lowercaseCommand.includes("twitter") || lowercaseCommand.includes("x.com")) platform = "twitter";
    else if (lowercaseCommand.includes("facebook")) platform = "facebook";
    else if (lowercaseCommand.includes("tiktok")) platform = "tiktok";
    
    // Extract action type
    let action = "unknown";
    if (lowercaseCommand.includes("follow")) action = "follow";
    else if (lowercaseCommand.includes("like")) action = "like";
    else if (lowercaseCommand.includes("comment")) action = "comment";
    else if (lowercaseCommand.includes("view") || lowercaseCommand.includes("watch")) action = "view";
    else if (lowercaseCommand.includes("listen")) action = "listen";
    else if (lowercaseCommand.includes("creat")) action = "create_content";
    
    // Extract number (count)
    const countMatch = lowercaseCommand.match(/\b(\d+)\b/);
    const count = countMatch ? parseInt(countMatch[1]) : 1;
    
    return {
      platform,
      action,
      count,
      url: null
    };
  }
  
  private getMockBrowserResponse(): BrowserUseResponse {
    return {
      success: true,
      sessionId: `mock-session-${Date.now()}`,
      action: "mock-action",
      result: {
        status: "completed",
        message: "Mock browser action completed successfully",
        data: {
          screenshot: null,
          html: "<html><body><h1>Mock HTML Content</h1></body></html>"
        }
      }
    };
  }
  
  private getMockImageGenerationResult(): ImageGenerationResult {
    return {
      url: "https://via.placeholder.com/512x512?text=AI+Generated+Image+(Offline+Mode)",
      width: 512,
      height: 512
    };
  }
  
  private getMockAudioGenerationResult(): AudioGenerationResult {
    return {
      url: "https://actions.google.com/sounds/v1/alarms/digital_watch_alarm_long.ogg",
      format: "audio/ogg",
      duration: 3.5
    };
  }
}
