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
  OPEN_ROUTER_API_KEY_VALIDATION: 'openrouter_api_key_validation_status',
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
  private openRouterApiKeyValid: boolean | null = null;

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
    console.log("ExternalAPIService: Initializing from storage...");
    
    if (typeof window !== 'undefined' && window.localStorage) {
      // Load API keys from localStorage
      const openRouterApiKey = localStorage.getItem(LOCAL_STORAGE_KEYS.OPEN_ROUTER_API_KEY);
      if (openRouterApiKey) {
        console.log("ExternalAPIService: Found OpenRouter API key in storage");
        this.openRouterService.setApiKey(openRouterApiKey);
        
        // Load validation status
        const validationStatus = localStorage.getItem(LOCAL_STORAGE_KEYS.OPEN_ROUTER_API_KEY_VALIDATION);
        if (validationStatus !== null) {
          this.openRouterApiKeyValid = validationStatus === 'true';
          console.log("ExternalAPIService: Loaded validation status:", this.openRouterApiKeyValid);
        }
      }
      
      const browserUseApiKey = localStorage.getItem(LOCAL_STORAGE_KEYS.BROWSER_USE_API_KEY);
      if (browserUseApiKey) {
        this.browserUseService.setApiKey(browserUseApiKey);
      }
      
      // Load offline mode setting
      const offlineMode = localStorage.getItem(LOCAL_STORAGE_KEYS.OFFLINE_MODE);
      if (offlineMode !== null) {
        this.offlineMode = offlineMode === 'true';
        console.log("ExternalAPIService: Loaded offline mode:", this.offlineMode);
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
   * Get OpenRouter API key validation status
   */
  getOpenRouterApiKeyValidationStatus(): boolean | null {
    return this.openRouterApiKeyValid;
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
    console.log("ExternalAPIService: Offline mode set to:", enabled);
  }
  
  /**
   * Set OpenRouter API key
   */
  setOpenRouterApiKey(key: string): void {
    console.log("ExternalAPIService: Setting OpenRouter API key");
    this.openRouterService.setApiKey(key);
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(LOCAL_STORAGE_KEYS.OPEN_ROUTER_API_KEY, key);
    }
    // Reset validation status when key changes
    this.openRouterApiKeyValid = null;
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem(LOCAL_STORAGE_KEYS.OPEN_ROUTER_API_KEY_VALIDATION);
    }
  }

  /**
   * Validate OpenRouter API key
   */
  async validateOpenRouterApiKey(): Promise<boolean> {
    try {
      if (!this.hasOpenRouterApiKey()) {
        console.log("ExternalAPIService: No API key to validate");
        this.openRouterApiKeyValid = false;
        this.saveValidationStatus(false);
        return false;
      }

      console.log("ExternalAPIService: Starting API key validation...");

      // Send a simple test request to validate the API key
      const testResponse = await this.openRouterService.sendToOpenRouter(
        "Ответь одним словом: OK", 
        "gpt-3.5-turbo"
      );
      
      console.log("ExternalAPIService: Validation response received:", testResponse);
      
      const isValid = !!(testResponse && 
                        testResponse.choices && 
                        testResponse.choices.length > 0 && 
                        testResponse.choices[0].message && 
                        testResponse.choices[0].message.content);
      
      this.openRouterApiKeyValid = isValid;
      this.saveValidationStatus(isValid);
      
      console.log("ExternalAPIService: API key validation result:", isValid);
      return isValid;
    } catch (error) {
      console.error("ExternalAPIService: Error validating API key:", error);
      this.openRouterApiKeyValid = false;
      this.saveValidationStatus(false);
      return false;
    }
  }

  private saveValidationStatus(isValid: boolean): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(LOCAL_STORAGE_KEYS.OPEN_ROUTER_API_KEY_VALIDATION, String(isValid));
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
      console.log("ExternalAPIService: Running in offline mode. Returning mock OpenRouter response.");
      return this.getMockOpenRouterResponse(prompt);
    }
    
    try {
      if (this.openRouterApiKeyValid === false) {
        console.log("ExternalAPIService: API key is known to be invalid, using mock response");
        return this.getMockOpenRouterResponse(prompt);
      }
      
      console.log("ExternalAPIService: Sending prompt to OpenRouter:", prompt.substring(0, 50) + "...");
      
      const response = await this.openRouterService.sendToOpenRouter(prompt, model);
      
      if (response && response.choices && response.choices.length > 0) {
        // If we successfully got a response, the API key is valid
        if (this.openRouterApiKeyValid !== true) {
          this.openRouterApiKeyValid = true;
          this.saveValidationStatus(true);
          console.log("ExternalAPIService: API key validated successfully during usage");
        }
        return response;
      } else {
        console.log("ExternalAPIService: Empty response received");
        return this.getMockOpenRouterResponse(prompt);
      }
    } catch (error) {
      console.error("ExternalAPIService: Error in OpenRouter API call:", error);
      this.openRouterApiKeyValid = false;
      this.saveValidationStatus(false);
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
            content: `Это демо-ответ для запроса: "${prompt.substring(0, 50)}..."\n\nВключен оффлайн режим. Настройте API ключи в разделе настроек для использования реальных AI сервисов.`
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
