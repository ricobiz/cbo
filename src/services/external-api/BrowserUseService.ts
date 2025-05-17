
import type { BrowserUseAction, BrowserUseResponse } from './types';

/**
 * Service for Browser Use API interactions
 */
export class BrowserUseService {
  private apiKey: string | null = null;

  /**
   * Set the Browser Use API key
   */
  setApiKey(key: string): void {
    this.apiKey = key;
  }

  /**
   * Check if the API key is set
   */
  hasApiKey(): boolean {
    return !!this.apiKey;
  }

  /**
   * Execute a browser action through Browser Use API
   */
  async executeBrowserAction(action: BrowserUseAction, sessionId?: string): Promise<BrowserUseResponse> {
    if (!this.hasApiKey()) {
      console.error('Browser Use API key not set');
      throw new Error('API key not configured');
    }
    
    try {
      const response = await fetch('https://api.browser-use.com/v1/action', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
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

  /**
   * Create a new browser session
   */
  async createBrowserSession(options?: {
    proxy?: string;
    userAgent?: string;
    viewport?: { width: number; height: number };
  }): Promise<string> {
    if (!this.hasApiKey()) {
      console.error('Browser Use API key not set');
      throw new Error('API key not configured');
    }
    
    try {
      const response = await fetch('https://api.browser-use.com/v1/session/create', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
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

  /**
   * Register an account using Browser Use API
   */
  async registerAccount(platform: string, credentials: {
    email: string;
    username?: string;
    password: string;
    fullName?: string;
  }, platformUrl: string, sessionId?: string): Promise<BrowserUseResponse> {
    // Create a new session if none provided
    const session = sessionId || await this.createBrowserSession();
    
    // Navigate to the platform
    await this.executeBrowserAction({
      type: 'navigate',
      params: { url: platformUrl }
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
}
