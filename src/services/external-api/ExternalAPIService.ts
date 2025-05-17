
import { AudioGenerationParams, AudioGenerationResult, ImageGenerationParams, ImageGenerationResult } from './types';

/**
 * Base Service for external API interactions
 */
export class ExternalAPIService {
  private static baseURL: string = 'http://localhost:8000'; // Updated to point to our FastAPI orchestrator

  /**
   * Generic method to make API calls
   */
  static async makeRequest<T>(
    endpoint: string, 
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET', 
    data?: any
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: data ? JSON.stringify(data) : undefined,
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || `API error: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Error making ${method} request to ${endpoint}:`, error);
      throw error;
    }
  }

  /**
   * Check if the orchestrator API is healthy
   */
  static async checkHealth(): Promise<{ status: string }> {
    return this.makeRequest<{ status: string }>('/health');
  }

  /**
   * Generate audio from text
   */
  static async generateAudio(params: AudioGenerationParams): Promise<AudioGenerationResult> {
    return this.makeRequest<AudioGenerationResult>('/content/generate/audio', 'POST', params);
  }

  /**
   * Generate image from prompt
   */
  static async generateImage(params: ImageGenerationParams): Promise<ImageGenerationResult> {
    return this.makeRequest<ImageGenerationResult>('/content/generate/image', 'POST', params);
  }

  /**
   * Generate text content
   */
  static async generateText(prompt: string, params?: Record<string, any>): Promise<{ content: string }> {
    return this.makeRequest<{ content: string }>('/content/generate/text', 'POST', {
      prompt,
      ...params
    });
  }
}
