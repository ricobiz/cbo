
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

class ExternalAPIService {
  private openRouterApiKey: string | null = null;
  private browserUseApiKey: string | null = null;
  
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
  
  // OpenRouter API integration
  async sendToOpenRouter(prompt: string, model: string = 'gpt-4'): Promise<OpenRouterResponse | null> {
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
  
  // Browser Use API integration
  async executeBrowserAction(action: BrowserUseAction, sessionId?: string): Promise<BrowserUseResponse | null> {
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
  
  // Create a new browser session
  async createBrowserSession(options?: {
    proxy?: string;
    userAgent?: string;
    viewport?: { width: number; height: number };
  }): Promise<string | null> {
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
}

// Create a singleton instance
export const externalAPIService = new ExternalAPIService();
