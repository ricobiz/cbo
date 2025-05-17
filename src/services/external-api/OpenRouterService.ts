
import type { OpenRouterResponse, CommandAnalysisResult } from './types';

/**
 * Service for OpenRouter API interactions
 */
export class OpenRouterService {
  private apiKey: string | null = null;

  /**
   * Set the OpenRouter API key
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
   * Send a prompt to the OpenRouter API
   */
  async sendToOpenRouter(prompt: string, model: string = 'gpt-4'): Promise<OpenRouterResponse | null> {
    if (!this.hasApiKey()) {
      console.error('OpenRouter API key not set');
      throw new Error('API key not configured');
    }
    
    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
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

  /**
   * Analyze a command using OpenRouter AI
   */
  async analyzeCommand(command: string): Promise<CommandAnalysisResult> {
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
}
