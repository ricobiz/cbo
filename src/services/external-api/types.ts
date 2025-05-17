/**
 * Types for all external API interactions
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
  action?: string;
  data?: any;
  result?: {
    status: string;
    message: string;
    data?: any;
  };
}

// Types for Verification and Feedback
export interface ActionVerification {
  platform: string;
  contentId: string;
  metricType: 'view' | 'play' | 'click' | 'like' | 'follow' | 'comment';
  timestamp: string;
  verified: boolean;
  metricValue?: number;
  metrics?: {
    before: number;
    after: number;
  };
  error?: string;
}

export interface CommandAnalysisResult {
  platform?: string;
  action?: string;
  count?: number;
  url?: string;
  additionalParams?: Record<string, any>;
}

export interface PlatformUrlMap {
  [platform: string]: string;
}

// Types for Content Generation
export type ImageGenerationParams = {
  prompt: string;
  style?: string;
  size?: string;
  negativePrompt?: string;
  seed?: number;
};

export type ImageGenerationResult = {
  url: string;
  width: number;
  height: number;
};

export type AudioGenerationParams = {
  text: string;
  voice: string;
  speed: number;
  format: string;
};

export type AudioGenerationResult = {
  url: string;
  duration: number;
};
